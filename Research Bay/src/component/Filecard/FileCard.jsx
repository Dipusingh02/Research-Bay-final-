import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FileCard = ({ file, onRate }) => {
  const [rating, setRating] = useState(file.rating || 0);

  const handleRate = (newRating) => {
    setRating(newRating);
    onRate(file._id, newRating);
  };

  return (
    <div className="file-card">
      <h3>{file.title}</h3>
      <p>Author: {file.author}</p>
      <p>Year: {file.year}</p>
      <a href={`http://localhost:8081/files/${file.pdf}`} download>Download</a>
      <div>
        <span>Rating: </span>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} onClick={() => handleRate(star)} style={{ cursor: 'pointer', color: star <= rating ? 'gold' : 'gray' }}>
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
    rating: PropTypes.number
  }).isRequired,
  onRate: PropTypes.func.isRequired
};

export default FileCard;
