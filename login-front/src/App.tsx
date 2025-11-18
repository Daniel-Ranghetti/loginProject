import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./presentation/pages/auth/auth-page";
import Hello from "./presentation/pages/Hello";

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
