const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const dotenv = require('dotenv');

// require('./utils/logOrigin');

// Load env vars
dotenv.config({ path: './config/config.env' });

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.name,
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;

// // Load the SDK and UUID
// var AWS = require('aws-sdk');
// var uuid = require('uuid');

// // Create unique bucket name
// var bucketName = 'node-sdk-sample-' + uuid.v4();
// // Create name for uploaded object key
// var keyName = 'hello_world.txt';

// // Create a promise on S3 service object
// var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' })
//   .createBucket({ Bucket: bucketName })
//   .promise();

// // Handle promise fulfilled/rejected states
// bucketPromise
//   .then(function (data) {
//     // Create params for putObject call
//     var objectParams = {
//       Bucket: bucketName,
//       Key: keyName,
//       Body: 'Hello World!',
//     };
//     // Create object upload promise
//     var uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' })
//       .putObject(objectParams)
//       .promise();
//     uploadPromise.then(function (data) {
//       console.log(
//         'Successfully uploaded data to ' + bucketName + '/' + keyName
//       );
//     });
//   })
//   .catch(function (err) {
//     console.error(err, err.stack);
//   });
