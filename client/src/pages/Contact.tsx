import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const handleContactSubmit = (data: { name: string; email: string; message: string }) => {
    console.log('Contact form submitted:', data);
    toast({
      title: "Xabar yuborildi!",
      description: "Tez orada siz bilan bog'lanamiz.",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bog'lanish</h1>
        <p className="text-xl text-muted-foreground">
          Biz bilan bog'laning va savollaringizni bering
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Info & Map */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map */}
          <Card className="overflow-hidden h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.7267844617!2d69.20357431542396!3d41.31151307927038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sChilonzor%2C%20Tashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Card>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Manzil</h3>
                  <p className="text-sm text-muted-foreground">
                    Xorazm, Shovot
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <p className="text-sm text-muted-foreground">
                    +998 91 985 95 95
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ish vaqti</h3>
                  <p className="text-sm text-muted-foreground">
                    Har kuni: 08:00 - 23:00
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    info@donarfood.uz
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <ContactForm onSubmit={handleContactSubmit} />
        </div>
      </div>
    </div>
  );
}
