"use client";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [verificationInfo, setVerificationInfo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ["/countries"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_DEV_URL || ""}/countries`
      );
      return response.json();
    },
    staleTime: 1000 * 60 * 30,
  });

  const countries = countriesData?.data || [];

  // Check user is verified
  const { data: userVerifyData } = useQuery({
    queryKey: ["/user/is-verified", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Check user have store
  const { data: userShopData } = useQuery({
    queryKey: ["/marketplace/check-if-shop-available", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // const shopAvailable = userShopData?.data?.shop_available === true;
  const shopAvailable = userShopData?.data?.has_package;
  const existingShopUrl = userShopData?.data?.shop_url;

  // Sync verification state whenever query data changes
  useEffect(() => {
    if (userVerifyData) {
      setIsUserVerified(userVerifyData.status === true);
      setVerificationInfo(userVerifyData.data ?? null);
    }
  }, [userVerifyData]);

  // Load user info & token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user_info");
    const storedToken = localStorage.getItem("access_token");

    if (storedUser) setUserInfo(JSON.parse(storedUser));
    if (storedToken) setAccessToken(storedToken);
  }, []);

  // Update user and save in localStorage
  const updateUserInfo = (user) => {
    setUserInfo(user);
    localStorage.setItem("user_info", JSON.stringify(user));
  };

  // Update access token and sync to localStorage
  const updateAccessToken = (token) => {
    setAccessToken(token);
    if (token) localStorage.setItem("access_token", token);
    else localStorage.removeItem("access_token");
  };

  // Logout and clear storage
  const logout = () => {
    setUserInfo(null);
    setAccessToken(null);
    setIsUserVerified(false);
    setVerificationInfo(null);
    localStorage.removeItem("user_info");
    localStorage.removeItem("access_token");
    router.push("/");
  };

  return (
    <AppContext.Provider
      value={{
        pathname,
        userInfo,
        accessToken,
        isUserVerified,
        verificationInfo,
        shopAvailable,
        existingShopUrl,
        countries,
        countriesLoading,
        uploadProgress,
        setUserInfo: updateUserInfo,
        setAccessToken: updateAccessToken,
        setUploadProgress,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy access
export const useAppContext = () => useContext(AppContext);