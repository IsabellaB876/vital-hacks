import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Spinner, Stack } from "react-bootstrap";
import { useSidebar } from "../../context/appContext";
import { getUser, generateToken } from "../../Service";
import loginImg from "../../assets/login-img.svg";
import logo from "../../assets/logo.svg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const { updateUserData, user } = useSidebar();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user && user.username && user.role) {
      if (user.role === "Patient") {
        navigate("/PatientHome");
      } else {
        navigate("/DoctorHome");
      }
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!username || !password) {
      setInvalid("Please enter both username and password.");
      return;
    }

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

      if (userData.user.password !== password) {
        setInvalid("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }

      // Only navigate once all updates are done
      if (userData.user.role === "Patient") {
        const data = await generateToken(username, password);
        console.log("TOKEN: " + data);
        navigate("/PatientHome");
      } else {
        await generateToken(username, password);
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
          <Stack direction="horizontal" gap={2}>
            <Image src={logo} alt="MedVault Logo" className="logo" />
            <h2>Medvault</h2>
          </Stack>
          <h1>Welcome Back!</h1>
          <p className="subtitle">Login to your account.</p>
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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <Button className="login-btn shadow" onClick={handleLogin}>
            Log in
          </Button>
          <h3 style={{ color: "red" }}>{invalid}</h3>
          <p className="account-text">
            New to MedVault? <a href="/Signup">Create an account.</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
