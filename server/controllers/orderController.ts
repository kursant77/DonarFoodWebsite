// server/controllers/orderController.ts
import { Request, Response } from "express";
import { storage } from "../storage";
import axios from "axios";

const TELEGRAM_TOKEN = "TOKENNI_BU_YERGA_QO'YING";
const CHAT_ID = "CHAT_ID_BU_YERGA_QO'YING";

export const orderController = {
  async getAll(req: Request, res: Response) {
    const orders = await storage.getAllOrders();
    res.json(orders);
  },

  async create(req: Request, res: Response) {
    try {
      const { name, phone, address, cart, totalPrice } = req.body;

      // 🧾 Buyurtmani bazaga saqlaymiz
      const newOrder = await storage.addOrder({
        name,
        phone,
        address,
        cart,
        totalPrice,
        date: new Date().toLocaleString("uz-UZ"),
      });

      // 🍔 Mahsulotlar ro‘yxatini matnga aylantiramiz
      const orderItems =
        Array.isArray(cart) && cart.length > 0
          ? cart
              .map(
                (item: any, index: number) =>
                  `${index + 1}. ${item.name} — ${item.price} so'm x ${item.quantity}`
              )
              .join("\n")
          : "Mahsulotlar topilmadi ❌";

      // ✉️ Telegram xabari
      const message = `
🧾 *Yangi zakaz!*
👤 *Ism:* ${name}
📞 *Telefon:* ${phone}
📍 *Manzil:* ${address}

🍔 *Buyurtmalar:*
${orderItems}

💰 *Umumiy summa:* ${totalPrice} so'm
🕒 *Sana:* ${new Date().toLocaleString("uz-UZ")}
`;

      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }
      );

      res.status(201).json({ message: "Buyurtma yuborildi!", order: newOrder });
    } catch (err) {
      console.error("❌ Buyurtma yuborishda xatolik:", err);
      res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
    }
  },
};
