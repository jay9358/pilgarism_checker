import React, { useEffect, useState } from 'react';
import { useDataContext } from '../DataContext';
import { useNavigate } from 'react-router-dom';

function AnalyzedText() {
  const { analyzedtext, inputimgurl, datasetimgurl, datasetfiles } = useDataContext();
  const [matchedimg, setMatchedimg] = useState<string[]>([]);
  const [match, setMatch] = useState<boolean>(true);
  const [filename, setFilename] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setMatch(true);
    const matched: string[] = [];
    const datasetname: string[] = [];
    const flattenedArray = analyzedtext.flat();
    const datasetlength = datasetimgurl.length;
    const t: number[] = [];

    for (let i = 0; i < datasetlength; i++) {
      if (flattenedArray[i] >= 0.8) {
        matched.push(datasetimgurl[i]);
        datasetname.push(datasetfiles[i]);
        t.push(i);
      }
    }

    const filenames = datasetname.map((file) => file.name);
    setFilename(filenames);

    if (matched.length === 0) {
      setMatch(false);
    } else {
      setMatchedimg(matched);
    }
  }, [analyzedtext, datasetimgurl, datasetfiles]);

  const generateText = () => {
    navigate('/generateText');
  };

  return (
    <div className="analyzed_container" style={{ width: '100%', display: 'flex' }}>
      <div className="inputimg_container" style={{ width: '40%' }}>
        <h1>Input Img</h1>
        <img src={inputimgurl} style={{ width: '100%' }} alt="" />
        <button onClick={generateText}>Generate Text</button>
      </div>
      <div className="matchedimg_container" style={{ width: '60%' }}>
        {match ? (
          <>
            <h1>Matched Imgs:</h1>
            {matchedimg.map((item, index) => (
              <div key={item} style={{ width: '100%' }}>
                <img src={item} style={{ width: '100%' }} alt="" />
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
