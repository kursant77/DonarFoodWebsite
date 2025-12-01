import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Star, Utensils } from "lucide-react";
import burgerImg from "@assets/stock_images/rasim1.webp";
import shawarmaImg from "@assets/stock_images/rasim4.webp";
import { useCountUp } from "@/hooks/use-count-up";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

interface HeroSectionProps {
  onOrderClick: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      {/* 🔹 Background rasmlar (parallax effekt bilan) */}
      <div className="absolute inset-0 opacity-10">
        <img
          src={burgerImg}
          alt="Burger"
          className="absolute top-10 right-10 w-64 h-64 object-cover rounded-full blur-sm animate-pulse hover:scale-110 transition-transform duration-1000"
          style={{ animationDuration: "3s" }}
          loading="lazy"
          decoding="async"
        />
        <img
          src={shawarmaImg}
          alt="Shawarma"
          className="absolute bottom-10 left-10 w-56 h-56 object-cover rounded-full blur-sm animate-pulse hover:scale-110 transition-transform duration-1000"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* 🔹 Matn va tugmalar */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <Badge className="text-lg px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full hover:scale-105 transition-transform duration-300">
              🍔 Doner Food
            </Badge>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-left-8 duration-1000 delay-200">
            Fast food –{" "}
            <span className="text-primary bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent animate-pulse">
              tez, mazali, issiq
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            Biz tezkor xizmat, mazali taom va do'stona muhitni taklif qilamiz.{" "}
            Bugun buyurtma bering va ta'mdan bahramand bo'ling!
          </p>

          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
              onClick={onOrderClick}
              data-testid="button-order-online"
            >
              Online zakaz qiling
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              onClick={onOrderClick}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full hover:scale-105 hover:shadow-xl transition-all duration-300"
              data-testid="button-view-menu"
            >
              Menyuni ko'rish
            </Button>
          </div>

          {/* 🔹 Statistikalar - animatsiyalar bilan */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <AnimatedStat number={100} label="Kunlik buyurtmalar" icon={TrendingUp} delay={600} />
            <AnimatedStat number={20} label="Taomlar" icon={Utensils} delay={800} />
            <AnimatedStat number={5} label="Reyting" icon={Star} delay={1000} suffix="★" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function AnimatedStat({ 
  number, 
  label, 
  icon: Icon, 
  delay = 0,
  suffix = "+",
  prefix = "",
}: { 
  number: number; 
  label: string; 
  icon: any;
  delay?: number;
  suffix?: string;
  prefix?: string;
}) {
  const { elementRef, isVisible } = useScrollAnimation(0.2);
  const { displayValue } = useCountUp({
    end: number,
    duration: 2000,
    enabled: isVisible,
    suffix,
    prefix,
  });

  return (
    <div
      ref={elementRef}
      className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-background to-accent/10 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Icon */}
      <div className="relative z-10 mb-4">
        <div className="inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="h-6 w-6 text-primary group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </div>

      {/* Number */}
      <div className="relative z-10">
        <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-orange-500 to-red-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 inline-block">
          {displayValue}
        </div>
        <div className="text-sm text-muted-foreground mt-2 group-hover:text-foreground transition-colors duration-300">
          {label}
        </div>
      </div>

      {/* Animated background particles */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-orange-500/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
    </div>
  );
}
