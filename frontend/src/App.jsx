import React, { useState } from "react";
import "./App.css";
import upload from "./assets/upload.svg";

import axios from "axios";

const App = () => {
  const [files, setFiles] = useState([]);
  const [preview, setPreviews] = useState([]);
  const [message, setMessage] = useState("");
  const [isUploadAttempted, setIsUploadAttempted] = useState(false);
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] =useState(0) 
  const [isError, setIsError] = useState(false)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
    setIsUploadAttempted(false);
    setMessage("");
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = preview.filter(
      (_, index) => index !== indexToRemove
    );
    URL.revokeObjectURL(preview[indexToRemove]);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    setIsUploadAttempted(false);
    setMessage("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage("No Files Selected to Upload");
      setIsUploadAttempted(true);
      setIsError(true)
      return;
    }
    setUploading(true)
    setUploadProgress(0)
    setIsUploadAttempted(true)
    const formData = new FormData();
    files.forEach((file)=>formData.append("images",file));
    // here images is a keyword for files
    try{
        const response = await axios.post("http://localhost:3000/upload/files", formData,{
          headers:{"content-type":"multipart/form-data"},
          onUploadProgress:(progressEvent)=>{
            const percentCompleted = Math.round((progressEvent.loaded*100)/progressEvent.total);
            setUploadProgress(percentCompleted)
          }
        })
        setMessage(response.data.message);
        setIsError(false)
    }
    catch(error){
        console.log(error)
        setMessage(error.response?.data?.message || "upload failed")
    }
    finally{
      setUploading(false)
    }
  };
  return (
    <div className="upload_container">
      <h2>Build a file upload App in React - Preview & progres</h2>
      <div className="file-input-wrapper">
        <input
          onChange={handleFileChange}
          multiple
          className="file-input"
          type="file"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="browse_btn">
          <img src={upload} className="upload_img" alt="upload_img" />
          Browse Files
        </label>
        <span className="file-count">
          {files.length > 0
            ? `${files.length} file${files.length === 1 ? "" : "s"} Selected`
            : "No Files Selected"}
        </span>
      </div>
      <div className="preview-container">
        {preview.map((src, index) => (
          <div key={index} className="preview-wrapper">
            <img src={src} alt="..." className="preview-image" />
            <button
              onClick={() => handleRemoveFile(index)}
              className="remove-btn"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <button className="upload-button"  disabled={uploading} onClick={handleUpload}>
        {uploading ? "Uploading . . ":"Upload Files"}
      </button>
       {uploading && <div className="progress_container">
        <div className="progress-bar" style={{width:`{uploadProgress}%`}}></div>
        <span className="progress-text">{uploadProgress}</span>
      </div>}
      {isUploadAttempted && <p className={`message ${isError}}?"error":"success"`}> {message}</p>}
    </div>
  );
};

export default App;
