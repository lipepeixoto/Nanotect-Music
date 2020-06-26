const { canModifyQueue } = require("../util/MusicUtil");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "🛎 ข้ามเพลงที่เล่นอยู่",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ ***➽***  **ข้ามเพลงสำเร็จ**`).catch(console.error);
  }
};
