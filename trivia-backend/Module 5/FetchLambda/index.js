const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'tblscore';

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'ASIAQHWNM2YM44LCHN6O',
    secretAccessKey: 'fgtjVzeC7gvrvf7l52YSPaKyQ4gaFRhTbcE5sFo3',
    sessionToken: 'FwoGZXIvYXdzEGgaDAis97lejYrwLrJpUyLAAceZL2Psy6KHwanADJY5yHKoaBH0Rsqppy4Z+gPyfst94skYOguIrNNPxnu60pCcAy5uS6dCjpZl2cf+8MiMtITaPRRF5bTB1cNh2Qz74zsInOEbIAutECUn7CHa3Cai5hlDK43iC+RvHlIQsyDGU5JFJP0x9uscTdlZDKVLJAr6RVCkzmi6MkP9jPLPJLaZelaZ7S0pBsHRsgeOrhwb1MvAy3qY78JL+F98M6HhGG4yUudMtbYAMLeLtLii6cEu/SjB06mmBjItB8fTZ/AuMkHNtmIjnhWYeU0AK1oIw66Ex8Ch9/YVlkwJFQnCKnQnblNKpKbq',
});

exports.fetchLambdahandler = async (event) => {
    const { instanceId } = event.instanceId;
    try {
        const params = {
            TableName: tableName,
            Key: { instanceId },
        };

        const result = await dynamoDB.scan(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message),
        };
    }
};
