
import { NextResponse } from "next/server";

import { uploadToS3 } from "@/app/utils/s3";


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

        const fileURL = await uploadToS3(fileName, Buffer.from(fileBuffer), contentType);


        return NextResponse.json({ status: 200, message: "File uploaded successfully", data: { fileURL } });

    } catch (error) {
        console.log("Error uploading file ", error);
        return NextResponse.json({ status: 500, message: "Error uploading file", data: { error } });

    }

}




