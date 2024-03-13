import React, { useEffect, useState } from 'react';
import { useDataContext } from '../DataContext';
import { useNavigate } from 'react-router-dom';
function AnalyzedText() {
  const { analyzedtext } = useDataContext();
  const { inputimgurl } = useDataContext();
  const { datasetimgurl } = useDataContext();
  const [matchedimg, setMatchedimg] = useState([]);
  const [match, setMatch] = useState(true);

  const {datasetfiles}=useDataContext();

  const[filename,setFilename]=useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    setMatch(true);
    let matched = [];
    let datasetname=[];
    const flattenedArray = analyzedtext.flat();
     // Flatten the array
    console.log(flattenedArray);
    const datasetlength = datasetimgurl.length;
    let t=[];
    for (let i = 0; i < datasetlength; i++) {
    console.log(flattenedArray[i]);
      if (flattenedArray[i] >= 0.8) {
        matched.push(datasetimgurl[i]);
        datasetname.push(datasetfiles[i])
        t.push(i);
      }
    }
    console.log(datasetname);
    const filename=datasetname.map(file => file.name);
    setFilename(filename);
    console.log(filename)
 
    if (matched.length === 0) {
     // wrap the string in an array
      setMatch(false);
    } else {
      setMatchedimg(matched);
      console.log(matchedimg)
    }
  },[analyzedtext,datasetimgurl,datasetfiles,matchedimg]);
const generateText=()=>{
  navigate('/generateText')
}
  return (
    <div className="analyzed_container" style={{ width: '100%', display: 'flex' }}>
      <div className="inputimg_container" style={{ width: '40%' }}>
        <h1>Input Img</h1>
        <img src={inputimgurl} style={{width:'100%'}} alt="" />
        <button onClick={generateText}></button>
      </div>
      <div className="matchedimg_container" style={{ width: '60%' }}>
        {match ? (
          <>
            <h1>Matched Imgs:</h1>
            {matchedimg.map((item,index)=> (
              <div key={item} style={{ width: '100%' }}>
                <img src={item} style={{width:'100%'}} alt="" />
                <h3>{filename[index]}</h3>
              </div>
            ))}
          </>
        ) : (
          <p>No Match Found</p>
        )}
      </div>
    </div>
  );
}

export default AnalyzedText;
