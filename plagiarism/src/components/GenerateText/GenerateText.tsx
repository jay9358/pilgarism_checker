import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDataContext } from '../DataContext';

function GenerateText() {
  const [text, setText] = useState('its okk');
  const {inputText}=useDataContext();
  useEffect(() => {
    setText(inputText);
    const fetchData = async () => {
      try {
        // Assuming you want to send 'text' to the backend
        const response = await axios.post('http://localhost:3000/generateText', { inputTextto: text });
        // Assuming the response contains the generated text
        setText(response.data.generatedText); // Update the state with the received text
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
       // Call the fetchData function
  }, [inputText,text]); // Include 'text' in the dependency array so that the effect runs when 'text' changes

  return (
    <div>
      <p>Generated Text: {text}</p>
    </div>
  );
}

export default GenerateText;
