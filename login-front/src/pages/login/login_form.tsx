import React, { memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const LoginForm = memo(({ className }: React.ComponentProps<"form">) => {
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
    <div className={className}>
      <div className="bg-white/95 shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Entrar</h2>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm text-gray-600">
            <span className="text-xs text-gray-500">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="seu@exemplo.com"
            />
          </label>

          <label className="block text-sm text-gray-600">
            <span className="text-xs text-gray-500">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="••••••••"
            />
          </label>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Manter login</span>
            </label>
            <a href="#" className="text-indigo-600 hover:underline">
              Esqueci a senha
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98
                       text-white font-medium py-2 px-4 rounded-md shadow-sm transition transform disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-xs text-gray-400">ou</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 border rounded-md py-2 bg-white text-sm shadow-sm hover:shadow
                         transition"
            >
              <FaFacebookF className="text-blue-600" />
              <span>Facebook</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border rounded-md py-2 px-3 bg-white text-sm shadow-sm hover:shadow transition"
            >
              <FcGoogle />
            </button>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 border rounded-md py-2 px-3 bg-black text-white shadow-sm hover:opacity-90 transition"
            >
              <FaApple />
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Não tem conta?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Criar conta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
});
