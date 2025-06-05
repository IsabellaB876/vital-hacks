import { Stack } from "react-bootstrap";
import FileCarousel from "./FileCarousel";
import FolderSection from "./FolderSection";
import NavBar from "./NavBar";
import NotificationSection from "./NotificationsSection";
import { useSidebar } from "../context/appContext";

function PatientHome() {
  const { showSidebar, user } = useSidebar();

  return (
    <Stack gap={3} className="text-start" style={{ marginTop: "8%" }}>
      <NavBar />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: showSidebar ? 320 : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Stack gap={3} className="text-start p-5">
          <h1>Welcome, {user.firstName}!</h1>
          <FileCarousel text="Requested Documents" bgColor="#9EBDF8" />
          <FolderSection />
          <NotificationSection />
        </Stack>
      </div>
    </Stack>
  );
}

export default PatientHome;
