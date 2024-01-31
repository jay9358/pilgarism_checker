// server.js
import express from 'express';
import cors from 'cors';
import { handleInputUpload, handleDatasetUpload, handleGetText } from './handlers/handlers';

const app = express();
const PORT = 3000;

app.use(cors());

// Routes
app.post('/uploadinput', handleInputUpload);
app.post('/uploaddataset', handleDatasetUpload);
app.get('/getText', handleGetText);

// Server setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
