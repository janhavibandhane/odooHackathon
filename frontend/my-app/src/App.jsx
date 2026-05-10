import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './layout/Layout';

// Pages - Auth & Dashboard
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/dashboard/Home';

// Pages - Trips
import CreateTrip from './pages/trips/CreateTrip';
import MyTrips from './pages/trips/MyTrips';
import ItineraryBuilder from './pages/trips/ItineraryBuilder';
import ItineraryView from './pages/trips/ItineraryView';
import Budget from './pages/trips/Budget';
import PackingList from './pages/trips/PackingList';
import Journal from './pages/trips/Journal';

// Pages - Explore
import CitySearch from './pages/explore/CitySearch';
import ActivitySearch from './pages/explore/ActivitySearch';

// Pages - Other
import SharedItinerary from './pages/public/SharedItinerary';
import ProfileSettings from './pages/profile/ProfileSettings';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/shared/:tripId" element={<SharedItinerary />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              
              {/* Trip Routes */}
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/trips/create" element={<CreateTrip />} />
              <Route path="/trips/:id/builder" element={<ItineraryBuilder />} />
              <Route path="/trips/:id/view" element={<ItineraryView />} />
              <Route path="/trips/:id/budget" element={<Budget />} />
              <Route path="/trips/:id/packing" element={<PackingList />} />
              <Route path="/trips/:id/journal" element={<Journal />} />

              {/* Explore Routes */}
              <Route path="/explore/cities" element={<CitySearch />} />
              <Route path="/explore/activities" element={<ActivitySearch />} />

              {/* Profile & Admin */}
              <Route path="/profile" element={<ProfileSettings />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
      />
    </AuthProvider>
  );
}

export default App;