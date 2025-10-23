import { LoginForm } from "./login_form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-gray-50">
      {/* coluna do form (esquerda em telas grandes) */}
      <div className="flex items-center justify-center p-6 lg:col-span-1">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      {/* coluna do hero (direita em telas grandes) */}
      <div className="hidden lg:block relative lg:col-span-2">
        <video
          src="/VIDEO MUITO FODA.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        />
        {/* <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(...)" }}
        /> */}
      </div>
    </div>
  );
}
