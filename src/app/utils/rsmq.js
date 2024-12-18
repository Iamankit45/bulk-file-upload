import RedisSMQ from 'rsmq';
import redisClient from './redis';

const rsmq = new RedisSMQ({
    client: redisClient,
    ns: 'rsmq'

});

async function ensureQueueExists(queueName) {

    try {
        
        await rsmq.createQueueAsync({ qname: queueName });
        console.log(`Queue ${queueName} created successfully`);
    } catch (error) 
    {
        if (error.name === 'queueExists') {
            console.log(`Queue ${queueName} already exists`);
        } else {
            console.log(`Error creating queue ${queueName}`, error);
            throw error;
        }
    }
}


ensureQueueExists('file-processing-queue');
export default rsmq;
