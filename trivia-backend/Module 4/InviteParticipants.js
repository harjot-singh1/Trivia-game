// external dependency imports from lambda layers
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const sns = new AWS.SNS();
const axios = require('axios');

module.exports.handler = async (event) => {
    let response = {};
    if (event && event.body) {
        // params needed passed as part of the requestbody
        const jsonifiedBody = JSON.parse(event.body);
        // required params
        const userId = jsonifiedBody.userId;
        const instanceId = jsonifiedBody.instanceId;
        const teamId = jsonifiedBody.teamId;
        const teamName = jsonifiedBody.teamName;
        const gameId = jsonifiedBody.gameId;
        // mandatory params required to proceed
        if (userId && instanceId && teamId) {
            // getting game instance to invite team participants to play the game
            const result = await dynamodb.getItem({
                TableName: "game_instance",
                Key: { instance_id: { "S": "" + instanceId } }
            }).promise();
            if (result?.Item) {
                // extracting item found to check if game instance exists
                const itemData = AWS.DynamoDB.Converter.unmarshall(result.Item);
                // invoking team module cloud function to get team members of the team playing game
                const response = await axios.post('https://us-central1-serverless-391112.cloudfunctions.net/get-team-members', {
                    teamId: "" + teamId
                });
                for (let user of response.data.message[0].team_members) {
                    if (user) {
                        // adding entry in dynamodb of each member invited for further statistics
                        await dynamodb.putItem({
                            TableName: "member_participation",
                            Item: {
                                participation_id: { "S": "" + user + "_" + instanceId },
                                instance_id: { "S": "" + instanceId },
                                userId: { "S": "" + user },
                                notification_initiated: { "S": "" + Date.now() },
                                status: { "S": "pending" }
                            }
                        }).promise();
                    }
                }
                // forming SNS topic name for team playing game
                const topicARN = "arn:aws:sns:us-east-1:310590638041:notify-participants-" + teamName.replace(/[^\w\-]/gi, '');
                console.log("TOPIC ARN: " + topicARN);
                // sending message to all participants via mail with game pin
                const responseFromSNS = await sns.publish({
                    TopicArn: topicARN,
                    Message: userId + " has requested you to join the game. Please log into trivia titans and enter game pin " + instanceId + "-" + gameId
                }).promise();
                console.log("SNS publish message: " + JSON.stringify(responseFromSNS));
            } else {
                return { statusCode: 500, body: JSON.stringify('Game instance not found') };
            }
        } else {
            return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
        }
        response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ instanceId: instanceId, message: "Members invited successfully" }),
        };
    }
    return response;
};
