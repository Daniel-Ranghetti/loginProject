import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import axios from "axios";

export const RegisterPage: React.FC = () => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await api.post("/users/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;
      } else {
      console.error("Erro inesperado:", err);}
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
    </div>
  );
};

export default RegisterPage;

