const AWS = require('aws-sdk')

exports.handler = async(event) => {
    try {
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const tableName = "trivia_categories"

        // Fetch specific category by id
        if(event.queryStringParameters && event.queryStringParameters.id) {
             const id = event.queryStringParameters.id
            
            const getAllCategories = {
                TableName: tableName
            }

            const all_categories = await db_connection.scan(getAllCategories).promise()
            var categories = {}

            all_categories.Items.forEach(item => {
                if(item.id == id){
                    categories = item
                }
            });
            
            response = {
                statusCode: 200,
                body: JSON.stringify(categories)
            }
            return response
        }else {
            // Get all categories
            const getAllCategories = {
                TableName: tableName
            }

            const all_categories = await db_connection.scan(getAllCategories).promise()
            const categories = all_categories.Items
            var response = {
                statusCode: 200,
                body: JSON.stringify(categories)
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