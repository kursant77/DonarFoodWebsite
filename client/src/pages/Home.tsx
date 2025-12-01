import HeroSection from "@/components/HeroSection";
import { Card } from "@/components/ui/card";
import { Utensils, Clock, Star, Truck } from "lucide-react";
import { useLocation } from "wouter";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const defaultFeatures = [
  {
    icon: Clock,
    title: "Tez yetkazish",
    description: "30 daqiqada eshigingizgacha",
    delay: 100,
  },
  {
    icon: Utensils,
    title: "Yangi mahsulotlar",
    description: "Har doim yangi va sifatli",
    delay: 200,
  },
  {
    icon: Star,
    title: "Yuqori sifat",
    description: "5 yulduzli xizmat",
    delay: 300,
  },
  {
    icon: Truck,
    title: "Bepul yetkazish",
    description: "50,000 so'mdan yuqori",
    delay: 400,
  },
];

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div>
      <HeroSection onOrderClick={() => setLocation("/menu")} />
      <FeaturesSection features={defaultFeatures} />
      <CTASection onMenuClick={() => setLocation("/menu")} />
    </div>
  );
}

function FeaturesSection({ features }: { features: typeof defaultFeatures }) {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <section 
      ref={elementRef}
      className="max-w-7xl mx-auto px-4 py-16"
    >
      <h2 
        className={`text-3xl md:text-4xl font-bold text-center mb-12 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-100 -translate-y-4"
        }`}
      >
        Nega <span className="text-primary">Doner Food</span>?
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <AnimatedFeatureCard 
            key={feature.title} 
            feature={feature} 
            index={index}
            isVisible={isVisible}
          />
        ))}
      </div>
    </section>
  );
}

function AnimatedFeatureCard({ 
  feature, 
  index,
  isVisible 
}: { 
  feature: any; 
  index: number;
  isVisible: boolean;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible 
          ? "opacity-100 translate-y-0 scale-100" 
          : "opacity-100 translate-y-8 scale-100"
      }`}
      style={{ transitionDelay: `${200 + index * 100}ms` }}
    >
      <Card className="group relative overflow-hidden p-6 text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border-2 hover:border-primary/50 h-full">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 mb-4 transition-colors duration-300">
            <Icon className="h-12 w-12 text-primary group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {feature.description}
          </p>
        </div>

        {/* Decorative particles */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      </Card>
    </div>
  );
}

function CTASection({ onMenuClick }: { onMenuClick: () => void }) {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <section 
      ref={elementRef}
      className="bg-primary/5 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 
          className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-4"
          }`}
        >
          Bugun buyurtma bering!
        </h2>
        <p 
          className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-4"
          }`}
        >
          Bizning menyumizda 20+ dan ortiq mazali taomlar mavjud. 
          Tanlang va zavqlaning!
        </p>
        <button
          onClick={onMenuClick}
          className={`bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-block touch-manipulation active:scale-95 ${
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-100 translate-y-4 scale-100"
          }`}
          style={{ transitionDelay: "200ms" }}
          data-testid="button-cta-menu"
        >
          Menyuni ko'rish
        </button>
      </div>
    </section>
  );
}
