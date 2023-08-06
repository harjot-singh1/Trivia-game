const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
    let response = {};
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const gameInstanceTable = 'game_instance';
    console.log("event-body " + event.body);
    if (event?.body) {
        const requestBody = JSON.parse(event.body);
        const instanceId = requestBody.instanceId;
        const score = requestBody.score;
        const lastQuestionAnswered = requestBody.lastQuestionAnswered;
        if (instanceId && score >= 0 && lastQuestionAnswered) {
            // get current game instance attributes and only update those which are passed
            try {
                const updatedValues = await dynamoDB.update({
                    TableName: gameInstanceTable,
                    Key: {
                        instance_id: instanceId,
                    },
                    UpdateExpression: 'SET lastUpdatedAt = :value1, score = :value2, lastQuestionAnswered= :value3',
                    ExpressionAttributeValues: {
                        ':value1': Date.now(),
                        ':value2': score,
                        ':value3': lastQuestionAnswered
                    },
                    ReturnValues: 'ALL_NEW',
                }).promise();
                console.log("data updated successfully", updatedValues);
            } catch (err) {
                console.error('Error updating item:', err);
            }
        } else {
            return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
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
            body: JSON.stringify({ instanceId: instanceId, lastQuestionAnswered: lastQuestionAnswered, score: score }),
        };
    }
    return response;
};
