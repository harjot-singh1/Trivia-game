// external dependency imports from lambda layers
const AWS = require('aws-sdk');
const sns = new AWS.SNS();

module.exports.handler = async (event) => {
    // configuring AWS dependency resource region
    AWS.config.update({ region: 'us-east-1' });

    const createTopic = async (teamName) => {
        try {
            const data = await sns.createTopic({ Name: teamName }).promise();
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
                await createTopic(teamName);
            }
            const topicArn = (await sns.createTopic({ Name: teamName }).promise()).TopicArn;
            const data = await sns.subscribe({
                Protocol: "email",
                TopicArn: topicArn,
                Endpoint: endpoint,
            }).promise();
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
        // create subscription under topic specifically for the team
        await createSubscription(jsonifiedBody.email, 'notify-participants-' + jsonifiedBody.teamName.replace(/[^\w\-]/gi, ''));
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify("Subscription notification sent successfully to " + jsonifiedBody.email),
        };
    }

    return {
        statusCode: 500,
        body: JSON.stringify("Failed to send notification"),
    };
};
