import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Globe,
  Send,
  MessageCircle,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

export default function Footer() {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  return (
    <footer 
      ref={elementRef}
      className={`bg-muted/50 border-t mt-16 transition-all duration-1000 ${
        isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 animate-in fade-in slide-in-from-left duration-700">
              🍔 Doner Food
            </h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base animate-in fade-in slide-in-from-left duration-700 delay-100">
              Tezkor xizmat, mazali taom va do'stona muhit. <br className="hidden sm:block" />
              Biz har doim sifatli va yangi taomlar tayyorlaymiz.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 sm:gap-5 flex-wrap">
              {[
                { icon: Send, href: "https://t.me/donerfood_uz", color: "hover:text-blue-500", label: "Telegram" },
                { icon: MessageCircle, href: "https://t.me/donerfood_chat", color: "hover:text-sky-500", label: "Chat" },
                { icon: Instagram, href: "https://instagram.com/dooner_food", color: "hover:text-pink-500", label: "Instagram" },
                { icon: Globe, href: "https://donerfood.uz", color: "hover:text-green-500", label: "Website" },
                { icon: MapPin, href: "https://maps.app.goo.gl/nyQNtouLmR8g5Zgk7", color: "hover:text-red-500", label: "Location" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-muted-foreground transition-all duration-300 transform hover:scale-125 active:scale-95 touch-manipulation ${social.color} animate-in fade-in zoom-in-95 duration-500`}
                    style={{ animationDelay: `${200 + index * 50}ms` }}
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold mb-4 text-lg animate-in fade-in slide-in-from-bottom duration-700">
              Aloqa
            </h3>
            <div className="space-y-3 text-muted-foreground">
              {[
                { icon: MapPin, text: "Xorazm viloyati, Shovot tumani" },
                { icon: Phone, text: "+998 91 985 95 95" },
                { icon: Clock, text: "Har kuni: 11:00 - 00:00" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-start gap-2 sm:gap-3 group animate-in fade-in slide-in-from-bottom duration-700"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm sm:text-base group-hover:text-foreground transition-colors duration-300">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold mb-4 text-lg animate-in fade-in slide-in-from-right duration-700">
              Tezkor havolalar
            </h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Bosh sahifa" },
                { href: "/menu", label: "Menyu" },
                { href: "/about", label: "Biz haqimizda" },
                { href: "/contact", label: "Bog'lanish" },
              ].map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 touch-manipulation active:scale-95 text-sm sm:text-base animate-in fade-in slide-in-from-right duration-700`}
                  style={{ animationDelay: `${400 + index * 50}ms` }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t mt-8 sm:mt-12 pt-8 text-center space-y-2 animate-in fade-in duration-1000 delay-500">
          <p className="text-sm sm:text-base text-muted-foreground">
            &copy; 2025 Doner Food. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-xs sm:text-sm opacity-70">
            <a
              href="/policy"
              className="hover:text-primary transition-colors duration-300 touch-manipulation"
            >
              Maxfiylik siyosati va Foydalanish shartlari
            </a>
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Created by{" "}
            <a
              href="https://asadbekjumanazarov.vercel.app"
              className="hover:text-primary transition-colors duration-300"
            >
              Asadbek Jumanazarov
            </a>
            {" "}&{" "}
            <a
              href="https://atakhanov.uz"
              className="hover:text-primary transition-colors duration-300"
            >
              Mirkamol Atahanov
            </a>
            {" "}&{" "}
            <a
              href="https://t.me/@asadbekjs"
              className="hover:text-primary transition-colors duration-300"
            >
              Asadbek Rakhimov
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
