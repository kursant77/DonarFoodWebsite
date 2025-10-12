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
import { Plus, Edit2, Trash2, LogOut, Package, ShoppingBag, Image as ImageIcon } from "lucide-react";
import type { Product, Order } from "@shared/schema";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  //todo: remove mock functionality
  const [products] = useState<Product[]>([
    { id: '1', name: 'Lavash', category: 'Lavash', price: 35000, image: '/placeholder.jpg' },
    { id: '2', name: 'Burger', category: 'Burger', price: 33000, image: '/placeholder.jpg' },
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
      createdAt: new Date(),
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

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">🍔 Donar Foof</div>
            <span className="text-sm text-muted-foreground">Admin Panel</span>
          </div>
          <Button variant="outline" onClick={onLogout} data-testid="button-logout">
            <LogOut className="h-4 w-4 mr-2" />
            Chiqish
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            className="rounded-full"
            data-testid="button-tab-products"
          >
            <Package className="h-4 w-4 mr-2" />
            Mahsulotlar
          </Button>
          <Button
            variant={activeTab === "orders" ? "default" : "outline"}
            onClick={() => setActiveTab("orders")}
            className="rounded-full"
            data-testid="button-tab-orders"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Buyurtmalar
          </Button>
        </div>

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
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
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
                          {new Date(order.createdAt).toLocaleDateString('uz-UZ')}
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
