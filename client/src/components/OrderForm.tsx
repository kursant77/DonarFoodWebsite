import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/components/ShoppingCart";
import type { CheckedState } from "@radix-ui/react-checkbox";

interface OrderFormProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  onSubmit: () => void; // ShoppingCart ichidagi handleOrderSubmit
  onCancel: () => void;
}

interface LocationData {
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
}

const TELEGRAM_FUNCTION_URL =
  import.meta.env.VITE_TELEGRAM_FUNCTION_URL || "/.netlify/functions/sentTelegram";

const RESTAURANT_LOCATION = {
  latitude: 41.65475,
  longitude: 60.2856352,
};

const MAX_DELIVERY_DISTANCE_KM = 7;

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateDistanceKm = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);

  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return earthRadiusKm * c;
};

export default function OrderForm({
  subtotal,
  deliveryFee,
  total,
  onSubmit,
  onCancel,
}: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [shareLocation, setShareLocation] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [distanceFromRestaurant, setDistanceFromRestaurant] = useState<number | null>(null);
  const [isWithinDeliveryZone, setIsWithinDeliveryZone] = useState(true);

  const { toast } = useToast();

  // Telefon raqamni formatlash
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Faqat raqamlarni qoldirish (+998 dan tashqari)
    const numbersOnly = value.replace(/\D/g, "");
    
    // Maksimal 9 ta raqam
    const limitedNumbers = numbersOnly.slice(0, 9);
    
    // Faqat raqamlarni saqlash (+998 ko'rsatiladi, lekin value'da saqlanmaydi)
    setPhone(limitedNumbers);
  };

  // Telefon raqamni tekshirish
  const validatePhone = (phoneNumber: string): boolean => {
    // 9 ta raqam bo'lishi kerak
    return phoneNumber.length === 9 && /^\d{9}$/.test(phoneNumber);
  };
// "1390910615", - Mirkamol Atahanov
// "157267759", - Doniyor
// "5865994146", - Asadbek Jumnazarov
// "1197078585", - Javlonbek
  // Geolocation olish
  const handleLocationShare = async (checked: CheckedState) => {
    const isChecked = checked === true;
    setShareLocation(isChecked);

    if (isChecked) {
      if (!navigator.geolocation) {
        toast({
          title: "Xatolik",
          description: "Brauzeringiz geolocation qo'llab-quvvatlamaydi",
          variant: "destructive",
        });
        setShareLocation(false);
        return;
      }

      setGettingLocation(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

          const distanceKm = calculateDistanceKm(
            { latitude, longitude },
            RESTAURANT_LOCATION
          );

          if (distanceKm > MAX_DELIVERY_DISTANCE_KM) {
            setLocationData(null);
            setDistanceFromRestaurant(distanceKm);
            setIsWithinDeliveryZone(false);
            setShareLocation(false);
            setGettingLocation(false);
            toast({
              title: "Yetkazib berish zonasidan tashqarida",
              description: "Biz faqat 7 km radius ichidagi manzillarga xizmat ko'rsatamiz.",
              variant: "destructive",
            });
            return;
          }

          setLocationData({
            latitude,
            longitude,
            googleMapsUrl,
          });
          setDistanceFromRestaurant(distanceKm);
          setIsWithinDeliveryZone(true);

          setGettingLocation(false);
          toast({
            title: "Joylashuv olingan ✅",
            description: `Masofa: ${distanceKm.toFixed(
              1
            )} km. Bu hududga yetkazib bera olamiz.`,
            variant: "success",
          });
        },
        () => {
          setGettingLocation(false);
          setShareLocation(false);
          setDistanceFromRestaurant(null);
          setIsWithinDeliveryZone(true);
          toast({
            title: "Xatolik",
            description:
              "Joylashuv olishda xatolik yuz berdi. Iltimos, manzilni qo'lda kiriting.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
      return;
    }

    setLocationData(null);
    setDistanceFromRestaurant(null);
    setIsWithinDeliveryZone(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address) {
      toast({ title: "Barcha maydonlarni to'ldiring!", variant: "destructive" });
      return;
    }

    // Telefon raqamni tekshirish
    if (!validatePhone(phone)) {
      toast({ 
        title: "Telefon raqamni to'liq to'ldiring", 
        description: "Telefon raqam 9 ta raqamdan iborat bo'lishi kerak.",
        variant: "destructive" 
      });
      return;
    }

    // Joylashuv ruxsati berilmaguncha zakaz berib bo'lmaydi
    if (!shareLocation || !locationData) {
      toast({ 
        title: "Joylashuvni ulashish majburiy!", 
        description: "Iltimos, joylashuvni ulashish checkbox'ini belgilang va ruxsat bering.",
        variant: "destructive" 
      });
      return;
    }

    if (!isWithinDeliveryZone) {
      toast({
        title: "Hudud tashqarisi",
        description: "Afsuski, biz faqat 7 km radiusda xizmat ko'rsatamiz.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const cartItems: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        toast({
          title: "Savat bo'sh",
          description: "Iltimos, kamida bitta mahsulot qo'shing.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // 🧾 Supabase'ga yozish
      const orderData: any = {
        name,
        phone: `+998${phone}`, // +998 ni qo'shamiz
        address,
        items: cartItems,
        subtotal,
        delivery_fee: deliveryFee,
        total,
      };

      // Agar joylashuv ulashilgan bo'lsa, qo'shamiz
      if (shareLocation && locationData) {
        orderData.location_latitude = locationData.latitude;
        orderData.location_longitude = locationData.longitude;
        orderData.location_url = locationData.googleMapsUrl;
      }

      if (typeof distanceFromRestaurant === "number") {
        orderData.delivery_distance_km = distanceFromRestaurant;
      }

      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) throw error;

      const now = new Date();
      const formattedTime = now.toLocaleString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit", // ⏱ Sekundni qo‘shdik
      });
      try {
        await axios.post(TELEGRAM_FUNCTION_URL, {
          name,
          phone: `+998${phone}`,
          address,
          items: cartItems,
          subtotal,
          deliveryFee,
          total,
          location: locationData,
          distanceKm: distanceFromRestaurant,
          timestamp: now.toISOString(),
          formattedTime,
        });
      } catch (telegramError: any) {
        console.error("Telegram xatosi:", telegramError);
        toast({
          title: "Eslatma yuborishda muammo",
          description: "Buyurtma qabul qilindi, lekin Telegram xabari yuborilmadi.",
        });
      }

      toast({ 
        title: "Buyurtma muvaffaqiyatli yuborildi! 🎊",
        description: "Tez orada siz bilan bog'lanamiz. Rahmat!",
        variant: "success",
      });
      localStorage.removeItem("cart");
      onSubmit();
    } catch (err: any) {
      toast({
        title: "Xatolik yuz berdi",
        description: err.message || "Buyurtma berishda xatolik yuz berdi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <h2 className="text-2xl font-bold mb-6">Buyurtma berish</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Ismingiz *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingizni kiriting"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefon raqam *</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                <span className="text-foreground font-semibold text-base">+998</span>
              </div>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData("text");
                  // Faqat raqamlarni olish
                  const numbersOnly = pastedText.replace(/\D/g, "");
                  // Maksimal 9 ta raqam
                  const limitedNumbers = numbersOnly.slice(0, 9);
                  setPhone(limitedNumbers);
                }}
                placeholder="90 123 45 67"
                required
                className="pl-[3.5rem] text-base"
                maxLength={9}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {phone.length < 9 
                ? `${9 - phone.length} ta raqam qoldi` 
                : "✅ Telefon raqam to'liq"}
            </p>
          </div>

          <div>
            <Label htmlFor="address">Manzil *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Yetkazib berish manzilini kiriting"
              required
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="shareLocation"
              checked={shareLocation}
              onCheckedChange={handleLocationShare}
              disabled={gettingLocation}
              required
            />
            <Label
              htmlFor="shareLocation"
              className="text-sm font-normal cursor-pointer"
            >
              {gettingLocation 
                ? "Joylashuv olinmoqda..." 
                : "Joylashuvni ulashish va Maxfiylik siyosatiga rozilik bildirish *"}
            </Label>
          </div>
          {shareLocation && locationData && distanceFromRestaurant !== null && (
            <p
              className={`text-sm mt-2 ${
                isWithinDeliveryZone ? "text-green-600 dark:text-green-400" : "text-red-600"
              }`}
            >
              Siz Doner Fooddan {distanceFromRestaurant.toFixed(1)} km uzoqdasiz. Maksimal radius:{" "}
              {MAX_DELIVERY_DISTANCE_KM} km.
            </p>
          )}

          <div className="border-t pt-4 mt-6">
            {deliveryFee > 0 && (
              <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-md">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  ℹ️ Buyurtma summasi 50,000 so'mdan kam bo'lgani uchun yetkazib berish to'lovi (10,000 so'm) qo'shildi.
                </p>
              </div>
            )}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span>Mahsulotlar:</span>
                <span className="font-mono">
                  {subtotal.toLocaleString()} so'm
                </span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex items-center justify-between text-sm text-orange-600 dark:text-orange-400">
                  <span>Yetkazib berish to'lovi:</span>
                  <span className="font-mono font-semibold">
                    +{deliveryFee.toLocaleString()} so'm
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-lg font-bold pt-2 border-t">
                <span>Jami to'lov:</span>
                <span className="font-mono text-primary text-2xl">
                  {total.toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Bekor qilish
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || !shareLocation || !locationData || gettingLocation}
            >
              {loading ? "Yuborilmoqda..." : "Tasdiqlash"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
