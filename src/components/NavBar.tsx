import { Container, Button, Image } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/react.svg";

function NavBar() {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <img src={""} alt="Logo" />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <Button className="me-4">Upload</Button>
            <Nav.Link href="#contact">Profile Name</Nav.Link>
            <Image src={logo} alt="Profile Photo" roundedCircle />
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
