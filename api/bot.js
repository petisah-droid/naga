export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("Bot Webhook is running active.");
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const OWNER_ID = 9032087771;
  const ALLOWED_GROUP_ID = -1003976963100;

  const update = req.body;
  if (!update) return res.status(200).send("No update body");

  // Helper untuk kirim pesan
  const sendMessage = async (chatId, text) => {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "HTML" })
    });
  };

  // Helper untuk meninggalkan grup/channel yang tidak diizinkan
  const leaveChat = async (chatId) => {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/leaveChat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId })
    });
  };

  const message = update.message;

  if (message) {
    const chatId = message.chat.id;
    const chatType = message.chat.type;

    // 1. KEAMANAN: Proteksi Grup / Channel Asing
    if (chatType === "group" || chatType === "supergroup" || chatType === "channel") {
      if (chatId !== ALLOWED_GROUP_ID) {
        // Jika bot diundang ke grup atau channel lain, bot pamit lalu keluar seketika
        await sendMessage(chatId, "Akses ditolak. Bot ini hanya beroperasi di grup resmi N.A.G.A.");
        await leaveChat(chatId);
        return res.status(200).send("Left unauthorized chat");
      }
    }

    // 2. SAMBUTAN MEMBER BARU DI GRUP RESMI
    if (chatId === ALLOWED_GROUP_ID && message.new_chat_members && message.new_chat_members.length > 0) {
      for (const member of message.new_chat_members) {
        // Jangan menyapa diri bot sendiri jika bot yang diundang
        if (member.is_bot) continue;
        const name = member.first_name || "Kawan";
        const welcomeText = `Selamat datang <b>${name}</b>!\n\nHalo, kunjungi http://naga.hs.vc/  untuk profile kami`;
        await sendMessage(ALLOWED_GROUP_ID, welcomeText);
      }
      return res.status(200).send("Member greeted");
    }

    // 3. PRIVATE CHAT KONTROL (HANYA UNTUK ANDA SEBAGAI OWNER)
    if (chatType === "private") {
      const senderId = message.from?.id;

      if (senderId !== OWNER_ID) {
        await sendMessage(chatId, "Akses ditolak. Bot ini terkunci khusus oleh Master N.A.G.A.");
        return res.status(200).send("Unauthorized user");
      }

      const text = message.text || "";

      if (text === "/start") {
        await sendMessage(chatId, "<b>Akses Diterima, Master.</b>\nSistem bot N.A.G.A aktif dan siap menerima instruksi.");
      } else if (text === "/ping") {
        await sendMessage(chatId, "<b>Status:</b> Bot online dan terhubung ke Vercel.");
      } else if (text.startsWith("/broadcast ")) {
        const broadcastMsg = text.replace("/broadcast ", "");
        await sendMessage(ALLOWED_GROUP_ID, broadcastMsg);
        await sendMessage(chatId, "Pesan broadcast berhasil dikirim ke grup.");
      } else {
        await sendMessage(chatId, `Perintah diterima, Master: "${text}"`);
      }

      return res.status(200).send("Command processed");
    }
  }

  return res.status(200).send("OK");
}
