import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // 🔐 ADMIN LOGIN
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    // Admin ma'lumotlarini tekshirish
    if (username === "admin" && password === "donarfoof123") {
      return res.json({ success: true, message: "Login successful" });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  });

  // 🍔 BARCHA MAHSULOTLARNI OLISH
  app.get("/api/products", async (req: Request, res: Response) => {
    const products = await storage.getAllProducts();
    res.json(products);
  });

  // ➕ YANGI MAHSULOT QO‘SHISH
  app.post(
    "/api/products",
    upload.single("image"),
    async (req: Request, res: Response) => {
      const { name, price, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : "";

      if (!name || !price || !category) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const newProduct = { id: Date.now(), name, price, category, image };
      await storage.addProduct(newProduct);
      res.json({ success: true, product: newProduct });
    },
  );

  // ✏️ MAHSULOTNI TAHRIRLASH
  app.put(
    "/api/products/:id",
    upload.single("image"),
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const { name, price, category } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

      const updated = await storage.updateProduct(Number(id), {
        name,
        price,
        category,
        image,
      });
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });

      res.json({ success: true, message: "Product updated successfully" });
    },
  );

  // ❌ MAHSULOTNI O‘CHIRISH
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await storage.deleteProduct(Number(id));

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product deleted successfully" });
  });

  // 🧾 BUYURTMA YUBORISH
  app.post("/api/orders", async (req: Request, res: Response) => {
    const { name, phone, address, items, total } = req.body;

    if (!name || !phone || !address || !items || !total) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newOrder = {
      id: Date.now(),
      name,
      phone,
      address,
      items,
      total,
      date: new Date().toISOString(),
    };

    await storage.addOrder(newOrder);
    res.json({
      success: true,
      message: "Order submitted successfully",
      order: newOrder,
    });
  });

  // 🧠 BUYURTMALAR TARIXI (Admin uchun)
  app.get("/api/orders", async (req: Request, res: Response) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  // HTTP serverni yaratish
  const httpServer = createServer(app);
  return httpServer;
}
