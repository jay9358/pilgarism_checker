// utils.js

function calculateCosineSimilarity(text1, text2) {
    const tokenize = (text) => text.toLowerCase().split(/\s+/);

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

export { calculateCosineSimilarity };
