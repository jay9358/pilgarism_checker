const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const { calculateCosineSimilarity } = require('./utils');



const openai = new OpenAI({ apiKey: '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' });
const app = express();
const PORT = 3000;
app.use(cors());
let inputText=[];
let datasetText=[];
app.use(bodyParser.json());
let inputFilesArray = [];
let datasetFilesArray = [];
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
                expires: Date.now() + 120* 60 * 1000, // URL expires in 3 minutes
                responseDisposition: 'attachment', // Treat the file as an attachment
            });

        downloadUrls.push(url);
    }

    return downloadUrls;
}



let authinput=[]
let authdataset=[]

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
      inputFilesArray=uploadedFileUrls;
      const authenticatedUrls = await generateAuthenticatedUrls(inputFilesArray);
      authinput=authenticatedUrls;
      console.log(authinput);
      const obj={authinput}
     
      // Perform additional actions if needed
  
      res.status(200).json(obj);
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
    datasetFilesArray=uploadedFileUrls;
    const authenticatedUrls = await generateAuthenticatedUrls(datasetFilesArray);
    authdataset=authenticatedUrls
    console.log(authdataset);
   const obj={authdataset}

    res.status(200).json(obj);
} 



catch(error){
    console.error('Error processing the request:', error);
    res.status(500).send('Internal Server Error');
}
});


app.get('/getText', async (req, res) => {
  try {
    console.log("getting text....")
      // Assuming inputText and getText are defined elsewhere
      inputText=await getText(authinput, inputText);
      // Perform additional actions if needed
      console.log(inputText)
      datasetText=await getText(authdataset,datasetText);
      console.log(datasetText)   ;
      const responseObj = { inputText, datasetText };

      res.status(200).json(responseObj);
    
  } catch (error) {
      console.error('Error processing the request:', error);
      res.status(500).send('Internal Server Error');
  }
});



async function getText(urls,textArray){
    try {
        const apiKey = "0CRydET24VEHiGaUQO8Odg3FP2R4SC0c";
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
      
    
        // Add all the extracted text to the textArray
        try {
            const results = await Promise.all(fetchPromises);
        
            // Log the content of the results variable
            console.log('Results:', results);
        
            // Parse each JSON string in the array
            const parsedResults = results.map(jsonString => JSON.parse(jsonString));
        
            // Extract the all_text property from each parsed result
            const allTextArray = parsedResults.map(result => result.all_text);

          
            textArray=allTextArray;
            return textArray;
        } catch (error) {
            console.error('Error extracting text:', error);
        }
      
       
      } catch (error) {
        console.error('Error extracting text:', error);
      }
    
}










app.get('/analyze', async (req, res) => {
  const inputTextArray = inputText; 
  try {
    // Assuming inputText and datasetText arrays are populated in the /getText endpoint
    const inputTextArray = inputText; 
    const datasetTextArray = datasetText;

    // Calculate cosine similarity between each input text and dataset text
    const similarityResults = [];

  
        const similarities = datasetTextArray.map(datasetTextItem => {
            return calculateCosineSimilarity(inputTextArray[0], datasetTextItem);
        });

        similarityResults.push(similarities);
    
    console.log(similarityResults);
    res.status(200).json({ similarityResults });
} catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).send('Internal Server Error');
}
})



app.post('/generateText', async (req, res) => {
  try {
    const text = req.body.inputTextto;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: `${text} generate similar content` }],
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0].message.content);

    // Add your text generation logic here if needed

    res.status(200).json({ generatedText: completion.choices[0].message.  content }); // Send a response back to the client
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).send('Internal Server Error');
  }
});


















// MongoDB connection (you can replace this with your own database connection)

// Server setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
