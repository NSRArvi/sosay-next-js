"use client";
import LoginForm from "@/components/auth/LoginForm";
import PublicRoute from "@/components/private/PublicRoute";
import AuthSidebar from "@/components/auth/AuthSidebar";

export default function Login() {
  return (
    <PublicRoute>
      <section className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800">
        {/* Left Column - Features */}
        <AuthSidebar />

        {/* Right Column - Login Form */}
        <LoginForm />
      </section>
    </PublicRoute>
  );
}
