const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

module.exports.handler = async (event) => {
    let response = {};
    let participantsResponse;
    const tableName = 'member_participation';
    if (event.body) {
        const requestBody = JSON.parse(event.body);
        const instanceId = requestBody.instanceId;
        const userId = requestBody.userId;
        try {
            participantsResponse = await dynamodb.getItem({
                TableName: tableName,
                Key: {
                    'participation_id': { S: userId + "_" + instanceId } // Assuming itemId is the primary key of your DynamoDB table
                }
            }).promise();
            console.log("Promise resolved successfully");
            console.log(JSON.stringify(participantsResponse));
        } catch (e) {
            console.error("Failed to persist in dynamodb" + e);
            return {
                statusCode: 500,
                message: e
            };
        }
        console.log("Setting success response");
        response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend domain if needed
                'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other required headers
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Add the allowed methods
                'Access-Control-Allow-Credentials': true, // Set to true if your requests include credentials (e.g., cookies)
            },
            body: JSON.stringify({ allowed: !!participantsResponse.Item }),
        };
    } else {
        return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
    }
    return response;
};