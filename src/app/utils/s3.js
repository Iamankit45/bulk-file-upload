import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import mime, { contentType } from "mime-types";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { parseFile } from './fileParser.js';


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

export async function downloadFromS3(fileUrl) 
{
    const bucket = process.env.AWS_BUCKET_NAME;
    try {
        
        const key = fileUrl.split('.amazonaws.com/')[1];

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key:key
        });

        const response = await s3Client.send(command);
        
        const fileBody = await streamToBuffer(response.Body);
        const fileExtension = key.split('.').pop().toLowerCase();

        const parsedData = await parseFile(fileBody, fileExtension);

        return parsedData;
        
        
    } catch (error) 
    {
        console.error("Error downloading file from S3", error);
        throw error;
    }
    

}

// Utility function to convert stream to string
async function streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);  
}
