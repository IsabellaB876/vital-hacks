import "./App.css";
import { Routes, Route, Navigate } from "react-router";
import Account from "./components/Account";
import { HashRouter } from "react-router-dom";
import PatientHome from "./components/PatientHome";
import DoctorHome from "./components/DoctorHome";
import { Provider } from "./context/appContext";

function App() {
  return (
    <Provider>
      <HashRouter>
        <div className="wd-main-content-offset">
          <Routes>
            <Route path="/" element={<Navigate to="/Account" />} />
            <Route path="/PatientHome" element={<PatientHome />} />
            <Route path="/DoctorHome" element={<DoctorHome />} />
            <Route path="/Account/*" element={<Account />} />
          </Routes>
        </div>
      </HashRouter>
    </Provider>
  );
}
export default App;
