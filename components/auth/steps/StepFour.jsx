import React from "react";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function StepFour({
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
