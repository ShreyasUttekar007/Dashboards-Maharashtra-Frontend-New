import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import localforage from "localforage";

const AddDashboard = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await localforage.getItem("token");

    if (!token) {
      console.error("Token is null or undefined");
      return;
    }

    const userId = await localforage.getItem("ID");

    if (!userId || !token) {
      console.error("User ID or Token not found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/biUrls/bi",
        {
          name,
          url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dashboard Created:", response.data.message);
      alert("Dashboard Created");
      history("/dashboard");
    } catch (error) {
      console.error("Dashboard not Created:", error.response.data.message);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="login">
          <img src="./STC_logo-01.png" className="img" />
          <h1>Add Dashboard</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="name"
              placeholder="Enter Dashboard Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <br />
            <input
              type="text"
              placeholder="Enter Dashboard Url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <br />
            <div className="bttn">
              <button type="submit" className="button">
                Add Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDashboard;
