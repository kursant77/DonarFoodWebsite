import HeroSection from "@/components/HeroSection";
import { Card } from "@/components/ui/card";
import { Utensils, Clock, Star, Truck } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Clock,
      title: "Tez yetkazish",
      description: "30 daqiqada eshigingizgacha",
    },
    {
      icon: Utensils,
      title: "Yangi mahsulotlar",
      description: "Har doim yangi va sifatli",
    },
    {
      icon: Star,
      title: "Yuqori sifat",
      description: "5 yulduzli xizmat",
    },
    {
      icon: Truck,
      title: "Bepul yetkazish",
      description: "50,000 so'mdan yuqori",
    },
  ];

  return (
    <div>
      <HeroSection onOrderClick={() => setLocation("/menu")} />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Nega <span className="text-primary">Donar Food</span>?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 text-center hover:shadow-lg transition-shadow">
              <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bugun buyurtma bering!
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Bizning menyumizda 20+ dan ortiq mazali taomlar mavjud. 
            Tanlang va zavqlaning!
          </p>
          <button
            onClick={() => setLocation("/menu")}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover-elevate active-elevate-2 inline-block"
            data-testid="button-cta-menu"
          >
            Menyuni ko'rish
          </button>
        </div>
      </section>
    </div>
  );
}
