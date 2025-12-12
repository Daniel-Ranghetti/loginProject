import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../infrastructure/services/api";

export default function Hello(): JSX.Element {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se está autenticado fazendo uma requisição
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (error) {
        // Se não estiver autenticado, volta para login
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    // Apenas navega para login, o cookie expira sozinho
    navigate("/login");
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: 80 }}>Carregando...</div>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Hello world kkkk</h1>
      <p>Você está logado como: {user?.name || user?.email}</p>
      <button
        onClick={handleLogout}
        style={{ padding: "8px 12px", marginTop: 12 }}
      >
        Logout
      </button>
    </div>
  );
}
