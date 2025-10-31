import { createClient } from "@supabase/supabase-js";

// ✅ Supabase ma’lumotlari
const supabaseUrl = "https://omdgrhymirjfcigfuzcb.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZGdyaHltaXJqZmNpZ2Z1emNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3Mzc0NzcsImV4cCI6MjA3NzMxMzQ3N30.8REWJhigVJH_2rrZH9J_NkyMgd2JDGi8ZSe1opCl7lM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
