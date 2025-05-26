import AdminPage from './Pages/Admin.jsx';
import EditProfile from "./Components/EditProfile.jsx";
import ProfilePage from "./Components/ProfilePage.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar.jsx";
import Footer from "./Components/Footer.jsx";
import Login from "./Components/LoginForm.jsx";
import './App.css';
import Events from "./Pages/Events.jsx";
import EventDetails from "./Pages/EventDetails.jsx";
import MyBookings from "./Pages/MyBookings.jsx";
import MyEventsPage from "./Pages/MyEventsPage.jsx";
import EventForm from "./Pages/EventForm.jsx";
import EventAnalyticsPage from "./Pages/EventAnalyticsPage.jsx";
import RegisterForm from "./Components/RegisterForm";
import ForgotPassword from "./Components/ForgotPassword";

function App() {
  return (
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<Events />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<RegisterForm></RegisterForm>} />
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/my-events" element={<MyEventsPage />} />
        <Route path="/my-events/new" element={<EventForm />} />
        <Route path="/my-events/:id/edit" element={<EventForm />} />
        <Route path="/my-events/analytics" element={<EventAnalyticsPage />} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
