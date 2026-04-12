import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Marketplace from "@/components/shop/Marketplace";
import UserShop from "@/components/shop/UserShop";
import ShopHeader from "@/components/shop/ShopHeader";

export default function page() {
  return (
    <section className="max-w-5xl mx-auto space-y-5 mt-14 md:mt-8 p-4">
      <ShopHeader/>
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
