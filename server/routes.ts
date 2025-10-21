import express from "express";
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";

// --- Prepare uploads directory ---
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --- Multer configuration ---
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

export async function registerRoutes(app: Express): Promise<Server> {
  // --- Admin login ---
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};
    if (username === "admin" && password === "donarfoof123") {
      return res.json({ success: true, message: "Login successful" });
    }
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  });

  // --- Get all products ---
  app.get("/api/products", async (_req: Request, res: Response) => {
    const products = await storage.getAllProducts();
    return res.json(products);
  });

  // --- Add new product ---
  app.post(
    "/api/products",
    upload.single("image"),
    async (req: Request, res: Response) => {
      try {
        const { name, price, category } = req.body ?? {};
        const file = req.file as Express.Multer.File | undefined;
        const image = file ? `/uploads/${file.filename}` : "";

        if (!name || !price || !category) {
          return res
            .status(400)
            .json({ success: false, message: "All fields are required" });
        }

        const newProduct = await storage.addProduct({
          name,
          price: Number(price),
          category,
          image,
        });

        return res.json({ success: true, product: newProduct });
      } catch (err: any) {
        return res
          .status(500)
          .json({ success: false, message: err?.message ?? "Server error" });
      }
    }
  );

  // --- Update product ---
  app.put(
    "/api/products/:id",
    upload.single("image"),
    async (req: Request, res: Response) => {
      try {
        const id = String(req.params.id); // <-- 🔥 string sifatida ishlatamiz
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
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        return res.json({ success: true, message: "Product updated successfully" });
      } catch (err: any) {
        return res
          .status(500)
          .json({ success: false, message: err?.message ?? "Server error" });
      }
    }
  );

  // --- Delete product ---
  app.delete("/api/products/:id", async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id); // <-- 🔥 string qilib o‘tamiz
      const deleted = await storage.deleteProduct(id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      return res.json({ success: true, message: "Product deleted successfully" });
    } catch (err: any) {
      return res
        .status(500)
        .json({ success: false, message: err?.message ?? "Server error" });
    }
  });

  // --- Create new order ---
  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const { name, phone, address, items, total } = req.body ?? {};

      if (!name || !phone || !address || !items || !total) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const newOrder = await storage.addOrder({
        name,
        phone,
        address,
        items,
        total: Number(total),
      });

      return res.json({
        success: true,
        message: "Order submitted successfully",
        order: newOrder,
      });
    } catch (err: any) {
      return res
        .status(500)
        .json({ success: false, message: err?.message ?? "Server error" });
    }
  });

  // --- Get all orders ---
  app.get("/api/orders", async (_req: Request, res: Response) => {
    const orders = await storage.getAllOrders();
    return res.json(orders);
  });

  // --- Serve uploaded images ---
  app.use("/uploads", express.static(uploadDir));

  const httpServer = createServer(app);
  return httpServer;
}
