import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../footer/Footer";
import "./library.css"
const Library = () => {
  const [libraryItems, setLibraryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibraryItems = async () => {
      try {
        const authToken = localStorage.getItem('token');
        console.log('Auth Token:', authToken);

        const response = await axios.get('http://localhost:8081/library', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        console.log('Library items:', response.data);

        setLibraryItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching library items:', error);

        if (error.response && error.response.status === 403) {
          console.log('403 Forbidden: Check your authentication token or permissions.');
        } else {
          console.log('Unexpected error occurred.');
        }
        
        setError('Failed to fetch library items');
        setLoading(false);
      }
    };

    fetchLibraryItems();
  }, []);

  return (
    <div>
    <Navbar />
    <div className="library bgcolor">
      <h2>My Library</h2>
      {loading ? (
        <p>Loading your library...</p>
      ) : error ? (
        <p>{error}</p>
      ) : libraryItems.length === 0 ? (
        <p>No items in your library yet.</p>
      ) : (
        <ul className="file-container ">
        
          {libraryItems.map((item) => (
            <li key={item.id} className="file-card">
              <h3>{item.title}</h3>
              <p>Author: {item.author}</p>
              <p>Year: {item.year}</p>
              <a
                href={`http://localhost:8081/files/${item.pdf}`}
                download
              >
                Download PDF
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
    <Footer />
    </div>
  );
};

export default Library;
