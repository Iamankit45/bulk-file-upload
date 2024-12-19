
import rsmq from '../app/utils/rsmq.js';
import {downloadFromS3} from '../app/utils/s3.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });



async function processFile(message){

    const {fileId,s3Url}=JSON.parse(message);

    try {

        
        console.log('FILE ID AND S3 URL ->>>>>>',s3Url);
        const fileData= await downloadFromS3(s3Url)

        // console.log('~~~~~~~~~~~~~~~~~~~~~`',fileData);
    } catch (error) {
        // console.log(error.message);
    }
    // console.log('Processing file',message);
    // await new Promise((resolve)=>setTimeout(resolve,2000));
    // console.log('File processed',message);
}


async function startWorker(){

    console.log("Worker started");

    while(true){
        try {
            const message =await rsmq.receiveMessageAsync({qname:'file-processing-queue'});
            if(message.id)
            {
                
                await processFile(message.message);
                await rsmq.deleteMessageAsync({qname:'file-processing-queue',id:message.id});
            }
            else
            {
                await new Promise((resolve)=>setTimeout(resolve,500));
            }
            
        } catch (error) {
            
            console.log('worker error',error);
        }
    }
}

startWorker().catch(console.error);