import { Stack } from "react-bootstrap";
import FileCarousel from "./FileCarousel";
import DocNavBar from "./DocNavBar";

function DoctorHome() {
  console.log("hello");
  return (
    <Stack gap={3} className="text-start">
      <DocNavBar />
      <h2>Welcome Doctor!</h2>
      <FileCarousel text="Requested Documents" bgColor="#9EBDF8" />
      <FileCarousel text="Patient Intake Forms" bgColor="#FFFFFF" />
      <FileCarousel text="HIPAA and Consent" bgColor="#FFFFFF" />
      <FileCarousel text="Treatments and Prescriptions" bgColor="#FFFFFF" />
      <FileCarousel text="Insurance" bgColor="#FFFFFF" />
    </Stack>
  );
}

export default DoctorHome;
