export default async function handler(req, res) {
  // Aktifkan CORS agar website bisa mengirim data ke API ini
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const OWNER_ID = "9032087771";

  const telegramMessage = 
    `🔔 <b>PESAN BARU DARI WEBSITE N.A.G.A</b>\n\n` +
    `👤 <b>Nama:</b> ${name || "Anonim"}\n` +
    `✉️ <b>Email:</b> ${email || "-"}\n` +
    `📝 <b>Pesan:</b>\n${message || "Pengunjung menekan tombol kontak."}\n\n` +
    `🌐 <i>Dikirim otomatis via Vercel</i>`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: OWNER_ID,
        text: telegramMessage,
        parse_mode: "HTML"
      })
    });

    return res.status(200).json({ success: true, message: "Terkirim ke Telegram" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
