import { Container, Button, Image } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import profile from "../assets/react.svg";
import logo from "../assets/logo.svg";
import hammy from "../assets/menu.svg";
import uploadIcon from "../assets/UploadIcon.svg";
import UploadScreen from "./UploadScreen";
import { useState } from "react";

function NavBar() {
  const [display, setDisplay] = useState<boolean>(false);

  const toggleDisplay = () => setDisplay(!display);
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" fixed="top">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Image className="hammy" src={hammy} alt="hammy" /> <br/>
            <Navbar.Brand href="/" className="m-0">
              <Image className="logo" src={logo} alt="Logo"/> MedVault
            </Navbar.Brand>
          </div>
          <Nav className="justify-content-end align-items-center">
            <Button onClick={toggleDisplay} className="upload-btn mb-2" size="lg">
              <Image className="upload" src={uploadIcon} alt="upload"/> Upload
            </Button>
            <Nav.Link href="#contact">Profile Name</Nav.Link>
            <Image src={profile} alt="Profile Photo" roundedCircle />
          </Nav>
        </Container>
      </Navbar>
      {display && <UploadScreen toggleDisplay={toggleDisplay} />}
    </>
  );
}

export default NavBar;