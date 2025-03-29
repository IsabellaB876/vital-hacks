import "./App.css";
import NavBar from "./components/NavBar";
import FileCarousel from "./components/FileCarousel";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container>
      <NavBar />
      <FileCarousel />
    </Container>
  );
}

export default App;
