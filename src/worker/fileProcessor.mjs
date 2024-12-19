
import rsmq from '../app/utils/rsmq.js';
import { downloadFromS3 } from '../app/utils/s3.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { validateRecords } from '../app/utils/validateRecords.js';
import { connectToDatabase } from '../app/utils/database.js';
import redisClient from '../app/utils/redis.js';



async function processFile(message) {

    const { fileId, s3Url } = JSON.parse(message);

    try {
        const fileData = await downloadFromS3(s3Url)
        const { validRecords, invalidRecords } = validateRecords(fileData);

        const db = await connectToDatabase();

        console.log('Valid Records:', validRecords);
        console.log('Invalid Records:', invalidRecords);

        if (validRecords.length > 0) {
            await db.collection('records').insertMany(
                validRecords.map((record) => ({ ...record, fileId, isValid: true }))
            );
        }


        if (invalidRecords.length > 0) {
            await db.collection('records').insertMany(
                invalidRecords.map((record) => ({ ...record, fileId, isValid: false }))
            );
        }

        // Update metadata in 'files' collection
        await db.collection('files').updateOne(
            { fileId },
            {
                $set: {
                    status: 'completed',
                    processedAt: new Date(),
                    validRecordsCount: validRecords.length,
                    invalidRecordsCount: invalidRecords.length,
                },
            }
        );

        // Update status in Redis
        await redisClient.set(
            fileId.toString(),
            JSON.stringify({
                status: 'completed',
                validRecordsCount: validRecords.length,
                invalidRecordsCount: invalidRecords.length,
            })
        );


    } catch (error) {
        const db = await connectToDatabase();
        await db.collection('files').updateOne(
            { fileId },
            { $set: { status: 'failed', error: error.message } }
        );
        
        // Update error status in Redis
        await redisClient.set(
            fileId.toString(),
            JSON.stringify({ status: 'failed', error: error.message })
        );
    }

}


async function startWorker() {

    console.log("Worker started");

    while (true) {
        try {
            const message = await rsmq.receiveMessageAsync({ qname: 'file-processing-queue' });
            if (message.id) {

                await processFile(message.message);
                await rsmq.deleteMessageAsync({ qname: 'file-processing-queue', id: message.id });
            }
            else {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

        } catch (error) {

            console.log('worker error', error);
        }
    }
}

startWorker().catch(console.error);