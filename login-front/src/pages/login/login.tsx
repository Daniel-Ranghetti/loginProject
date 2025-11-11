import { RegisterPage } from "../register/Register";
import { AuthPage } from "./login_form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3 bg-gray-50">

      {/* coluna do form*/}
      <div className="flex items-center justify-center p-6 lg:col-span-1">
        <div className="w-full max-w-md">
        <h1 className="text-4xl font-semibold mb-14 text-gray-800 text-center">Login-Project</h1>
          <AuthPage/>
          <RegisterPage/>
        </div>
      </div>
      {/* coluna do video*/}
      <div className="hidden lg:block relative lg:col-span-2">
        <video
          src="/VIDEO MUITO FODA.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
}
