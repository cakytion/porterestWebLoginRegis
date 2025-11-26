import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import CreatePortfolio from './CreatePortfolio'; // Import หน้า Create Portfolio
import Profile from './profile'; // Import หน้า Profile ที่สร้างใหม่
import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import FinishSignup from './FinishSignup';
import SignInWithGoogle from './SignInWithGoogle';
import AdminDashboard from './admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<SignInWithGoogle />} />

          {/* Protected Routes (ต้อง Login ก่อน) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePortfolio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile" // Route สำหรับหน้า Profile
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/finish-signup"
            element={
              <ProtectedRoute>
                <FinishSignup />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;