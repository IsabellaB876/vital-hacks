import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Account from "./components/Account";
import { HashRouter } from "react-router-dom";
import PatientHome from "./components/PatientHome";
import DoctorHome from "./components/DoctorHome";
import { Provider } from "./context/appContext";
import Profile from "./components/Profile";
import { useEffect } from "react";
import { verifyToken, getUser } from "./Service";
import { useSidebar } from "./context/appContext";

function AppContent() {
  const { updateUserData, user } = useSidebar();

  // Token validation logic here
  useEffect(() => {
    const validateToken = async () => {
      try {
        const data = await verifyToken();
        if (data.username && data.password) {
          const userData = await getUser(data.username);

          updateUserData("firstName", userData.user.firstName);
          updateUserData("lastName", userData.user.lastName);
          updateUserData("username", userData.user.username);
          updateUserData("role", userData.user.role);
          updateUserData("birthDate", userData.user.birthDate);
          updateUserData("files", userData.user.files);
          updateUserData("photo", userData.user.photo);
          updateUserData("password", userData.user.password);
          updateUserData("users", userData.user.users);

          console.log("TOKEN VALIDATED!");
        }
      } catch (error) {
        console.log("token invalid, sign in again");
        updateUserData("firstName", "");
        updateUserData("lastName", "");
        updateUserData("username", "");
        updateUserData("role", "");
        updateUserData("birthDate", "");
        updateUserData("files", []);
        updateUserData("photo", "");
        updateUserData("users", []);
        updateUserData("password", "");
      }
    };
    validateToken();
  }, []);

  return (
    <HashRouter>
      <div className="wd-main-content-offset">
        <Routes>
          <Route path="/" element={<Navigate to="/Account" />} />
          <Route path="/PatientHome" element={<PatientHome />} />
          <Route path="/DoctorHome" element={<DoctorHome />} />
          <Route path="/Account/*" element={<Account />} />
          <Route path="/Profile" element={<Profile />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

function App() {
  return (
    <Provider>
      <AppContent />
    </Provider>
  );
}

export default App;
