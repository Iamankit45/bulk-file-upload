
import rsmq from '../app/utils/rsmq.js';

async function startWorker(){

    console.log("Worker started");

    while(true){
        try {
            const message =await rsmq.receiveMessageAsync({qname:'file-processing-queue'});
            if(message.id)
            {
                
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