import axios from "axios";

const BOT_TOKEN = "8217777940:AAEtHgcJq95sXehj2vsyH9CFf5PfpL2pI84";
const CHAT_ID = "5865994146";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

export async function sendOrderToTelegram(order) {
  const message = `
🧾 Yangi buyurtma!
👤 Ism: ${order.name}
📞 Telefon: ${order.phone}
🍔 Taom: ${order.product}
💰 Narx: ${order.price} so'm
`;

  try {
    await axios.post(TELEGRAM_API, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("✅ Telegramga yuborildi");
  } catch (error) {
    console.error("❌ Telegramga yuborishda xato:", error);
  }
}
