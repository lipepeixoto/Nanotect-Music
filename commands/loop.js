const { canModifyQueue } = require("../util/updatevoice");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "Toggle music loop",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    const looped = new MessageEmbed()
    .setDescription(`\`\`\`🔁 | Song is now: ${queue.loop ? "**Looped**" : "**Unlooped**"}\`\`\``)

    queue.loop = !queue.loop;
    return queue.textChannel
      .send(looped)
      .catch(console.error);
  }
};
