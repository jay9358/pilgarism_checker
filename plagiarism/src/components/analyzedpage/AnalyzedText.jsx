import React, { useEffect, useState } from 'react';
import { useDataContext } from '../DataContext';

function AnalyzedText() {
  const { analyzedtext } = useDataContext();
  const { inputimgurl } = useDataContext();
  const { datasetimgurl } = useDataContext();
  const [matchedimg, setMatchedimg] = useState([]);
  const [match, setMatch] = useState(true);
  const {inputfiles}=useDataContext();
  const {datasetfiles}=useDataContext();
  const {datasetnames,setnames}=useState([]);
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
    let tlength=t.length;
 
    if (matched.length === 0) {
     // wrap the string in an array
      setMatch(false);
    } else {
      setMatchedimg(matched);
      console.log(matchedimg)
    }
  }, []);

  return (
    <div className="analyzed_container" style={{ width: '100%', display: 'flex' }}>
      <div className="inputimg_container" style={{ width: '40%' }}>
        <h1>Input Img</h1>
        <img src={inputimgurl} style={{width:'100%'}} alt="" />
      </div>
      <div className="matchedimg_container" style={{ width: '60%' }}>
        {match ? (
          <>
            <h1>Matched Imgs:</h1>
            {matchedimg.map((item) => (
              <div key={item} style={{ width: '100%' }}>
                <img src={item} style={{width:'100%'}} alt="" />
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
