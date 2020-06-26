const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "🛎 เปิด : ปิด เล่นเพลงซ้ำ",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    // toggle from false to true and reverse
    queue.loop = !queue.loop;
    return queue.textChannel
      .send(`🔁 เล่นเพลงซ้ำ ***➽***  ${queue.loop ? "**เปิด**" : "**ปิด**"}`)
      .catch(console.error);
  }
};
