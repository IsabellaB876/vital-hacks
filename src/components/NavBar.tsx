import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { MdAccountCircle } from "react-icons/md";

function NavBar() {
  return (
    <>
      <Navbar bg="light" data-bs-theme="light" fixed="top">
        <Container>
          <Navbar.Brand href="/">
            <img src={""} alt="Logo" />
          </Navbar.Brand>
          <Nav className="justify-content-end">
            <button className="me-4">Request</button>
            <button className="me-4">Upload</button>
            <MdAccountCircle size={50} />
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavBar;
