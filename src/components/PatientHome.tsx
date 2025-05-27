import { useState } from "react";
import { Stack } from "react-bootstrap";
import FileCarousel from "./FileCarousel";
import FolderSection from "./FolderSection";
import NavBar from "./NavBar";
import { useSidebar } from "../context/appContext";

function PatientHome() {
  const { showSidebar, user } = useSidebar();

  return (
    <Stack gap={3} className="text-start">
      <NavBar />
      <div
        className="flex-grow-1"
        style={{
          marginLeft: showSidebar ? 320 : 0,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Stack gap={3} className="text-start p-3">
          <NavBar />
          <h1>Welcome {user.firstName}!</h1>
          <FileCarousel text="Requested Documents" bgColor="#9EBDF8" />
          <FolderSection />
        </Stack>
      </div>
    </Stack>
  );
}

export default PatientHome;
