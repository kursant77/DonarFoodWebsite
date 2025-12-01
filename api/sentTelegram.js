const axios = require("axios");

const DEFAULT_BOT_TOKEN = "8217777940:AAEtHgcJq95sXehj2vsyH9CFf5PfpL2pI84";
const DEFAULT_CHAT_IDS = [
  "5865994146", // Asadbek Jumnazarov
  "1390910615", // Mirkamol Atahanov
  "1197078585", // Javlonbek
  "157267759", // Doniyor
];

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || DEFAULT_BOT_TOKEN;
const CHAT_IDS = (process.env.TELEGRAM_CHAT_IDS || DEFAULT_CHAT_IDS.join(","))
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

const TELEGRAM_API = BOT_TOKEN
  ? `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
  : null;

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(200).set(corsHeaders).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .set(corsHeaders)
      .json({ error: "Method not allowed" });
  }

  try {
    // Validate request body exists
    if (!req.body) {
      return res
        .status(400)
        .set(corsHeaders)
        .json({ error: "Request body is required" });
    }

    // Parse and validate JSON
    let order;
    try {
      order = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      return res.status(400).set(corsHeaders).json({
        error: "Invalid JSON in request body",
        details: parseError.message,
      });
    }

    // Validate required fields
    if (!TELEGRAM_API || CHAT_IDS.length === 0) {
      return res.status(500).set(corsHeaders).json({
        error: "Server is missing Telegram credentials",
      });
    }

    if (!order.name || !order.phone || !order.total) {
      return res.status(400).set(corsHeaders).json({
        error: "Missing required fields",
        required: ["name", "phone", "total"],
      });
    }

    const items = Array.isArray(order.items) ? order.items : [];
    const itemsList =
      items.length > 0
        ? items
            .map((item) => {
              const qty = Number(item.quantity ?? item.qty ?? 1) || 1;
              const price = Number(item.price) || 0;
              return `- ${item.name ?? "Noma'lum"} (${qty} dona) — ${price.toLocaleString()} so'm`;
            })
            .join("\n")
        : "— Mahsulotlar ro'yxati mavjud emas";

    const deliveryInfo =
      Number(order.deliveryFee) > 0
        ? `\n🚚 Yetkazib berish: ${Number(order.deliveryFee).toLocaleString()} so'm`
        : "";

    let locationInfo = "";
    if (order.location?.googleMapsUrl) {
      const { latitude, longitude, googleMapsUrl } = order.location;
      const hasCoords =
        typeof latitude === "number" && typeof longitude === "number";
      const coords = hasCoords
        ? `\nKoordinatalar: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        : "";
      locationInfo = `\n📍 Joylashuv: ${googleMapsUrl}${coords}`;
    }
    const distanceInfo =
      typeof order.distanceKm === "number"
        ? `\n📏 Masofa: ${Number(order.distanceKm).toFixed(1)} km`
        : "";

    const message = `
🧾 Yangi buyurtma!

👤 Ism: ${order.name}
📞 Telefon: ${order.phone}
📍 Manzil: ${order.address ?? "—"}${locationInfo}${distanceInfo}
🍽 Mahsulotlar:
${itemsList}

💰 Mahsulotlar: ${Number(order.subtotal || 0).toLocaleString()} so'm${deliveryInfo}
💰 Umumiy summa: ${Number(order.total).toLocaleString()} so'm
⏰ Vaqt: ${order.formattedTime ?? order.timestamp ?? new Date().toISOString()}
`;

    await Promise.all(
      CHAT_IDS.map((chatId) =>
        axios.post(TELEGRAM_API, {
          chat_id: chatId,
          text: message.trim(),
        })
      )
    );

    return res.status(200).set(corsHeaders).json({
      success: true,
      message: "✅ Telegramga yuborildi",
    });
  } catch (error) {
    console.error("❌ Telegramga yuborishda xato:", error);

    // Handle axios errors
    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.description || error.message || "Unknown error";

    return res
      .status(statusCode >= 400 && statusCode < 500 ? statusCode : 500)
      .set(corsHeaders)
      .json({
        error: "❌ Telegramga yuborishda xato",
        details: errorMessage,
      });
  }
};

