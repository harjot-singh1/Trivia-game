const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
    AWS.config.update({ region: 'us-east-1' });
    const sns = new AWS.SNS();
    const createSubscription = async (endpoint) => {
        try {
            const params = {
                Protocol: "email",
                TopicArn: "arn:aws:sns:us-east-1:310590638041:notifyParticipants",
                Endpoint: endpoint,
            };

            const data = await sns.subscribe(params).promise();
            console.log('Subscription created successfully:', data.SubscriptionArn);
            return data.SubscriptionArn;
        } catch (err) {
            console.error('Error creating subscription:', err);
            throw err;
        }
    };

    if (event.body) {
        const requestBody = JSON.parse(event.body);
        await createSubscription(requestBody.email);
        return {
            statusCode: 200,
            body: JSON.stringify("Notification sent successfully to " + requestBody.email),
        };
    }
    return {
        statusCode: 500,
        body: JSON.stringify("Failed to send notification"),
    };
};
