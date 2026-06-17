import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function StepTwo({ view, email, isLoading, onBack, onSubmit }) {
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
          We&apos;ve sent a 6-digit code to{" "}
          <span className="text-secondary font-semibold">
            {view ? "your phone" : email}
          </span>
          <br />
          Please also check your spam folder.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otp" className="text-sm sm:text-base">
          OTP Code
        </Label>
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
