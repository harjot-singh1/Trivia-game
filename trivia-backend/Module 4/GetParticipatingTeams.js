const AWS = require('aws-sdk');
const { promisify } = require('util');

const dynamodb = new AWS.DynamoDB();
const scanAsync = promisify(dynamodb.scan).bind(dynamodb);

module.exports.handler = async (event) => {
    const gameId = "" + event.queryStringParameters.gameId;
    console.log("Path parameters: " + gameId);

    try {
        const dbResponse = await scanAsync({
            TableName: 'game_instance'
        });
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend domain if needed
                'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other required headers
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Add the allowed methods
                'Access-Control-Allow-Credentials': true, // Set to true if your requests include credentials (e.g., cookies)
            },
            body: JSON.stringify(dbResponse.Items.filter(instance => {
                console.log("Instance:: " + JSON.stringify(instance));
                return instance?.gameId?.S === "" + gameId
            })
                .map(instance => ({ id: instance.teamId.S })))
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
