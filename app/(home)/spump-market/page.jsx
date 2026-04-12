import PublicMarketplace from "@/components/shop/PublicMarketplace";
import ShopHeader from "@/components/shop/ShopHeader";

export default function page() {
  return (
    <section className="max-w-5xl mx-auto px-4 pt-24">
      <ShopHeader/>
      <PublicMarketplace />
    </section>
  );
}
