import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import burgerImg from "@assets/stock_images/juicy_hamburger_with_6391bb79.jpg";
import shawarmaImg from "@assets/stock_images/shawarma_kebab_wrap__cefd1eb4.jpg";

interface HeroSectionProps {
  onOrderClick: () => void;
}

export default function HeroSection({ onOrderClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/20">
      {/* Background Images with Parallax Effect */}
      <div className="absolute inset-0 opacity-10">
        <img
          src={burgerImg}
          alt=""
          className="absolute top-10 right-10 w-64 h-64 object-cover rounded-full blur-sm animate-pulse"
          style={{ animationDuration: '3s' }}
        />
        <img
          src={shawarmaImg}
          alt=""
          className="absolute bottom-10 left-10 w-56 h-56 object-cover rounded-full blur-sm animate-pulse"
          style={{ animationDuration: '4s', animationDelay: '1s' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-block mb-4">
            <Badge className="text-lg px-4 py-1 bg-primary/10 text-primary border-primary/20">
              🍔 Donar Foof
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Fast food –{" "}
            <span className="text-primary">tez, mazali, issiq</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Biz tezkor xizmat, mazali taom va do'stona muhitni taklif qilamiz. 
            Bugun buyurtma bering va ta'mdan bahramand bo'ling!
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full"
              onClick={onOrderClick}
              data-testid="button-order-online"
            >
              Online zakaz qiling
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full"
              data-testid="button-view-menu"
            >
              Menyuni ko'rish
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Kunlik buyurtmalar</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">20+</div>
              <div className="text-sm text-muted-foreground">Taomlar</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">5★</div>
              <div className="text-sm text-muted-foreground">Reyting</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
