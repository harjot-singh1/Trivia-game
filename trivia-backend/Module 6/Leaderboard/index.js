const AWS = require('aws-sdk')
const {Storage} = require('@google-cloud/storage')
const fs = require('fs');
const path = require('path');
const filePathCredentials = path.join(__dirname, "my-project-31313-579a51d77020.json");
const axios = require("axios")

// Create csv and upload file
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
        var team_data = []
        var individual_data = []
        
        // Get team data
        await axios.get("https://us-central1-serverless-391112.cloudfunctions.net/team-stats").then((res)=>{
            if(res.data){
                team_data = res.data
            }
        })
        
        // Get individual data
        await axios.get("https://us-central1-serverless-391112.cloudfunctions.net/individual-stats").then((res)=>{
            if(res.data){
                individual_data = res.data
            }
        })
        
        

        await uploadFile(individual_data,team_data)

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