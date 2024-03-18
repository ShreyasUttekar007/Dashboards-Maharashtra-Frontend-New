import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import IframeContainer from "./components/IframeContainer";
import Dashboard from "./components/Dashboard";
import UpdateLogin from "./components/UpdateLogin";
import Register from "./components/Register";
import AddDashboard from "./components/AddDashboard";
import DashboardManagementComponent from "./components/DashboardManagementComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/createDashboard" element={<AddDashboard />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/update" element={<UpdateLogin />} />
        <Route path="/dashboard/:index" element={<IframeContainer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userManagement" element={<DashboardManagementComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
