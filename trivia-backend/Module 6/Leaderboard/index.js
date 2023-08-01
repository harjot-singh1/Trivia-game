const AWS = require('aws-sdk')
const {Storage} = require('@google-cloud/storage')
const fs = require('fs');
const path = require('path');
const filePathCredentials = path.join(__dirname, "my-project-31313-579a51d77020.json");

const uploadFile = async (individual_data,team_data) => {
    var file_data1 = "email,score,Date\n"
    individual_data.forEach((item)=>{
        file_data1+=item.email+","+item.score+","+item.date+"\n"
    })
    fs.writeFileSync("/tmp/stats1.csv", file_data1);

    var file_data2 = "team,score,Date\n"
    team_data.forEach((item)=>{
        file_data2+=item.team+","+item.score+","+item.date+"\n"
    })
    fs.writeFileSync("/tmp/stats2.csv", file_data2);

    const storage = new Storage({
        keyFilename: filePathCredentials,
    })
    
    await storage.bucket("trivia-statistics").upload("/tmp/stats1.csv", {
        destination: "leaderboard-individual.csv"
    });

    await storage.bucket("trivia-statistics").upload("/tmp/stats2.csv", {
        destination: "leaderboard-team.csv"
    });
}

exports.handler = async(event) => {
    try {
        const team_data = [
            {
                team: "Team A",
                score: 350,
                date: "20/07/2023" 
            },
            {
                team: "Team A",
                score: 240,
                date: "25/05/2023" 
            },
            {
                team: "Team B",
                score: 120,
                date: "05/06/2023" 
            },
            {
                team: "Team B",
                score: 420,
                date: "10/07/2023" 
            },
            {
                team: "Team C",
                score: 275,
                date: "30/07/2023" 
            }
        ]
        const individual_data = [
            {
                email: "kadivarnand007@gmail.com",
                score: 80,
                date: "21/06/2023" 
            },
            {
                email: "rakshitranpariya@gmail.com",
                score: 120,
                date: "10/05/2023" 
            },
            {
                email: "kadivarnand007@gmail.com",
                score: 70,
                date: "18/07/2023" 
            },
            {
                email: "vivekpatel@gmail.com",
                score: 100,
                date: "26/06/2023" 
            },
            {
                email: "kavanpatel@gmail.com",
                score: 60,
                date: "28/06/2023" 
            },
            {
                email: "kavanpatel@gmail.com",
                score: 40,
                date: "08/07/2023" 
            }
        ]
        // const category = "trivia_categories"
        // const question = "trivia_questions"
        // const game = "trivia_games"
        
        // const categories = await db_connection.scan({TableName: category}).promise()
        // const questions = await db_connection.scan({TableName: question}).promise()
        // const games = await db_connection.scan({TableName: game}).promise()
    
        // var category_stats = []

        // categories.Items.forEach((c)=>{
        //     var sum = 0
        //     questions.Items.forEach(item => {
        //         if(item.category == c.name){
        //             sum = sum + 1
        //         }
        //     })
        //     category_stats.push({
        //         category: c.name,
        //         questions: sum
        //     })
        // })
        
        // const res = {
        //     total_categories: categories.Items.length,
        //     total_questions: questions.Items.length,
        //     total_games: games.Items.length,
        //     category_stats: category_stats
        // }

        await uploadFile(individual_data,team_data)
        // const file_data1 = "Games,Categories,Questions\n"+res.total_games+","+res.total_categories+","+res.total_questions

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



// const AWS = require('aws-sdk')
// // const createCsvWriter = require('csv-writer').createObjectCsvWriter
// const CSV = require('csv-writer')
// const {Storage} = require('@google-cloud/storage')
// const fs = require('fs');
// const path = require('path');
// const filePath = path.join(__dirname, "stats.csv");
// const filePathCredentials = path.join(__dirname, "my-project-31313-579a51d77020.json");

// const createCSVFile = async () => {
//     const csv_writer = CSV.createObjectCsvWriter
//     const data = [
//         {category: 'abc'}
//     ]
//     await csv_writer({
//         header: [
//             {id: 'category',title: 'category'}
//         ]
//     }).writeRecords(data)
// }

// exports.handler = async(event) => {
//     try {
//         const db_connection = new AWS.DynamoDB.DocumentClient()
        
//         const category = "trivia_categories"
//         const question = "trivia_questions"
//         const game = "trivia_games"
        
//         const categories = await db_connection.scan({TableName: category}).promise()
//         const questions = await db_connection.scan({TableName: question}).promise()
//         const games = await db_connection.scan({TableName: game}).promise()
    
//         var category_stats = []

//         categories.Items.forEach((c)=>{
//             var sum = 0
//             questions.Items.forEach(item => {
//                 if(item.category == c.name){
//                     sum = sum + 1
//                 }
//             })
//             category_stats.push({
//                 category: c.name,
//                 questions: sum
//             })
//         })
        
//         const res = {
//             total_categories: categories.Items.length,
//             total_questions: questions.Items.length,
//             total_games: games.Items.length,
//             category_stats: category_stats
//         }

//         // const fileContents = fs.readFileSync(filePath, 'utf8');

//         // Upload the CSV file to Google Cloud Storage
//         // const storage = new Storage();
//         // await storage.bucket("trivia-statistics").upload(filePath, {
//         //     destination: "stats.csv"
//         // });

//         const storage = new Storage({
//             keyFilename: filePathCredentials,
//         })
//         storage.bucket("trivia-statistics").upload(filePath, {
//             destination: "stats.csv"
//         },(error,file)=>{
//             if(error) {
//                 console.error(`Error uploading image image_to_upload.jpeg: ${error}`)
//                 var response = {
//                     statusCode: 200,
//                     body: error
//                 }
//                 return response
//             } else {
//                 console.log("Image image_to_upload.jpeg uploaded")
//                 var response = {
//                     statusCode: 200,
//                     body: "Success"
//                 }
//                 return response
//             }
//         });

//     }catch(error){
//         var response = {
//             statusCode: 400,
//             body: JSON.stringify(error)
//         }
//         return response
//     }
// };

