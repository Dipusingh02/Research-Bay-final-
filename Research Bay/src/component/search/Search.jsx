import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./search.css";
import "./fc.css";

// FileCard component for displaying individual file details
// const FileCard = ({ file, onAddToLibrary }) => {
//   return (
//     <div className="file-card">
//       <h3>{file.title}</h3>
//       <p>Author: {file.author}</p>
//       <p>Year: {file.year}</p>
//       <a href={`http://localhost:8081/files/${file.pdf}`} download>
//         Download PDF
//       </a>
//       <button onClick={() => onAddToLibrary(file._id)}>Add to Library</button>
//     </div>
//   );
// };
const FileCard = ({ file, onAddToLibrary }) => {
  console.log("FileCard received file:", file); // Debug log to check the file object

  // Check if file._id exists and is not undefined
  if (!file || !file._id) {
    console.error("File object is missing _id:", file); // Additional logging for missing _id
  }

  return (
    <div className="file-card">  
    <a href={`http://localhost:8081/files/${file.pdf}`} download>   <h3>{file.title}</h3>  
    <p>Author: {file.author}</p>  
    <p>Year: {file.year}</p>  
    <a href={`http://localhost:8081/files/${file.pdf}`} download>  
      Download PDF  
    </a>  
    <button onClick={() => onAddToLibrary(file.id)}>Add to Library</button>  
    </a>  
   </div> 
  );
};


FileCard.propTypes = {
  file: PropTypes.shape({  
   id: PropTypes.string.isRequired,  
   title: PropTypes.string.isRequired,  
   author: PropTypes.string.isRequired,  
   year: PropTypes.string.isRequired,  
   pdf: PropTypes.string.isRequired,  
  }).isRequired,  
  onAddToLibrary: PropTypes.func.isRequired, 
};

const FileContainer = () => {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/search/${query}`);
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    if (query) {
      fetchFiles();
    }
  }, [query]);

  // const handleAddToLibrary = async (fileId) => {
  //   const token = localStorage.getItem("token");
    
  //   if (!token) {
  //     console.error("No token found, user might not be logged in.");
  //     alert("Please log in to continue.");
  //     return;
  //   }
  
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8081/add-to-library",
  //       { fileId },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.status === 200) {
  //       alert("File added to library successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error adding file to library:", error);
  
  //     if (error.response && error.response.status === 403) {
  //       console.error("Authorization failed. Token might be invalid or expired.");
  //       alert("You are not authorized to perform this action. Please log in again.");
  
  //       // Optionally force a logout
  //       localStorage.removeItem("token");
  //       // Redirect to login page
  //       window.location.href = "/login";
  //     }
  //   }
  // };

//   const handleAddToLibrary = async (fileId) => {
//     console.log("Received fileId:", fileId); // Log to confirm fileId is correct
//     if (!fileId || fileId.trim() === "") {
//       console.error("No fileId provided or fileId is empty.");
//       alert("Please select a file to add to the library.");
//       return;
//     }

//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("No token found, user might not be logged in.");
//       alert("Please log in to continue.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:8081/add-to-library",
//         { fileId: fileId.trim() }, // Ensure fileId is correctly sent
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.status === 200) {
//         alert("File added to library successfully!");
//       }
//     } catch (error) {
//       console.error("Error adding file to library:", error);
//       if (error.response && error.response.status === 403) {
//         alert("You are not authorized to perform this action. Please log in again.");
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       } else {
//         alert("Error adding file to the library. Please try again later.");
//       }
//     }
//     alert('File added to library successfully!');  
// };
const handleAddToLibrary = async (fileId) => {  
  console.log("Received fileId:", fileId); // Log to confirm fileId is correct  
  if (!fileId) {  
   console.error("No fileId provided.");  
   alert("Please select a file to add to the library.");  
   return;  
  }  
  
  const token = localStorage.getItem("token");  
  
  if (!token) {  
   console.error("No token found, user might not be logged in.");  
   alert("Please log in to continue.");  
   return;  
  }  
  
  try {  
   const response = await axios.post(  
    "http://localhost:8081/add-to-library",  
    { fileId }, 
    {  
      headers: {  
       Authorization: `Bearer ${token}`,  
      },  
    }  
   );  
   if (response.status === 200) {  
    alert("File added to library successfully!");  
   }  
  } catch (error) {  
   console.error("Error adding file to library:", error);  
   if (error.response && error.response.status === 403) {  
    alert("You are not authorized to perform this action. Please log in again.");  
    localStorage.removeItem("token");  
    window.location.href = "/login";  
   } else {  
    alert("Error adding file to the library. Please try again later.");  
   }  
  }  
};


  return (
    <div className="search-body">
      <div className="search-container">
        <div className="search-header">
          <h1>Discover and Share Knowledge</h1>
          <br />
          <p>
            Welcome to ResearchBay, your gateway to a world of research. Explore
            a vast collection of scholarly papers, or share your own work with a
            global audience. Whether you’re a student, academic, or professional,
            ResearchBay is here to support your journey of discovery.
          </p>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Title, Tags, Author, Year..."
          className="search-input"
        />
        <div className="file-container">
          {files.length > 0 ? (
            files.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                onAddToLibrary={handleAddToLibrary}
              />
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileContainer;
