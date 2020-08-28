const { canModifyQueue } = require("../util/updatevoice");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shuffle",
  description: "Shuffle queue",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    const shuffled = new MessageEmbed()
    .setDescription(`\`\`\`🔀 | Song is now: **Shuffled**\`\`\``)

    let songs = queue.songs;
    for (let i = songs.length - 1; i > 1; i--) {
      let j = 1 + Math.floor(Math.random() * i);
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    queue.songs = songs;
    message.client.queue.set(message.guild.id, queue);
    queue.textChannel.send(shuffled).catch(console.error);
  }
};
