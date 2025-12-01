import { Card } from "@/components/ui/card";
import { Heart, Users, Award } from "lucide-react";
import interior1 from "@assets/stock_images/rasim1.webp";
import interior2 from "@assets/stock_images/rasim2.webp";
import interior3 from "@assets/stock_images/rasim3.webp";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function About() {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  const values = [
    {
      icon: Heart,
      title: "Sifat",
      description: "Faqat eng yangi va sifatli mahsulotlardan foydalanamiz",
    },
    {
      icon: Users,
      title: "Mijozlar",
      description: "Har bir mijoz biz uchun qimmatli va muhim",
    },
    {
      icon: Award,
      title: "Afzallik",
      description: "Online buyurtma qilish va yetkazib berish",
    },
  ];

  return (
    <div
      ref={elementRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Header */}
      <div
        className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-100 -translate-y-4"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Biz haqimizda
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Doner Food - bu tezkor xizmat, mazali taom va do'stona muhit uchun eng
          yaxshi tanlov
        </p>
      </div>

      {/* Story Section */}
      <div
        className={`mb-12 sm:mb-16 transition-all duration-700 delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-4"
        }`}
      >
        <Card className="p-6 sm:p-8 md:p-12 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Bizning tarix</h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
            <p>
              Doner Food 2025 yilda tashkil etilgan va bugungi kunda Xorazmning
              eng mashhur fast food kafelaridan biriga aylangan. Bizning
              maqsadimiz — har bir mijozga mazali, sifatli va tez tayyorlangan
              taomlarni taqdim etish.
            </p>
            <p>
              Biz an'anaviy retseptlar va zamonaviy texnologiyalarni
              birlashtirib, noyob ta'mga ega taomlar yaratamiz. Har bir lavash,
              burger yoki doner bizning oshpazlarimiz tomonidan sevgi bilan
              tayyorlanadi.
            </p>
            <p>
              Bugungi kunda biz kuniga 100+ dan ortiq buyurtmalarni bajaramiz va
              mijozlarimizning ishonchini qozonganmiz. Bizning jamoamiz siz
              uchun har doim tayyor!
            </p>
          </div>
        </Card>
      </div>

      {/* Values */}
      <div
        className={`mb-12 sm:mb-16 transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
          Bizning qadriyatlarimiz
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className={`transition-all duration-500 ${
                  isVisible
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-100 translate-y-8 scale-100"
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Card className="p-6 sm:p-8 text-center group hover:shadow-xl hover:scale-105 transition-all duration-300 touch-manipulation active:scale-95 h-full">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 mb-4 transition-colors duration-300">
                    <Icon className="h-12 w-12 sm:h-16 sm:w-16 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {value.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gallery */}
      <div
        className={`transition-all duration-700 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-100 translate-y-4"
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
          Bizning kafe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          <div
            className={`md:col-span-2 transition-all duration-500 ${
              isVisible ? "opacity-100 scale-100" : "opacity-100 scale-100"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <img
              src="/exterior-night.JPG"
              alt="Doner Food dining area"
              className="w-full h-full min-h-[300px] object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
              loading="lazy"
            />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <div
              className={`transition-all duration-500 ${
                isVisible ? "opacity-100 scale-100" : "opacity-100 scale-100"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <img
                src="/exterior-day.JPG"
                alt="Doner Food dining area"
                className="w-full h-48 sm:h-56 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                loading="lazy"
              />
            </div>
            <div
              className={`transition-all duration-500 ${
                isVisible ? "opacity-100 scale-100" : "opacity-100 scale-100"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <img
                src="/interior.JPG"
                alt="Doner Food dining area"
                className="w-full h-48 sm:h-56 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
