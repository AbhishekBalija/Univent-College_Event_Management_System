import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { LoginPage, RegisterPage } from './pages';
import { ProtectedRoute } from './components/auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Protected routes with layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Layout />}>
            <Route index element={<h1 className="text-4xl font-bold mb-6">Welcome to EventFlow+</h1>} />
            <Route path="dashboard" element={<h1 className="text-4xl font-bold mb-6">Dashboard</h1>} />
            {/* Add more routes here as you develop the application */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
