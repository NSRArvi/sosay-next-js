"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Play, Users, LayoutDashboard, Tv, Star } from "lucide-react";
import ContentTab from "@/components/contents/ContentTab";
import MyContentTab from "@/components/contents/MyContentTab";
import FansTab from "@/components/contents/FansTab";
import MyCreatorsTab from "@/components/contents/MyCreatorsTab";
import UploadContentDialog from "@/components/contents/UploadContentDialog";
import ContentDetails from "@/components/contents/ContentDetails";
import { useAppContext } from "@/context/context";

export default function ContentPage() {
  const { accessToken, userInfo } = useAppContext();
  const [activeTab, setActiveTab] = useState("content");
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [activeContentId, setActiveContentId] = useState(null);

  if (activeContentId) {
    return (
      <section className="max-w-5xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
        <ContentDetails
          contentId={activeContentId}
          onBack={() => setActiveContentId(null)}
          onContentClick={setActiveContentId}
          accessToken={accessToken}
        />
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto space-y-4 mt-14 md:mt-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Content
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all your content
          </p>
        </div>
        <Button
          onClick={() => setOpenUploadDialog(true)}
          className="gap-2 bg-secondary hover:bg-secondary/90 cursor-pointer"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Upload Content</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="gap-2 bg-transparent p-0 h-auto w-auto flex-wrap mb-6">
          <TabsTrigger
            value="content"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-100 cursor-pointer"
          >
            <Tv className="h-4 w-4" />
            <span>Contents</span>
          </TabsTrigger>
          <TabsTrigger
            value="my-content"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100 cursor-pointer"
          >
            <Play className="h-4 w-4" />
            <span>My Contents</span>
          </TabsTrigger>
          <TabsTrigger
            value="fans"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900 data-[state=active]:text-pink-700 dark:data-[state=active]:text-pink-100 cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>Fans</span>
          </TabsTrigger>
          <TabsTrigger
            value="my-creators"
            className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-yellow-100 dark:data-[state=active]:bg-yellow-900 data-[state=active]:text-yellow-700 dark:data-[state=active]:text-yellow-100 cursor-pointer"
          >
            <Star className="h-4 w-4" />
            <span>My Creators</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <ContentTab
            accessToken={accessToken}
            onContentClick={setActiveContentId}
          />
        </TabsContent>

        <TabsContent value="my-content" className="space-y-6">
          <MyContentTab
            accessToken={accessToken}
            onUploadClick={() => setOpenUploadDialog(true)}
            onContentClick={setActiveContentId}
          />
        </TabsContent>

        <TabsContent value="fans" className="space-y-6">
          <FansTab accessToken={accessToken} userInfo={userInfo} />
        </TabsContent>

        <TabsContent value="my-creators" className="space-y-6">
          <MyCreatorsTab accessToken={accessToken} />
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <UploadContentDialog
        open={openUploadDialog}
        onOpenChange={setOpenUploadDialog}
        accessToken={accessToken}
        onUploadSuccess={() => setActiveTab("my-content")}
      />
    </section>
  );
}
