import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    // Função para buscar metadados dos arquivos
    const fetchFileMetadata = async () => {
        try {
            const response = await fetch('http://44.196.241.153:8080/files/metadata', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar metadados dos arquivos');
            }
            const files = await response.json();
            setUploadedFiles(files);
        } catch (error) {
            console.error('Erro ao buscar metadados dos arquivos:', error);
        }
    };
    fetchFileMetadata();
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
      const response = await fetch('http://44.196.241.153:8080/upload', {
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
          const response = await fetch('http://44.196.241.153:8080/files/metadata', { // Corrigido para o endpoint correto
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
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
        <h2>Files in Dynamo</h2>
        {uploadedFiles.length === 0 ? (
          <p>No files available.</p>
        ) : (
          uploadedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <h3 rel="noopener noreferrer">
                {file.fileId}
              </h3>
              <a href={file.metadata} download={file.fileId} className="download-icon" title="Download">
                <i className="fas fa-download"></i>
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;