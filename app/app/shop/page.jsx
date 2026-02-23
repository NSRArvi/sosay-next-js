"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Marketplace from "@/components/shop/Marketplace";
import UserShop from "@/components/shop/UserShop";

export default function page() {
  return (
    <section className="max-w-5xl mx-auto space-y-5 mt-14 md:mt-8 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shop</h1>
        <p className="text-gray-600">
          Buy and sell items with your campus community. Browse the marketplace or manage your own shop.
        </p>
      </div>
      
      <Tabs defaultValue="marketplace">
        <TabsList>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="shop">My Shop</TabsTrigger>
        </TabsList>

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