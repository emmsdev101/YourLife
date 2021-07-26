require('dotenv').config()
const S3 = require('aws-sdk/clients/s3')

const fs = require('fs')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKey = process.env.AWS_BUCKET_ACCESS_KEY
const secretKey = process.env.AWS_BUCKET_SECRET_KEY


const s3 = new S3({
    region: region,
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    
})


 function uploadFile(file){
    try{
        const fileStream = fs.createReadStream(file.path)
    console.log(bucketName)
    console.log(region)
    console.log(accessKey)
    console.log(secretKey)
    const uploadParams = {
        Bucket: bucketName,
        Body:fileStream,
        Key:file.filename
    }
    return s3.upload(uploadParams).promise()
    }catch(err){
        console.log(err)
        return null
    }
}
exports.uploadFile = uploadFile

 function getFileStream(fileKey){
    try{
        const donwloadParams = {
            Key:fileKey,
            Bucket:bucketName
        }

        const objectS3 = s3.getObject(donwloadParams).createReadStream().on('error', error => {
           console.log(error)
        });
        return objectS3
    }catch(err){
        console.log(err)
        return null
    }
}
exports.getFileStream = getFileStream