module.exports = {
  name: "volume",
  aliases: ['v'],
  description: "🛎 ปรับระดับเสียงบอทเพลง",
  execute(message, args) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.reply("📛 ***➽***  **คุณต้องเข้าห้องพูดคุยก่อน**").catch(console.error);
    if (!serverQueue) return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);

    if (!args[0])
      return message.reply(`🔊 ***➽***  ระดับเสียงบอทตอนนี้ ***➽***  **${serverQueue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("🔊 ***➽***  **โปรดระบุเลขระดับเสียง**").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("🔊 ***➽***  **โปรดระบุเลขระดับเสียง 0 - 100**").catch(console.error);

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return serverQueue.textChannel.send(`🔊 ***➽***  เสียงตั่งค่าเป็น ***➽***  **${args[0]}%**`).catch(console.error);
  }
};
