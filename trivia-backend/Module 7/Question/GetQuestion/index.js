const AWS = require('aws-sdk')

exports.handler = async(event) => {
    try {
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const tableName = "trivia_questions"
        
        // Get specific question from table by id
        if(event.queryStringParameters && event.queryStringParameters.id) {
            const id = event.queryStringParameters.id
            
            const getAllQuestions = {
                TableName: tableName
            }

            const all_questions = await db_connection.scan(getAllQuestions).promise()
            var question = {}
            all_questions.Items.forEach(item => {
                if(item.id == id){
                   question = item
                }
            });
            
            response = {
                statusCode: 200,
                body: JSON.stringify(question)
            }
            return response
        }else {
            const getAllQuestions = {
                TableName: tableName
            }

            // Get all questions
            const all_questions = await db_connection.scan(getAllQuestions).promise()
            const questions = all_questions.Items
            var response = {
                statusCode: 200,
                body: JSON.stringify(questions)
            }
            return response
        }

    }catch(error){
        var response = {
            statusCode: 400,
            body: JSON.stringify(error)
        }
        return response
    }
};