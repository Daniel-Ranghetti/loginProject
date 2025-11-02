import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/login";
import Hello from "./pages/Hello";
import RegisterPage from "./pages/register/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/hello" element={<Hello />} />
      {/* futuras rotas */}
    </Routes>
  );
}
