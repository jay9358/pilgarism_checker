import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import { Storage } from '@google-cloud/storage'; // Updated import for Google Cloud Storage

const app = express();
const PORT = 3000;
app.use(cors());
const inputText=[];
const datasetText=[];

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
app.post('/uploadinput', inputupload.array('files'), async(req, res) => {
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

      await getText(authinput,inputText);
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
   
    await getText(authdataset,datasetText);
    res.status(200).send('Files uploaded successfully.');
} 

catch(error){
    console.error('Error processing the request:', error);
    res.status(500).send('Internal Server Error');
}
});






async function getText(urls,textArray){
    try {
        const apiKey = "UIgyVTAZWZhSAGrNhmSTwKwQCFVl2XNk";
        const apiEndpoint = "https://api.apilayer.com/image_to_text/url";
    
        // Use Promise.all to fetch text for all URLs concurrently
        const fetchPromises = urls.map(async (url) => {
          const requestOptions = {
            method: 'GET',
            headers: new Headers({ 'apikey': apiKey }),
          };
    
          // Replace {url} in the API endpoint with the current URL
          const imageUrl = `${apiEndpoint}?url=${encodeURIComponent(url)}`;
    
          const response = await fetch(imageUrl, requestOptions);
          const result = await response.text();
    
          return result;
        });
    
        // Wait for all fetchPromises to resolve
        const results = await Promise.all(fetchPromises);
    
        // Add all the extracted text to the textArray
        try {
            const results = await Promise.all(fetchPromises);
        
            // Log the content of the results variable
            console.log('Results:', results);
        
            // Parse each JSON string in the array
            const parsedResults = results.map(jsonString => JSON.parse(jsonString));
        
            // Extract the all_text property from each parsed result
            const allTextArray = parsedResults.map(result => result.all_text);
        
            console.log('All Text Array:', allTextArray);
        
        } catch (error) {
            console.error('Error extracting text:', error);
        }
      
       
      } catch (error) {
        console.error('Error extracting text:', error);
      }
    
}




















// MongoDB connection (you can replace this with your own database connection)

// Server setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
