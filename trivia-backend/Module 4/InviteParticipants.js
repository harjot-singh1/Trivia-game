const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB();
const sns = new AWS.SNS();
const axios = require('axios');

module.exports.handler = async (event) => {
    let response = {};
    if (event && event.body) {
        const jsonifiedBody = JSON.parse(event.body);
        const userId = jsonifiedBody.userId;
        const instanceId = jsonifiedBody.instanceId;
        const teamId = jsonifiedBody.teamId;
        const teamName = jsonifiedBody.teamName;
        if (userId && instanceId && teamId) {
            const result = await dynamodb.getItem({
                TableName: "game_instance",
                Key: { instance_id: { "S": "" + instanceId } }
            }).promise();
            if (result?.Item) {
                const itemData = AWS.DynamoDB.Converter.unmarshall(result.Item);
                console.log(itemData.teamId);
                // call team API
                // const response = [ { email: "madanmayank5@gmail.com"},  { email: "my905874@dal.ca"}];
                console.log("teamId: " + teamId);
                const response = await axios.post('https://us-central1-serverless-391112.cloudfunctions.net/get-team-members', {
                    teamId: "" + teamId
                });
                console.log("Team Memebers:" + JSON.stringify(response.data));
                for (let user of response.data.message[0].team_members) {
                    if (user) {
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
                        if (userId != user) {
                            const topicARN = "arn:aws:sns:us-east-1:310590638041:notify-participants-" + teamName.replace(/[^\w\-]/gi, '');
                            console.log("TOPIC ARN: " + topicARN);
                            const responseFromSNS = await sns.publish({
                                TopicArn: topicARN,
                                Message: userId + " has requested you to join the game. Please log into trivia titans and enter game pin " + instanceId
                            }).promise();
                            console.log("SNS publish message: " + JSON.stringify(responseFromSNS));
                        }
                    }
                }
            } else {
                return { statusCode: 500, body: JSON.stringify('Game instance not found') };
            }
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
            body: JSON.stringify({ instanceId: instanceId, message: "Members invited successfully" }),
        };
    }
    return response;
};
