import { Container, Button, Image } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/logo.svg";
import hammy from "../assets/menu.svg";
import uploadIcon from "../assets/WhiteUploadIcon.svg";
import taskAdd from "../assets/taskAdd.svg";
import UploadScreen from "./UploadScreen";
import { useState } from "react";

function NavBar() {
  const [display, setDisplay] = useState<boolean>(false);

  const toggleDisplay = () => setDisplay(!display);
  return (
    <>
      <Navbar
        data-bs-theme="light"
        fixed="top"
        style={{ backgroundColor: "white" }}
      >
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <Image className="hammy" src={hammy} alt="hammy" /> <br />
            <Navbar.Brand href="/" className="m-0">
              <Image className="logo" src={logo} alt="Logo" /> MedVault
            </Navbar.Brand>
          </div>

          <form className="d-flex">
            <input
              className="search-bar form-control shadow me-2"
              type="search"
              placeholder="Search for anything..."
              aria-label="Search"
            />
          </form>

          <Nav className="justify-content-end align-items-center">
            <div className="d-flex gap-5">
              <Button onClick={toggleDisplay} className="upload-btn">
                <Image
                  className="upload-icon"
                  src={uploadIcon}
                  style={{ color: "white" }}
                  alt="upload"
                />{" "}
                Upload
              </Button>

              <Button className="request-btn">
                <Image className="request-icon" src={taskAdd} alt="task" />{" "}
                Request
              </Button>
            </div>
          </Nav>
        </Container>
      </Navbar>
      {display && <UploadScreen toggleDisplay={toggleDisplay} />}
    </>
  );
}

export default NavBar;
