// server/storage.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 🔧 ESM muhitida __dirname ni yaratamiz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📂 Ma'lumotlar saqlanadigan joy
const dataDir = path.join(__dirname, "data");
const productsPath = path.join(dataDir, "products.json");
const ordersPath = path.join(dataDir, "orders.json");

// 📁 Papka va fayllarni avtomatik tayyorlash
function ensureFileExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]", "utf-8");
}

// 📖 Faylni o‘qish
function readFile(filePath: string) {
  ensureFileExists(filePath);
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("❌ JSON o‘qishda xatolik:", err);
    return [];
  }
}

// ✍️ Faylga yozish
function writeFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("❌ JSON yozishda xatolik:", err);
  }
}

// 🗂️ Asosiy storage obyekt
export const storage = {
  // 🛍 Mahsulotlar
  async getAllProducts() {
    return readFile(productsPath);
  },

  async addProduct(product: any) {
    const products = readFile(productsPath);
    const newProduct = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...product,
    };
    products.push(newProduct);
    writeFile(productsPath, products);
    return newProduct;
  },

  async updateProduct(id: string, updates: any) {
    const products = readFile(productsPath);
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) return null;

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    writeFile(productsPath, products);
    return products[index];
  },

  async deleteProduct(id: string) {
    const products = readFile(productsPath);
    const index = products.findIndex((p: any) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    writeFile(productsPath, products);
    return true;
  },

  // 🧾 Buyurtmalar
  async getAllOrders() {
    return readFile(ordersPath);
  },

  async addOrder(order: any) {
    const orders = readFile(ordersPath);
    const newOrder = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...order,
    };
    orders.push(newOrder);
    writeFile(ordersPath, orders);
    return newOrder;
  },
};
