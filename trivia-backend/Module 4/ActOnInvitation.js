const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

module.exports.handler = async (event) => {
    let response = {};
    if (event && event.body) {
        const userId = event.body.userId;
        const instanceId = event.body.instanceId;
        const decision = event.body.decision;
        if (userId && instanceId) {
            await dynamodb.putItem({
                TableName: 'member_participation',
                Item: {
                    participation_id: { "S": "" + userId + "_" + instanceId },
                    notificationActedUpon: { "S": "" + Date.now() },
                    status: { "S": "" + decision }
                }
            }).promise();
        } else {
            return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
        }
        response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend domain if needed
                'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other required headers
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Add the allowed methods
                'Access-Control-Allow-Credentials': true, // Set to true if your requests include credentials (e.g., cookies)
            },
            body: { instanceId: instanceId, message: "status updated" },
        };
    }
    return response;
};