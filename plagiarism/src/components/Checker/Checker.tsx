  import { useEffect, useState } from 'react';
  import './checker.css';
  import Dropzone, { FileRejection } from 'react-dropzone';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { useDataContext } from '../DataContext';
  function Checker() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>('');
    const [Dataset, setDatasetFiles] = useState<File[]>([]);
    const [inputUpload,setInput]=useState(false);
    const [datasetUpload,setDataset]=useState(false);
    const[showtext,setText]=useState(false);
    const[getinputText,setInputtext]=useState('');
    const [loading, setLoading] = useState(false);
    const { setContextData } = useDataContext();
    const {setDatasetTextData}=useDataContext();
    const {setdatasetimgData}=useDataContext();
    const {setinputimgData}=useDataContext();
    const{setInputonFiles}=useDataContext();
    const{setDatasetonFiles}=useDataContext();
    const navigate = useNavigate();// Create a history object
    const onInputDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        setError('Invalid file. Please upload a valid file.');
      } else {
        const newFiles = [...selectedFiles, ...acceptedFiles.slice(0, 1 - selectedFiles.length)];
        console.log(newFiles)
        setInputonFiles(newFiles);
        // Check file size for each new file
        const sizeLimit = 700 * 1024; // 300 KB in bytes
        const filesWithinSizeLimit = newFiles.every((file) => file.size <= sizeLimit);
    
        if (filesWithinSizeLimit) {
          setSelectedFiles(newFiles);
          setError('');
          // Perform additional actions if needed
        } else {
          setSelectedFiles([]);
          setError('File size exceeds the limit (300 KB). Please choose smaller files.');
        }
      }
    };
    const onDatasetDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        setError('Invalid file. Please upload a valid file.');
      } else {
        const newFiles = [...Dataset, ...acceptedFiles.slice(0, 100 - Dataset.length)];
        setDatasetonFiles(newFiles);
        // Check file size for each new file
        const sizeLimit = 2000 * 1024; // 300 KB in bytes
        const filesWithinSizeLimit = newFiles.every((file) => file.size <= sizeLimit);
    
        if (filesWithinSizeLimit) {
          setDatasetFiles(newFiles);
          setError('');
          // Perform additional actions if needed
        } else {
          setDatasetFiles([]);
          setError('File size exceeds the limit (300 KB). Please choose smaller files.');
        }
      }
    };
    
    const onUploadinput= async()=>{
      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      try {
        const img=await axios.post('http://localhost:3000/uploadinput', formData);
        console.log('Files uploaded successfully');
        setError('');
        setinputimgData(img.data.authinput)
        console.log(img.data.authinput);
        setInput(true);
      } catch (error) {
        console.error('Error uploading files:', error);
        setError('Error uploading files. Please try again.');
      }
      
    }
    const onUploaddataset= async()=>{
      const form = new FormData();

      Dataset.forEach((file) => {
        form.append('files', file);
      });

      try {
        const img=await axios.post('http://localhost:3000/uploaddataset', form);
        console.log('Files uploaded successfully');
        setError('');
        setdatasetimgData(img.data.authdataset)
        console.log(img.data.authdataset);
        setDataset(true);
      } catch (error) {
        console.error('Error uploading files:', error);
        setError('Error uploading files. Please try again.');
      }
      
    }

    const ongetText= async()=>{
     try{
      setLoading(true);
      const inputTextResponse = await axios.get('http://localhost:3000/getText');
      const inputText = inputTextResponse.data.inputText;
      const datasettext=inputTextResponse.data.datasetText;
      setInputtext(inputText[0]);
      
      setContextData(inputText[0]);
      // Use inputText as needed
      setText(true);
      setDatasetTextData(datasettext);
      console.log('Input Text:', inputText);
      navigate('/text');
     }
     catch (error) {
      console.error('Error retrieving text:', error);
  }
    }
    useEffect(() => {
      console.log(selectedFiles);
    }, [selectedFiles]);

    return (
      <div className="checker_container">

  <div className="dropzone">
    {showtext?(<div style={{color:'white'}}>{getinputText}</div>):(<></>)}
        {inputUpload ? (<>
          
          <div style={{color:'white',display:'flex',justifyContent:'center',alignItems:'center'}}>uploaded</div>
          </>
        ) : (
          <>
            <Dropzone onDrop={onInputDrop}>
              {({ getRootProps, getInputProps }) => (
                <section className="dropzone-container" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop the Input files</p>
                </section>
              )}
            </Dropzone>
            {selectedFiles.map((file, index) => (
              <div
                style={{
                  color: 'white',
                  textAlign: 'center',
                }}
                key={index}
              >
                <p>Selected File {index + 1}: {file.name}</p>
                {/* You can add more information or actions related to each selected file here */}
              </div>
            ))}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="bu" style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                style={{
                  height: '2rem',
                  width: '5rem',
                  backgroundColor: 'blue',
                }}
                onClick={onUploadinput}
              >
                upload
              </button>
            </div>
          </>
        )}
      </div>

      <div className="content">
    {datasetUpload ? (<>
      <div style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>uploaded</div>
      
      </>
    ) : (
      <>
        <Dropzone onDrop={onDatasetDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className="dropzone-container" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop the Dataset files</p>
            </section>
          )}
        </Dropzone>
        <button
          style={{
            height: '2rem',
            width: '5rem',
            backgroundColor: 'blue',
          }}
          onClick={onUploaddataset}
        >
          upload
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {Dataset.map((file, index) => (
          <div
            style={{
              color: 'white',
              textAlign: 'center',
            }}
            key={index}
          >
            <p>Selected File {index + 1}: {file.name}</p>
            {/* You can add more information or actions related to each selected file here */}
          </div>
        ))}
      </>
    )}
  </div>
  {
    inputUpload && datasetUpload && (
      <button
        style={{
          height: '2rem',
          width: '5rem',
          backgroundColor: 'blue',
          position:'absolute',
          top:'50%',
          left:'57%'
        }}
        onClick={ongetText}
      >
       {loading ? 'Loading...' : 'Upload'}
      </button>
    )
  }

    </div>
  );
    
  }

  export default Checker;
