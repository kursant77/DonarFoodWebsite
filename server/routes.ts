import express from "express";
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import fetch from "node-fetch";

// --- 📸 Uploads papkasini tayyorlash ---
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --- ⚙️ Multer sozlamasi ---
const diskStorage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename(_req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: diskStorage });

// --- 🤖 Telegram sozlamalari ---
const TELEGRAM_BOT_TOKEN = "8217777940:AAEtHgcJq95sXehj2vsyH9CFf5PfpL2pI84";
const CHAT_ID = "5865994146";

// --- 🔔 Telegram xabar yuborish ---
async function sendOrderToTelegram(order: any) {
  const message = `
🧾 *Yangi zakaz!*
👤 Ism: ${order.name}
📞 Telefon: ${order.phone}
📍 Manzil: ${order.address}

🍔 Buyurtmalar:
${order.items
  .map((item: any) => `- ${item.name} (${item.quantity} dona) — ${item.price} so'm`)
  .join("\n")}

💰 Umumiy summa: ${order.total} so'm
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}

// --- 🚀 Asosiy route’lar ---
export async function registerRoutes(app: Express): Promise<Server> {
  // 🧠 Admin login
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};
    if (username === "admin" && password === "donarfood123") {
      return res.json({ success: true, message: "Login successful" });
    }
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  });

  // 📦 Barcha mahsulotlar
  app.get("/api/products", async (_req: Request, res: Response) => {
    const products = await storage.getAllProducts();
    return res.json(products);
  });

  // ➕ Mahsulot qo‘shish
  app.post("/api/products", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const { name, price, category } = req.body ?? {};
      const file = req.file as Express.Multer.File | undefined;
      const image = file ? `/uploads/${file.filename}` : "";

      if (!name || !price || !category) {
        return res.status(400).json({ success: false, message: "Barcha maydonlarni to‘ldiring" });
      }

      const newProduct = await storage.addProduct({
        name,
        price: Number(price),
        category,
        image,
      });

      return res.json({ success: true, product: newProduct });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message ?? "Server xatosi" });
    }
  });

  // ✏️ Mahsulotni yangilash
  app.put("/api/products/:id", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id).trim();
      const { name, price, category } = req.body ?? {};
      const file = req.file as Express.Multer.File | undefined;
      const image = file ? `/uploads/${file.filename}` : req.body.image ?? "";

      const updated = await storage.updateProduct(id, {
        name,
        price: Number(price),
        category,
        image,
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
      }

      return res.json({
        success: true,
        message: "Mahsulot muvaffaqiyatli yangilandi",
        product: updated,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message ?? "Server xatosi" });
    }
  });

  // 🗑️ Mahsulotni o‘chirish
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id).trim();
      const deleted = await storage.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ success: false, message: "Mahsulot topilmadi" });
      }

      return res.json({ success: true, message: "Mahsulot o‘chirildi" });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message ?? "Server xatosi" });
    }
  });

  // 🧾 Buyurtma yaratish
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { name, phone, address, items, total } = req.body ?? {};
      if (!name || !phone || !address || !items || !total) {
        return res.status(400).json({ success: false, message: "Barcha maydonlarni to‘ldiring" });
      }

      const newOrder = await storage.addOrder({
        name,
        phone,
        address,
        items,
        total: Number(total),
      });

      await sendOrderToTelegram(newOrder);

      return res.json({
        success: true,
        message: "Buyurtma muvaffaqiyatli yuborildi",
        order: newOrder,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err?.message ?? "Server xatosi" });
    }
  });

  // 📜 Barcha buyurtmalar
  app.get("/api/orders", async (_req: Request, res: Response) => {
    const orders = await storage.getAllOrders();
    return res.json(orders);
  });

  // 🖼️ Yuklangan rasmni ko‘rsatish
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
