import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-white">
          Admin Login
        </h1>

        <LoginForm />
      </div>
    </main>
  );
}
