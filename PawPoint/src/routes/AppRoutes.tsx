import { Route, Routes } from "react-router-dom";

import { MainLayout } from "../Layout/MainLayout";
import { Register } from "../pages/Register/Register";
import { Login } from "../pages/Login/Login";
import { VerifyEmail } from "../pages/VerifyEmail/VerifyEmail";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Vaccinations } from "../pages/Vaccinations/Vaccinations";
import { AnimalDetails } from "../pages/AniamlDetails/AnimalDetails";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { Deworming } from "../pages/Deworming/Deworming";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/vaccinations" element={<PrivateRoute><Vaccinations /></PrivateRoute>} />
        <Route path="/deworming" element={<PrivateRoute><Deworming /></PrivateRoute>} />
        <Route path="/animals/:animalId" element={<PrivateRoute><AnimalDetails /></PrivateRoute>}/>
      </Route>
    </Routes>
  );
};