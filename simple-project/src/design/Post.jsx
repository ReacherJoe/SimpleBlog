import React, { useState } from 'react';
import './FileUploadForm.css';

function FileUploadForm() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('text', text);
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('File uploaded successfully');
        setTitle('');
        setText('');
        setFile(null);
       
        window.location.href = 'http://localhost:5173/';
      } else {
        alert('Error uploading file');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label><br />
        <input type="text" id="title" name="title" value={title} onChange={handleTitleChange} /><br />
        <label htmlFor="text">Text:</label><br />
        <textarea id="text" name="text" value={text} onChange={handleTextChange}></textarea><br />
        <label htmlFor="file">Select File:</label><br />
        <input type="file" id="file" name="file" onChange={handleFileChange} /><br /><br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUploadForm;
