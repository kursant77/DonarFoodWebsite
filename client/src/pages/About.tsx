import { Card } from "@/components/ui/card";
import { Heart, Users, Award } from "lucide-react";
import interior1 from "@assets/stock_images/rasim1.jpg";
import interior2 from "@assets/stock_images/rasim2.jpg";
import interior3 from "@assets/stock_images/rasim3.jpg";

export default function About() {
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
      title: "Tajriba",
      description: "10 yildan ortiq fast food sohasida tajriba",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Biz haqimizda</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Donar FooD - bu tezkor xizmat, mazali taom va do'stona muhit uchun eng yaxshi tanlov
        </p>
      </div>

      {/* Story Section */}
      <div className="mb-16">
        <Card className="p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-6">Bizning tarix</h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Donar FooD 2025 yilda tashkil etilgan va bugungi kunda Xorazmning eng mashhur fast food kafelaridan biriga aylangan.
              Bizning maqsadimiz — har bir mijozga mazali, sifatli va tez tayyorlangan taomlarni taqdim etish.
            </p>
            <p>
              Biz an'anaviy retseptlar va zamonaviy texnologiyalarni birlashtirib, noyob ta'mga ega taomlar yaratamiz.
              Har bir lavash, burger yoki doner bizning oshpazlarimiz tomonidan sevgi bilan tayyorlanadi.
            </p>
            <p>
              Bugungi kunda biz kuniga 500+ dan ortiq buyurtmalarni bajaramiz va mijozlarimizning ishonchini qozonganmiz.
              Bizning jamoamiz siz uchun har doim tayyor!
            </p>
          </div>
        </Card>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Bizning qadriyatlarimiz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value) => (
            <Card key={value.title} className="p-8 text-center">
              <value.icon className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">Bizning kafe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <img
              src={interior1}
              alt="Donar FooD interior"
              className="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="space-y-6">
            <img
              src={interior2}
              alt="Donar FooD dining area"
              className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            />
            <img
              src={interior3}
              alt="Donar FooD atmosphere"
              className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
