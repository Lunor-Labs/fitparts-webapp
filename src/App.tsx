import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Seller/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/seller/login" element={<Login />} />
          <Route path="/seller/register" element={<Register />} />
          <Route 
            path="/seller/dashboard" 
            element={
              <ProtectedRoute requiredRole="seller">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;