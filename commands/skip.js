const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skip",
  aliases: ['s'],
  description: "🛎 ข้ามเพลงที่เล่นอยู่",
  execute(message) {
    if (!canModifyQueue(message.member)) return;

    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.channel.send("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);

    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ ***➽***  **ข้ามเพลงแล้ว**`).catch(console.error);
  }
};
