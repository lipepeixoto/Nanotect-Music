const { canModifyQueue } = require("../util/EvobotUtil");


module.exports = {
  name: "stop",
  aliases: ["dc"],
  description: "🛎 ปิดเพลงที่เล่นอยู่",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏹ ***➽***  **ปิดเพลงเรียบร้อย**`).catch(console.error);
  }
};
