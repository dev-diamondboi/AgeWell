import React, { useContext } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import ElderlySearch from "./pages/ElderlySearch"; 
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import MedicationView from "./pages/MedicationView";
import HealthDetails from "./pages/HealthDetails";
import DailyCheckIn from "./pages/DailyCheckIn";
import EmergencyContacts from "./pages/EmergencyContacts";
import AdminDashboard from "./pages/AdminDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import DietPlan from "./pages/DietPlan";
import Schedule from "./pages/Schedule";
import FamilyDashboard from "./pages/FamilyDashboard";
import HealthcareDashboard from "./pages/HealthcareDashboard";
import ScheduleView from "./pages/ScheduleView";
import PrivateRoute from "./components/PrivateRoute";
import ContactUs from "./pages/ContactUs";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import DemoMode from "./pages/DemoMode";
import PricingPage from "./pages/PricingPage"; 
import ElderlyDetails from "./pages/ElderlyDetails";
import SystemPerformance from "./pages/SystemPerformance";

// Wrappers for routes with params
const DietPlanWrapper = () => {
  const { elderlyId } = useParams();
  return <DietPlan elderlyId={elderlyId} />;
};

const ScheduleWrapper = () => {
  const { elderlyId } = useParams();
  return <Schedule elderlyId={elderlyId} />;
};

function App() {
  const { user, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/login?loggedOut=true"); 
  };

  const isProtectedRoute = !["/", "/login", "/about", "/contact", "/demo", "/pricing"].includes(location.pathname);

  const redirectByRole = () => {
    switch (user?.role) {
      case "elderly":
        return "/dashboard";
      case "caregiver":
        return "/caregiver-dashboard";
      case "family":
        return "/family-dashboard";
      case "healthcare":
        return "/healthcare-dashboard";
      case "admin":
        return "/admin-dashboard";
      default:
        return "/";
    }
  };

  return (
    <>
      {user && isProtectedRoute && <Sidebar handleLogout={handleLogout} user={user} />}


      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route
        path="/login"
        element={<LoginPage key={location.key} setUser={setUser} />}
        />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/demo" element={<DemoMode />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/view-schedule" element={<ScheduleView user={user} />} />

        {/* ELDERLY ROUTES */}
        <Route path="/dashboard" element={<PrivateRoute user={user} roles={["elderly"]}><Dashboard /></PrivateRoute>} />
        <Route path="/medications" element={<PrivateRoute user={user} roles={["elderly"]}><MedicationView /></PrivateRoute>} />
        <Route path="/health-details" element={<PrivateRoute user={user} roles={["elderly"]}><HealthDetails user={user} /></PrivateRoute>} />
        <Route path="/daily-checkin" element={<PrivateRoute user={user} roles={["elderly"]}><DailyCheckIn /></PrivateRoute>} />
        <Route path="/emergency-contacts" element={<PrivateRoute user={user} roles={["elderly"]}><EmergencyContacts user={user} /></PrivateRoute>} />
        <Route path="/emergency" element={<Navigate to="/emergency-contacts" replace />} />

        {/* CAREGIVER ROUTES */}
        <Route path="/caregiver-dashboard" element={<PrivateRoute user={user} roles={["caregiver"]}><CaregiverDashboard user={user} /></PrivateRoute>} />
        <Route path="/elderly/:id" element={<ElderlyDetails />} />
        <Route path="/caregiver/:elderlyId/diet" element={<PrivateRoute user={user} roles={["caregiver"]}><DietPlanWrapper /></PrivateRoute>} />
        <Route path="/caregiver/:elderlyId/schedule" element={<PrivateRoute user={user} roles={["caregiver"]}><ScheduleWrapper /></PrivateRoute>} />
        <Route path="/search-elderly" element={<PrivateRoute user={user} roles={["caregiver"]}><ElderlySearch user={user} /></PrivateRoute>} /><Route path="/elderly/:id" element={<ElderlyDetails />} />


        {/* FAMILY */}
        <Route path="/family-dashboard" element={<PrivateRoute user={user} roles={["family"]}><FamilyDashboard /></PrivateRoute>} />

        {/* HEALTHCARE */}
        <Route path="/healthcare-dashboard" element={<PrivateRoute user={user} roles={["healthcare"]}><HealthcareDashboard /></PrivateRoute>} />

        {/* ADMIN */}
        <Route path="/admin-dashboard" element={<PrivateRoute user={user} roles={["admin"]}><AdminDashboard /></PrivateRoute>} />
        <Route path="/system-performance" element={<PrivateRoute user={user} roles={["admin"]}><SystemPerformance /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default App;
