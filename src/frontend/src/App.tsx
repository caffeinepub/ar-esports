import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <HashRouter>
      <div
        className="min-h-screen"
        style={{ background: "oklch(0.08 0.01 260)" }}
      >
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </HashRouter>
  );
}
