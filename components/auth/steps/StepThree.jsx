import React, { useState } from "react";
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
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
import { motion } from "framer-motion";

export default function StepThree({ userId, isLoading, onBack, onSubmit }) {
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
        <Label htmlFor="gender" className="text-sm sm:text-base">
          Gender
        </Label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger
            id="gender"
            className="w-full h-10 sm:h-11 text-sm sm:text-base"
          >
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
        <Label htmlFor="password" className="text-sm sm:text-base">
          Password
        </Label>
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
        <Label htmlFor="password_confirmation" className="text-sm sm:text-base">
          Confirm Password
        </Label>
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
