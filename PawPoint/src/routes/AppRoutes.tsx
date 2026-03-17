import { Route, Routes } from "react-router-dom";

import { MainLayout } from "../Layout/MainLayout";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { VerifyEmail } from "../pages/VerifyEmail/VerifyEmail";
import { Dashboard } from "../pages/Dashboard/Dashboard";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};