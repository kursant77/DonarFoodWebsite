// server/storage.ts
export const storage = {
  products: [] as any[],
  orders: [] as any[],

  async getAllProducts() {
    return this.products;
  },

  async addProduct(product: any) {
    const newProduct = { id: Date.now().toString(), ...product };
    this.products.push(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: any) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.products[index] = { ...this.products[index], ...updates };
    return this.products[index];
  },

  async deleteProduct(id: string) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  },

  async getAllOrders() {
    return this.orders;
  },

  async addOrder(order: any) {
    const newOrder = { id: Date.now().toString(), ...order };
    this.orders.push(newOrder);
    return newOrder;
  },
};
