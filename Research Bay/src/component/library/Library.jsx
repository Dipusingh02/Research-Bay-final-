import React, { useState, useEffect } from "react";
import axios from "axios";

const Library = ({ token }) => {
  const [libraryItems, setLibraryItems] = useState([]);

  useEffect(() => {
    const fetchLibraryItems = async () => {
      try {
        const response = await axios.get("http://localhost:8081/library", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLibraryItems(response.data);
      } catch (error) {
        console.error("Error fetching library items:", error);
      }
    };

    fetchLibraryItems();
  }, [token]);

  return (
    <div className="library">
      <h2>My Library</h2>
      {libraryItems.length === 0 ? (
        <p>No items in your library yet.</p>
      ) : (
        <ul>
          {libraryItems.map((item) => (
            <li key={item.id}>
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
  );
};

export default Library;
