import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import BrowseJobs from './pages/student/BrowseJobs';
import JobDetail from './pages/student/JobDetail';
import MyApplications from './pages/student/MyApplications';
import SavedJobs from './pages/student/SavedJobs';

import RecruiterDashboard from './pages/recruiter/Dashboard';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import PostJob from './pages/recruiter/PostJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import ViewApplicants from './pages/recruiter/ViewApplicants';

import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import RecruiterApprovals from './pages/admin/RecruiterApprovals';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Student */}
        <Route path="/student/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><Profile /></ProtectedRoute>} />
        <Route path="/student/jobs" element={<ProtectedRoute roles={['student']}><BrowseJobs /></ProtectedRoute>} />
        <Route path="/student/jobs/:id" element={<ProtectedRoute roles={['student']}><JobDetail /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute roles={['student']}><MyApplications /></ProtectedRoute>} />
        <Route path="/student/saved-jobs" element={<ProtectedRoute roles={['student']}><SavedJobs /></ProtectedRoute>} />

        {/* Recruiter */}
        <Route path="/recruiter/dashboard" element={<ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="/recruiter/company" element={<ProtectedRoute roles={['recruiter']}><CompanyProfile /></ProtectedRoute>} />
        <Route path="/recruiter/post-job" element={<ProtectedRoute roles={['recruiter']}><PostJob /></ProtectedRoute>} />
        <Route path="/recruiter/jobs" element={<ProtectedRoute roles={['recruiter']}><ManageJobs /></ProtectedRoute>} />
        <Route path="/recruiter/jobs/:jobId/applicants" element={<ProtectedRoute roles={['recruiter']}><ViewApplicants /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/approvals" element={<ProtectedRoute roles={['admin']}><RecruiterApprovals /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
