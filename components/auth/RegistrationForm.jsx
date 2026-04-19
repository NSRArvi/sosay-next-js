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
    { number: 4, title: "Profile Photo" },
  ];

  return (
    <div className="min-h-screen w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative mt-14 md:mt-0">
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

          <p className="text-xs sm:text-sm text-center text-gray-500 pt-6 sm:pt-8">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-destructive font-semibold hover:text-destructive/80 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function to calculate age
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// Step 1 Component
function StepOne({ view, setView, setEmail, isLoading, onSubmit }) {
  const [name, setName] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [countryId, setCountryId] = useState("");
  const [date, setDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ageError, setAgeError] = useState("");
  const { countries, countriesLoading } = useAppContext();

  // Generate year options (from 1900 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleDateSelect = (selectedDate) => {
    if (selectedDate) {
      const age = calculateAge(selectedDate);
      if (age < 16) {
        setAgeError("You must be at least 16 years old to register");
        setDate(null);
      } else {
        setAgeError("");
        setDate(selectedDate);
      }
    }
  };

  const handleSubmit = () => {
    if (!date) {
      setAgeError("Please select your date of birth");
      return;
    }

    const age = calculateAge(date);
    if (age < 16) {
      setAgeError("You must be at least 16 years old to register");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("country_id", countryId);
    if (view) {
      formData.append("phone", phoneValue);
    } else {
      formData.append("email", emailValue);
      setEmail(emailValue);
    }
    formData.append("dob", format(date, "yyyy-MM-dd"));
    onSubmit(formData);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-sm sm:text-base text-gray-500">Join Sosay in just a few steps</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
        <div className="relative">
          <Input
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pr-10 text-sm sm:text-base h-10 sm:h-11"
          />
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm sm:text-base">Country</Label>
        <Select value={countryId} onValueChange={setCountryId} disabled={countriesLoading}>
          <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
            <SelectValue placeholder={countriesLoading ? "Loading countries..." : "Select Country"} />
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            {countries.map((country) => (
              <SelectItem key={country.id} value={String(country.id)}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {view ? (
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
          <div className="relative">
            <Input
              id="phone"
              placeholder="Enter your phone number"
              type="tel"
              value={phoneValue}
              onChange={(e) => setPhoneValue(e.target.value)}
              className="pr-10 text-sm sm:text-base h-10 sm:h-11"
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
          <div className="relative">
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              className="pr-10 text-sm sm:text-base h-10 sm:h-11"
            />
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* <Button
        type="button"
        variant="link"
        onClick={() => setView(!view)}
        className="text-xs sm:text-sm text-secondary hover:text-secondary/80 p-0 h-auto font-medium w-full text-left -mt-2"
      >
        {view ? "Use email instead" : "Use phone instead"}
      </Button> */}

      <div className="space-y-2">
        <Label className="text-sm sm:text-base">Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal h-10 sm:h-11 text-sm sm:text-base ${
                ageError ? "border-red-500" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
              {date ? (
                format(date, "PPP")
              ) : (
                <span className="text-muted-foreground">Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 space-y-3">
              {/* Month and Year Selectors */}
              <div className="flex gap-2">
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-full flex-1 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-full flex-1 h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Calendar Component */}
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                month={new Date(selectedYear, selectedMonth)}
                onMonthChange={(newMonth) => {
                  setSelectedMonth(newMonth.getMonth());
                  setSelectedYear(newMonth.getFullYear());
                }}
                initialFocus
                disabled={(date) => {
                  const age = calculateAge(date);
                  return age < 16 || date > new Date();
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        {ageError && (
          <p className="text-xs text-red-500 mt-1">{ageError}</p>
        )}
        <p className="text-xs text-gray-500">You must be at least 16 years old to register</p>
      </div>

      <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !name || !countryId || (!emailValue && !phoneValue) || !date}
          className="w-full bg-secondary text-white font-semibold py-5 sm:py-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base hover:bg-secondary/90"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}

// Step 2 Component
function StepTwo({ view, email, isLoading, onBack, onSubmit }) {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = () => {
    onSubmit(otpCode);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Verify Your {view ? "Phone" : "Email"}
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          We&apos;ve sent a 6-digit code to {view ? "your phone" : email}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp" className="text-sm sm:text-base">OTP Code</Label>
        <Input
          id="otp"
          placeholder="000000"
          type="text"
          maxLength={6}
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
          className="text-center text-xl sm:text-2xl tracking-widest h-12 sm:h-14"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 sm:px-8 py-5 sm:py-6 font-semibold text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || otpCode.length !== 6}
            className="w-full bg-secondary text-white font-semibold py-5 sm:py-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base hover:bg-secondary/90"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Step 3 Component
function StepThree({ userId, isLoading, onBack, onSubmit }) {
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  const handleSubmit = () => {
    if (password !== passwordConfirmation) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("gender", gender);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);
    formData.append("country_id", 10);
    onSubmit(formData);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Secure Your Account
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Create a strong password and tell us about yourself
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender" className="text-sm sm:text-base">Gender</Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger id="gender" className="w-full h-10 sm:h-11 text-sm sm:text-base">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
        <div className="relative">
          <Input
            id="password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10 text-sm sm:text-base h-10 sm:h-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
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

      <div className="space-y-2">
        <Label htmlFor="password_confirmation" className="text-sm sm:text-base">Confirm Password</Label>
        <div className="relative">
          <Input
            id="password_confirmation"
            placeholder="Confirm your password"
            type={showPasswordConfirmation ? "text" : "password"}
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="pr-10 text-sm sm:text-base h-10 sm:h-11"
          />
          <button
            type="button"
            onClick={() =>
              setShowPasswordConfirmation(!showPasswordConfirmation)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPasswordConfirmation ? (
              <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Password must be at least 8 characters long
      </p>

      <div className="flex gap-3 pt-2">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 sm:px-8 py-5 sm:py-6 font-semibold text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !gender ||
              password.length < 8 ||
              passwordConfirmation.length < 8
            }
            className="w-full bg-secondary text-white font-semibold py-5 sm:py-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base hover:bg-secondary/90"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// Step 4 Component
function StepFour({
  imagePreview,
  setImagePreview,
  isLoading,
  onBack,
  onSubmit,
  onImageChange,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Add Profile Photo
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Make your profile stand out with a photo
        </p>
      </div>

      <div className="flex flex-col items-center py-6 sm:py-8">
        {imagePreview ? (
          <div className="relative">
            <Image
              src={imagePreview}
              alt="Preview"
              width={160}
              height={160}
              unoptimized
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-secondary shadow-lg"
            />
            <Button
              onClick={() => setImagePreview(null)}
              size="icon"
              className="absolute -top-2 -right-2 rounded-full h-7 w-7 sm:h-8 sm:w-8 bg-destructive hover:bg-destructive/90 text-white"
            >
              ×
            </Button>
          </div>
        ) : (
          <label className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-secondary transition-all bg-gray-50 hover:bg-gray-100">
            <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2" />
            <span className="text-xs sm:text-sm text-gray-500 font-medium">
              Upload Photo
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            onClick={onBack}
            variant="outline"
            className="px-6 sm:px-8 py-5 sm:py-6 font-semibold text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.98 }} className="flex-1">
          <Button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full bg-secondary text-white font-semibold py-5 sm:py-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-sm sm:text-base hover:bg-secondary/90"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                Complete Registration
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}