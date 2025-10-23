import { MapPin, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🍔 Donar Food</h3>
            <p className="text-muted-foreground">
              Tezkor xizmat, mazali taom va do'stona muhit. 
              Biz har doim sifatli va yangi taomlar tayyorlaymiz.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Aloqa</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Toshkent shahar, Chilonzor tumani</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+998 90 123 45 67</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>Har kuni: 09:00 - 23:00</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Tezkor havolalar</h3>
            <div className="space-y-2">
              <a href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Bosh sahifa
              </a>
              <a href="/menu" className="block text-muted-foreground hover:text-primary transition-colors">
                Menyu
              </a>
              <a href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                Biz haqimizda
              </a>
              <a href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Bog'lanish
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Donar Foof. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  );
}
