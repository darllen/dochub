import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Função para buscar arquivos do bucket
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://54.237.83.234:8080/files');
        if (!response.ok) {
          throw new Error('Erro ao buscar arquivos');
        }
        const files = await response.json();
        setUploadedFiles(files);
      } catch (error) {
        console.error('Erro ao buscar arquivos:', error);
      }
    };
    fetchFiles();
  }, []);

  async function handleFileUpload(event) {
    event.preventDefault();
  
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
  
    if (!file) {
      console.error('Nenhum arquivo selecionado');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://54.237.83.234:8080/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }
  
      const result = await response.text();
      console.log('Resposta do servidor:', result);
      // Atualiza a lista de arquivos após o upload
      const fetchFiles = async () => {
        try {
          const response = await fetch('http://54.237.83.234:8080/files');
          if (!response.ok) {
            throw new Error('Erro ao buscar arquivos');
          }
          const files = await response.json();
          setUploadedFiles(files);
        } catch (error) {
          console.error('Erro ao buscar arquivos:', error);
        }
      };
      fetchFiles();
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
    }
  }

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files));
  };

  const handleFileRemove = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div className="app">
      <h1>File Storage App</h1>
      <div className="upload-area">
        <input 
          id="fileInput"
          type="file"
          multiple
          onChange={handleFileChange}
          className="upload-input"
        />
        <button id="uploadButton" onClick={handleFileUpload}>Salvar</button>
      </div>
      <div className="file-list">
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file, index) => (
            <div key={index} className="file-item">
              <p>{file.name}</p>
              <button onClick={() => handleFileRemove(index)}>Delete</button>
            </div>
          ))
        )}
      </div>
      <div className="uploaded-files">
        <h2>Files in S3</h2>
        {uploadedFiles.length === 0 ? (
          <p>No files available.</p>
        ) : (
          uploadedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                {file.key}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
