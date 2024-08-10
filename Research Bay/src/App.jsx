import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [data, setData] = useState([]);
 
  // Handle file input change
  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle text input changes
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleYearChange = (e) => setYear(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value);

  // Fetch file data on component mount
  useEffect(() => {
    axios.get('http://localhost:8081/').then((res) => {
      setData(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  // Handle file upload
  const handleUpload = () => {
    if (!file) return alert('Please select a file');

    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('title', title);
    formdata.append('year', year);
    formdata.append('author', author);

    axios.post('http://localhost:8081/upload', formdata).then((res) => {
      if (res.data.Status === 'Success') {
        console.log('Upload succeeded');
        setTitle('');
        setYear('');
        setAuthor('');
        setFile(null);
        // Refresh file list
        axios.get('http://localhost:8081/').then((res) => {
          setData(res.data);
        }).catch((err) => {
          console.log(err);
        });
      } else {
        console.log('Upload failed');
      }
    }).catch((err) => {
      console.log('Error found: ', err);
    });
  };    

  const searchHandle = async (event) => {
    let key = event.target.value;
    if (key) {
      try {
        const result = await axios.get(`http://localhost:8081/search/${key}`);
        if (result.data) {
          setData(result.data);
        } else {
          setData([]); // Clear data if no result is found
        }
      } catch (err) {
        console.error('Error fetching search results:', err);
      }
    } else {
      // If the search input is cleared, reload the entire data
      try {
        const result = await axios.get('http://localhost:8081/');
        setData(result.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
  };
  
  

  return (
    <div className='container'>
      <input type='file' onChange={handleFile} />
      <input type='text' placeholder='Title' value={title} onChange={handleTitleChange} />
      <input type='text' placeholder='Year' value={year} onChange={handleYearChange} />
      <input type='text' placeholder='Author' value={author} onChange={handleAuthorChange} />
      <button onClick={handleUpload}>Upload</button>
      <br />
      <input type='text' placeholder='Search Paper' onChange={searchHandle}/>
      <br />
      {data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li className='list-class' key={item.id}>
              <p>File: {item.pdf}</p>
              <p>Title: {item.title}</p>
              <p>Year: {item.year}</p>
              <p>Author: {item.author}</p>
            </li>
          ))}
        </ul>
      ) : (
        <h1>No files available</h1>
      )}
    </div>
  );
};

export default App;
