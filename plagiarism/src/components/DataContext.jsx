import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [inputText, setInputText] = useState('');
  const [datasetText, setDatasetText] = useState(''); // Add datasetText state
  const [analyzedtext,setAnalyzedText]=useState(null);
  const [inputimgurl,setInputimgurl]=useState([]);
  const [datasetimgurl,setdatasetimgurl]=useState([]);
  const [inputfiles,setInputfiles]=useState([]);
  const [datasetfiles,setDatasetfiles]=useState([]);
  const setContextData = (text) => {
    setInputText(text);
  };
  const setInputonFiles = (text) => {
    setInputfiles(text);
  };
  const setDatasetonFiles = (text) => {
    setDatasetfiles(text);
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
    <DataContext.Provider value={{datasetfiles,setDatasetonFiles,inputfiles,setInputonFiles, inputText, setContextData, datasetText, setDatasetTextData,analyzedtext,setAnalyzedTextData,inputimgurl,setinputimgData,datasetimgurl,setdatasetimgData}}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  return useContext(DataContext);
};
