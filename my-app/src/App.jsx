import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import Home from "./pages/Home.jsx";
import IPODetails from "./components/IpoDetails.jsx";
import CompareIPOs from "./components/CompareIpo.jsx";
import PopularIPOs from "./components/Popular.jsx";
import UpcomingIPOs from "./components/UpcomingIpos.jsx";
import Logout from "./components/Logout.jsx";
import { ThemeProvider } from "./components/ThemeToggle.jsx";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ipo/:slug" element={<IPODetails />} />
          <Route path="/compare-ipo" element={<CompareIPOs />} />
          <Route path="/" element={<Home />} />
          <Route path="/popular-ipos" element={<PopularIPOs />} />
          <Route path="/upcoming-ipos" element={<UpcomingIPOs />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
