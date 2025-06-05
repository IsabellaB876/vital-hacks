import { Container, Button, Image } from "react-bootstrap";
import Penciel from "../assets/Penciel.svg";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/logo.svg";
import hammy from "../assets/menu.svg";
import uploadIcon from "../assets/WhiteUploadIcon.svg";
import taskAdd from "../assets/taskAdd.svg";
import UploadScreen from "./UploadScreen";
import SideBar from "./SideBar";
import { useState } from "react";
import { useSidebar } from "../context/appContext";
import { useLocation } from "react-router-dom";

function NavBar() {
  const [display, setDisplay] = useState<boolean>(false);
  const { toggleSidebar } = useSidebar();

  const toggleDisplay = () => setDisplay(!display);

  const location = useLocation();
  const isProfile = location.pathname === '/Profile';
  return (
    <>
      <Navbar
        data-bs-theme="light"
        fixed="top"
        style={{ backgroundColor: "white" }}
      >
        <SideBar />
        <div
          className="full-logo d-flex align-items-center gap-2"
          style={{ zIndex: 10, position: "relative" }}
        >
          <Image
            onClick={toggleSidebar}
            className="hammy"
            src={hammy}
            alt="hammy"
          />{" "}
          <br />
          <Navbar.Brand href="/PatientHome" className="m-0">
            <Image className="logo" src={logo} alt="Logo" /> MedVault
          </Navbar.Brand>
        </div>

        <Container className="d-flex justify-content-center align-items-center gap-5">
          {/* Search Bar */}
          <form className="d-flex w-50">
            <input
              className="search-bar form-control shadow"
              type="search"
              placeholder="Search for anything..."
              aria-label="Search"
            />
          </form>

          {/* Upload and Request Buttons */}
          <div className="d-flex gap-5 ms-5">
            {!isProfile ? (
              <>
                <Button
                  onClick={toggleDisplay}
                  className="upload-btn d-flex align-items-center px-3 py-2"
                >
                  <Image className="me-2" src={uploadIcon} alt="upload" />
                  Upload
                </Button>

                <Button className="request-btn d-flex align-items-center px-3 py-2">
                  <Image className="me-2" src={taskAdd} alt="task" />
                  Request
                </Button>
              </>
            ) : (
              <Button
                //onClick={toggleDisplay}
                className="edit-btn d-flex align-items-center px-3 py-2"
              >
                <Image className="me-2" src={Penciel} alt="edit" />
                Edit
              </Button>
            )}


          </div>
        </Container>
      </Navbar>
      {display && <UploadScreen toggleDisplay={toggleDisplay} />}
    </>
  );
}

export default NavBar;
