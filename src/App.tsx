import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ToastContainer';
import { Layout } from './components/layout';
import { Home, Login, Register, Dashboard, Venues, VenueDetails, MyBookings, Profile } from './pages';
import { MyVenues, CreateVenue, EditVenue, VenueBookings } from './pages/manager';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venues/:id" element={<VenueDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/venues"
              element={
                <ProtectedRoute requireVenueManager>
                  <MyVenues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/venues/create"
              element={
                <ProtectedRoute requireVenueManager>
                  <CreateVenue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/venues/:id/edit"
              element={
                <ProtectedRoute requireVenueManager>
                  <EditVenue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/bookings"
              element={
                <ProtectedRoute requireVenueManager>
                  <VenueBookings />
                </ProtectedRoute>
              }
            />
          </Routes>
            </Layout>
            <ToastContainer />
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
