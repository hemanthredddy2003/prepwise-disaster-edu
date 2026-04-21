import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import AlertSystem from "./pages/alerts/AlertSystem";
import EmergencyAction from "./pages/alerts/EmergencyAction";
import FamilySafetyPlan from "./pages/family/FamilySafetyPlan";
import DisasterQuiz from "./pages/quiz/DisasterQuiz";
import ShelterLocator from "./pages/shelters/ShelterLocator";
import DrillScheduler from "./pages/drills/DrillScheduler";
import CoursesPage from "./pages/courses/CoursesPage";
import CourseDetail from "./pages/courses/CourseDetail";
import ProfilePage from "./pages/profile/ProfilePage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CertificatePage from "./pages/certificates/CertificatePage";
import EmergencyKit from "./pages/kit/EmergencyKit";
import NotFound from "./pages/error/NotFound";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="alerts" element={<AlertSystem />} />
          <Route path="emergency-action" element={<EmergencyAction />} />
          <Route path="family-plan" element={<FamilySafetyPlan />} />
          <Route path="quiz" element={<DisasterQuiz />} />
          <Route path="shelters" element={<ShelterLocator />} />
          <Route path="drills" element={<DrillScheduler />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="kit" element={<EmergencyKit />} />
          <Route path="certificates" element={<CertificatePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
