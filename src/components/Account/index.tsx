import Signup from "./SignUp";
import { Routes, Route, Navigate } from "react-router";

export default function Account() {
  return (
    <div id="wd-account-screen">
      <h2>Account</h2>
      <Routes>
        <Route path="/" element={<Navigate to="/Account/Signup" />} />
        {/* <Route path="/Signin" element={<Signin />} />
        <Route path="/Profile" element={<Profile />} /> */}
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </div>
  );
}
