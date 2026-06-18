import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

export default function DashboardTab() {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [bio, setBio] = useState("");
  const [subscriptionPrice, setSubscriptionPrice] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["/contents/me/bio", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (data?.data) {
      setBio(data.data.bio || "");
      setSubscriptionPrice(data.data.subscription_price || "");
    }
  }, [data]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subscription_price", subscriptionPrice);
    formData.append("bio", bio);
    updateMutation.mutate(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow dark:bg-gray-800 overflow-hidden relative">
      {/* Cover Image */}
      {userInfo?.user_cover_image ? (
        <img
          src={userInfo.user_cover_image}
          alt="Cover"
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
      )}

      {/* Profile Image & Edit Button */}
      <div className="px-6 relative">
        <div className="flex justify-between items-end -mt-12 mb-4">
          <div className="relative">
            {userInfo?.user_image ? (
              <img
                src={userInfo.user_image}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200"></div>
            )}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm text-sm font-medium">
                <Pencil className="w-4 h-4" />
                Edit Bio
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile & Pricing</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subscription Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={subscriptionPrice}
                    onChange={(e) => setSubscriptionPrice(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 15.00"
                    required
                  />
                  <label className="block text-xs font-medium text-secondary dark:text-gray-300 mt-1">
                    System will take 10% of your subscription fee.
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Tell your subscribers about your premium content..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updateMutation.isLoading}
                  className="w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2"
                >
                  {updateMutation.isLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* User Info */}
        <div className="pb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {userInfo?.name || "Creator Name"}
          </h2>

          {isLoading ? (
            <p className="text-gray-500 mt-2 animate-pulse">Loading bio...</p>
          ) : (
            <div className="mt-3">
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {data?.data?.bio || "No bio added yet."}
              </p>

              <div className="mt-4 inline-flex items-center text-sm px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium border border-blue-100 dark:border-blue-800/50">
                <span className="mr-2">Subscription:</span>
                <span className="text-lg font-bold">
                  ${data?.data?.subscription_price || "0.00"}
                </span>
                <span className="text-sm font-normal ml-1 opacity-80">
                  / month
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
