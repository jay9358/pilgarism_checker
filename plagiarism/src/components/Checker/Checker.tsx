import React, { useEffect, useState } from 'react';
import './checker.css';
import Dropzone, { FileRejection } from 'react-dropzone';

function Checker() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');

  const onFileDrop = async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      setError('Invalid file. Please upload a valid file.');
    } else {
      const newFiles = [...selectedFiles, ...acceptedFiles.slice(0, 2 - selectedFiles.length)];
      setSelectedFiles(newFiles);

      if (newFiles.length > 0) {
        setError('');
        // Perform additional actions if needed
      } else {
        setError('Invalid file. Please upload a valid file.');
      }
    }
  };

  useEffect(() => {
    console.log(selectedFiles);
  }, [selectedFiles]);

  return (
    <div className="checker_container">
      <div className="dropzone">
        <Dropzone onDrop={onFileDrop}>
          {({ getRootProps, getInputProps }) => (
            <section className="dropzone-container" {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop the files</p>
            </section>
          )}
        </Dropzone>
        {selectedFiles.map((file, index) => (
          <div style={{
            color:'white',
            textAlign:'center'
          }} key={index}>
            <p>Selected File {index + 1}: {file.name}</p>
            {/* You can add more information or actions related to each selected file here */}
          </div>
        ))}
         {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      di
      <div className="content">
         
       

      </div>
    </div>
  );
}

export default Checker;
