// Trigger: API Gateway WebSocket $connect
// Purpose: Track active collaborators when they join a document.
import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
    try {
        const { connectionId, docId } = event.queryStringParameters;

        // Store connection in DynamoDB for real-time notifications
        await dynamoDB.put({
            TableName: 'ActiveConnections',
            Item: { connectionId, docId, timestamp: new Date().toISOString() }
        }).promise();

        return { statusCode: 200 };
    } catch (error) {
        console.error('Error storing connection:', error);
        throw error;
    }
};