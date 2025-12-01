import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useCountUp } from "@/hooks/use-count-up";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { TrendingUp, DollarSign, ShoppingBag, Calendar } from "lucide-react";

// 🔹 Order interfeysi
interface Order {
  id: number;
  created_at: string;
  total?: number | string | null;
  total_price?: number | string | null;
  product_name?: string;
  quantity?: number;
  items?: unknown;
}

export default function Analytics() {
  // 🔹 Statlar uchun state
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [topProducts, setTopProducts] = useState<{ name: string; total: number }[]>([]);
  const [dailyStats, setDailyStats] = useState<{ date: string; orders: number; revenue: number }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🔹 Dark mode aniqlash
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    setIsDarkMode(document.documentElement.classList.contains("dark"));
    return () => observer.disconnect();
  }, []);

  // 🔹 Supabase'dan buyurtmalarni olish
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");
      if (error) {
        console.error("Buyurtmalarni olishda xato:", error);
      } else if (data) {
        setOrders(data as Order[]);
        calculateStats(data as Order[]);
      }
    };
    fetchOrders();
  }, []);

  // 🔹 Statistika hisoblash funksiyasi
  const calculateStats = (data: Order[]) => {
    const parsePrice = (order: Order) => {
      const price = order.total ?? order.total_price ?? 0;
      const cleaned = String(price).replace(/[^\d.-]/g, "");
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : 0;
    };

    const getOrderItemCount = (o: Order) => {
      if (o.product_name) return Number(o.quantity) || 0;
      const raw = o.items;
      try {
        const arr = typeof raw === "string" ? JSON.parse(raw) : Array.isArray(raw) ? raw : null;
        if (Array.isArray(arr)) {
          return arr.reduce((sum, it: any) => sum + (Number(it?.qty ?? it?.quantity ?? 0) || 0), 0);
        }
      } catch {}
      return 1;
    };

    const totalOrderCount = data.reduce((sum, o) => sum + getOrderItemCount(o), 0);
    const totalRev = data.reduce((sum, o) => sum + parsePrice(o), 0);

    const today = new Date().toISOString().split("T")[0];
    const todayOrdersData = data.filter((o) => o.created_at.startsWith(today));
    const todayOrderCount = todayOrdersData.reduce((sum, o) => sum + getOrderItemCount(o), 0);
    const todayRev = todayOrdersData.reduce((sum, o) => sum + parsePrice(o), 0);

    // 🔹 Eng ko‘p buyurtma qilingan mahsulotlar
    const productMap: Record<string, number> = {};
    data.forEach((o) => {
      if (o.product_name) {
        productMap[o.product_name] = (productMap[o.product_name] || 0) + (Number(o.quantity) || 0);
        return;
      }
      const raw = o.items;
      let items: Array<{ name?: string; qty?: number; quantity?: number }> | null = null;
      try {
        if (typeof raw === "string") items = JSON.parse(raw);
        else if (Array.isArray(raw)) items = raw as Array<{ name?: string; qty?: number; quantity?: number }>;
      } catch { items = null; }
      if (Array.isArray(items)) {
        items.forEach((it) => {
          const name = it.name?.trim();
          const qty = Number(it.qty ?? it.quantity ?? 0);
          if (name && qty > 0) productMap[name] = (productMap[name] || 0) + qty;
        });
      }
    });
    const top = Object.entries(productMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    // 🔹 Kunlik statistika (oxirgi 7 kun)
    const dailyMap: Record<string, { orders: number; revenue: number }> = {};
    data.forEach((o) => {
      const day = o.created_at.split("T")[0];
      if (!dailyMap[day]) dailyMap[day] = { orders: 0, revenue: 0 };
      dailyMap[day].orders += 1;
      dailyMap[day].revenue += parsePrice(o);
    });
    const dailyArr = Object.entries(dailyMap)
      .map(([date, val]) => ({ date, ...val }))
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(-7);

    setTotalOrders(totalOrderCount);
    setTotalRevenue(totalRev);
    setTodayOrders(todayOrderCount);
    setTodayRevenue(todayRev);
    setTopProducts(top);
    setDailyStats(dailyArr);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold animate-in fade-in slide-in-from-top-4 duration-700">
        📊 Analitika paneli
      </h1>

      {/* 🔹 Statlar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatedStatCard title="Umumiy tushum" value={totalRevenue} icon={DollarSign} color="green" delay={100} suffix=" so'm" />
        <AnimatedStatCard title="Kundalik tushum" value={todayRevenue} icon={TrendingUp} color="blue" delay={200} suffix=" so'm" />
        <AnimatedStatCard title="Umumiy buyurtmalar" value={totalOrders} icon={ShoppingBag} color="orange" delay={300} />
        <AnimatedStatCard title="Bugungi buyurtmalar" value={todayOrders} icon={Calendar} color="purple" delay={400} />
      </div>

      {/* 🔹 So‘nggi 7 kunlik tushum grafigi */}
      <Card>
        <CardHeader>
          <CardTitle>📅 So‘nggi 7 kunlik tushum</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <XAxis
                dataKey="date"
                tick={{ fill: isDarkMode ? "#fff" : "#000" }}
                axisLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                tickLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                label={{ value: "Sana", position: "insideBottom", offset: -5, fill: isDarkMode ? "#fff" : "#000" }}
              />
              <YAxis
                tick={{ fill: isDarkMode ? "#fff" : "#000" }}
                axisLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                tickLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                tickFormatter={(v) => Number(v).toLocaleString("uz-UZ")}
              />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? "#1e293b" : "#fff", borderColor: isDarkMode ? "#475569" : "#e5e7eb", color: isDarkMode ? "#fff" : "#000" }}
                formatter={(value: any) => [`${Number(value).toLocaleString("uz-UZ")} so‘m`, "Tushum"]}
                labelFormatter={(label) => `Sana: ${label}`}
              />
              <Line type="monotone" dataKey="revenue" name="Tushum" stroke={isDarkMode ? "#60a5fa" : "#2563eb"} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 🔹 Eng ko‘p buyurtma qilingan mahsulotlar */}
      <Card>
        <CardHeader>
          <CardTitle>🔥 Eng ko‘p buyurtma qilingan mahsulotlar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <XAxis
                dataKey="name"
                tick={{ fill: isDarkMode ? "#fff" : "#000" }}
                axisLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                tickLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                label={{ value: "Mahsulot", position: "insideBottom", offset: -5, fill: isDarkMode ? "#fff" : "#000" }}
              />
              <YAxis
                tick={{ fill: isDarkMode ? "#fff" : "#000" }}
                axisLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                tickLine={{ stroke: isDarkMode ? "#475569" : "#e5e7eb" }}
                tickFormatter={(v) => Number(v).toLocaleString("uz-UZ")}
              />
              <Tooltip
                contentStyle={{ backgroundColor: isDarkMode ? "#1e293b" : "#fff", borderColor: isDarkMode ? "#475569" : "#e5e7eb", color: isDarkMode ? "#fff" : "#000" }}
                formatter={(value: any) => [`${Number(value).toLocaleString("uz-UZ")}`, "Soni"]}
                labelFormatter={(label) => `Mahsulot: ${label}`}
              />
              <Bar dataKey="total" name="Soni" fill={isDarkMode ? "#34d399" : "#10b981"} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// 🔹 Animated stat card
function AnimatedStatCard({
  title,
  value,
  icon: Icon,
  color,
  delay = 0,
  suffix = "",
}: {
  title: string;
  value: number;
  icon: any;
  color: "green" | "blue" | "orange" | "purple";
  delay?: number;
  suffix?: string;
}) {
  const { elementRef, isVisible } = useScrollAnimation(0.1);
  const { displayValue } = useCountUp({ end: value, duration: 2000, enabled: isVisible, decimals: 0, suffix });

  const colorClasses = {
    green: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
    blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    orange: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
  };

  return (
    <Card
      ref={elementRef}
      className={`group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isVisible ? "animate-in fade-in slide-in-from-bottom-8 zoom-in-95" : "opacity-0"
      } ${colorClasses[color]}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* 🔹 Animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 dark:from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <p className="text-3xl font-extrabold animate-pulse-once">{displayValue}</p>
      </CardContent>

      {/* 🔹 Decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
    </Card>
  );
}
