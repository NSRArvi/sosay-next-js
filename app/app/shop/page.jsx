"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingBag } from "lucide-react";
import Marketplace from "@/components/shop/Marketplace";
import UserShop from "@/components/shop/UserShop";
import ShopHeader from "@/components/shop/ShopHeader";
import { useAppContext } from "@/context/context";
import Link from "next/link";

export default function page() {
  const { shopAvailable } = useAppContext();
  return (
    <section className="max-w-5xl mx-auto space-y-5 mt-14 md:mt-8 p-4">
      {!shopAvailable && <ShopHeader />}
      <Tabs defaultValue="marketplace">
        <div className="flex justify-between items-center">
          <TabsList className="gap-2 bg-transparent p-0 mb-6">
            <TabsTrigger
              value="marketplace"
              className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-100 cursor-pointer"
            >
              <Store className="h-4 w-4" />
              <span>SPUMP Market</span>
            </TabsTrigger>
            <TabsTrigger
              value="shop"
              className="gap-2 rounded-full px-4 py-2 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-100 cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>My Ads</span>
            </TabsTrigger>
          </TabsList>

          <Link
            href="https://scottypumpkin.com/spump-escrow"
            className="gap-2 rounded-full text-xs px-4 py-1.5 border bg-secondary text-white cursor-pointer"
          >
            How to buy?
          </Link>
        </div>

        <TabsContent value="marketplace">
          <Marketplace />
        </TabsContent>

        <TabsContent value="shop">
          <UserShop />
        </TabsContent>
      </Tabs>
    </section>
  );
}
