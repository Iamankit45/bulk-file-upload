import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import mime, { contentType } from "mime-types";

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {

        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})


export async function uploadToS3(key, fileBody, contentType) {

    
    const bucket = process.env.AWS_BUCKET_NAME;

    const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: fileBody,
        ContentType: contentType
    };

    try {

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);
        console.log(`File uploaded successfully: ${key}`);

        return `https://${bucket}.s3.ap-south-1.amazonaws.com/${key}`;



    } catch (error) {

        console.log("Error uploading file ", error);
        throw error;

    }

}