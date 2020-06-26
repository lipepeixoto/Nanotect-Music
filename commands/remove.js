const { canModifyQueue } = require("../util/EvobotUtil");

module.exports = {
  name: "remove",
  description: "🛎 ลบเพลงออกจากคิว",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("📛 ***➽***  **ไม่มีเพลงในคิว**").catch(console.error);
    if (!canModifyQueue(message.member)) return;
    
    if (!args.length) return message.reply(`**วิธีใช้** ***➽***  **${message.client.prefix}remove <เลขในคิว>**`);
    if (isNaN(args[0])) return message.reply(`**วิธีใช้** ***➽***  **${message.client.prefix}remove <เลขในคิว>**`);

    const song = queue.songs.splice(args[0] - 1, 1);
    queue.textChannel.send(`${message.author} ❌ ***➽***  **ได้ลบเพลง** **${song[0].title}** **ออกจากคิว**`);
  }
};
