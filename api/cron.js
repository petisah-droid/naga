export default async function handler(req, res) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ALLOWED_GROUP_ID = "-1003976963100";
  const messageText = "Halo, kunjungi naga.hs.vc untuk profile kami";

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: ALLOWED_GROUP_ID,
        text: messageText,
        disable_web_page_preview: false
      })
    });

    const data = await response.json();
    return res.status(200).json({ success: true, result: data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
