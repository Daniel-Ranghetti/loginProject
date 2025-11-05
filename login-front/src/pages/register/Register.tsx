import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // Ajuste a chamada ao backend conforme sua API:
      // await api.post("/auth/register", { name, email, password });
      // por enquanto apenas redireciona para o login
      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-8 min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] p-7 rounded-lg bg-white flex flex-col gap-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
      >
        <h2 className="mb-2 text-center text-xl font-semibold">Registrar</h2>

        {error && (
          <div className="text-red-700 bg-red-100 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <label className="flex flex-col text-sm">
          Nome
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />
        </label>

        <label className="flex flex-col text-sm">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@exemplo.com"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />
        </label>

        <label className="flex flex-col text-sm">
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />
        </label>

        <label className="flex flex-col text-sm">
          Confirmar senha
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-2.5 px-4 bg-blue-600 text-white rounded-md font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Registrando..." : "Criar conta"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
