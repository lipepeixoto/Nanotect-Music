const { canModifyQueue } = require("../util/MusicUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ['l'],
  description: "Toggle music loop",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.");
    if (!canModifyQueue(message.member)) return;

    queue.loop = !queue.loop;

    let loopEmbed = new MessageEmbed()

      .setAuthor("🔄 Looped music...")
      .setDescription(`**❯ Loop is now:** ${queue.loop ? "✅" : "❎"}`)
      .setColor("RANDOM")
      .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    return queue.textChannel.send(loopEmbed);
  }
};
