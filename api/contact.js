export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { name, email, message } = req.body || {};
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const OWNER_ID = "9032087771";

  const telegramMessage = 
    `🔔 <b>PESAN BARU DARI WEBSITE N.A.G.A</b>\n\n` +
    `👤 <b>Nama:</b> ${name || "Anonim"}\n` +
    `✉️ <b>Email:</b> ${email || "-"}\n` +
    `📝 <b>Pesan:</b>\n${message || "Pengunjung mengirim pesan form."}\n\n` +
    `🌐 <i>Dikirim otomatis via Vercel</i>`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: OWNER_ID,
        text: telegramMessage,
        parse_mode: "HTML"
      })
    });

    const tgData = await tgRes.json();
    if (tgData.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ success: false, error: tgData.description });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
