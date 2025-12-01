import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

try {
  createRoot(rootElement).render(<App />);
} catch (error) {
  if (process.env.NODE_ENV !== "production") {
    console.error("Failed to render app:", error);
  }
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; flex-direction: column; padding: 20px; text-align: center;">
      <h1 style="color: #ef4444; margin-bottom: 16px;">Xatolik yuz berdi</h1>
      <p style="color: #6b7280; margin-bottom: 8px;">Websayt yuklanmadi. Iltimos, sahifani yangilang.</p>
      <button onclick="window.location.reload()" style="padding: 8px 16px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 16px;">
        Sahifani yangilash
      </button>
    </div>
  `;
}
