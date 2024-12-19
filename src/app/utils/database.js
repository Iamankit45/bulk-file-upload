import {MongoClient} from 'mongodb';

let client
export async function connectToDatabase() {
    
    if(!client)
    {
        client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
    }

    return client.db(process.env.DB_NAME)
}