import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/login/auth-page";
import Hello from "./pages/Hello";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/hello" element={<Hello />} />
      {/* futuras rotas */}
    </Routes>
  );
}
