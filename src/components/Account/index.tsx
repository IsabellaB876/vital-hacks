import Signup from "./SignUp";
import { Routes, Route, Navigate } from "react-router";
import Login from "./Login";

export default function Account() {
  return (
    <div id="wd-account-screen">
      <Routes>
        <Route path="/" element={<Navigate to="/Account/Signup" />} />
        {/* <Route path="/Signin" element={<Signin />} />
        <Route path="/Profile" element={<Profile />} /> */}
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </div>
  );
}
