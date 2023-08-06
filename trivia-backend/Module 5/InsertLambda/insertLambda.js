const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'tblscore';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'ASIAQHWNM2YM44LCHN6O',
  secretAccessKey: 'fgtjVzeC7gvrvf7l52YSPaKyQ4gaFRhTbcE5sFo3',
  sessionToken: 'FwoGZXIvYXdzEGgaDAis97lejYrwLrJpUyLAAceZL2Psy6KHwanADJY5yHKoaBH0Rsqppy4Z+gPyfst94skYOguIrNNPxnu60pCcAy5uS6dCjpZl2cf+8MiMtITaPRRF5bTB1cNh2Qz74zsInOEbIAutECUn7CHa3Cai5hlDK43iC+RvHlIQsyDGU5JFJP0x9uscTdlZDKVLJAr6RVCkzmi6MkP9jPLPJLaZelaZ7S0pBsHRsgeOrhwb1MvAy3qY78JL+F98M6HhGG4yUudMtbYAMLeLtLii6cEu/SjB06mmBjItB8fTZ/AuMkHNtmIjnhWYeU0AK1oIw66Ex8Ch9/YVlkwJFQnCKnQnblNKpKbq',
});


exports.insertLambdahandler = async (event) => {

  try {
    const { instanceId, score, lastQuestionAnswered } = event;

    // Check if the instanceId already exists in DynamoDB
    const checkParams = {
      TableName: tableName,
      Key: {
        instanceId: instanceId,
      },
    };

    const existingData = await dynamoDB.get(checkParams).promise();
    if (existingData && existingData.Item) {
      // If the instanceId exists, delete the existing entry
      const deleteParams = {
        TableName: tableName,
        Key: {
          instanceId: instanceId,
        },
      };
      console.log(deleteParams);
      await dynamoDB.delete(deleteParams).promise();
    }

    // Store the new data in DynamoDB
    const params = {
      TableName: tableName,
      Item: {
        instanceId: instanceId,
        score: score,
        lastQuestionAnswered: lastQuestionAnswered,
      },
    };
    console.log(params);
    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: 'Data stored in DynamoDB successfully!',
    };
  } catch (error) {
    console.error('Error storing data in DynamoDB:', error);
    return {
      statusCode: 500,
      body: error,
    };
  }
};

