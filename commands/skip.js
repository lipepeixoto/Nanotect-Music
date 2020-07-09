const { canModifyQueue } = require("../util/MusicUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s"],
  description: "Skip the currently playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue)
      return message.reply("There is nothing playing that I could skip for you.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    queue.playing = true;
    queue.connection.dispatcher.end();

    let skipEmbed = new MessageEmbed()

    .setAuthor("⏭ Skipped music...")
    .setDescription(`**❯ Requested By:** ${message.author}`)
    .setColor("RANDOM")
    .setFooter("Creator: Nanotect.", "https://i.imgur.com/40JSoww.png")
    .setTimestamp();

    queue.textChannel.send(skipEmbed);
  }
};
