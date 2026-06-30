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

export default function FansTab({ accessToken }) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Creator Profile
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                  Tell your audience what makes your content special.
                </p>
              </div>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-600 rounded-md hover:bg-blue-100 transition-colors shadow-sm text-sm font-medium dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl">
                      Edit Profile & Pricing
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
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 transition-colors mt-4"
                    >
                      {updateMutation.isLoading
                        ? "Saving changes..."
                        : "Save Changes"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoadingProfile ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700/50">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                  {profileData?.data?.bio ||
                    "You haven't added a bio yet. Click 'Edit' to tell your audience about your premium content."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats & Integrations Column */}
        <div className="space-y-4">
          {/* Subscription Price Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">
              Monthly Subscription
            </h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${profileData?.data?.subscription_price || "0.00"}
              </span>
              <span className="text-gray-500 text-sm font-medium">/mo</span>
            </div>
          </div>

          {/* Stripe Card */}
          {stripeStatusData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Payouts
                </h3>
              </div>

              {!stripeStatusData.data?.is_ready ? (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Connect your Stripe account to start receiving subscription earnings.
                  </p>
                  <button
                    onClick={() => stripeOnboardMutation.mutate()}
                    disabled={stripeOnboardMutation.isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {stripeOnboardMutation.isLoading
                      ? "Connecting..."
                      : "Connect Stripe"}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Stripe is connected
                    </span>
                  </div>
                  <button
                    onClick={() => stripeOnboardMutation.mutate()}
                    disabled={stripeOnboardMutation.isLoading}
                    className="w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {stripeOnboardMutation.isLoading
                      ? "Please wait..."
                      : "Change Account"}
                  </button>
                </div>
              )}
            </div>
          )}
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
