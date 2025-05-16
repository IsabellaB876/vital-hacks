import { Stack } from "react-bootstrap";
import FileCarousel from "./FileCarousel";
import FolderSection from "./FolderSection";
import NavBar from "./NavBar";

function PatientHome() {
  return (
    <Stack gap={3} className="text-start">
      <NavBar />
      <h1>Welcome Patient!</h1>
      <FileCarousel text="Requested Documents" bgColor="#9EBDF8" />
      <FolderSection />
    </Stack>
  );
}

export default PatientHome;
