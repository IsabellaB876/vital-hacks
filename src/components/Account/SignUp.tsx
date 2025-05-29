import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Spinner } from "react-bootstrap";
import { useSidebar } from "../../context/appContext";
import { getUser } from "../../Service";
import loginImg from "../../assets/login-img.svg";
import logo from "../../assets/logo.svg";

function Signup() {
  const { updateUserData } = useSidebar();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSignup = async () => {
    try {
      const userData = await getUser(username);

      setLoading(true);

      updateUserData("firstName", userData.user.firstName);
      updateUserData("lastName", userData.user.lastName);
      updateUserData("username", userData.user.username);
      updateUserData("role", userData.user.role);
      updateUserData("birthDate", userData.user.birthDate);
      updateUserData("files", userData.user.files);
      updateUserData("photo", userData.user.photo);
      updateUserData("password", userData.user.password);
      updateUserData("users", userData.user.users);

      // Only navigate once all updates are done
      if (userData.user.role === "Patient") {
        navigate("/PatientHome");
      } else {
        navigate("/DoctorHome");
      }
    } catch (error) {
      setInvalid("Invalid username or password. Please try again.");
      console.log("Signup error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (loading) {
    // Render a blank screen with a loading spinner
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="login-page m-0 p-0">
      <div className="login-left m-0 p-0">
        <img src={loginImg} alt="MedVault Preview" className="preview-image" />
      </div>
      <div className="login-right">
        <div className="login-form">
          <Image src={logo} alt="MedVault Logo" className="logo" />
          <h1>Welcome Back!</h1>
          <p className="subtitle">Login to your account.</p>
          <input
            type="text"
            placeholder="Username"
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input type="password" placeholder="Password" className="input" />
          <Button className="login-btn" onClick={handleSignup}>
            Log in
          </Button>
          <h3 style={{ color: "red" }}>{invalid}</h3>
          <p className="account-text">
            New to MedVault? <a href="/signup">Create an account.</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
