import { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = {
  title: "Login | Cake Affair",
  description: "Log in to your Cake Affair account",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center mt-6 p-4 sm:p-6 md:p-12">
      <div className="w-full max-w-lg">
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
