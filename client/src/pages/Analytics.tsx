// src/pages/AdminDashboard/Analytics.tsx
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { supabase } from "@/supabase";
import { useTheme } from "next-themes"; // ✅ Dark/Light mode hook

// 🔹 Buyurtmalar jadvalidagi ma’lumotlar formati
interface Order {
  id: number;
  product_name: string;
  quantity: number;
  total_price: number;
  created_at: string;
}

// ✅ 🔹 Analytics komponentiga kiruvchi props turlari
interface AnalyticsProps {
  orders: any[];
  products: any[];
  messages: any[];
}

// 🔹 Asosiy Analytics komponenti
export default function Analytics({ orders, products, messages }: AnalyticsProps) {
  // Theme (dark yoki light)
  const { theme } = useTheme();

  // State’lar
  const [orderData, setOrderData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [topProducts, setTopProducts] = useState<{ name: string; total: number }[]>([]);

  // 🧠 Supabase’dan buyurtmalarni olish
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("orders").select("*");

      if (error) {
        console.error("Xatolik:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setOrderData(data);
        calculateStats(data);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  // 📊 Statistikalarni hisoblash funksiyasi
  const calculateStats = (data: Order[]) => {
    const total = data.length;
    const revenue = data.reduce((sum, o) => sum + o.total_price, 0);

    const today = new Date().toISOString().split("T")[0];
    const todayRev = data
      .filter((o) => o.created_at.startsWith(today))
      .reduce((sum, o) => sum + o.total_price, 0);

    // Eng ko‘p buyurtma qilingan mahsulotlar
    const productMap: Record<string, number> = {};
    data.forEach((o) => {
      productMap[o.product_name] =
        (productMap[o.product_name] || 0) + o.quantity;
    });

    const top = Object.entries(productMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    setTotalOrders(total);
    setTotalRevenue(revenue);
    setTodayRevenue(todayRev);
    setTopProducts(top);
  };

  // Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  // 🔹 UI qismi
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold">📈 Analitika</h2>

      {/* 📦 Umumiy statistikalar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 text-center shadow-md">
          <h3 className="text-lg font-semibold">Umumiy buyurtmalar</h3>
          <p className="text-3xl font-bold mt-2">{totalOrders}</p>
        </Card>

        <Card className="p-4 text-center shadow-md">
          <h3 className="text-lg font-semibold">Umumiy tushum</h3>
          <p className="text-3xl font-bold mt-2">{totalRevenue.toLocaleString()} so‘m</p>
        </Card>

        <Card className="p-4 text-center shadow-md">
          <h3 className="text-lg font-semibold">Bugungi tushum</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">
            {todayRevenue.toLocaleString()} so‘m
          </p>
        </Card>
      </div>

      {/* 🥇 Eng ko‘p buyurtma qilingan mahsulotlar */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">
            Eng ko‘p buyurtma qilingan mahsulotlar
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <XAxis dataKey="name" stroke={theme === "dark" ? "#fff" : "#000"} />
              <YAxis stroke={theme === "dark" ? "#fff" : "#000"} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
                  color: theme === "dark" ? "#fff" : "#000",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
