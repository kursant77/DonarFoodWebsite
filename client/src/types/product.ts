export interface Product {
  id: number;
  name: string;
  title?: string; // ✅ qo‘shamiz
  description?: string;
  price: number;
  category?: string;
  image?: string;
  available?: boolean;
}
