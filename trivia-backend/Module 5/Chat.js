const AWS = require('aws-sdk');

const sqs = new AWS.SQS();
const sns = new AWS.SNS();

AWS.config.update({
    accessKeyId: 'ASIAQHWNM2YM6KCBE5EZ',
    secretAccessKey: 'RNnFaL+/wBgdMU3n1R2nOlGeJffWcgpXLRobjK0u',
    sessionToken: 'FwoGZXIvYXdzEK///////////wEaDM2SjATvSPalsknDyyLAAe6UHO26MBzRvHBjsMHizxYCy2QOyZPG91lt4F2DArY/AQceDjvViJbK8PGb2wz65Ex7g49lc8Ym+82izrX8lZy7MTUTGl5v2jIU0uGAXbZY40U8ZhElSqL/jP0tLrbzKXKfMCVLBVAfRdnQu4PdzwwvGLshHrop4QsBEsKG002Nma9W+o+YyGKQsPmI4ITdTQa96d+zRDedDPZKbuJUWPc2FhJn11uIjisWvcKMyavX/JD/CbXBKVHsGgdTAcVg5SirkrmmBjIt3o8VVDbSRyOL3MenQwwL0YEP01UiE5kHZM3X1B2xDCaL4lUHhE9gbDm31gB2',
    region: 'us-east-1',
});

exports.messagehandler = async (event, context) => {
    const message = event.message;

    // Send the message to the SQS queue
    const sqsParams = {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/016536884761/ingamechat',
        MessageBody: message,
    };

    try {
        await sqs.sendMessage(sqsParams).promise();
        console.log('Message sent to SQS queeu:', message);
    } catch (error) {
        console.error('Error sending message to SQS:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error sending message to SQS' }),
        };
    }

    // const responseBody = { message: message };
    // const snsParams = {
    //     TopicArn: 'arn:aws:sns:us-east-1:016536884761:ingamechat',
    //     Message: JSON.stringify(responseBody),
    // };

    // try {
    //     await sns.publish(snsParams).promise();
    //     console.log('Message published to SNS:', message);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Message sent successfully', receivedMessage: message }),
    };
    // } catch (error) {
    //     console.error('Error publishing message to SNS:', error);
    //     return {
    //         statusCode: 500,
    //         body: JSON.stringify({ error: 'Error publishing message to SNS' }),
    //     };
    // }
};



exports.receivedhandler = async (event, context) => {
    try {
        const queueUrl = 'https://sqs.us-east-1.amazonaws.com/016536884761/ingamechat';
        const params = {
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 30,
            WaitTimeSeconds: 0,
        };

        const data = await sqs.receiveMessage(params).promise();

        if (!data.Messages || data.Messages.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'No messages available.' }),
            };
        }

        const messages = data.Messages.map((message) => {
            return {
                messageId: message.MessageId,
                receiptHandle: message.ReceiptHandle,
                body: JSON.parse(message.Body),
            };
        })
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error.' }),
        };
    }
};
