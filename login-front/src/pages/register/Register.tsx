import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

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
      // Chamando o endpoint que você informou
      await api.post("/users/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      // O backend não retorna token no registro, então apenas mostramos um toast de sucesso
      setSuccessMessage("Conta criada com sucesso! Redirecionando para login...");
      // opção: limpar campos
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // aguarda 1.5s para o usuário ler o toast e então redireciona para /login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const data = err.response?.data;

        if (status === 409) {
          setError("E-mail já cadastrado.");
        } else if (data?.errors && Array.isArray(data.errors)) {
          // caso o backend retorne um array de erros de validação
          setError(data.errors.map((i: any) => i.msg || i).join(" "));
        } else if (data?.message) {
          setError(data.message);
        } else {
          setError("Erro ao registrar. Tente novamente.");
        }
      } else {
        setError(err?.message || "Erro ao registrar.");
      }
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

        {/* Toast/Alert de sucesso */}
        {successMessage && (
          <div
            role="status"
            aria-live="polite"
            className="text-green-800 bg-green-100 p-2 rounded-md text-sm"
          >
            {successMessage}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div role="alert" className="text-red-700 bg-red-100 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

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