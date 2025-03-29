import React, { useState } from "react";
import { Button } from "react-bootstrap";
import UploadScreen from "./UploadScreen";

function NavBar() {
  const [showUploadScreen, setShowUploadScreen] = useState(false);

  // Toggle upload screen visibility
  const toggleUploadScreen = () => {
    setShowUploadScreen(!showUploadScreen);
  };

  // Handle upload completion
  const handleFileUpload = (
    file: File,
    isValid: boolean,
    validationMessage?: string
  ) => {
    console.log(`File ${file.name} uploaded. Valid: ${isValid}`);
    if (validationMessage) {
      console.log(`Validation message: ${validationMessage}`);
    }
    
    // Optional: Close the upload screen after successful upload
    // if (isValid) {
    //   setShowUploadScreen(false);
    // }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Medical Documents Portal
          </a>
          
          <div className="d-flex ms-auto">
            <Button onClick={toggleUploadScreen} className="btn btn-primary">
              Upload Document
            </Button>
          </div>
        </div>
      </nav>

      {/* Upload Screen */}
      {showUploadScreen && (
        <UploadScreen
          toggleDisplay={toggleUploadScreen}
          onFileUpload={handleFileUpload}
        />
      )}
    </>
  );
}

export default NavBar;