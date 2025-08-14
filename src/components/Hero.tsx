import heroImage from "@/assets/construction-hero.jpg";

const Hero = () => {
  return (
    <section className="relative w-full h-[850px] md:h-[700px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: `url(${heroImage})`
        }} 
      />
    </section>
  );
};
export default Hero;