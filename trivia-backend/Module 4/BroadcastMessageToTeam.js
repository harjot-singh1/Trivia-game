// external dependency imports from lambda layers
const AWS = require('aws-sdk');
const sns = new AWS.SNS();

module.exports.handler = async (event) => {
    let response = {};
    if (event && event.body) {
        const jsonifiedBody = JSON.parse(event.body);
        //generic params to send message to team
        const teamName = jsonifiedBody.teamName;
        const msg = jsonifiedBody.msg;
        console.log("TEAM NAME: " + teamName + "  || msg: " + msg);
        if (teamName && msg) {
            // forming topic to send notification
            const topicARN = "arn:aws:sns:us-east-1:310590638041:notify-participants-" + teamName.replace(/[^\w\-]/gi, '');
            console.log("TOPIC ARN: " + topicARN);
            // sending the intended message to the indended team
            const responseFromSNS = await sns.publish({
                TopicArn: topicARN,
                Message: JSON.stringify(msg)
            }).promise();
            console.log("SNS publish message: " + JSON.stringify(responseFromSNS));
            response = {
                statusCode: 201,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                    'Access-Control-Allow-Credentials': true,
                },
                body: "Message sent successfully",
            };
        }
    } else {
        return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
    }
    return response;
};
