import React, { memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  if (currentForm >= typeForm.length -1) {
    setCurrentForm(0);
  }
}

  return (
    <>
      {typeForm[currentForm].id === 'login' && (    
        <div className="pt-32">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Entrar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="block text-sm text-gray-600">
            <span className="text-xs text-gray-500">Email</span>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="email@exemplo.com"
            />
          </div>
          <div className="block text-sm text-gray-600">
            <span className="text-xs text-gray-500">Senha</span>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-gray-800 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Senha"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
              />
              <span>Manter login</span>
            </div>
            <a href="#" className="text-indigo-600 hover:underline">
              Esqueci a senha
            </a>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full color-white inline-flex items-center justify-center gap-2 bg-indigo-800 hover:bg-indigo-600 active:scale-98
                       text-white font-medium py-2 px-4 rounded-md shadow-sm transition transform disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-xs text-gray-400">ou</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex justify-center mt-3">
            <Button
              type="button"
              className="bg-indigo-800 items-center border rounded-md py-2 px-3 mx-auto"
            >
              <FcGoogle/> Entre pelo Google
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Não tem conta?{" "}
            <Button onClick={handleForm} className="bg-transparent hover:bg-transparent text-indigo-600 hover:underline">
              Criar conta
            </Button>
          </p>
        </form>
      </div>
      )}



    {typeForm[currentForm].id === 'register' && (
      <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registrar</h2>

          Nome
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />

          E-mail
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />

          Senha
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />

          Confirmar senha
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            className="mt-1 p-2.5 border border-[#d0d7de] rounded-md text-sm"
          />

        <Button
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98
                       text-white font-medium py-2 px-4 rounded-md shadow-sm transition transform disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Criar conta"}
         </Button>
                     <Button onClick={handleForm} className="bg-transparent hover:bg-white text-indigo-600 hover:underline transition-colors">
              Criar conta
            </Button>
       </form>
      </div>
      )}
    </>
  );
};

export const AuthPage = memo(AuthPageComponent);