const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
    AWS.config.update({ region: 'us-east-1' });
    const sns = new AWS.SNS();

    const createTopic = async (teamName) => {
        try {
            const params = {
                Name: teamName,
            };

            const data = await sns.createTopic(params).promise();
            console.log('Topic created successfully:', data.TopicArn);
            return data.TopicArn;
        } catch (err) {
            console.error('Error creating topic:', err);
            throw err;
        }
    };

    const isTopicExists = async (teamName) => {
        try {
            const topics = await sns.listTopics({}).promise();
            const topicExists = topics.Topics.some((topic) => topic.TopicArn.endsWith(':' + teamName));
            return topicExists;
        } catch (err) {
            console.error('Error checking topic existence:', err);
            throw err;
        }
    };

    const createSubscription = async (endpoint, teamName) => {
        try {
            // Check if the topic exists, if not, create it
            const topicExists = await isTopicExists(teamName);
            if (!topicExists) {
                await createTopic(teamName); // Pass the teamName to createTopic
            }

            const topicArn = (await sns.createTopic({ Name: teamName }).promise()).TopicArn;

            const params = {
                Protocol: "email",
                TopicArn: topicArn,
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
        const jsonifiedBody = JSON.parse(event.body);
        console.log("Event body " + jsonifiedBody.teamName);
        console.log("Topic name: " + 'notify-participants-' + jsonifiedBody.teamName.replace(/[^\w\-]/gi, ''));
        await createSubscription(jsonifiedBody.email, 'notify-participants-' + jsonifiedBody.teamName.replace(/[^\w\-]/gi, ''));
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend domain if needed
                'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other required headers
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Add the allowed methods
                'Access-Control-Allow-Credentials': true, // Set to true if your requests include credentials (e.g., cookies)
            },
            body: JSON.stringify("Notification sent successfully to " + jsonifiedBody.email),
        };
    }

    return {
        statusCode: 500,
        body: JSON.stringify("Failed to send notification"),
    };
};
