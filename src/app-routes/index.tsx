import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "../login";
import Register from "../register";
import AuthRequired from "./auth";  // Auth check component
import Home from "../Home";
import Navbar from "../navbar";  // Navbar is imported
import Appointments from "../appointments";
import DoctorRegister from "../doctor"; // Add DoctorRegister component

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes: No Navbar displayed */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctor" element={<DoctorRegister />} />

        {/* Protected routes: Show Navbar and secure routes with AuthRequired */}
        <Route element={<AuthRequired />}>
          {/* Home route is now accessible via "/" */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/appointments" element={<><Navbar /><Appointments /></>} />
        </Route>

        {/* Redirect to login if the route doesn't exist */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
