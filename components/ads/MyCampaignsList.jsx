"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp } from "lucide-react";
import CampaignSkeleton from "./CampaignSkeleton";

export default function MyCampaignsList({ campaigns, isLoading }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const calculateProgress = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, index) => (
          <CampaignSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Zap className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">No campaigns yet</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Create your first campaign to boost your content
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {campaigns.map((campaign) => {
        const progress = calculateProgress(campaign.start_date, campaign.end_date);
        const postDescription = campaign.boostable?.description
          ? stripHtml(campaign.boostable.description)
          : "Post content unavailable";

        return (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">Campaign #{campaign.id}</CardTitle>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        campaign.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : campaign.status === "completed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {campaign.status?.charAt(0).toUpperCase() +
                        campaign.status?.slice(1)}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-1">
                    {postDescription}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Budget and Spending */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Budget</p>
                  <p className="text-lg font-semibold">${parseFloat(campaign.total_budget).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Spent</p>
                  <p className="text-lg font-semibold">${parseFloat(campaign.spent_amount).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                  <p className="text-lg font-semibold">
                    ${(parseFloat(campaign.total_budget) - parseFloat(campaign.spent_amount)).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Campaign Progress
                  </p>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {progress}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-secondary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Start Date</p>
                  <p className="font-medium">{formatDate(campaign.start_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">End Date</p>
                  <p className="font-medium">{formatDate(campaign.end_date)}</p>
                </div>
              </div>

              {/* Targeting Info */}
              {(campaign.target_gender ||
                campaign.target_min_age ||
                campaign.target_country_id) && (
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Targeting
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {campaign.target_gender && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2.5 py-1 rounded-full">
                        {campaign.target_gender?.charAt(0).toUpperCase() +
                          campaign.target_gender?.slice(1)}
                      </span>
                    )}
                    {(campaign.target_min_age || campaign.target_max_age) && (
                      <span className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2.5 py-1 rounded-full">
                        Age {campaign.target_min_age || "13"}-
                        {campaign.target_max_age || "65"}
                      </span>
                    )}
                    {campaign.target_country_id && (
                      <span className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-2.5 py-1 rounded-full">
                        Country: {campaign.target_country_id}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Post ID: {campaign.boostable_id}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Created {formatDate(campaign.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
