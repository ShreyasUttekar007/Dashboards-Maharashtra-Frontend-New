import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../css/login.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDashboards, setSelectedDashboards] = useState([]);
  const [allDashboards, setAllDashboards] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/biUrls/get-all-dashboards");
        setAllDashboards(response.data.map(dashboard => ({ value: dashboard._id, label: dashboard.name })));
      } catch (error) {
        console.error("Error fetching dashboards:", error);
      }
    };

    fetchDashboards();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          email,
          password,
          dashboards: selectedDashboards.map(dashboard => dashboard.value),
        }
      );
      console.log("Sign up success:", response.data.message);
      history("/");
    } catch (error) {
      console.error("Sign up failed:", error.response.data.message);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="login">
          <img src="./STC_logo-01.png" className="img" />
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <Select
              options={allDashboards}
              isMulti
              value={selectedDashboards}
              onChange={setSelectedDashboards}
              placeholder="Select Dashboards"
            />
            <br />
            <div className="bttn">
              <button type="submit" className="button">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
