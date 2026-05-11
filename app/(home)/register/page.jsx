"use client";
import RegistrationForm from "@/components/auth/RegistrationForm";
import PublicRoute from "@/components/private/PublicRoute";
import AuthSidebar from "@/components/auth/AuthSidebar";

export default function Register() {
  return (
    <PublicRoute>
      <section className="min-h-screen flex flex-col md:flex-row bg-gray-50 text-gray-800 pt-20">
        {/* Left Column - Features */}
        <AuthSidebar/>

        {/* Right Column - Registration Form */}
        <RegistrationForm />
      </section>
    </PublicRoute>
  );
}
