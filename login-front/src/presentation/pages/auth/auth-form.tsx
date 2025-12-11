import React, { memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../infrastructure/services/api";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";

const AuthPageComponent: React.FC<React.ComponentProps<'form'>> = (props) => {
  const [name, setName] = useState("");
  const [currentForm, setCurrentForm] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/users/login", { email, password, keepLogged });
      // Cookie é definido automaticamente pelo navegador
      navigate("/hello");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao fazer login";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/users/register", { name, email, password });
      // Após registrar, faz login automaticamente
      await api.post("/users/login", { email, password });
      // Cookie é definido automaticamente pelo navegador
      navigate("/hello");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao registrar";
      setError(errorMessage);
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
    <div>
      {typeForm[currentForm].id === 'login' && (    
        <div className="pt-10">
        <h2 className="text-2xl font-semibold mb-4">Entrar</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input className="h-12" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/>
            <Input className="h-12" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Senha"/>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Input type="checkbox" className="h-4 w-4 rounded" onChange={(e) => setKeepLogged(e.target.checked)} /> Manter login
            </div>
            <a href="#" className="text-gray-600 hover:underline">
              Esqueci a senha
            </a>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-indigo-800 hover:bg-indigo-600">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="flex justify-center mt-3">
            <Button type="button" className="bg-gray-200 text-black">
              <FcGoogle/> Entrar pelo Google
            </Button>
          </div>
          <div className="mt-3 pt-10 text-center">
            <Button type="button" onClick={handleForm} className="text-md bg-transparent hover:bg-transparent hover:underline text-gray-500">
              Criar uma conta
            </Button>
          </div>
        </form>
      </div>
      )}

    {typeForm[currentForm].id === "register" && (
        <div className="pt-12">
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registrar</h2>
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
            <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome" />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Senha" />
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Confirme a senha" />
            <Button type="submit" disabled={loading} className="w-full bg-indigo-800 hover:bg-indigo-600">
              {loading ? "Registrando..." : "Criar conta"}
            </Button>

            <div className=" mt-3 text-center">
              <Button type="button" onClick={handleForm} className=" text-md bg-transparent hover:bg-transparent text-gray-500 hover:underline">
                Ja possuo uma conta
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const AuthForm = memo(AuthPageComponent);