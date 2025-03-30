import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Signup() {
//   const [user, setUser] = useState<any>({});
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const signup = async () => {
//     const currentUser = await client.signup(user);
//     dispatch(setCurrentUser(currentUser));
//     navigate("/Kanbas/Account/Profile");
  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      <input className="wd-username form-control mb-2" placeholder="username" />
      <input className="wd-password form-control mb-2" placeholder="password" />
      <input className="wd-email form-control mb-2" placeholder="****@gmail.com" type="email" id="wd-email" /><br/>
      <input className="wd-birthday form-control mb-2" placeholder="00/00/0000" type="date"/> 
      <Link  to="/PatientHome" > <Button className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </Button> </Link><br />
      <Link to="/Account/Profile" className="wd-signin-link">Sign in</Link>
    </div>
    );
}

export default Signup;
