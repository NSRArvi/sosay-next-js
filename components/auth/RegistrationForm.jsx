import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  User,
  CheckCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  CalendarIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/context";
import StepOne from "@/components/auth/steps/StepOne";
import StepTwo from "@/components/auth/steps/StepTwo";
import StepThree from "@/components/auth/steps/StepThree";
import StepFour from "@/components/auth/steps/StepFour";

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState(false); // false = email, true = phone
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { setUserInfo, setAccessToken } = useAppContext();
  const router = useRouter();

  // Step 1: Initial Registration
  const handleStepOne = async (formData) => {
    try {
      setIsLoading(true);
      const url = `${
        process.env.NEXT_PUBLIC_API_DEV_URL || ""
      }/user/registration/step/one`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === true) {
        setCurrentStep(2);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: OTP Verification
  const handleOtpVerification = async (otpCode) => {
    const formData = new FormData();
    formData.append("otp_code", otpCode);
    formData.append("otp_type", "account_verify");

    try {
      setIsLoading(true);
      const via = view ? "phone" : "email";
      const url = `${
        process.env.NEXT_PUBLIC_API_DEV_URL || ""
      }/otp/verification/${via}`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === true && data.data?.user_id) {
        setUserId(data.data.user_id);
        setCurrentStep(3);
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Password & Gender
  const handleStepTwo = async (formData) => {
    try {
      setIsLoading(true);
      const url = `${
        process.env.NEXT_PUBLIC_API_DEV_URL || ""
      }/user/registration/step/two`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === true) {
        setCurrentStep(4);
      } else {
        alert(data.message || "Failed to set password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Profile Image
  const handleImageUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file_name", selectedFile);
    formData.append("user_id", userId);
    formData.append("type", "0");

    try {
      setIsLoading(true);
      const url = `${
        process.env.NEXT_PUBLIC_API_DEV_URL || ""
      }/user/registration/image`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === true) {
        router.push("/app");
        toast.success(data.message);
        setAccessToken(data.data.access_token);
        setUserInfo(data.data);
      } else {
        toast.error(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Verify OTP" },
    { number: 3, title: "Password" },
    { number: 4, title: "Photo" },
  ];

  return (
    <div className="min-h-screen w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-secondary"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 rounded-full bg-destructive"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="w-full max-w-sm sm:max-w-md lg:max-w-2xl relative z-10"
      >
        {/* Stepper Header */}
        <div className="bg-white p-4 sm:p-6 rounded-t-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between gap-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-base font-semibold transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-secondary text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs mt-1 sm:mt-2 font-medium text-center max-w-[60px] sm:max-w-none ${
                      currentStep >= step.number
                        ? "text-secondary"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 sm:h-1 flex-1 rounded transition-all duration-300 mt-4 sm:mt-5 ${
                      currentStep > step.number ? "bg-secondary" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-b-xl shadow-lg border-x border-b border-gray-100">
          {currentStep === 1 && (
            <StepOne
              view={view}
              setView={setView}
              setEmail={setEmail}
              isLoading={isLoading}
              onSubmit={handleStepOne}
            />
          )}

          {currentStep === 2 && (
            <StepTwo
              view={view}
              email={email}
              isLoading={isLoading}
              onBack={() => setCurrentStep(1)}
              onSubmit={handleOtpVerification}
            />
          )}

          {currentStep === 3 && (
            <StepThree
              userId={userId}
              isLoading={isLoading}
              onBack={() => setCurrentStep(2)}
              onSubmit={handleStepTwo}
            />
          )}

          {currentStep === 4 && (
            <StepFour
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
              isLoading={isLoading}
              onBack={() => setCurrentStep(3)}
              onSubmit={handleImageUpload}
              onImageChange={handleImageChange}
            />
          )}

          <div>
            <p className="text-xs sm:text-sm text-center text-gray-500 pt-6 sm:pt-8">
              Already have an account?{" "}
              <Link
                href="/"
                className="text-destructive font-semibold hover:text-destructive/80 transition-colors"
              >
                Login
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
        </div>
      </motion.div>
    </div>
  );
}
