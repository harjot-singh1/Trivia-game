const AWS = require('aws-sdk')

exports.handler = async(event) => {
    try {
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const tableName = "trivia_games"
        
        // Get specific game from table by id
        if(event.queryStringParameters && event.queryStringParameters.id) {
            const id = event.queryStringParameters.id
            
            const getAllGames = {
                TableName: tableName
            }

            const all_games = await db_connection.scan(getAllGames).promise()
            var game = {}
            all_games.Items.forEach(item => {
                if(item.id == id){
                   game = item
                }
            });
            
            response = {
                statusCode: 200,
                body: JSON.stringify(game)
            }
            return response
        }else {
            const getAllGames = {
                TableName: tableName
            }

            // Get all games from table
            const all_games = await db_connection.scan(getAllGames).promise()
            const games = all_games.Items
            var response = {
                statusCode: 200,
                body: JSON.stringify(games)
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