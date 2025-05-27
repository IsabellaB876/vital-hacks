import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useSidebar } from "../../context/appContext";
import { getUser } from "../../Service";

function Signup() {
  const { updateUserData } = useSidebar();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userData = await getUser(username);

      updateUserData("firstName", userData.user.firstName);
      updateUserData("lastName", userData.user.lastName);
      updateUserData("username", userData.user.username);
      updateUserData("role", userData.user.role);
      updateUserData("birthDate", userData.user.birthDate);
      updateUserData("files", userData.user.files);
      updateUserData("photo", userData.user.photo);

      // Only navigate once all updates are done
      navigate("/PatientHome");
    } catch (error) {
      console.log("Signup error:", error);
    }
  };

  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      <input
        className="wd-username form-control mb-2"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input className="wd-password form-control mb-2" placeholder="password" />
      <input
        className="wd-email form-control mb-2"
        placeholder="****@gmail.com"
        type="email"
        id="wd-email"
      />
      <input
        className="wd-birthday form-control mb-2"
        placeholder="00/00/0000"
        type="date"
      />
      <Button
        className="wd-signup-btn btn btn-primary mb-2 w-100"
        onClick={handleSignup}
      >
        Sign up (Patient)
      </Button>
    </div>
  );
}

export default Signup;
