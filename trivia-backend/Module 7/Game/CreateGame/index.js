const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

// Generate random ID
const generateId = () => {
    const lower = 1000
    const upper = 9999
    
    return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

exports.handler = async(event) => {
    try {
        const req = JSON.parse(event.body)
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const tableName = "trivia_games"
    
        // Store game in table
        await db_connection.put({TableName: tableName,Item: {id: generateId(), ...req}}).promise()
    
        const invokeParams = {
            FunctionName: 'TriviaDashboard',
            InvocationType: 'RequestResponse',
            Payload: "" 
        };

        await lambda.invoke(invokeParams).promise()

        var response = {
            statusCode: 200,
            body: "Added"
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