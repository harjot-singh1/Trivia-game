const AWS = require('aws-sdk')

exports.handler = async(event) => {
    try {
        const req = JSON.parse(event.body)
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const tableName = "trivia_categories"

        await db_connection.put({TableName: tableName,Item: {...req}}).promise()
        
        var response = {
            statusCode: 200,
            body: "Updated"
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
