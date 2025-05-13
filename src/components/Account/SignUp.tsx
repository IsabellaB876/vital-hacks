import { Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import loginGraphic from "../../assets/tempLogin.png"; // or whatever your image path is

function Signup() {
  return (
    <div className="wd-signup-screen d-flex">
      {/* Left side - Image */}
      <div className="left-side">
        <img src={loginGraphic} alt="Signup" />
      </div>

      {/* Right side - Form */}
      <div className="right-side d-flex justify-content-center align-items-center">
        <Stack gap={3} className="w-75">
          <h1>Sign up</h1>
          <input className="form-control" placeholder="Username" />
          <input
            className="form-control"
            placeholder="Password"
            type="password"
          />
          <input className="form-control" placeholder="Email" type="email" />
          <input className="form-control" placeholder="Birthday" type="date" />
          <Link to="/PatientHome">
            <Button className="w-100 btn btn-primary">Sign up (Patient)</Button>
          </Link>
          <Link to="/DoctorHome">
            <Button className="w-100 btn btn-primary">Sign up (Doctor)</Button>
          </Link>
          <Link to="/Account/Profile" className="text-center">
            Sign In
          </Link>
        </Stack>
      </div>
    </div>
  );
}

export default Signup;
