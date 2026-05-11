"use client";
import React, { useState } from "react";
import {
  ShoppingBag,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  CreditCard,
  BarChart3,
  Target,
  Zap,
  Star,
  ChevronRight,
  Plus,
  ArrowRight,
  CheckCircle,
  Globe,
  Smartphone,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function BusinessSosay() {
  const [activeTab, setActiveTab] = useState("products");
  const [hoveredCard, setHoveredCard] = useState(null);

  const achieveData = [
    {
      icon: <TrendingUp className="w-8 h-8 text-pink-600" />,
      title: "Grow Awareness",
      description:
        "Leverage engaging content across posts, Stories, and Reels to showcase your brand and reach wider audiences organically.",
      metric: "3x more reach",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Get New Customers",
      description:
        "Convert visitors into buyers with seamless shopping experiences and targeted promotions directly on your profile.",
      metric: "45% conversion rate",
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Build Relationships",
      description:
        "Foster community through meaningful engagement, customer feedback, and subscription-based loyalty programs.",
      metric: "89% retention rate",
    },
  ];

  const businessFeatures = [
    {
      icon: <Package className="w-6 h-6" />,
      title: "Product Management",
      description:
        "Add, edit, and organize your products with rich media galleries and detailed specifications.",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Order Analytics",
      description:
        "Track sales, monitor inventory, and analyze customer behavior with real-time dashboards.",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Stripe Integration",
      description:
        "Secure payments directly to your Stripe account with automated invoicing and receipts.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Transactions",
      description:
        "Enterprise-grade security with fraud protection and PCI compliance for all payments.",
    },
  ];

  const boostSteps = [
    {
      step: "01",
      title: "Set Up Your Store",
      description:
        "Connect your Stripe account and configure your business profile with branding and contact information.",
    },
    {
      step: "02",
      title: "Add Your Products",
      description:
        "Upload product images, set prices, manage inventory, and create compelling product descriptions.",
    },
    {
      step: "03",
      title: "Launch & Promote",
      description:
        "Share your products through content, boost posts as ads, and engage with your growing customer base.",
    },
    {
      step: "04",
      title: "Manage & Scale",
      description:
        "Process orders, track analytics, and optimize your strategy based on performance insights.",
    },
  ];

  const faqData = [
    {
      title: "How do I connect my Stripe account?",
      details:
        "Simply go to Business Settings > Payment Methods and follow the secure Stripe Connect flow to link your account. Payments will be deposited directly to your bank account.",
    },
    {
      title: "What fees does Sosay charge?",
      details:
        "Sosay takes a small platform fee of 3% per transaction. Stripe's standard processing fees also apply. No monthly fees or setup costs.",
    },
    {
      title: "Can I manage inventory and orders?",
      details:
        "Yes! Our business dashboard provides complete inventory management, order tracking, customer communications, and sales analytics.",
    },
    {
      title: "How do customers discover my products?",
      details:
        "Products appear in your profile, the Sosay marketplace, and can be promoted through boosted posts and targeted advertising to reach new customers.",
    },
  ];

  const stats = [
    {
      label: "Active Sellers",
      value: "25K+",
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      label: "Monthly Sales",
      value: "$2.4M",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: "Products Listed",
      value: "180K+",
      icon: <Package className="w-5 h-5" />,
    },
    {
      label: "Customer Satisfaction",
      value: "98%",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-pink-50 via-white to-blue-50 min-h-screen text-gray-900 py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative mx-5 md:container md:mx-auto flex flex-col gap-8 lg:flex-row md:items-center md:gap-16 py-20">
        <div className="flex flex-col gap-6 lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-pink-200 w-fit">
            <Zap className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-medium text-pink-600">
              Business Solutions
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Transform your passion into
            <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              profitable business
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed">
            Launch your online store, manage products, process orders, and
            receive payments directly through your Stripe account. All
            integrated seamlessly with your social presence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              href={"https://bfinit.com/bfinit-ecomerce-platform"}
              target="_blank"
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Selling Now
            </Link>
            <Link
              href={"https://shop.bfinit.com/stores/695b75e764517ee399752724"}
              target="_blank"
              className="px-8 py-4 border-2 border-pink-500 rounded-full text-pink-600 font-semibold transition-all duration-300 hover:bg-pink-50"
            >
              View Demo Store
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 bg-white/80 backdrop-blur-sm rounded-lg border-2 border-gray-100 hover:border-pink-200 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center justify-center mb-2 text-pink-600">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="relative bg-white/90 backdrop-blur-md rounded-2xl border-2 border-gray-200 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                Business Dashboard
              </h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex gap-2 mb-6">
              {["products", "orders", "analytics"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Dashboard Content */}
            <div className="space-y-4">
              {activeTab === "products" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded"></div>
                      <div>
                        <div className="font-medium text-gray-800">
                          Premium T-Shirt
                        </div>
                        <div className="text-sm text-gray-600">
                          In Stock: 45
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold">$29.99</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded"></div>
                      <div>
                        <div className="font-medium text-gray-800">
                          Designer Mug
                        </div>
                        <div className="text-sm text-gray-600">
                          In Stock: 23
                        </div>
                      </div>
                    </div>
                    <div className="text-green-600 font-semibold">$15.99</div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-800">#ORD-001</div>
                      <div className="text-sm text-gray-600">John Doe</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">$89.97</div>
                      <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Paid
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-800">#ORD-002</div>
                      <div className="text-sm text-gray-600">Jane Smith</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-semibold">$45.98</div>
                      <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                        Pending
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "analytics" && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Revenue</span>
                      <span className="text-green-600 font-semibold">+23%</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      $12,450
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Orders</span>
                      <span className="text-green-600 font-semibold">+18%</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">156</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Business Features */}
      <div className="relative mx-5 md:container md:mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              succeed online
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete business toolkit with integrated payments, inventory
            management, and customer analytics
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businessFeatures.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-white/80 backdrop-blur-md rounded-xl border-2 border-gray-100 hover:border-pink-200 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-white">
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

      {/* Achievement Section */}
      <div className="relative mx-5 md:container md:mx-auto py-20">
        <div className="text-center mb-16">
          <p className="text-pink-600 font-semibold text-sm uppercase mb-4">
            What do you want to achieve?
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Get results that matter throughout the customer journey
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {achieveData.map((data, index) => (
            <div key={index} className="text-center group">
              <div className="mb-6 flex justify-center">
                <div className="bg-pink-100 rounded-full p-4 group-hover:bg-pink-200 transition-all duration-300">
                  {data.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                {data.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {data.description}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full border border-green-200">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {data.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started Steps */}
      <div className="relative mx-5 md:container md:mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Start selling in four simple steps
          </h2>
          <p className="text-xl text-gray-600">
            From setup to your first sale in minutes, not hours
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {boostSteps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                {index < boostSteps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-0.5 bg-gradient-to-r from-pink-300 to-transparent ml-4"></div>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-pink-600 transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative mx-5 md:container md:mx-auto py-20">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently asked
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Got questions about Sosay Business? We've got answers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-md rounded-xl border-2 border-gray-100 p-6 hover:bg-white hover:border-pink-200 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-pink-600 transition-colors duration-300 flex-1">
                  {faq.title}
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 group-hover:rotate-90 transition-all duration-300 flex-shrink-0 ml-4" />
              </div>
              <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">
                {faq.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-20">
        <div className="mx-5 md:container md:mx-auto text-center">
          <p className="text-white font-semibold text-sm uppercase mb-4">
            Let's get started
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            Ready to grow your business with Sosay?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of creators who've transformed their passion into
            profitable businesses
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={"https://bfinit.com/bfinit-ecomerce-platform"}
              target="_blank"
              className="px-8 py-4 bg-white text-pink-600 hover:bg-gray-100 font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Start Selling Now
            </Link>
            <Link
              href={"https://shop.bfinit.com/stores/695b75e764517ee399752724"}
              target="_blank"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="relative mx-5 md:container md:mx-auto py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <div className="font-semibold text-gray-800">Secure Payments</div>
              <div className="text-sm text-gray-600">
                256-bit SSL encryption
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Globe className="w-8 h-8 text-blue-600" />
            <div>
              <div className="font-semibold text-gray-800">Global Reach</div>
              <div className="text-sm text-gray-600">Sell worldwide</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Smartphone className="w-8 h-8 text-purple-600" />
            <div>
              <div className="font-semibold text-gray-800">
                Mobile Optimized
              </div>
              <div className="text-sm text-gray-600">Perfect on any device</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
