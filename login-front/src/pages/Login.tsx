import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Ajuste o caminho caso seu backend use outro
      const res = await api.post("/auth/login", { email, password });
      // espera-se que o backend retorne { accessToken: '...' } ou { access_token: '...' }
      const token = res.data?.accessToken ?? res.data?.access_token ?? null;
      if (!token) {
        throw new Error("Resposta inválida do servidor: token não encontrado.");
      }
      localStorage.setItem("token", token);
      // redireciona para página Hello
      navigate("/hello");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        maxWidth: 420,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Email
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>
            Senha
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {error && <div style={{ marginTop: 12, color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}
