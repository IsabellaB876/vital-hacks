import { Container, Button, Image } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/react.svg";
import RequestScreen from "./RequestScreen.tsx";
import { useState } from "react";

function DocNavBar() {
  const [display, setDisplay] = useState<boolean>(false);

  const toggleDisplay = () => setDisplay(!display);
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <img src={""} alt="Logo" />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Button onClick={toggleDisplay} className="mb-2">
              Request
            </Button>
            <Nav.Link href="#contact">Profile Name</Nav.Link>
            <Image src={logo} alt="Profile Photo" roundedCircle />
          </Nav>
        </Container>
      </Navbar>

      {display && <RequestScreen toggleDisplay={toggleDisplay} />}
    </>
  );
}

export default DocNavBar;
