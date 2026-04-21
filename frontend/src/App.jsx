import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './Routes';
import { useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';


import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CheckoutSimulation from './pages/CheckoutSimulation';
import { Spinner } from './components/ui';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1120]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] text-white min-h-screen flex flex-col selection:bg-green-500/30 selection:text-green-500">
      <Navbar />
      
      <main className="flex-grow">
        <ReactRoutes>
          {}
          <Route path="/" element={<Landing />} />
          
          {}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {}
          <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute role="user"><CheckoutSimulation /></ProtectedRoute>} />

          {}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

          {}
          <Route path="*" element={<Navigate to="/" replace />} />
        </ReactRoutes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
