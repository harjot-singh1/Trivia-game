const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

exports.handler = async(event) => {
    try {
        const req = JSON.parse(event.body)
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const tableName = "trivia_games"
        const id = req.id

        const deleteGameById = {
            TableName: tableName,
            Key: {id: id}
        }

        // Delete game from table
        await db_connection.delete(deleteGameById).promise()
        
        const invokeParams = {
            FunctionName: 'TriviaDashboard',
            InvocationType: 'RequestResponse',
            Payload: "" 
        };

        await lambda.invoke(invokeParams).promise()
        
        var response = {
            statusCode: 200,
            body: "Deleted"
        }
        return response
    }catch(error){
        var response = {
            statusCode: 400,
            body: JSON.stringify(error)
        }
        return response
    }
};
