// server/storage.ts
import { randomUUID } from "crypto";

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  items: any[];
  total: number;
  date: string;
}

export class MemStorage {
  private users = new Map<string, User>();
  private products = new Map<string, Product>();
  private orders = new Map<string, Order>();

  constructor() {
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "donarfoof123",
    });
  }

  // 👤 Users
  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find((u) => u.username === username);
  }

  // 🛒 Products
  async getAllProducts() {
    return Array.from(this.products.values());
  }

  async addProduct(product: Omit<Product, "id">) {
    const id = randomUUID();
    const newProduct = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updated: Partial<Product>) {
    const existing = this.products.get(id);
    if (!existing) return false;
    this.products.set(id, { ...existing, ...updated });
    return true;
  }

  async deleteProduct(id: string) {
    return this.products.delete(id);
  }

  // 📦 Orders
  async getAllOrders() {
    return Array.from(this.orders.values());
  }

  async addOrder(order: Omit<Order, "id" | "date">) {
    const id = randomUUID();
    const newOrder: Order = { ...order, id, date: new Date().toISOString() };
    this.orders.set(id, newOrder);
    return newOrder;
  }
}

// ✅ Export qilamiz
export const storage = new MemStorage();
