import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Mail, User, MessageSquare } from "lucide-react";

interface ContactFormProps {
  onSubmit: (data: { name: string; email: string; message: string }) => void;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-bold mb-6">Xabar yuboring</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="contact-name" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Ismingiz *
          </Label>
          <Input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ismingizni kiriting"
            required
            data-testid="input-contact-name"
          />
        </div>

        <div>
          <Label htmlFor="contact-email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email *
          </Label>
          <Input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            data-testid="input-contact-email"
          />
        </div>

        <div>
          <Label htmlFor="contact-message" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Xabar *
          </Label>
          <Textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Sizning xabaringiz..."
            required
            rows={5}
            data-testid="input-contact-message"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          data-testid="button-submit-contact"
        >
          Xabar yuborish
        </Button>
      </form>
    </Card>
  );
}
