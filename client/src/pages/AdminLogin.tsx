import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock, User } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Saqlab qo‘yamiz (token yoki sessiya)
        localStorage.setItem("isAdmin", "true");
        setLocation("/admin-dashboard");
      } else {
        setError("❌ Noto‘g‘ri foydalanuvchi nomi yoki parol!");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Serverga ulanib bo‘lmadi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🍔</div>
          <h1 className="text-3xl font-bold mb-2">Donar Foof Admin</h1>
          <p className="text-muted-foreground">
            Kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Foydalanuvchi nomi
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Parol
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Kirilmoqda..." : "Kirish"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium mb-1">Demo kirish ma'lumotlari:</p>
          <p>Username: admin</p>
          <p>Parol: donarfoof123</p>
        </div>
      </Card>
    </div>
  );
}
