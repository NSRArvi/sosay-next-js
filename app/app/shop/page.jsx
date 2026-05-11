import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingBag } from "lucide-react";
import Marketplace from "@/components/shop/Marketplace";
import UserShop from "@/components/shop/UserShop";
import ShopHeader from "@/components/shop/ShopHeader";

export default function page() {
  return (
    <section className="max-w-5xl mx-auto space-y-5 mt-14 md:mt-8 p-4">
      <ShopHeader/>
      <Tabs defaultValue="marketplace">
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
