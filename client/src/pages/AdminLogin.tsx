import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Sun } from "lucide-react";

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode class boshqaruvi
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const success = await onLogin(username, password);
      if (!success) {
        setError("Username yoki parol noto‘g‘ri!");
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.error(err);
      }
      setError("Server bilan bog'lanishda xato yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full p-2 transition-all"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-5 transition-colors duration-500"
      >
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100">
          Admin Panelga kirish
        </h1>

        <div>
          <Label
            htmlFor="username"
            className="text-gray-700 dark:text-gray-300 transition-colors"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-gray-700 dark:text-gray-300 transition-colors"
          >
            Parol
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Parolni kiriting"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Kirish..." : "Kirish"}
        </Button>
      </form>
    </div>
  );
}
