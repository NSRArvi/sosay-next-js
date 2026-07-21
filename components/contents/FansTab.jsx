"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import {
  User,
  Users,
  Pencil,
  CheckCircle,
  CreditCard,
  Sparkles,
  DollarSign,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function SubscriberSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm mb-3">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-4 w-16 ml-auto" />
        <Skeleton className="h-4 w-12 ml-auto rounded-md" />
      </div>
    </div>
  );
}

export default function FansTab({ accessToken, userInfo }) {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const [bio, setBio] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Bio & Subscription Query
  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["/contents/me/bio", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Stripe Status Query
  const { data: stripeStatusData } = useQuery({
    queryKey: ["/onboarding/status", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (profileData?.data) {
      setBio(profileData.data.bio || "");
      setSubscriptionPrice(profileData.data.subscription_price || "");
    }
  }, [profileData]);

  const updateMutation = useMutation({
    mutationFn: (formData) =>
      postWithToken("/contents/profile/pricing", formData, accessToken),
    onSuccess: (res) => {
      if (res.status) {
        toast.success(
          res.message || "Profile and pricing updated successfully!",
        );
        queryClient.invalidateQueries({ queryKey: ["/contents/me/bio"] });
        setIsOpen(false);
      } else {
        toast.error("Failed to update profile.");
      }
    },
    onError: () => {
      toast.error("An error occurred while updating.");
    },
  });

  const stripeOnboardMutation = useMutation({
    mutationFn: () => postWithToken("/onboarding/url", {}, accessToken),
    onSuccess: (res) => {
      if (res.status && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.message || "Failed to generate Stripe onboarding URL.");
      }
    },
    onError: () => {
      toast.error("An error occurred while connecting to Stripe.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subscription_price", subscriptionPrice);
    formData.append("bio", bio);
    updateMutation.mutate(formData);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["/contents/subscribers", accessToken, page],
    queryFn: () =>
      fetchWithToken({
        queryKey: [`/contents/subscribers?page=${page}`, accessToken],
      }),
    enabled: !!accessToken,
    keepPreviousData: true,
  });

  const subscribers = data?.data || [];
  const paginationData = data?.pagination || null;

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      {/* Dashboard Top Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800 dark:border-gray-700 relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full relative bg-gray-200 dark:bg-gray-700">
          {userInfo?.user_cover_image ? (
            <img
              src={userInfo.user_cover_image}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600"></div>
          )}

          {/* Edit Button overlay */}
          <div className="absolute top-4 right-4 z-20">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur border border-gray-200/50 text-gray-700 rounded-full hover:bg-white transition-colors shadow-sm text-sm font-medium dark:bg-gray-900/80 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                  <Pencil className="w-4 h-4" />
                  Edit Dashboard
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Update Dashboard
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      Subscription Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={subscriptionPrice}
                      onChange={(e) => setSubscriptionPrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="0.00"
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Platform fee is 10%. You keep 90% of earnings.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-200 rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                      placeholder="Welcome to my premium feed! Here you'll find..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={updateMutation.isLoading}
                    className="w-full py-2 bg-secondary hover:bg-secondary/95 text-white font-medium rounded-full disabled:opacity-50 transition-colors mt-4"
                  >
                    {updateMutation.isLoading
                      ? "Saving changes..."
                      : "Save Changes"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-6 mb-6 relative z-10">
            {/* User Image */}
            <div className="relative -mt-16 md:-mt-20 shrink-0">
              {userInfo?.user_image ? (
                <img
                  src={userInfo.user_image}
                  alt="Profile"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md bg-white"
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Name and Bio */}
            <div className="flex-1 pb-2 md:pt-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {userInfo?.name || "Creator"}
              </h1>
              {isLoadingProfile ? (
                <div className="h-4 bg-gray-100 rounded w-1/2 mt-2 animate-pulse"></div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed max-w-2xl whitespace-pre-wrap">
                  {profileData?.data?.bio ||
                    "You haven't added a bio yet. Click 'Edit Profile' to tell your audience about your premium content."}
                </p>
              )}
            </div>
          </div>

          {/* Pricing & Stripe Bottom Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-700/50">
            {/* Subscription Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Monthly Subscription
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${profileData?.data?.subscription_price || "0.00"}
                  </span>
                  <span className="text-sm font-medium text-gray-500">/mo</span>
                </div>
              </div>
            </div>

            {/* Stripe Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${stripeStatusData?.data?.is_ready ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"}`}
              >
                <Wallet className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Stripe Payouts
                </p>
                {stripeStatusData?.data?.is_ready ? (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-500" />{" "}
                      Connected
                    </span>
                    <button
                      onClick={() => stripeOnboardMutation.mutate()}
                      disabled={stripeOnboardMutation.isLoading}
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
                    >
                      {stripeOnboardMutation.isLoading
                        ? "Changing..."
                        : "Change Account"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                      Not Connected
                    </span>
                    <button
                      onClick={() => stripeOnboardMutation.mutate()}
                      disabled={stripeOnboardMutation.isLoading}
                      className="text-xs font-medium bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                      {stripeOnboardMutation.isLoading
                        ? "Connecting..."
                        : "Connect"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribers Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Your Subscribers
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SubscriberSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-10 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
            <p className="font-medium text-sm">Failed to load subscribers.</p>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              No subscribers yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {subscribers.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-gray-600">
                  {sub.subscriber?.profile_picture ? (
                    <img
                      src={sub.subscriber.profile_picture}
                      alt={sub.subscriber.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    {sub.subscriber?.name || "Unknown User"}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-medium bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">
                      ${sub.price_paid}
                    </div>
                    <div className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium">
                      +${sub.creator_earnings} Earned
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-md h-8 px-3 text-xs font-medium"
                    asChild
                  >
                    <Link href={`/app/profile/${sub.subscriber?.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {paginationData?.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="cursor-pointer rounded-md h-9 px-3 text-sm"
                >
                  Previous
                </Button>
                <div className="flex gap-1">
                  {Array.from(
                    { length: paginationData.last_page },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <Button
                      key={p}
                      variant={page === p ? "default" : "outline"}
                      onClick={() => handlePageChange(p)}
                      className="w-9 h-9 p-0 cursor-pointer rounded-md text-sm"
                    >
                      {p}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === paginationData.last_page}
                  className="cursor-pointer rounded-md h-9 px-3 text-sm"
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
