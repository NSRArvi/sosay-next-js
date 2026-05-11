"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Ban, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const FansTab = ({ fans = [], stats = {} }) => {
  const [blockingId, setBlockingId] = useState(null);
  const [messageOpen, setMessageOpen] = useState(null);

  const handleMessage = (fanId) => {
    // TODO: Open message dialog or navigate to chat
    setMessageOpen(fanId);
    toast.success("Opening message...");
  };

  const handleBlock = async (fanId) => {
    setBlockingId(fanId);
    try {
      // TODO: Call API to block fan
      toast.success("Fan blocked successfully");
    } catch (error) {
      toast.error("Failed to block fan");
    } finally {
      setBlockingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Fans Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0">
          <div className="space-y-2">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-300">
              Total Fans
            </p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {stats.totalFans || 0}
            </p>
          </div>
        </Card>

        {/* Premium Subscribers Card */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0">
          <div className="space-y-2">
            <p className="text-sm font-medium text-purple-600 dark:text-purple-300">
              Premium Subscribers
            </p>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
              {stats.premiumSubscribers || 0}
            </p>
          </div>
        </Card>

        {/* New This Month Card */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-0">
          <div className="space-y-2">
            <p className="text-sm font-medium text-green-600 dark:text-green-300">
              New This Month
            </p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              {stats.newThisMonth || 0}
            </p>
          </div>
        </Card>
      </div>

      {/* Fans List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Your Fans
        </h3>
        {fans && fans.length > 0 ? (
          <div className="space-y-3">
            {fans.map((fan) => (
              <div
                key={fan.id}
                className="p-4 flex items-center gap-2 bg-white shadow hover:shadow-md transition-shadow rounded-xl"
              >

                  {/* User Avatar */}
                  <div className="relative h-12 w-12 flex-shrink-0">
                    {!fan.profileImage ? (
                      <Image
                        src={fan.profileImage}
                        alt={fan.name}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {fan.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Fan Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {fan.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Subscribed{" "}
                      {fan.subscribedDate
                        ? new Date(fan.subscribedDate).toLocaleDateString()
                        : "Recently"}
                    </p>
                  </div>

                  {/* Premium Badge */}
                  {fan.isPremium && (
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-200">
                        Premium
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMessage(fan.id)}
                      className="gap-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Message</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleBlock(fan.id)}
                      disabled={blockingId === fan.id}
                      className="gap-1"
                    >
                      {blockingId === fan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Ban className="h-4 w-4" />
                      )}
                      <span className="hidden sm:inline">Block</span>
                    </Button>
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No fans yet. Keep creating amazing content!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FansTab;
