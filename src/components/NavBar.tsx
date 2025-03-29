import React, { useState } from "react";
import { Button, Navbar } from "react-bootstrap";
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
      <Navbar bg="light" data-bs-theme="light" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <img src={""} alt="Logo" />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Button onClick={toggleDisplay} className="mb-2">
              Upload
            </Button>
            <Nav.Link href="#contact">Profile Name</Nav.Link>
            <Image src={logo} alt="Profile Photo" roundedCircle />
          </Nav>
        </Container>
      </Navbar>

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
