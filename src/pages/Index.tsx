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

const Index = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nova Casa Construção",
         url: window.location.origin,
     logo: `${window.location.origin}/src/assets/LOGO NOVA CASA.png`,
    description:
      "Loja completa de material de construção com os melhores preços. Cimento, tijolos, tintas, ferramentas e muito mais.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    sameAs: [],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Nova Casa Construção - Material de Construção Online | Cimento, Tijolos, Tintas"
        description="Loja completa de material de construção com os melhores preços. Cimento, tijolos, tintas, ferramentas e muito mais. Entrega rápida em Sorocaba."
        keywords="material de construção, cimento, tijolo, tinta, ferramentas, construção, obra, reforma, loja online, Sorocaba"
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
