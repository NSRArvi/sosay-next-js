import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Eye, EyeOff, Mail, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserInfo, setAccessToken } = useAppContext();
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_DEV_URL}/login`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === false) {
        toast.error(data.errors);
      } else if (data.data.two_fa_status === 1) {
        router.push("/2fa_verification");
        localStorage.setItem("email", email);
        localStorage.setItem("two_fa_type", data.data.two_fa_type);
      } else if (data.status === true) {
        router.push("/app");
        toast.success(data.message);
        setAccessToken(data.data.access_token);
        setUserInfo(data.data);
      } else {
        toast.error(data.errors);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Subtle background pattern - responsive sizes */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-secondary"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full bg-destructive"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg relative z-10"
      >
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-xl border border-gray-100 backdrop-blur-sm"
        >
          {/* Scotty Pumpkin — vertical logo block */}
          <a
            href="https://scottypumpkin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-1.5 mb-6 transition-all duration-200"
          >
            <span className="relative">
              <Image
                src="/images/logo/scotty.webp"
                alt="Scotty Pumpkin"
                width={56}
                height={56}
                className="rounded-full object-cover transition-transform duration-200 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }}
              />
              <span
                className="hidden h-14 w-14 items-center justify-center rounded-full text-2xl"
                style={{
                  border: "2.5px solid #F97316",
                  boxShadow:
                    "0 0 0 4px rgba(249,115,22,0.12), 0 0 18px rgba(249,115,22,0.30)",
                  background: "#fff7ed",
                }}
              >
                🎃
              </span>
            </span>
            <span className="flex flex-col items-center leading-tight">
              <span
                className="text-[10px] font-semibold uppercase"
                style={{
                  color: "rgba(194,87,10,0.50)",
                  letterSpacing: "0.12em",
                }}
              >
                Part of the
              </span>
              <span
                className="text-xs font-bold transition-colors duration-200 group-hover:text-orange-600"
                style={{ color: "#C2570A" }}
              >
                Scotty Pumpkin Web3 Ecosystem
              </span>
            </span>
          </a>

          {/* divider */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-300 font-medium">Sosay</span>
            <span className="h-px flex-1 bg-gray-100" />
          </div>

          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-center mb-3 sm:mb-4 text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Welcome Back
          </motion.h2>
          <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
            Sign in to your Sosay account
          </p>

          <div className="space-y-5">
            {view ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden space-y-2"
              >
                <Label htmlFor="phone_number" className="text-sm sm:text-base">
                  Phone Number
                </Label>
                <div className="relative">
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="pr-10 text-sm sm:text-base h-10 sm:h-11"
                  />
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden space-y-2"
              >
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="pr-10 text-sm sm:text-base h-10 sm:h-11"
                  />
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="pr-10 text-sm sm:text-base h-10 sm:h-11"
                />
                <button
                  type="button"
                  onClick={handleTogglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end items-center text-xs sm:text-sm">
              <Link
                href="/forget-password"
                className="text-secondary hover:text-secondary/80 transition-colors font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary text-white font-semibold py-5 sm:py-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base hover:bg-secondary/90"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-center text-gray-500 pt-6 sm:pt-8">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-destructive font-semibold hover:text-destructive/80 transition-colors"
              >
                Sign up
              </Link>
            </p>

            <p className="text-xs sm:text-sm text-center text-gray-500 mt-2">
              Explore the smart features of{" "}
              <Link
                href="/home"
                className="text-destructive font-semibold hover:text-destructive/80 transition-colors"
              >
                Sosay
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
