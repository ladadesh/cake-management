import { Metadata } from "next";
import AuthForm from "../components/AuthForm";

export const metadata: Metadata = {
  title: "Register | Cake Affair",
  description: "Create a new Cake Affair account",
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen bg-pink-50 flex-col items-center p-4 sm:p-6 md:p-12">
      <div className="w-full max-w-lg">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
