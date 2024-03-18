import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import localforage from "localforage";

const Login = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/update");
  };
  const handleRegister = () => {
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setEmailError("");
      setPasswordError("");

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const userEmail = response.data.userObj.email;
      const token = response.data.token;
      const id = response.data.userObj._id;
      const role = response.data.userObj.roles[0];
      localforage.setItem("email", userEmail);
      localforage.setItem("token", token);
      localforage.setItem("ID", id);
      localforage.setItem("userRole", role);
      console.log("Login success:", response.data.message);
      navigate("/Dashboard");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setEmailError("Incorrect email or password");
        setPasswordError("Incorrect email or password");
      } else {
        console.error("Login failed:", error.response.data.message);
      }
    }
  };

  return (
    <div>
      <div className="container">
        <div className="login">
          <img src="./STC_logo-01.png" className="img" />
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="error">{passwordError}</p>
            <br />
            <div className="bttn">
              <button type="submit" className="button">
                Sign In
              </button>
            </div>
          </form>
          <button onClick={handleClick} className="button">
            Update Password
          </button>
          <button onClick={handleRegister} className="button">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
