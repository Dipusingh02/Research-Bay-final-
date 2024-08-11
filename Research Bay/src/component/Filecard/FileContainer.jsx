import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FileCard from './FileCard.jsx';
import "./fc.css";

const FileContainer = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8081/get-latest-files');
        setFiles(response.data.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  const handleRate = async (id, rating) => {
    try {
      await axios.post(`http://localhost:1000/rate-file/${id}`, { rating });
    } catch (error) {
      console.error('Error rating file:', error);
    }
  };

  return (
    <div className="file-container">
      {files.map((file) => (
        <FileCard key={file._id} file={file} onRate={handleRate} />
      ))}
    </div>
  );
};

export default FileContainer;
