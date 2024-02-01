import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [inputText, setInputText] = useState('');
  const [datasetText, setDatasetText] = useState(''); // Add datasetText state
  const [analyzedtext,setAnalyzedText]=useState(null);
  const [inputimgurl,setInputimgurl]=useState([]);
  const [datasetimgurl,setdatasetimgurl]=useState([]);
  const setContextData = (text) => {
    setInputText(text);
  };

  const setDatasetTextData = (text) => {
    setDatasetText(text);
  };
  const setinputimgData = (text) => {
    setInputimgurl(text);
  };
  const setdatasetimgData = (text) => {
    setdatasetimgurl(text);
  };

  const setAnalyzedTextData =(data)=>{
    const innerArray = data[0]; // Assuming there's only one inner array
  
    // Setting the extracted array using setDatasetText
    setAnalyzedText(innerArray);
  };

  return (
    <DataContext.Provider value={{ inputText, setContextData, datasetText, setDatasetTextData,analyzedtext,setAnalyzedTextData,inputimgurl,setinputimgData,datasetimgurl,setdatasetimgData}}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
