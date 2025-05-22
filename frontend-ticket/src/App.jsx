import EditProfile from "./Components/EditProfile";
import ProfilePage from "./Components/ProfilePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import Login from "./Components/LoginForm";
import RegisterForm from "./Components/RegisterForm";
import ForgotPassword from "./Components/ForgotPassword";

function App() {
  return (
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<RegisterForm></RegisterForm>} />
        <Route path="/forgot-password" element={<ForgotPassword></ForgotPassword>} />
      </Routes>
      <Footer></Footer>
    </Router>
  );
}

export default App;
