import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import Home from "../assets/Home.svg";
import Setting from "../assets/Setting.svg";
import Folder from "../assets/Folder.svg";
import Account from "../assets/Account.svg";
import { useSidebar } from "../context/appContext";

function SideBar() {
  const { showSidebar } = useSidebar();

  return (
    <div
      id="side-menu"
      style={{
        width: showSidebar ? "25%" : 0,
        overflowX: "hidden",
        transition: "width 0.3s ease",
        zIndex: 1030, // behind Navbar if needed
      }}
      className="list-group position-fixed bottom-0 top-0 start-0 shadow"
    >
      {showSidebar && (
        <div className="side-menu-components d-flex flex-column">
          <Button className="profile-btn d-flex align-items-center shadow gap-3 px-4 py-3">
            <Image
              className="profile-img"
              src={Account}
              alt="Profile"
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
            <div className="d-flex flex-column text-start">
              <span className="name">First Last</span>
              <span className="email">Email</span>
            </div>
          </Button>

          <Link to="" id="home-link" className="list-group-item">
            {" "}
            <Image className="home" src={Home} alt="home" /> Home{" "}
          </Link>
          <a
            href="#collapseExample"
            id="file-link"
            className="list-group-item"
            data-bs-toggle="collapse"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            <Image className="all-file" src={Folder} alt="all-file" /> All Files
          </a>
          <div className="collapse" id="collapseExample">
            <div>
              <Link to="" id="treat-link" className="list-group-item">
                {" "}
                Treatments and Perscriptions{" "}
              </Link>
              <Link to="" id="hippa-link" className="list-group-item">
                {" "}
                HIPPA and Consent{" "}
              </Link>
              <Link to="" id="intake-link" className="list-group-item">
                {" "}
                Patient Intake Form{" "}
              </Link>
              <Link to="" id="insurance-link" className="list-group-item">
                {" "}
                Insurance{" "}
              </Link>
              <Link to="" id="other-link" className="list-group-item">
                {" "}
                Other{" "}
              </Link>
            </div>
          </div>
          <Link to="" id="setting" className="list-group-item">
            {" "}
            <Image className="setting" src={Setting} alt="setting" /> Settings
          </Link>
        </div>
      )}
    </div>
  );
}
export default SideBar;
