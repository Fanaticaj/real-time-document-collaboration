// Trigger: AppSync Resolver (Pre-Execution)
// Purpose: Validate if a user has permission to edit a document.
import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const handler = async (event) => {
    try {
        // 1. Get user groups from Cognito
        const user = await cognito.adminListGroupsForUser({
            Username: event.identity.username,
            UserPoolId: 'YOUR_USER_POOL_ID' // Replace with your User Pool ID
        }).promise();

        // 2. Check if user has 'editors' permission
        const isEditor = user.Groups.some(g => g.GroupName === 'editors');
        if (!isEditor) {
            throw new Error("Write access required");
        }

        return { allowed: true };
    } catch (error) {
        console.error('Error validating user access:', error);
        throw error;
    }
};