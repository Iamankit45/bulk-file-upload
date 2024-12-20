
import { NextResponse } from "next/server";

import { uploadToS3 } from "@/app/utils/s3";
import redisClient from '@/app/utils/redis';
import rsmq from '@/app/utils/rsmq';
import { connectToDatabase } from '@/app/utils/database';
import mime, { contentType } from "mime-types";



export async function POST(req) {
    try {

        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ status: 400, message: "No file uploaded" });
        }

        const fileBuffer = await file.arrayBuffer();
        const fileName = `uploads/${Date.now()}_${file.name}`;
        const contentType = mime.lookup(file.name) || "application/octet-stream";
        const s3Url = await uploadToS3(fileName, Buffer.from(fileBuffer), contentType);
        const fileId = Date.now().toString();


        const db=await connectToDatabase();

        await db.collection('files').insertOne({
            fileId,
            fileName,
            s3Url,
            uploadedAt: new Date().toISOString(),
            status: 'uploaded',
        });


        //adding initial status to redis 
        await redisClient.set(fileId, JSON.stringify({ status: 'uploaded', fileName, s3Url ,uploadedAt: new Date().toISOString()  }));

        //publish msg to rsmq
        await rsmq.sendMessageAsync({ qname: 'file-processing-queue', message: JSON.stringify({ fileId, s3Url }) });

        return NextResponse.json({ status: 200, message: "uploaded", data: { fileId,s3Url } });

    } catch (error) {
        console.log("Error uploading file ", error);
        return NextResponse.json({ status: 500, message: "Error uploading file", data: { error } });

    }

}




