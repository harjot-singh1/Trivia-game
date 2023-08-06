const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
module.exports.handler = async (event) => {
    let response = {};
    const gameInstanceTable = 'game_instance';
    if (event?.userId && event?.teamId && event?.gameId) {
        const userId = event.userId;
        const teamId = event.teamId;
        const gameId = event.gameId;
        console.log("User " + userId + "|| team " + teamId + "|| Game " + gameId);
        let instanceId = 0;
        if (userId && teamId && gameId) {
            instanceId = getRandomInt(1, 25555);
            try {
                await dynamodb.putItem({
                    TableName: gameInstanceTable,
                    Item: {
                        instance_id: { "S": "" + instanceId },
                        scheduledTimestamp: { "S": "" + Date.now() },
                        teamId: { "S": teamId },
                        initiatedBy: { "S": userId },
                        gameId: { "S": gameId }
                    }
                }).promise();
                console.log("Promise resolved successfully");
            } catch (e) {
                console.error("Failed to persist in dynamodb" + e);
                return {
                    statusCode: 500,
                    message: e
                };
            }
        } else {
            return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
        }
        console.log("Setting success response")
        response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend domain if needed
                'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other required headers
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Add the allowed methods
                'Access-Control-Allow-Credentials': true, // Set to true if your requests include credentials (e.g., cookies)
            },
            body: { instanceId: instanceId, message: "Game session created successfully" },
        };
    }
    return response;
};
