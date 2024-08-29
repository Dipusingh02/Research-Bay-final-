import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import "./fc.css";


const FileCard = ({ file, onRate, onAddToLibrary }) => {
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
      <button
        className="add-to-library-button"
        onClick={() => onAddToLibrary(file._id)}
      >
        Add to Library
      </button>
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
  onAddToLibrary: PropTypes.func.isRequired,
};
export default FileCard;