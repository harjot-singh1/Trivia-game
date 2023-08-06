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
                    'participation_id': { S: userId + "_" + instanceId }
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
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ allowed: !!participantsResponse.Item }),
        };
    } else {
        return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
    }
    return response;
};