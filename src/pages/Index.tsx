import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoBanner from "@/components/PromoBanner";
import Categories from "@/components/Categories";
import SpecialOffers from "@/components/SpecialOffers";
import FeaturedProducts from "@/components/FeaturedProducts";
import SocialProof from "@/components/SocialProof";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PromoBanner />
      <Header />
      <main>
        <Hero />
        <Categories />
        <SpecialOffers />
        <FeaturedProducts />
        <SocialProof />
        <Newsletter />
      </main>
      <Footer />
      <FloatingCart />
    </div>
  );
};

export default Index;
