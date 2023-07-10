const AWS = require('aws-sdk')

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

        await db_connection.delete(deleteGameById).promise()
        
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
