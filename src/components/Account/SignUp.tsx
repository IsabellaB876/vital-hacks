import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Spinner, Stack } from "react-bootstrap";
import { useSidebar } from "../../context/appContext";
import loginImg from "../../assets/login-img.svg";
import logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";
import { createUser } from "../../Service";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const { updateUserData } = useSidebar();
  const [role, setRole] = useState("Patient");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const options = ["Patient", "Doctor"];
  const [showPassword, setShowPassword] = useState(false);

  const onToggle = (value: string) => console.log("Selected:", value);

  const handleToggle = (index: number) => {
    setActive(index);
    setRole(options[index]);
    onToggle?.(options[index]);
  };

  const handleSignup = async () => {
    if (!firstName || !lastName || !username || !password || !role) {
      setInvalid("Please fill in all fields.");
      return;
    }

    const user = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      role: role,
      birthDate: "",
      files: [],
      photo: null,
      users: [],
      password: password,
    };

    try {
      const userData = await createUser(user);

      if (userData) {
        setLoading(true);
        updateUserData("firstName", firstName);
        updateUserData("lastName", lastName);
        updateUserData("username", username);
        updateUserData("role", role);
        updateUserData("birthDate", "");
        updateUserData("files", []);
        updateUserData("photo", null);
        updateUserData("password", password);
        updateUserData("users", []);

        navigate(role === "Patient" ? "/PatientHome" : "/DoctorHome");
      } else {
        setInvalid("Failed to create account. Please try again.");
      }
    } catch (error) {
      setInvalid("Username is taken. Please try another.");
      console.log("Signup error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (loading) {
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
          <Stack direction="horizontal" gap={2}>
            <Image src={logo} alt="MedVault Logo" className="logo" />
            <h2>Medvault</h2>
          </Stack>
          <h1>Glad to have you here!</h1>
          <p className="subtitle">Create your account.</p>
          <div className="btn-group d-flex" role="group">
            {options.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`btn flex-fill ${
                  active === i ? "" : "btn-outline-secondary"
                }`}
                style={{
                  backgroundColor: active === i ? "#1f3c88" : "transparent",
                  color: active === i ? "white" : "#1f3c88",
                  borderColor: "#1f3c88",
                }}
                onClick={() => handleToggle(i)}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="First Name"
            className="input"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="input"
            onChange={(e) => setUsername(e.target.value)}
          />
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              placeholder="Password"
              className="input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
            >
              <span
                aria-label={showPassword ? "Hide password" : "Show password"}
                role="button"
                tabIndex={0}
                onClick={() => setShowPassword(!showPassword)}
                onKeyPress={e => { if (e.key === "Enter") setShowPassword(!showPassword); }}
              >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </span>
          </div>
          <Button className="login-btn shadow" onClick={handleSignup}>
            Sign up
          </Button>
          <h3 style={{ color: "red" }}>{invalid}</h3>
          <p className="account-text">
            Already have an account? <Link to="/Account/Login">Log in.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
