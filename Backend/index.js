const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { Storage } = require('@google-cloud/storage');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

function calculateCosineSimilarity(text1, text2) {
  const tokenize = (text) => text.split(/\s+/);

  const getTermFrequency = (text) => {
      const termFrequency = {};
      const tokens = tokenize(text);

      tokens.forEach((token) => {
          termFrequency[token] = (termFrequency[token] || 0) + 1;
      });

      return termFrequency;
  };

  const dotProduct = (vector1, vector2) => {
      let result = 0;

      for (const term in vector1) {
          if (vector2.hasOwnProperty(term)) {
              result += vector1[term] * vector2[term];
          }
      }

      return result;
  };

  const magnitude = (vector) => {
      let result = 0;

      for (const term in vector) {
          result += vector[term] ** 2;
      }

      return Math.sqrt(result);
  };

  const cosineSimilarity = (text1, text2) => {
      console.log(text1 + "                       ///////////////////                  "+text2)
      const tf1 = getTermFrequency(text1);
      const tf2 = getTermFrequency(text2);

      const dotProd = dotProduct(tf1, tf2);
      const mag1 = magnitude(tf1);
      const mag2 = magnitude(tf2);

      if (mag1 === 0 || mag2 === 0) {
          return 0; // Avoid division by zero
      }

      return dotProd / (mag1 * mag2);
  };

  return cosineSimilarity(text1, text2);
}


const openai = new OpenAI({ apiKey: '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' });
const app = express();
app.use(bodyParser.json());
const PORT = 3000;
















// MongoDB connection (you can replace this with your own database connection)

// Server setup
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
