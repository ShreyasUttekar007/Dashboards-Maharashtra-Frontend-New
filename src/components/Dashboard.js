import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/cards.css";
import localforage from "localforage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [powerBiUrls, setPowerBiUrls] = useState([]);
  console.log("powerBiUrls::: ", powerBiUrls);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  console.log("role::: ", role);

  const logout = async () => {
    await localforage.removeItem("token");
    await localforage.removeItem("ID");
    await localforage.removeItem("email");
    navigate("/");
  };

  const handleClick = () => {
    navigate("/createDashboard");
  };
  const handleClick1 = () => {
    navigate("/userManagement");
  };

  const handleDelete = async (dashboardId) => {
    const token = await localforage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/biUrls/delete-dashboard/${dashboardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/Dashboard");
    } catch (error) {
      console.error(
        "Error deleting dashboard:",
        error.response?.data?.message || "Unknown error"
      );
    }
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await localforage.getItem("email");

        if (storedEmail) {
          const modifiedEmail = storedEmail.toUpperCase().split("@")[0];
          setEmail(modifiedEmail);
        }
      } catch (error) {
        console.error("Error retrieving email:", error);
      }
    };

    fetchEmail();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = await localforage.getItem("token");

      if (!token) {
        console.error("Token is null or undefined");
        return;
      }

      const userId = await localforage.getItem("ID");
      const roles = await localforage.getItem("userRole");
      setRole(roles);

      if (!userId || !token) {
        console.error("User ID or Token not found");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/biUrls/get-dashboards/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPowerBiUrls(response.data);
      } catch (error) {
        console.error(
          "Error fetching dashboards:",
          error.response.data.message
        );
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ flex: 1 }} className="cards-container">
      <div className="head">
        <div className="header-img">
          <img
            src="./STC_logo-01.png"
            onClick={logout}
            className="imggg"
            alt="STC Logo"
          />
          <div>
            <h3 style={{ color: "white" }}>Logged In As </h3>
            <h3 style={{ color: "#00aaff" }}>{email}</h3>
          </div>
        </div>
        <div className="logout-btn">
          <button onClick={logout} className="btn">
            Logout
          </button>
        </div>
        <div className="logout-btn">
          {role !== "mod" ? null : (
            <button onClick={handleClick} className="btn">
              Add Dashboard
            </button>
          )}
        </div>
        <div className="logout-btn">
          {role !== "mod" ? null : (
            <button onClick={handleClick1} className="btn">
              Assign Dashboard
            </button>
          )}
        </div>
      </div>
      <div className="cards">
        {powerBiUrls.map(({ _id, name, url }, index) => (
          <Link
            key={index}
            to={`/dashboard/${index}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              className="card"
              style={{
                padding: "10px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <img
                src="https://www.scnsoft.com/images-for-demo/power-bi.png"
                className="image"
                alt={`Card ${index + 1}`}
              />
              <div className="card-name">
                <button className="btttn">{name}</button>
                {role !== "mod" ? null : (
                  <button
                    onClick={() => handleDelete(_id)}
                    className="delete-btttn"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="footer">© 2023 Showtime Consulting</div>
    </div>
  );
};

export default Dashboard;
