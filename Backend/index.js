import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
// import { v2 as cloudinary } from 'cloudinary'; // Updated import for Cloudinary
// import { CloudinaryStorage } from 'multer-storage-cloudinary'; // Added import for Cloudinary storage
import { Storage } from '@google-cloud/storage'; // Updated import for Google Cloud Storage

const app = express();
const PORT = 3000;
app.use(cors());
// Multer configuration
// const Inputstorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './input'); // Set your desired upload directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });
// cloudinary.config({ 
//     cloud_name: 'dqyaqiwwt', 
//     api_key: '755337683328969', 
//     api_secret: 'ZzL_8gmO49zRAYRX4rKNYw7jEvA' 
//   });
//   const cloudinaryStorageInput = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'input', // Set your desired upload directory for input files
//         format: async (req, file) => 'png', // You can set the format or remove this line
//         public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
//     },
// });

// const cloudinaryStorageDataset = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'dataset', // Set your desired upload directory for dataset files
//         format: async (req, file) => 'png', // You can set the format or remove this line
//         public_id: (req, file) => `${file.fieldname}-${Date.now()}`,
//     },
// });
// const inputupload = multer({ storage: cloudinaryStorageInput });
// const dataupload = multer({ storage: cloudinaryStorageDataset });
// const dataset = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './Dataset'); // Set your desired upload directory
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

const inputFilesArray = [];
const datasetFilesArray = [];
const storage = new Storage({
    projectId: 'auspicious-rex-411614',
    keyFilename: './keyfile.json',
  });
  const bucket = storage.bucket('input_plagiarism');
 
 
  const inputupload = multer({
    storage: multer.memoryStorage(),
  });
  
  const dataupload = multer({
    storage: multer.memoryStorage(),
  });


  async function generateAuthenticatedUrls(filesArray) {
    const downloadUrls = [];

    for (const fileUrl of filesArray) {
        // Remove the protocol and bucket name if they exist
        const cleanUrl = fileUrl.replace(/^https:\/\/storage.googleapis.com\/[^/]+\//, '');

        // Generate download URL
        const [url] = await storage
            .bucket(bucket.name)
            .file(cleanUrl)
            .getSignedUrl({
                action: 'read',
                expires: Date.now() + 3 * 60 * 1000, // URL expires in 3 minutes
                responseDisposition: 'attachment', // Treat the file as an attachment
            });

        downloadUrls.push(url);
    }

    return downloadUrls;
}



const authinput=[]
const authdataset=[]

// Route for file upload
app.post('/uploadinput', inputupload.array('files', 1), async(req, res) => {
try{
    const inputFiles = req.files;

    if (!inputFiles || inputFiles.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log("Uploaded successfully");
    const fileUploadPromises = inputFiles.map(async (file) => {
        const blob = bucket.file(`input/${file.originalname}`);
        const blobStream = blob.createWriteStream();
        blobStream.end(file.buffer);
  
        return new Promise((resolve, reject) => {
          blobStream.on('finish', () => {
            resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
          });
  
          blobStream.on('error', (error) => {
            reject(error);
          });
        });
      });
  
      const uploadedFileUrls = await Promise.all(fileUploadPromises);
      inputFilesArray.push(...uploadedFileUrls);
      const authenticatedUrls = await generateAuthenticatedUrls(inputFilesArray);
      authinput.push(...authenticatedUrls)
      console.log(authinput);
      // Perform additional actions if needed
  
      res.status(200).send('Files uploaded successfully.');
}
catch(error){
    console.error('Error processing the request:', error);
    res.status(500).send('Internal Server Error');
}
});

app.post('/uploaddataset', dataupload.array('files'), async(req, res) => {
try{
    const datasetFiles = req.files;
    if (!datasetFiles || datasetFiles.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log("Uploaded successfully");
    const fileUploadPromises = datasetFiles.map(async (file) => {
        const blob = bucket.file(`dataset/${file.originalname}`); // Specify the "dataset" folder
        const blobStream = blob.createWriteStream();
        blobStream.end(file.buffer);

        return new Promise((resolve, reject) => {
            blobStream.on('finish', () => {
                resolve(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
            });

            blobStream.on('error', (error) => {
                reject(error);
            });
        });
    });

    const uploadedFileUrls = await Promise.all(fileUploadPromises);
    datasetFilesArray.push(...uploadedFileUrls);
    const authenticatedUrls = await generateAuthenticatedUrls(datasetFilesArray);
    authdataset.push(...authenticatedUrls)
    console.log(authdataset);
   

    res.status(200).send('Files uploaded successfully.');
} 

catch(error){
    console.error('Error processing the request:', error);
    res.status(500).send('Internal Server Error');
}
});

// MongoDB connection (you can replace this with your own database connection)

// Server setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
