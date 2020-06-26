const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "🛎 ข้ามเพลงในคิว",
  execute(message, args) {
    if (!args.length) return message.reply(`**วิธีใช้** ***➽***  **${message.client.prefix}${name} <เลขในคิว>**`);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("🚫 ***➽***  **ไม่มีเพลงในคิว**").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.songs = queue.songs.slice(args[0] - 2);
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ ***➽***  **ข้ามไปเพลงที่ ${args[0] - 1}**`).catch(console.error);
  }
};
