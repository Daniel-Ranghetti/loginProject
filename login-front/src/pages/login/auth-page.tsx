import React, { memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FaFacebookF, FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const AuthPageComponent: React.FC<React.ComponentProps<'form'>> = (props) => {
  const [name, setName] = useState("");
  const [currentForm, setCurrentForm] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const token = res.data?.access_token ?? null;
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

  const typeForm = [
    {
      id: 'login',
      title: "login",
    },
    {
      id: 'register',
      title: "register",
    },
  ]

function handleForm() {
  setCurrentForm((prevState) => prevState + 1);
}

  return (
    <>
      {typeForm[currentForm].id === 'login' && (    
        <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Entrar</h2>
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
            <button
              type="button"
              className="items-center border rounded-md py-2 px-3"
            >
              <FcGoogle />
            </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Não tem conta?{" "}
            <button onClick={handleForm} className="text-indigo-600 hover:underline">
              Criar conta
            </button>
          </p>
        </form>
      </div>
      )}
    {typeForm[currentForm].id === 'register' && (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registrar</h2>
        <label htmlFor="name" className="flex flex-col text-sm">
          Nome
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            autoComplete="name"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />
        </label>
        <label htmlFor="email" className="flex flex-col text-sm">
          E-mail
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@exemplo.com"
            autoComplete="email"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />
        </label>
        <label htmlFor="password" className="flex flex-col text-sm">
          Senha
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoComplete="new-password"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />
        </label>
        <label htmlFor="confirmPassword" className="flex flex-col text-sm">
          Confirmar senha
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            autoComplete="new-password"
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
)}
    </>
  );
};

export const AuthPage = memo(AuthPageComponent);