import React from 'react';
import { useState } from 'react';
import { useDataContext } from '../DataContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Process() {
 // Destructure inputText from location.state
 const navigate = useNavigate();
  const { inputText } = useDataContext();
  const {datasetText}=useDataContext();
  const {setAnalyzedTextData}=useDataContext();

  const [loading,setLoading]=useState(false);
  const AnalyzeSet= async()=>{
    setLoading(true)
    const inputTextResponse = await axios.get('http://localhost:3000/analyze');
    console.log(datasetText);
    const datas=inputTextResponse.data.similarityResults;
    console.log(datas);
    setAnalyzedTextData(datas)
    navigate('/AnalyzedText');
    
  }





  return (
    <div className="process" style={{height:'100vh',width:'100%',textAlign:'center',justifyContent:'center', flexWrap:'wrap', display:'flex',alignContent:'center'}}>
      {inputText}
      <div>      <button
        style={{
          height: '2rem',
          width: '5rem',
          backgroundColor: 'blue',
    
        }}
      onClick={AnalyzeSet}
      >
       {loading ? 'Loading...' : 'Analyze'}
      </button></div>
    </div>
    
  );
}

export default Process;
