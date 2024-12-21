import { NextResponse } from "next/server";
import { uploadToS3 } from "@/app/utils/s3";
import redisClient from '@/app/utils/redis';
import rsmq from '@/app/utils/rsmq';
import { connectToDatabase } from '@/app/utils/database';
import mime from "mime-types";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("file");

        if (!files || files.length === 0) {
            return NextResponse.json({ status: 400, message: "No files uploaded" });
        }

        const db = await connectToDatabase();
        const responses = [];

        for (const file of files) {
            const fileBuffer = await file.arrayBuffer();
            const fileName = file.name; 
            const s3FileName = `uploads/${Date.now()}_${file.name}`;
            const contentType = mime.lookup(file.name) || "application/octet-stream";
            const s3Url = await uploadToS3(s3FileName, Buffer.from(fileBuffer), contentType);
            const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

            // Save file metadata to the database
            await db.collection('files').insertOne({
                fileId,
                fileName,
                s3Url,
                uploadedAt: new Date().toISOString(),
                status: 'uploaded',
            });

            // Add initial status to Redis as uploaded
            await redisClient.set(fileId, JSON.stringify({
                status: 'uploaded',
                fileName,
                s3Url,
                uploadedAt: new Date().toISOString(),
            }));

            // Publish message to the RSMQ queue
            await rsmq.sendMessageAsync({
                qname: 'file-processing-queue',
                message: JSON.stringify({ fileId, s3Url }),
            });

            
            responses.push({ fileId, fileName, s3Url });
        }

        return NextResponse.json({
            status: 200,
            message: "Files uploaded successfully",
            data: responses,
        });

    } catch (error) {
        console.error("Error uploading files: ", error);
        return NextResponse.json({
            status: 500,
            message: "Error uploading files",
            data: { error },
        });
    }
}
