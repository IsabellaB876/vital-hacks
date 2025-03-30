import { Stack } from "react-bootstrap";  
import FileCarousel from "./FileCarousel";
import NavBar from "./NavBar";

function PatientHome(){
    return(
    <Stack gap={3} className="text-start">
    <NavBar />
    <h2>Welcome Patient!</h2>
    <FileCarousel text="Requested Documents" bgColor="#9EBDF8" />
    <FileCarousel text="Patient Intake Forms" bgColor="#FFFFFF" />
    <FileCarousel text="HIPAA and Consent" bgColor="#FFFFFF" />
    <FileCarousel text="Treatments and Prescriptions" bgColor="#FFFFFF" />
    <FileCarousel text="Insurance" bgColor="#FFFFFF" />
  </Stack>
  );
}

export default PatientHome;