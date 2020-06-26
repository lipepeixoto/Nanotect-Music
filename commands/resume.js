const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "🛎 เล่นเพลงที่หยุดไว้",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ ***➽***  **เล่นเพลงต่อ**`).catch(console.error);
    }

    return message.reply("🚫 ***➽***  **เพลงในคิวไม่หยุด**").catch(console.error);
  }
};
