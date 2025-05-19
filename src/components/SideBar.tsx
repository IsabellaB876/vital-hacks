import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import Home from "../assets/Home.svg";
import Setting from "../assets/Setting.svg";
import Folder from "../assets/Folder.svg";

function SideBar() {
    return (
        <div id="side-menu" style={{ width: 280 }}
            className="list-group rounded-0 position-fixed bottom-0 top-0 d-none d-md-block z-2">
            <Link to="" id="home-link" className="list-group-item"> <Image className="home" src={Home} alt="home" /> Home </Link>
            <a href="#collapseExample" id="file-link" className="list-group-item" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseExample">
                <Image className="all-file" src={Folder} alt="all-file" /> All Files
            </a>
            <div className="collapse" id="collapseExample">
                <div>
                <Link to="" id="treat-link" className="list-group-item ms-3"> Treatments and Perscriptions </Link>
                <Link to="" id="hippa-link" className="list-group-item ms-3"> HIPPA and Consent </Link>
                <Link to="" id="intake-link" className="list-group-item ms-3"> Patient Intake Form </Link>
                <Link to="" id="insurance-link" className="list-group-item ms-3"> Insurance </Link>
                <Link to="" id="other-link" className="list-group-item ms-3"> Other </Link>
                </div>
            </div>
            <Link to="" id="setting" className="list-group-item"> <Image className="setting" src={Setting} alt="setting" /> Settings</Link>
        </div>
    );
}
export default SideBar;