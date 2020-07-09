const { canModifyQueue } = require("../util/MusicUtil");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pause the currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause(true);

      let pauseEmbed = new MessageEmbed()

      .setAuthor("⏯ Paused music...")
      .setDescription(`**❯ Requested By:** ${message.author}`)
      .setColor("RANDOM")
      .setFooter("Creator: Nanotect.", "https://i.imgur.com/40JSoww.png")
      .setTimestamp();

      return queue.textChannel.send(pauseEmbed);
    }
  }
};
