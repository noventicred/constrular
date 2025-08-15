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
import SEO from "@/components/SEO";
import { useSettings } from "@/hooks/useSettings";

const Index = () => {
  const { getCompanyName, getSiteTitle, getSiteDescription } = useSettings();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": getCompanyName(),
    "url": window.location.origin,
    "logo": `${window.location.origin}/logo.png`,
    "description": getSiteDescription(),
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    },
    "sameAs": []
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={getSiteTitle()}
        description={getSiteDescription()}
        keywords="material de construção, cimento, tijolo, tinta, ferramentas, construção, obra, reforma, loja online, São Paulo"
        structuredData={structuredData}
        type="website"
      />
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
