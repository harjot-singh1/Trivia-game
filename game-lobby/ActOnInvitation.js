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
            body: { instanceId: instanceId, message: "status updated" },
        };
    }
    return response;
};