import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestSupabase() {
  const [status, setStatus] = useState("⏳ Ulanmoqda...");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from("menu").select("*").limit(1);
        if (error) throw error;
        setStatus("✅ Supabase ishlayapti! Jadval topildi.");
        console.log("Supabase data:", data);
      } catch (err: any) {
        console.error("❌ Supabase xato:", err);
        setStatus(`❌ Supabase bilan ulanishda xatolik: ${err.message}`);
      }
    }
    testConnection();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{status}</h2>
    </div>
  );
}
