import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserLibrary = ({ token }) => {
    const [libraryItems, setLibraryItems] = useState([]);

    // Fetch user's library items
    useEffect(() => {
        const fetchLibraryItems = async () => {
            try {
                const response = await axios.get('http://localhost:8081/library', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass JWT token for authentication
                    },
                });
                setLibraryItems(response.data);
            } catch (err) {
                console.error('Error fetching library items:', err);
            }
        };

        fetchLibraryItems();
    }, [token]);

    return (
        <div>
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
                            <p>Tags: {item.tags}</p>
                            <a href={`http://localhost:8081/files/${item.pdf}`} target="_blank" rel="noopener noreferrer">
                                Download PDF
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserLibrary;
