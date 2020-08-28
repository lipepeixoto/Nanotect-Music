const { canModifyQueue } = require("../util/updatevoice");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["v"],
  description: "Change volume of currently playing music",
  execute(message, args) {
    const queue = message.client.queue.get(message.guild.id);

    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member))
      return message.reply("You need to join a voice channel first!").catch(console.error);

      const currentvolume = new MessageEmbed()
      .setDescription(`\`\`\`🔊 | The current volume is: **${queue.volume}%**\`\`\``)

    if (!args[0]) return message.reply(currentvolume).catch(console.error);
    if (isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("Please use a number between 0 - 100.").catch(console.error);

    queue.volume = args[0];
    queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    const setvolume = new MessageEmbed()
    .setDescription(`\`\`\`🔊 | Volume set to: **${args[0]}%**\`\`\``)

    return queue.textChannel.send(setvolume).catch(console.error);
  }
};
