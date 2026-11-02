import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './layouts/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManagement } from './pages/admin/StudentManagement';
import { FacultyManagement } from './pages/admin/FacultyManagement';
import { SubjectManagement } from './pages/admin/SubjectManagement';
import { AcademicManagement } from './pages/admin/AcademicManagement';
import { GradePublishManagement } from './pages/admin/GradePublishManagement';
import { AdminReports } from './pages/admin/AdminReports';

// Faculty Pages
import { FacultyDashboard } from './pages/faculty/FacultyDashboard';
import { MarksEntryPage } from './pages/faculty/MarksEntryPage';
import { SubjectAnalytics } from './pages/faculty/SubjectAnalytics';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentResults } from './pages/student/StudentResults';
import { StudentProfile } from './pages/student/StudentProfile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="faculty" element={<FacultyManagement />} />
            <Route path="subjects" element={<SubjectManagement />} />
            <Route path="academic" element={<AcademicManagement />} />
            <Route path="grades" element={<GradePublishManagement />} />
            <Route path="publish" element={<GradePublishManagement />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* Faculty Routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['ROLE_FACULTY', 'ROLE_ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FacultyDashboard />} />
            <Route path="marks" element={<MarksEntryPage />} />
            <Route path="analytics" element={<SubjectAnalytics />} />
          </Route>

          {/* Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['ROLE_STUDENT', 'ROLE_ADMIN', 'ROLE_FACULTY']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

