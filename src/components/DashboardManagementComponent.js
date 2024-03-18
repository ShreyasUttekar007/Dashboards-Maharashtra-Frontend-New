import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import localforage from "localforage";
import "../css/dashboardManagementComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const DashboardManagementComponent = () => {
  const [dashboards, setDashboards] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loggedInUserRole, setLoggedInUserRole] = useState("");
  const [assignMessage, setAssignMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = await localforage.getItem("token");
      axios
        .get("http://localhost:5000/api/biUrls/get-all-dashboards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setDashboards(response.data);
        })
        .catch((error) => {
          console.error("Error fetching dashboards:", error);
        });

      axios
        .get("http://localhost:5000/api/auth/get-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });

      localforage
        .getItem("userRole")
        .then((role) => {
          setLoggedInUserRole(role);
        })
        .catch((error) => {
          console.error("Error fetching logged-in user role:", error);
        });
    };
    fetchData();
  }, []);

  const handleAssignDashboard = async (dashboardId) => {
    try {
      const token = await localforage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/biUrls/assign-dashboard/${dashboardId}`,
        {
          user: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignMessage("Dashboard Assigned Successfully!!!!!");
      const dashboardsResponse = await axios.get(
        "http://localhost:5000/api/biUrls/get-all-dashboards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDashboards(dashboardsResponse.data);
      setSelectedUsers([]);
      setTimeout(() => {
        setAssignMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error assigning dashboard:", error);
    }
  };

  const handleRemoveDashboardAccess = async (dashboardId) => {
    try {
      const token = await localforage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/biUrls/remove-dashboard-access/${dashboardId}`,
        {
          user: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAssignMessage("Access Removed Successfully!!!!!");
      const dashboardsResponse = await axios.get(
        "http://localhost:5000/api/biUrls/get-all-dashboards",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDashboards(dashboardsResponse.data);
      setSelectedUsers([]);
      setTimeout(() => {
        setAssignMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error removing dashboard access:", error);
    }
  };

  return (
    <>
      <h1 className="header-text">Dashboard Management</h1>

      <div className="dashboard-management-container">
        <div className="msg-div">
          {assignMessage && (
            <div className="assign-alert">
              <FontAwesomeIcon icon={faCheck} className="icon" />
              {assignMessage}
            </div>
          )}
        </div>

        <table className="dashboard-management-table">
          <thead>
            <tr>
              <th>Dashboard Name</th>
              <th>Assigned Users</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dashboards.map((dashboard) => (
              <tr key={dashboard._id}>
                <td>{dashboard.name}</td>
                <td
                  style={{
                    maxWidth: "200px",
                  }}
                >
                  <Select
                    options={users.map((user) => ({
                      value: user._id,
                      label: user.email,
                    }))}
                    isMulti
                    onChange={(selectedOptions) =>
                      setSelectedUsers(
                        selectedOptions.map((option) => option.value)
                      )
                    }
                  />
                </td>
                <td>
                  {loggedInUserRole === "mod" && (
                    <div className="action-buttons">
                      <button
                        className="dashboard-management-button"
                        onClick={() => handleAssignDashboard(dashboard._id)}
                      >
                        Assign
                      </button>
                      <button
                        className="dashboard-management-button-remove"
                        onClick={() => handleRemoveDashboardAccess(dashboard._id)}
                      >
                        Remove Access
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardManagementComponent;
