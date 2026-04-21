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
import { Profile } from "../pages/Profile/Profile";
import { ChangePassword } from "../pages/Profile/ChangePassword";
import { Notifications } from "../pages/Notifications/Notifications";
import { Settings } from "../pages/Settings/Settings";
import { ForgotPassword } from "../pages/ForgotPassword/ForgotPassword";
import { ResetPassword } from "../pages/ResetPassword/ResetPassword";
import { AdminDashboard } from "../pages/Admin/AdminDashboard";
import { AdminUserDetails } from "../pages/Admin/AdminUserDetails";
import { AdminRoute } from "./AdminRoute";
import { ContactUs } from "../pages/ContactUs/ContactUs";
import { MyContactMessages } from "../pages/ContactUs/MyContactMessages";
import { AdminContactMessages } from "../pages/Admin/AdminContactMessages";
import { AdminContactMessageDetails } from "../pages/Admin/AdminContactMessageDetails";
import { PublicHome } from "../pages/PublicHome/PublicHome";
import { Assistant } from "../pages/Assistant/Assistant";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicHome />} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

      <Route
          path="/change-password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />

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
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/animals/:animalId" element={<PrivateRoute><AnimalDetails /></PrivateRoute>}/>
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings/></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        
        <Route path="/admin/users/:id" element={<AdminRoute><AdminUserDetails /></AdminRoute>} />
        <Route path="/contact-us" element={<PrivateRoute><ContactUs /></PrivateRoute>}/>
        <Route path="/my-contact-messages" element={<PrivateRoute><MyContactMessages /></PrivateRoute>}/>
        <Route path="/admin/contact-messages" element={<AdminRoute><AdminContactMessages /></AdminRoute>}/>
        <Route path="/admin/contact-messages/:id" element={<AdminRoute><AdminContactMessageDetails /></AdminRoute>}/>
        <Route path="/assistant" element={<PrivateRoute><Assistant /></PrivateRoute>} />
        </Route>
    </Routes>
  );
};