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
    <div>
      {typeForm[currentForm].id === 'login' && (    
        <div className="pt-10">
        <h2 className="text-2xl font-semibold mb-4">Entrar</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input className="h-12" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email"/>
            <Input className="h-12" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Senha"/>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Input type="checkbox" className="h-4 w-4 rounded" /> Manter login
            </div>
            <a href="#" className="text-gray-600 hover:underline">
              Esqueci a senha
            </a>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-indigo-800 hover:bg-indigo-600">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <div className="flex justify-center mt-3">
            <Button className="bg-gray-200  text-black">
              <FcGoogle/> Entrar pelo Google
            </Button>
          </div>
          <div className="mt-3 pt-10 text-center">
            <Button onClick={handleForm} className="text-md bg-transparent hover:bg-transparent hover:underline text-gray-500">
              Criar uma conta
            </Button>
          </div>
        </form>
      </div>
      )}

    {typeForm[currentForm].id === "register" && (
        <div className="pt-12">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registrar</h2>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" />
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
            <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme a senha" />
            <Button disabled={loading} className="w-full bg-indigo-800 hover:bg-indigo-600">
              {loading ? "Registrando..." : "Criar conta"}
            </Button>

            <div className=" mt-3 text-center">
              <Button onClick={handleForm} className=" text-md bg-transparent hover:bg-transparent text-gray-500 hover:underline">
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