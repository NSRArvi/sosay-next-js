import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Eye, EyeOff, ArrowLeft, Lock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgetPasswordForm() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Step 1: Send Reset Password Request
  const handleSendResetRequest = async (e) => {
    e.preventDefault();
    const form = e.target;
    const emailValue = form.email.value;

    try {
      setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_DEV_URL}/user/reset/password/${emailValue}`;
      const response = await fetch(url, {
        method: "GET",
      });

      const data = await response.json();
      
      if (data.status === true) {
        toast.success(data.message || "Reset code sent to your email!");
        setEmail(emailValue);
        setStep(2);
      } else {
        toast.error(data.errors || data.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Set New Password
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newPassword = form.new_password.value;
    const confirmPassword = form.confirm_new_password.value;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }

    const formData = new FormData();
    formData.append("new_password", newPassword);
    formData.append("confirm_new_password", confirmPassword);

    try {
      setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_DEV_URL}/user/set/new/password/${email}`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.status === true) {
        toast.success(data.message || "Password reset successful!");
        setStep(3);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        toast.error(data.errors || data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-white p-10 rounded-lg shadow border border-gray-100 backdrop-blur-sm">
          {/* Back to Login Link */}
          {step !== 3 && (
            <Link
              href="/"
              className="inline-flex items-center text-sm text-primary hover:text-indigo-700 transition-colors font-medium mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          )}

          {/* Step 1: Enter Email */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold text-center mb-4 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Forgot Password?
              </motion.h2>
              <p className="text-center text-gray-500 mb-8">
                Enter your email to receive a password reset code
              </p>

              <form onSubmit={handleSendResetRequest} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="pr-10"
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-secondary text-white font-semibold py-6 hover:secondary/90 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 mr-2" />
                        Send Reset Code
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Set New Password */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-3xl font-bold text-center mb-4 text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Set New Password
              </motion.h2>
              <p className="text-center text-gray-500 mb-2">
                Create a strong password for your account
              </p>
              <p className="text-center text-sm text-indigo-600 font-medium mb-8">
                {email}
              </p>

              <form onSubmit={handleSetNewPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new_password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      name="new_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_new_password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm_new_password"
                      name="confirm_new_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      required
                      minLength={8}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-secondary text-white font-semibold py-6 hover:secondary/90 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Reset Password
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Success Message */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
              </motion.div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Password Reset Successful!
              </h2>
              <p className="text-gray-500 mb-8">
                Your password has been reset successfully.
                <br />
                Redirecting to login page...
              </p>
              
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}