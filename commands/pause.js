const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "pause",
  description: "🛎 หยุดเพลงที่กำลังเล่นอยู่",
  execute(message) {
    if (!canModifyQueue(message.member)) return

    const queue = message.client.queue.get(message.guild.id);
    if (queue && queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);
      return queue.textChannel.send(`${message.author} ⏸  ***➽***  **หยุดเพลงเรียบร้อย**`).catch(console.error);
    }
    
    return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
  }
};
