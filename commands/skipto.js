const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "🛎 ข้ามเพลงเลขในคิว",
  execute(message, args) {
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`**วิธีใช้** ***➽***  ${message.client.prefix}${name} **<เลขในคิว>**`);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("🚫 ***➽***  **ไม่มีคิว**").catch(console.error);

    queue.songs = queue.songs.slice(args[0] - 2);
    queue.connection.dispatcher.end();
    queue.textChannel.send(`${message.author} ⏭ ***➽***  **ข้ามไปเพลง ${args[0] - 1}**`).catch(console.error);
  }
};
