const { canModifyQueue } = require("../util/MusicUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Resume currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(`${message.author} ▶ resumed the music!`).catch(console.error);
    }

    let resumeEmbed = new MessageEmbed()

    .setAuthor("⏯ Resume music...")
    .setDescription(`**❯ Requested By:** ${message.author}`)
    .setColor("RANDOM")
    .setFooter("Creator: Nanotect.", "https://i.imgur.com/40JSoww.png")
    .setTimestamp();

    return message.reply(resumeEmbed);
  }
};
