// uploadHandlers.js
import { generateAuthenticatedUrls, getText } from '../utils';
import { authinput, inputText, authdataset, datasetText } from '../data';

export const inputUploadHandler = async (req, res) => {
    try {
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
        inputFilesArray = uploadedFileUrls;
        const authenticatedUrls = await generateAuthenticatedUrls(inputFilesArray);
        authinput = authenticatedUrls;
        console.log(authinput);

        // Perform additional actions if needed

        res.status(200).send('Files uploaded successfully.');
    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const datasetUploadHandler = async (req, res) => {
    try {
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
        datasetFilesArray = uploadedFileUrls;
        const authenticatedUrls = await generateAuthenticatedUrls(datasetFilesArray);
        authdataset = authenticatedUrls
        console.log(authdataset);

        res.status(200).send('Files uploaded successfully.');
    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const getTextHandler = async (req, res) => {
    try {
        console.log("getting text....")
        // Assuming inputText and getText are defined elsewhere
        await getText(authinput, inputText);
        // Perform additional actions if needed
        console.log(inputText)
        await getText(authdataset, datasetText);
        console.log(datasetText);
        const responseObj = { inputText };

        res.status(200).json(responseObj);

    } catch (error) {
        console.error('Error processing the request:', error);
        res.status(500).send('Internal Server Error');
    }
};
