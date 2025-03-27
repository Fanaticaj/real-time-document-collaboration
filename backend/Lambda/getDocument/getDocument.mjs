// Trigger: AppSync Query / API Gateway GET request
// Purpose: Retrieve a document from S3 for a user with valid permissions.
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const handler = async (event) => {
    try {
        // 1. Check if user has access via Cognito (event.identity)
        if (!event.identity || !event.identity.groups || !event.identity.groups.includes('readers')) {
            throw new Error("Access denied");
        }

        // 2. Fetch document from S3
        const data = await s3.getObject({
            Bucket: 'your-document-bucket',
            Key: `documents/${event.documentId}.txt`
        }).promise();

        return {
            content: data.Body.toString(),
            lastEditedBy: data.Metadata.lastEditedBy
        };
    } catch (error) {
        console.error('Error fetching document:', error);
        throw error; // Re-throw the error to ensure Lambda handles it
    }
};