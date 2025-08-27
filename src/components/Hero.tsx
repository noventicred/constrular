import heroDesktop from "@/assets/construction-hero-desktop.jpg";
import heroMobile from "@/assets/construction-hero-mobile.jpg";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${isMobile ? heroMobile : heroDesktop})`
        }} 
      />
    </section>
  );
};
export default Hero;