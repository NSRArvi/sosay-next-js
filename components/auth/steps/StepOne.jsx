import React, { useState } from "react";
import {
  Mail,
  Phone,
  User,
  ArrowRight,
  CalendarIcon,
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
import { useAppContext } from "@/context/context";

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

export default function StepOne({ view, setView, setEmail, isLoading, onSubmit }) {
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
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => currentYear - i
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
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
        <p className="text-sm sm:text-base text-gray-500">
          Join Sosay in just a few steps
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base">
          Full Name
        </Label>
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
        <Select
          value={countryId}
          onValueChange={setCountryId}
          disabled={countriesLoading}
        >
          <SelectTrigger className="w-full h-10 sm:h-11 text-sm sm:text-base">
            <SelectValue
              placeholder={
                countriesLoading ? "Loading countries..." : "Select Country"
              }
            />
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
          <Label htmlFor="phone" className="text-sm sm:text-base">
            Phone Number
          </Label>
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
          <Label htmlFor="email" className="text-sm sm:text-base">
            Email Address
          </Label>
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
        {ageError && <p className="text-xs text-red-500 mt-1">{ageError}</p>}
        <p className="text-xs text-gray-500">
          You must be at least 16 years old to register
        </p>
      </div>

      <motion.div whileTap={{ scale: 0.98 }} className="pt-2">
        <Button
          onClick={handleSubmit}
          disabled={
            isLoading ||
            !name ||
            !countryId ||
            (!emailValue && !phoneValue) ||
            !date
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
  );
}
