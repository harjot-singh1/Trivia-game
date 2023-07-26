const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
    let response = {};
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    const gameInstanceTable = 'game_instance';
    console.log("event-body " + event.body);
    if (event && event.body) {
        const requestBody = JSON.parse(event.body);
        const instanceId = requestBody.instanceId;
        const score = requestBody.score;
        if (instanceId && score >= 0) {
            try {
                const updatedValues = await dynamoDB.update({
                    TableName: gameInstanceTable,
                    Key: {
                        instance_id: instanceId,
                    },
                    UpdateExpression: 'SET lastUpdatedAt = :value1, score = :value2',
                    ExpressionAttributeValues: {
                        ':value1': Date.now(),
                        ':value2': score,
                    },
                    ReturnValues: 'ALL_NEW', // Optional, specify what values to return after the update (ALL_NEW returns the updated item)
                }).promise();

                console.log("data updated successfully", updatedValues);
            } catch (err) {
                console.error('Error updating item:', err);
                // Handle error if needed
                // return appropriate response
            }
        } else {
            return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
        }
        console.log("Setting success response");
        response = {
            statusCode: 201,
            body: JSON.stringify({ instanceId: instanceId, message: "Game session created successfully" }),
        };
    }
    return response;
};
