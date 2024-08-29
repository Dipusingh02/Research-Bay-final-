import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./search.css";
import "./fc.css";

// FileCard component for displaying individual file details
const FileCard = ({ file, onRate }) => {
  const [rating, setRating] = useState(file.rating || 0);

  const handleRate = async (newRating) => {
    setRating(newRating);
    onRate(file._id, newRating);
  };

  return (
    <div className="file-card">
      <h3>{file.title}</h3>
      <p>Author: {file.author}</p>
      <p>Year: {file.year}</p>
      <a href={`http://localhost:8081/files/${file.pdf}`} download>
        Download PDF
      </a>
      <div className="rating">
        <span>Rating: </span>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRate(star)}
            style={{
              cursor: "pointer",
              color: star <= rating ? "gold" : "gray",
            }}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

FileCard.propTypes = {
  file: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired,
    pdf: PropTypes.string.isRequired,
    rating: PropTypes.number,
  }).isRequired,
  onRate: PropTypes.func.isRequired,
};

// FileContainer component to handle search and display results
const FileContainer = () => {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/search/${query}`
        );
        setFiles(response.data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    if (query) {
      fetchFiles();
    }
  }, [query]);

  const handleRate = async (id, rating) => {
    try {
      await axios.post(`http://localhost:8081/rate-file/${id}`, { rating });
    } catch (error) {
      console.error("Error rating file:", error);
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
            global audience. Whether you’re a student, academic, or
            professional, ResearchBay is here to support your journey of
            discovery.
          </p>
          </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder=" Search  by  Title,  Tags,  Author,  Year..."
          className="search-input"
        />
        <div className="file-container">
          {files.length > 0 ? (
            files.map((file) => (
              <FileCard key={file._id} file={file} onRate={handleRate} />
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
