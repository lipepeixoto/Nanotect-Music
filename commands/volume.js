const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "🛎 ปรับระดับเสียงบอทเพลง",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("📛 ***➽***  **คุณต้องเข้าห้องพูดคุยก่อน**").catch(console.error);

    if (!args[0]) return message.reply(`🔊 ***➽***  ระดับเสียงตอนนี้ ***➽***  **${queue.volume}%**`).catch(console.error);
    if (isNaN(args[0])) return message.reply("🔊 ***➽***  **โปรดระบุระดับเสียง**").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("🔊 ***➽***  **โปรดระบุระดับเสียง 0 - 100**").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return queue.textChannel.send(`🔊 ***➽***  เสียงตั่งค่าเป็น ***➽***  **${args[0]}%**`).catch(console.error);
  }
};
