import { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Hello(): JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // se não estiver logado, volta para login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Hello world kkkk</h1>
      <p>Você está logado.</p>
      <button
        onClick={handleLogout}
        style={{ padding: "8px 12px", marginTop: 12 }}
      >
        Logout
      </button>
    </div>
  );
}
