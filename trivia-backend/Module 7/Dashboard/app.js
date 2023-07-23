const {Storage} = require('@google-cloud/storage')
const fs = require('fs')
const path = require('path')
const filePath = path.join(__dirname, "stats.csv")


const fileupload = async() => {
    const storage = new Storage({
        keyFilename: `./my-project-31313-579a51d77020.json`,
    })
    storage.bucket("trivia-statistics").upload(filePath, {
        destination: "stats.csv"
    },(error,file)=>{
        if(error) {
            console.error(`Error uploading image image_to_upload.jpeg: ${error}`)
        } else {
            console.log("Image image_to_upload.jpeg uploaded")
        }
    });
}

fileupload()