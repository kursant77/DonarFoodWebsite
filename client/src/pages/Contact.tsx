import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function Contact() {
  const { toast } = useToast();
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  // ✅ Formadan kelgan ma'lumotlarni qayta ishlash
  const handleContactSubmit = (data: { name: string; email: string; message: string }) => {
    toast({
      title: "Xabar yuborildi! ✅",
      description: "Tez orada siz bilan bog'lanamiz.",
      variant: "success",
    });
  };

  const contactInfo = [
    { icon: MapPin, title: "Manzil", text: "Xorazm, Shovot" },
    { icon: Phone, title: "Telefon", text: "+998 91 985 95 95" },
    { icon: Clock, title: "Ish vaqti", text: "Har kuni: 11:00 - 00:00" },
    { icon: Mail, title: "Email", text: "info@donarfood.uz" },
  ];

  return (
    <div 
      ref={elementRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      {/* Header */}
      <div 
        className={`text-center mb-8 sm:mb-12 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-100 -translate-y-4"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Bog'lanish
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Biz bilan bog'laning va savollaringizni bering
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Contact Info & Map */}
        <div 
          className={`lg:col-span-3 space-y-6 transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-100 -translate-x-4"
          }`}
        >
          {/* Map */}
          <Card className="overflow-hidden h-80 sm:h-96 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40803.0659367072!2d60.2856352!3d41.65474999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41de4900132e85d3%3A0x5d2bdc2752fce77!2sDoner%20Food!5e1!3m2!1suz!2s!4v1762248221581!5m2!1suz!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Doner Food Location"
            />
          </Card>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={info.title}
                  className={`transition-all duration-500 ${
                    isVisible 
                      ? "opacity-100 translate-y-0 scale-100" 
                      : "opacity-100 translate-y-8 scale-100"
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <Card className="p-4 sm:p-6 group hover:shadow-xl hover:scale-105 transition-all duration-300 touch-manipulation active:scale-95 h-full">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1 text-sm sm:text-base group-hover:text-primary transition-colors duration-300">
                        {info.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {info.text}
                      </p>
                    </div>
                  </div>
                </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div 
          className={`lg:col-span-2 transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-100 translate-x-4"
          }`}
        >
          <ContactForm onSubmit={handleContactSubmit} />
        </div>
      </div>
    </div>
  );
}
