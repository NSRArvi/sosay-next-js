"use client";
import React from "react";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Plus } from "lucide-react";
import MyCampaignsList from "@/components/ads/MyCampaignsList";
import CreateCampaignForm from "@/components/ads/CreateCampaignForm";

export default function AddManagerPage() {
  const { accessToken, userInfo } = useAppContext();

  // Fetch my campaigns
  const {
    data: campaignsData,
    isLoading: campaignsLoading,
  } = useQuery({
    queryKey: ["/ads/campaigns/me", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  // Fetch personal posts for boost selection
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: [
      `/feed_management/private/feeds/all/post/${userInfo.id}`,
      accessToken,
    ],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const campaigns = campaignsData?.data || [];
  const posts = postsData?.data || [];

  return (
    <section className="max-w-4xl mx-auto space-y-6 px-4 mt-14 md:mt-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold dark:text-white mb-2">Boost Your Content</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your advertising campaigns and boost your posts
        </p>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="mb-6 gap-2 p-0 bg-transparent">
          <TabsTrigger value="campaigns" className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
            <List className="h-5 w-5" />
            <span>My Campaigns</span>
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
            <Plus className="h-5 w-5" />
            <span>Create Campaign</span>
          </TabsTrigger>
        </TabsList>

        {/* My Campaigns Tab */}
        <TabsContent value="campaigns">
          <MyCampaignsList 
          accessToken={accessToken}
          campaigns={campaigns} 
          isLoading={campaignsLoading} />
        </TabsContent>

        {/* Create Campaign Tab */}
        <TabsContent value="create">
          <CreateCampaignForm
            posts={posts}
            postsLoading={postsLoading}
            accessToken={accessToken}
            userInfo={userInfo}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
