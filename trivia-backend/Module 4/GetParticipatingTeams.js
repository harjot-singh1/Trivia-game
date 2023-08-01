const AWS = require('aws-sdk');
const { promisify } = require('util');

const dynamodb = new AWS.DynamoDB();
const scanAsync = promisify(dynamodb.scan).bind(dynamodb);

module.exports.handler = async (event) => {
    const gameId = event.pathParameters.gameId;
    console.log("Path parameters: " + JSON.stringify(event.pathParameters));

    try {
        const dbResponse = await scanAsync({
            TableName: 'game_instance'
        });

        console.log("Instances found for team " + gameId + ": " + JSON.stringify(dbResponse.Items));

        const response = {
            statusCode: 200,
            body: JSON.stringify(dbResponse.Items.filter(instance => instance.gameId.S === "" + gameId).map(instance => ({ name: instance.teamId.S })))
        };

        return response;
    } catch (err) {
        console.error('Error retrieving items:', err);

        const errorResponse = {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };

        return errorResponse;
    }
};
