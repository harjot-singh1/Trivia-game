const AWS = require('aws-sdk')
const {Storage} = require('@google-cloud/storage')
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, "stats.csv");
const filePathCredentials = path.join(__dirname, "my-project-31313-579a51d77020.json");

// Create data csv file and upload in google cloud storage
const uploadFile = async (data) => {
    var file_data1 = "Games,Categories,Questions\n"+data.total_games+","+data.total_categories+","+data.total_questions
    fs.writeFileSync("/tmp/stats1.csv", file_data1);

    var file_data2 = "Category,Questions\n"
    data.category_stats.forEach((item)=>{
        file_data2+=item.category+","+item.questions+"\n"
    })
    fs.writeFileSync("/tmp/stats2.csv", file_data2);

    const storage = new Storage({
        keyFilename: filePathCredentials,
    })
    
    // Store game stats
    await storage.bucket("trivia-statistics").upload("/tmp/stats1.csv", {
        destination: "game-stats.csv"
    });

    // Store category stats
    await storage.bucket("trivia-statistics").upload("/tmp/stats2.csv", {
        destination: "category-stats.csv"
    });
}

exports.handler = async(event) => {
    try {
        const db_connection = new AWS.DynamoDB.DocumentClient()
        
        const category = "trivia_categories"
        const question = "trivia_questions"
        const game = "trivia_games"
        
        // Scan data from database
        const categories = await db_connection.scan({TableName: category}).promise()
        const questions = await db_connection.scan({TableName: question}).promise()
        const games = await db_connection.scan({TableName: game}).promise()
    
        var category_stats = []

        categories.Items.forEach((c)=>{
            var sum = 0
            questions.Items.forEach(item => {
                if(item.category == c.name){
                    sum = sum + 1
                }
            })
            category_stats.push({
                category: c.name,
                questions: sum
            })
        })
        
        const res = {
            total_categories: categories.Items.length,
            total_questions: questions.Items.length,
            total_games: games.Items.length,
            category_stats: category_stats
        }

        // Upload file function call
        await uploadFile(res)

        var response = {
            statusCode: 200,
            body: "Success"
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