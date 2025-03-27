// Trigger: S3 PutObject Event
// Purpose: Send real-time notifications via WebSocket when a document is updated.
import AWS from 'aws-sdk';

const apiGateway = new AWS.ApiGatewayManagementApi({
    endpoint: 'YOUR_WEBSOCKET_API_ENDPOINT'
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getActiveConnections(docId) {
    const params = {
        TableName: 'Connections',
        KeyConditionExpression: 'docId = :docId',
        ExpressionAttributeValues: {
            ':docId': docId
        }
    };
    const result = await dynamoDB.query(params).promise();
    return result.Items.map(item => item.connectionId);
}

export const handler = async (event) => {
    try {
        const docId = event.Records[0].s3.object.key.split('/')[1].replace('.txt', '');
        const connections = await getActiveConnections(docId);
        await Promise.all(connections.map(async connId => {
            try{
                await apiGateway.postToConnection({
                    ConnectionId: connId,
                    Data: JSON.stringify({
                        action: 'DOC_UPDATED',
                        docId
                    })
                }).promise()
            } catch (error) {
                if(error.statusCode === 410){
                    console.log(`connection ${connId} is gone. removing.`)
                    //remove connection id from database.
                    await dynamoDB.delete({
                        TableName: 'Connections',
                        Key: {
                            docId: docId,
                            connectionId: connId
                        }
                    }).promise();
                } else {
                    console.error(`Failed to send message to ${connId}:`, error);
                }
            }
        }));
    } catch (error) {
        console.error('Error processing S3 event:', error);
        throw error;
    }
};