import { Stack } from "react-bootstrap";
import FileCarousel from "./FileCarousel";
import DocNavBar from "./DocNavBar";
import { useSidebar } from "../context/appContext";

function DoctorHome() {
  console.log("hello");
  const { user } = useSidebar();
  return (
    <Stack gap={3} className="text-start">
      <DocNavBar />
      <Stack gap={3} className="text-start p-5">
        <h1>Welcome, Doctor {user.firstName}!</h1>
        <FileCarousel text="Requested Documents" bgColor="#9EBDF8" />
        <FileCarousel text="Patient Intake Forms" bgColor="#FFFFFF" />
        <FileCarousel text="HIPAA and Consent" bgColor="#FFFFFF" />
        <FileCarousel text="Treatments and Prescriptions" bgColor="#FFFFFF" />
        <FileCarousel text="Insurance" bgColor="#FFFFFF" />
      </Stack>
    </Stack>
  );
}

export default DoctorHome;
