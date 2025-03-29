import "./App.css";
import NavBar from "./components/NavBar";
import FileCarousel from "./components/FileCarousel";
import { Stack } from "react-bootstrap";

function App() {
  return (
    <Stack gap={3} className="text-start">
      <h3>Welcome Patient!</h3>
      <NavBar />
      <FileCarousel />
    </Stack>
  );
}

export default App;
