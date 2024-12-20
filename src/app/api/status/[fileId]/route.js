import { NextResponse } from "next/server";
import redisClient from "@/app/utils/redis";

export async function GET(request, context) {
    try {
        
        const { fileId } = await context.params;
        console.log(`Fetching status for fileId: ${fileId}`);

        
        const statusData = await redisClient.get(fileId);
        console.log('Status Data from Redis:', statusData);

        if (!statusData) {
            console.log(`No status found for fileId: ${fileId}`);
            return new Response(JSON.stringify({ status: 'not found' }), { status: 404 });
        }

        return new Response(statusData, { status: 200 });
    } catch (error) {
        console.error('Error fetching status from Redis:', error);
        return new Response(JSON.stringify({ status: 'error', message: error.message }), { status: 500 });
    }
}
