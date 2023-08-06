const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()
const axios = require('axios')

const generateId = () => {
    const lower = 1000
    const upper = 9999
    
    return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

const getAutomatedTag = async (question) => {
    var result = []
    await axios.post("https://us-central1-serverless-391112.cloudfunctions.net/categorize-question",{"questionText": question}).then((res)=>{
        if(res.data){
            result = res.data.categories
        }
    }).catch((error)=>{
        result = "undefined"
    })

    return result;
}

exports.handler = async(event) => {
    try {
        const req = JSON.parse(event.body)
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const tableName = "trivia_questions"
    
        const result = await getAutomatedTag(req.question)
        
        await db_connection.put({TableName: tableName,Item: {id: generateId(), ...req, categories: result}}).promise()
        
        const triggerDashboard = {
            FunctionName: 'TriviaDashboard',
            InvocationType: 'RequestResponse',
            Payload: "" 
        };

        await lambda.invoke(triggerDashboard).promise()
        
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


// const AWS = require('aws-sdk')
// const lambda = new AWS.Lambda()

// const generateId = () => {
//     const lower = 1000
//     const upper = 9999
    
//     return Math.floor(Math.random() * (upper - lower + 1)) + lower
// }

// exports.handler = async(event) => {
//     try {
//         const req = JSON.parse(event.body)
//         const db_connection = new AWS.DynamoDB.DocumentClient()
//         const tableName = "trivia_questions"
    
//         await db_connection.put({TableName: tableName,Item: {id: generateId(), ...req}}).promise()
        
//         const triggerDashboard = {
//             FunctionName: 'TriviaDashboard',
//             InvocationType: 'RequestResponse',
//             Payload: "" 
//         };

//         await lambda.invoke(triggerDashboard).promise()
        
//         var response = {
//             statusCode: 200,
//             body: "Added"
//         }
//         return response
//     }catch(error){
//         var response = {
//             statusCode: 400,
//             body: JSON.stringify(error)
//         }
//         return response
//     }
// };