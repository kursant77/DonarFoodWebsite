import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, LogOut, Package, ShoppingBag, Image as ImageIcon, LayoutDashboard } from "lucide-react";
import type { Product, Order } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  //todo: remove mock functionality
  const [products] = useState<Product[]>([
    { id: '1', name: 'Lavash', category: 'Lavash', price: 35000, image: '/placeholder.jpg' },
    { id: '2', name: 'Burger', category: 'Burger', price: 33000, image: '/placeholder.jpg' },
    { id: '3', name: 'Shaverma', category: 'Shaverma', price: 25000, image: '/placeholder.jpg' },
    { id: '4', name: 'Hot-dog', category: 'Hot-Dog', price: 13000, image: '/placeholder.jpg' },
  ]);

  //todo: remove mock functionality
  const [orders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'Alisher Valiyev',
      phone: '+998901234567',
      address: 'Chilonzor, 12-mavze',
      items: JSON.stringify([{ name: 'Lavash', quantity: 2, price: 35000 }]),
      total: 70000,
      createdAt: new Date('2024-10-12T10:30:00'),
    },
    {
      id: '2',
      customerName: 'Nodira Karimova',
      phone: '+998901234568',
      address: 'Yunusobod, 5-kvartal',
      items: JSON.stringify([{ name: 'Burger', quantity: 1, price: 33000 }, { name: 'Hot-dog', quantity: 2, price: 13000 }]),
      total: 59000,
      createdAt: new Date('2024-10-12T11:15:00'),
    },
    {
      id: '3',
      customerName: 'Jamshid Toshmatov',
      phone: '+998901234569',
      address: 'Mirzo Ulug\'bek, 8-uy',
      items: JSON.stringify([{ name: 'Shaverma', quantity: 3, price: 25000 }]),
      total: 75000,
      createdAt: new Date('2024-10-12T12:00:00'),
    },
  ]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setImagePreview("");
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
    setIsProductModalOpen(true);
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="text-2xl font-bold text-primary">🍔 Donar Foof</div>
          <p className="text-sm text-muted-foreground mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("overview")}
            data-testid="button-nav-overview"
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("products")}
            data-testid="button-nav-products"
          >
            <Package className="h-4 w-4 mr-2" />
            Mahsulotlar
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("orders")}
            data-testid="button-nav-orders"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Buyurtmalar
          </Button>
        </nav>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" onClick={onLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Jami mahsulotlar</p>
                      <p className="text-3xl font-bold">{products.length}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Jami buyurtmalar</p>
                      <p className="text-3xl font-bold">{orders.length}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <ShoppingBag className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Jami daromad</p>
                      <p className="text-2xl font-bold font-mono">{totalRevenue.toLocaleString()} so'm</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">So'nggi buyurtmalar</h2>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => {
                    const items = JSON.parse(order.items);
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-bold text-primary">{order.total.toLocaleString()} so'm</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Mahsulotlar boshqaruvi</h2>
                <Button onClick={openAddProduct} data-testid="button-add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Mahsulot qo'shish
                </Button>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rasm</TableHead>
                      <TableHead>Nomi</TableHead>
                      <TableHead>Kategoriya</TableHead>
                      <TableHead>Narx</TableHead>
                      <TableHead className="text-right">Amallar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-mono">{product.price.toLocaleString()} so'm</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => openEditProduct(product)}
                              data-testid={`button-edit-${product.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => console.log('Delete', product.id)}
                              data-testid={`button-delete-${product.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Buyurtmalar tarixi</h2>

              <div className="space-y-4">
                {orders.map((order) => {
                  const items = JSON.parse(order.items);
                  return (
                    <Card key={order.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{order.customerName}</h3>
                          <p className="text-sm text-muted-foreground">{order.phone}</p>
                          <p className="text-sm text-muted-foreground">{order.address}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-bold text-primary text-xl">
                            {order.total.toLocaleString()} so'm
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {new Date(order.createdAt).toLocaleDateString('uz-UZ')} {new Date(order.createdAt).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2">Buyurtma:</p>
                        <div className="space-y-1">
                          {items.map((item: any, idx: number) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {item.name} × {item.quantity} = {(item.price * item.quantity).toLocaleString()} so'm
                            </p>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
            </DialogTitle>
          </DialogHeader>

          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            console.log('Product saved');
            setIsProductModalOpen(false);
          }}>
            <div>
              <Label htmlFor="product-name">Nomi *</Label>
              <Input
                id="product-name"
                defaultValue={editingProduct?.name}
                placeholder="Masalan: Lavash"
                required
                data-testid="input-product-name"
              />
            </div>

            <div>
              <Label htmlFor="product-category">Kategoriya *</Label>
              <Select defaultValue={editingProduct?.category}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Kategoriyani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lavash">Lavash</SelectItem>
                  <SelectItem value="Shaverma">Shaverma</SelectItem>
                  <SelectItem value="Doner">Doner</SelectItem>
                  <SelectItem value="Burger">Burger</SelectItem>
                  <SelectItem value="Tost">Tost</SelectItem>
                  <SelectItem value="Hot-Dog">Hot-Dog</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="product-price">Narx (so'm) *</Label>
              <Input
                id="product-price"
                type="number"
                defaultValue={editingProduct?.price}
                placeholder="25000"
                required
                data-testid="input-product-price"
              />
            </div>

            <div>
              <Label htmlFor="product-image" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Rasm *
              </Label>
              <Input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                data-testid="input-product-image"
              />
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Ko'rinishi:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border"
                    data-testid="img-preview"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsProductModalOpen(false)}
                data-testid="button-cancel-product"
              >
                Bekor qilish
              </Button>
              <Button type="submit" className="flex-1" data-testid="button-save-product">
                Saqlash
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
