"use client";
import React, { useState } from "react";
import {
  Video,
  Users,
  DollarSign,
  BarChart3,
  Star,
  Wallet,
  Play,
  Upload,
  Settings,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Calendar,
  Crown,
  Zap,
  Gift,
  CreditCard,
  Bell,
  Lock,
  Unlock,
  ArrowUp,
  PlusCircle,
  Edit,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

export default function Creators() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPricing, setSelectedPricing] = useState("monthly");

  const creatorStats = {
    totalSubscribers: 12847,
    monthlyRevenue: 8924,
    totalViews: 284729,
    starsReceived: 1492,
    walletBalance: 15847.32,
  };

  const recentVideos = [
    {
      id: 1,
      title: "Building My Dream Studio Setup",
      thumbnail:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      views: 15420,
      likes: 892,
      comments: 134,
      duration: "12:45",
      type: "Premium",
      uploadDate: "2 days ago",
    },
    {
      id: 2,
      title: "Daily Vlog: Behind the Scenes",
      thumbnail:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      views: 8734,
      likes: 456,
      comments: 78,
      duration: "8:32",
      type: "Free",
      uploadDate: "5 days ago",
    },
    {
      id: 3,
      title: "Exclusive Tutorial: Advanced Techniques",
      thumbnail:
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      views: 22105,
      likes: 1247,
      comments: 203,
      duration: "18:21",
      type: "Premium",
      uploadDate: "1 week ago",
    },
  ];

  const subscriptionTiers = [
    {
      name: "Basic",
      price: 9.99,
      features: [
        "Access to premium videos",
        "Monthly live streams",
        "Community access",
        "Early video access",
      ],
    },
    {
      name: "Premium",
      price: 19.99,
      features: [
        "All Basic features",
        "1-on-1 monthly chat",
        "Exclusive behind-the-scenes",
        "Custom requests",
        "Priority support",
      ],
    },
    {
      name: "VIP",
      price: 49.99,
      features: [
        "All Premium features",
        "Weekly video calls",
        "Personal mentorship",
        "Exclusive merchandise",
        "Direct phone access",
      ],
    },
  ];

  const recentTransactions = [
    {
      type: "Subscription",
      amount: 19.99,
      user: "Sarah M.",
      date: "2 hours ago",
    },
    { type: "Stars", amount: 5.0, user: "Mike K.", date: "4 hours ago" },
    {
      type: "Subscription",
      amount: 9.99,
      user: "Emma R.",
      date: "6 hours ago",
    },
    { type: "Stars", amount: 12.5, user: "Alex T.", date: "1 day ago" },
  ];

  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen text-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative mx-5 md:container md:mx-auto pt-40 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-pink-200 w-fit mb-6">
            <Crown className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-medium text-pink-600">
              Creator Hub
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Turn your passion into
            <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              profitable content
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Create exclusive videos and reels, build your fanbase, and monetize
            your content through subscriptions, stars, and direct fan
            engagement.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={"/register"}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
            >
              <Video className="w-5 h-5" />
              Start Creating
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 p-6 text-center hover:shadow-xl transition-all duration-300">
            <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {creatorStats.totalSubscribers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Subscribers</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 p-6 text-center hover:shadow-xl transition-all duration-300">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              ${creatorStats.monthlyRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Revenue</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 p-6 text-center hover:shadow-xl transition-all duration-300">
            <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {creatorStats.totalViews.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 p-6 text-center hover:shadow-xl transition-all duration-300">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              {creatorStats.starsReceived.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Stars Received</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 p-6 text-center hover:shadow-xl transition-all duration-300">
            <Wallet className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">
              ${creatorStats.walletBalance.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Wallet Balance</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="relative mx-5 md:container md:mx-auto pb-20">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: <BarChart3 className="w-4 h-4" />,
            },
            {
              id: "content",
              label: "Content",
              icon: <Video className="w-4 h-4" />,
            },
            {
              id: "subscribers",
              label: "Fans",
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "pricing",
              label: "Pricing",
              icon: <CreditCard className="w-4 h-4" />,
            },
            {
              id: "wallet",
              label: "Wallet",
              icon: <Wallet className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                  : "bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800 border-2 border-gray-100 hover:border-pink-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <button className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 hover:bg-white transition-all duration-300 hover:shadow-xl text-left group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Upload New Content
                    </h3>
                    <p className="text-sm text-gray-600">
                      Create videos & reels
                    </p>
                  </div>
                </div>
              </button>

              <button className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 hover:bg-white transition-all duration-300 hover:shadow-xl text-left group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Notify Fans
                    </h3>
                    <p className="text-sm text-gray-600">
                      Send updates to subscribers
                    </p>
                  </div>
                </div>
              </button>

              <button className="p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 hover:bg-white transition-all duration-300 hover:shadow-xl text-left group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-3 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      View Analytics
                    </h3>
                    <p className="text-sm text-gray-600">Track performance</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <DollarSign className="w-6 h-6 text-green-600" />
                Recent Earnings
              </h3>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${transaction.type === "Subscription" ? "bg-pink-100" : "bg-yellow-100"}`}
                      >
                        {transaction.type === "Subscription" ? (
                          <Crown className="w-4 h-4 text-pink-600" />
                        ) : (
                          <Star className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {transaction.type} from {transaction.user}
                        </div>
                        <div className="text-sm text-gray-600">
                          {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold">
                      +${transaction.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-8">
            {/* Content Upload Area */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-8 text-center">
              <div className="mb-6">
                <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-gray-800">
                  Upload New Content
                </h3>
                <p className="text-gray-600">
                  Drag and drop your videos or click to browse
                </p>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-pink-500 transition-colors duration-300">
                <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                  Choose Files
                </button>
              </div>
            </div>

            {/* Recent Videos */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Your Content
                </h3>
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full text-white font-medium transition-colors duration-300 flex items-center gap-2 shadow-lg">
                  <PlusCircle className="w-4 h-4" />
                  New Video
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentVideos.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute top-2 left-2">
                        {video.type === "Premium" ? (
                          <div className="flex items-center gap-1 px-2 py-1 bg-pink-500 rounded-full text-xs font-medium text-white">
                            <Lock className="w-3 h-3" />
                            Premium
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 bg-green-500 rounded-full text-xs font-medium text-white">
                            <Unlock className="w-3 h-3" />
                            Free
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                        {video.duration}
                      </div>
                    </div>
                    <h4 className="font-medium mb-2 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {video.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {video.likes.toLocaleString()}
                        </span>
                      </div>
                      <button className="hover:text-gray-800 transition-colors duration-300">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "subscribers" && (
          <div className="space-y-8">
            {/* Fan Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6 text-center">
                <Users className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">12,847</div>
                <div className="text-sm text-gray-600">Total Fans</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6 text-center">
                <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">8,432</div>
                <div className="text-sm text-gray-600">Premium Subscribers</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6 text-center">
                <ArrowUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">+347</div>
                <div className="text-sm text-gray-600">New This Month</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6 text-center">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">94%</div>
                <div className="text-sm text-gray-600">Retention Rate</div>
              </div>
            </div>

            {/* Fan Management */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Manage Your Fans
              </h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((fan) => (
                  <div
                    key={fan}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-semibold">
                        U{fan}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          User {fan}
                        </div>
                        <div className="text-sm text-gray-600">
                          Premium Subscriber • 6 months
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors duration-300">
                        Message
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors duration-300">
                        Block
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-8">
            {/* Pricing Toggle */}
            <div className="text-center">
              <div className="inline-flex bg-white/80 border-2 border-gray-200 rounded-full p-1 mb-8">
                <button
                  onClick={() => setSelectedPricing("monthly")}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedPricing === "monthly"
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                      : "text-gray-600"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPricing("yearly")}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedPricing === "yearly"
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                      : "text-gray-600"
                  }`}
                >
                  Yearly (Save 20%)
                </button>
              </div>
            </div>

            {/* Subscription Tiers */}
            <div className="grid md:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">
                      {tier.name}
                    </h3>
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      $
                      {selectedPricing === "yearly"
                        ? (tier.price * 12 * 0.8).toFixed(2)
                        : tier.price}
                      <span className="text-sm text-gray-600">
                        /{selectedPricing === "yearly" ? "year" : "month"}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
                    <Edit className="w-4 h-4" />
                    Edit Tier
                  </button>
                </div>
              ))}
            </div>

            {/* Stars System */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <Star className="w-6 h-6 text-yellow-500" />
                Stars System
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4 text-gray-800">
                    How Stars Work
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Fans can buy stars from Sosay</li>
                    <li>• They send stars during live streams or on posts</li>
                    <li>• Each star = $0.01 USD to you</li>
                    <li>• Stars encourage fan interaction</li>
                    <li>• Instant notifications when you receive stars</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold mb-4 text-gray-800">
                    Star Packages for Fans
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>100 Stars</span>
                      <span className="text-green-600 font-semibold">
                        $1.99
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>500 Stars</span>
                      <span className="text-green-600 font-semibold">
                        $8.99
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>1000 Stars</span>
                      <span className="text-green-600 font-semibold">
                        $16.99
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>5000 Stars</span>
                      <span className="text-green-600 font-semibold">
                        $79.99
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div className="space-y-8">
            {/* Wallet Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6 text-center">
                <Wallet className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  ${creatorStats.walletBalance.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Available Balance</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6 text-center">
                <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">$2,450</div>
                <div className="text-sm text-gray-600">Pending Payouts</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6 text-center">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">Dec 15</div>
                <div className="text-sm text-gray-600">Next Payout</div>
              </div>
            </div>

            {/* Cashout Options */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-800">
                <CreditCard className="w-6 h-6 text-green-600" />
                Cashout Options
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <button className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-pink-200 transition-all duration-300 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          Bank Transfer
                        </div>
                        <div className="text-sm text-gray-600">
                          2-3 business days
                        </div>
                      </div>
                    </div>
                  </button>

                  <button className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-pink-200 transition-all duration-300 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">PayPal</div>
                        <div className="text-sm text-gray-600">
                          Instant transfer
                        </div>
                      </div>
                    </div>
                  </button>

                  <button className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-pink-200 transition-all duration-300 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          Crypto Wallet
                        </div>
                        <div className="text-sm text-gray-600">
                          USFRANC or other currencies
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold mb-4 text-gray-800">
                    Quick Cashout
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Amount to withdraw
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Withdrawal method
                      </label>
                      <select className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-pink-500">
                        <option value="">Select method</option>
                        <option value="bank">Bank Transfer</option>
                        <option value="paypal">PayPal</option>
                        <option value="crypto">Crypto Wallet</option>
                      </select>
                    </div>
                    <button className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                      Withdraw Funds
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">
                Transaction History
              </h3>
              <div className="space-y-4">
                {[
                  {
                    type: "Withdrawal",
                    amount: -2500,
                    method: "Bank Transfer",
                    date: "2 days ago",
                    status: "Completed",
                  },
                  {
                    type: "Subscription Revenue",
                    amount: 847,
                    method: "Premium Tier",
                    date: "3 days ago",
                    status: "Completed",
                  },
                  {
                    type: "Stars Revenue",
                    amount: 156,
                    method: "Fan Gifts",
                    date: "4 days ago",
                    status: "Completed",
                  },
                  {
                    type: "Withdrawal",
                    amount: -1200,
                    method: "PayPal",
                    date: "1 week ago",
                    status: "Completed",
                  },
                ].map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "Withdrawal"
                            ? "bg-red-100"
                            : "bg-green-100"
                        }`}
                      >
                        {transaction.type === "Withdrawal" ? (
                          <ArrowUp className="w-4 h-4 text-red-600 rotate-180" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">
                          {transaction.type}
                        </div>
                        <div className="text-sm text-gray-600">
                          {transaction.method} • {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-semibold ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}$
                        {Math.abs(transaction.amount)}
                      </div>
                      <div className="text-xs text-green-600">
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Features Showcase */}
      <div className="relative mx-5 md:container md:mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              succeed as a creator
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools and features designed to help you create, engage, and
            monetize your content
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Video className="w-8 h-8" />,
              title: "Video & Reels Creation",
              description:
                "Upload high-quality videos and create engaging reels with built-in editing tools and filters.",
              color: "from-pink-500 to-rose-500",
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Fan Management",
              description:
                "Track your subscribers, send personalized messages, and build stronger relationships with your audience.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: <Crown className="w-8 h-8" />,
              title: "Subscription Tiers",
              description:
                "Create multiple subscription levels with different perks and pricing to maximize your revenue.",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "Stars & Gifts",
              description:
                "Receive virtual gifts and stars from fans during live streams and on your content.",
              color: "from-yellow-500 to-orange-500",
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Advanced Analytics",
              description:
                "Deep insights into your content performance, audience demographics, and revenue trends.",
              color: "from-green-500 to-emerald-500",
            },
            {
              icon: <Wallet className="w-8 h-8" />,
              title: "Secure Wallet",
              description:
                "Safe and secure wallet with multiple cashout options including crypto, PayPal, and bank transfers.",
              color: "from-indigo-500 to-purple-500",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-100 hover:border-pink-200 hover:bg-white hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`bg-gradient-to-r ${feature.color} rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-white`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-20">
        <div className="mx-5 md:container md:mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Creator Success Stories
            </h2>
            <p className="text-xl text-white/90">
              See how creators are building thriving businesses on Sosay
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                earnings: "$12,500/month",
                subscribers: "15.2K",
                content: "Fitness & Wellness",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Mike Chen",
                earnings: "$8,900/month",
                subscribers: "9.8K",
                content: "Tech Reviews",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              },
              {
                name: "Emma Rodriguez",
                earnings: "$15,800/month",
                subscribers: "22.1K",
                content: "Cooking & Recipes",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
              },
            ].map((creator, index) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-xl border-2 border-white/20 p-6 text-center group hover:bg-white transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={creator.image}
                  alt={creator.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {creator.name}
                </h3>
                <p className="text-gray-600 mb-4">{creator.content}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Earnings:</span>
                    <span className="text-green-600 font-semibold">
                      {creator.earnings}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subscribers:</span>
                    <span className="text-blue-600 font-semibold">
                      {creator.subscribers}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative mx-5 md:container md:mx-auto py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Ready to start your creator journey?
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Join thousands of creators who are already building successful
          businesses and connecting with their fans on Sosay
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href={"/register"} className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center">
            <Crown className="w-5 h-5" />
            Become a Creator
          </Link>
        </div>
      </div>
    </section>
  );
}
