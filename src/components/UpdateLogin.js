import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

const UpdateLogin = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const history = useNavigate();

  const handleClick = ()=>{
    history("/")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/update-password",
        {
          email,
          currentPassword,
          newPassword,
        }
      );
      console.log("Login success:", response.data.message);
      history("/");
    } catch (error) {
      alert(
        "Incorrect Credentials!!  Please Re-check",
        error.response.data.message
      );
      console.error("Login failed:", error.response.data.message);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="login">
          <img src="./STC_logo-01.png" className="img" />
          <h1>Create New Password</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <br />
            <div className="bttn">
              <button type="submit" className="button">
                Update Password
              </button>
            </div>
          </form>
          <button onClick={handleClick} className="button">Login</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateLogin;
