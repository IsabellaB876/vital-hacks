import "./App.css";
import NavBar from "./components/NavBar";
import FileCard from "./components/FileCard";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container>
      <NavBar />
      <FileCard />
    </Container>
  );
}

export default App;
