import { useState } from "react";
import { supabase } from "../supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Mail, User, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // ✅ Hook import

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast(); // ✅ Toast hook’ini ishlatish

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const timestamp = new Date().toISOString();

    try {
      const { error } = await supabase.from("messages").insert([
        {
          name,
          email,
          message,
          created_at: timestamp,
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        toast({
          title: "Xatolik",
          description: "Xabar yuborishda xatolik yuz berdi. Qayta urinib ko‘ring.",
          variant: "destructive", // ❌ qizil
        });
      } else {
        toast({
          title: "Muvaffaqiyat!",
          description: "Xabaringiz muvaffaqiyatli yuborildi.",
          variant: "default", // ✅ yashil
        });
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Server bilan aloqa uzildi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold mb-6 text-center">Biz bilan bog‘laning</h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="contact-name" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Ismingiz *
          </Label>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismingizni kiriting"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email *
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Xabar *
          </Label>
          <Textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Xabaringizni shu yerga yozing..."
            required
            rows={5}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Yuborilmoqda..." : "Xabar yuborish"}
        </Button>
      </form>
    </Card>
  );
}
