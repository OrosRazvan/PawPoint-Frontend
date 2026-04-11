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
import { Appointments } from "../pages/Appointments/Appointment";
import { BookAppointmentStep1 } from "../pages/Appointments/BookAppointmentStep1";
import { BookAppointmentStep2 } from "../pages/Appointments/BookAppointmentStep2";
import { BookAppointmentStep3 } from "../pages/Appointments/BookAppointmentStep3";

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
        <Route path="/appointments" element={<PrivateRoute><Appointments /></PrivateRoute>} />
        <Route path="/appointments/book" element={<PrivateRoute><BookAppointmentStep1 /></PrivateRoute>} />
        <Route path="/appointments/book/date-time" element={<PrivateRoute><BookAppointmentStep2 /></PrivateRoute>} />
        <Route
          path="/appointments/book/confirmation"
          element={<PrivateRoute><BookAppointmentStep3 /></PrivateRoute>}
        />
        <Route path="/animals/:animalId" element={<PrivateRoute><AnimalDetails /></PrivateRoute>}/>
      </Route>
    </Routes>
  );
};