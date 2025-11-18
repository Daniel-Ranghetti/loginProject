import { AuthForm } from "./auth-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-9">

      {/* coluna do form*/}
      <div className="flex items-center justify-center p-6 lg:col-span-2">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-semibold mb-6 text-gray-800 text-center transform -translate-y-6">Login-Project</h1>
          <AuthForm/>
        </div>
      </div>
      {/* coluna do video*/}
      <div className="hidden lg:block relative lg:col-span-7">
        <video
          src="/VIDEO MUITO FODA.mp4"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
}
