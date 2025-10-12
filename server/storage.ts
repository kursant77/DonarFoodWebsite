import { randomUUID } from "crypto";

// 🔸 MA'LUMOTLAR TURLARI (TypeScript interfeyslar)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
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

export interface InsertProduct {
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
  items: Product[];
  total: number;
  date: string;
}

export interface InsertOrder {
  name: string;
  phone: string;
  address: string;
  items: Product[];
  total: number;
}

// 🔹 UMUMIY SAQLASH INTERFEYSI
export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getAllProducts(): Promise<Product[]>;
  addProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updated: Partial<Product>): Promise<boolean>;
  deleteProduct(id: string): Promise<boolean>;

  // Orders
  getAllOrders(): Promise<Order[]>;
  addOrder(order: InsertOrder): Promise<Order>;
}

// 🔹 XOTIRADA SAQLANADIGAN (RAM) SAQLASH SINF
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();

    // 🔑 Admin foydalanuvchini avtomatik qo‘shamiz
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "donarfoof123",
    });
  }

  // 🔸 USERS
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // 🔸 PRODUCTS
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async addProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updated: Partial<Product>): Promise<boolean> {
    const existing = this.products.get(id);
    if (!existing) return false;
    this.products.set(id, { ...existing, ...updated });
    return true;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // 🔸 ORDERS
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async addOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      id,
      date: new Date().toISOString(),
      ...insertOrder,
    };
    this.orders.set(id, order);
    return order;
  }
}

// 🔸 STORAGE INSTANSIYASINI EKSPORT QILAMIZ
export const storage = new MemStorage();
