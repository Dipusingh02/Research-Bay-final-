// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./upload.css";
import Navbar from "../Navbar/Navbar";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [tags, setTags] = useState("");
  const [title, setTitle] = useState("");
  const [uploadStatus, setUploadStatus] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("author", author);
    formData.append("year", year);
    formData.append("tags", tags);
    formData.append("title", title);

    try {
      const response = await fetch("http://localhost:8081/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("File uploaded successfully");
        // Clear form fields
        setFile(null);
        setAuthor("");
        setYear("");
        setTags("");
        setTitle("");
      } else {
        setUploadStatus("Upload failed");
      }
    } catch (error) {
      setUploadStatus("Upload failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bgcolor">
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-input">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
              required
            />
          </div>
          <div className="form-input">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year"
              required
            />
          </div>
          <div className="form-input">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags"
            />
          </div>
          <div className="form-input">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paper Title"
              required
            />
          </div>
          <div className="form-input">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-input">
            <button type="submit">Upload</button>
          </div>
        </form>
        {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
      </div>
    </div>
    </div>
  );
}

export default UploadForm;
