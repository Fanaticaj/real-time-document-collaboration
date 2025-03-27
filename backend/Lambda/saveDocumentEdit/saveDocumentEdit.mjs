// Trigger: API Gateway (REST/WebSocket) or AppSync GraphQL mutation
// Purpose: Save document edits to S3 and broadcast changes to collaborators.
import AWS from 'aws-sdk';
import appsync from 'aws-appsync';

const s3 = new AWS.S3();

export const handler = async (event) => {
    try {
        // 1. Validate user permissions via Cognito (from event.headers)
        if (!event.userId) {
            throw new Error("Unauthorized");
        }

        // 2. Save edited content to S3
        await s3.putObject({
            Bucket: 'your-document-bucket',
            Key: `documents/${event.documentId}.txt`,
            Body: event.content,
            Metadata: { lastEditedBy: event.userId }
        }).promise();

        // 3. Notify collaborators via AppSync
        const appsyncClient = new appsync.AppSyncClient();
        await appsyncClient.mutate({
            mutation: `publishUpdate($docId: ID!, $content: String!)`,
            variables: { docId: event.documentId, content: event.content }
        });

        return { status: 'success' };
    } catch (error) {
        console.error('Error saving document edit:', error);
        throw error;
    }
};