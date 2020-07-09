const { canModifyQueue } = require("../util/MusicUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skipto",
  aliases: ["st"],
  description: "Skip to the selected queue number",
  execute(message, args) {
    if (!args.length) return message.reply(`Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`);

    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.channel.send("There is no queue.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.songs = queue.songs.slice(args[0] - 2);
    queue.connection.dispatcher.end();

    let skiptoEmbed = new MessageEmbed()

      .setAuthor("⏭ Skipto music...")
      .setDescription(`**❯ Skipped:** ${args[0] - 1} songs`)
      .setColor("RANDOM")
      .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    queue.textChannel.send(skiptoEmbed);
  }
};
