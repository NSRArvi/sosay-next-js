"use client";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWithToken } from "@/helpers/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Zap } from "lucide-react";
import toast from "react-hot-toast";
import SearchablePostSelector from "./SearchablePostSelector";

export default function CreateCampaignForm({
  posts,
  postsLoading,
  accessToken,
  userInfo,
}) {
  const queryClient = useQueryClient();

  // Form states
  const [boostableId, setBoostableId] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [targetCountryId, setTargetCountryId] = useState("");
  const [targetGender, setTargetGender] = useState("");
  const [targetMinAge, setTargetMinAge] = useState("");
  const [targetMaxAge, setTargetMaxAge] = useState("");

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async () => {
      if (!boostableId || !totalBudget || !durationDays) {
        throw new Error("Please fill in all required fields");
      }

      const formData = new FormData();
      formData.append("boostable_id", boostableId);
      formData.append(
        "boostable_type",
        "Modules\\FeedManagement\\app\\Models\\Post"
      );
      formData.append("total_budget", totalBudget);
      formData.append("duration_days", durationDays);

      if (targetCountryId)
        formData.append("target_country_id", targetCountryId);
      if (targetGender) formData.append("target_gender", targetGender);
      if (targetMinAge) formData.append("target_min_age", targetMinAge);
      if (targetMaxAge) formData.append("target_max_age", targetMaxAge);

      return await postWithToken("/ads/boost", formData, accessToken);
    },
    onSuccess: (data) => {
      if (data.status || data.success) {
        toast.success(data.message || "Campaign created successfully!");

        // Reset form
        setBoostableId("");
        setTotalBudget("");
        setDurationDays("");
        setTargetCountryId("");
        setTargetGender("");
        setTargetMinAge("");
        setTargetMaxAge("");

        // Refetch campaigns
        queryClient.invalidateQueries(["/ads/my-campaigns", accessToken]);
      } else {
        toast.error(data.message || "Failed to create campaign");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create campaign");
    },
  });

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    createCampaignMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>Boost a post to reach more people</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateCampaign} className="space-y-6">
          {/* Select Post - Searchable */}
          <div className="space-y-2">
            <Label>Select Post to Boost *</Label>
            <SearchablePostSelector
              posts={posts}
              isLoading={postsLoading}
              selectedPostId={boostableId}
              onSelectPost={setBoostableId}
            />
          </div>

          {/* Budget and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget ($) *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter budget"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">Minimum budget</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Days) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="Enter duration in days"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                min="1"
                max="365"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-500">Campaign duration</p>
            </div>
          </div>

          {/* Optional Targeting */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="font-semibold mb-4 text-sm">Optional Targeting</h3>

            {/* Gender */}
            <div className="space-y-2 mb-4">
              <Label htmlFor="gender">Target Gender</Label>
              <Select value={targetGender} onValueChange={setTargetGender}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="minAge">Minimum Age</Label>
                <Input
                  id="minAge"
                  type="number"
                  placeholder="Min age"
                  value={targetMinAge}
                  onChange={(e) => setTargetMinAge(e.target.value)}
                  min="13"
                  max="120"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAge">Maximum Age</Label>
                <Input
                  id="maxAge"
                  type="number"
                  placeholder="Max age"
                  value={targetMaxAge}
                  onChange={(e) => setTargetMaxAge(e.target.value)}
                  min="13"
                  max="120"
                  className="w-full"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Target Country</Label>
              <Select value={targetCountryId} onValueChange={setTargetCountryId}>
                <SelectTrigger id="country" className="w-full">
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">United States</SelectItem>
                  <SelectItem value="2">United Kingdom</SelectItem>
                  <SelectItem value="3">Canada</SelectItem>
                  <SelectItem value="4">Australia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={createCampaignMutation.isPending}
              className="flex-1 bg-secondary hover:bg-secondary/90"
            >
              {createCampaignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Create Campaign
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
