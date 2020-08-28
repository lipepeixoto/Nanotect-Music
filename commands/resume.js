const { canModifyQueue } = require("../util/updatevoice");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "resume",
  aliases: ["r"],
  description: "Resume currently playing music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    const resumed = new MessageEmbed()
    .setDescription(`\`\`\`⏯ | Song is now: **Resumed**\`\`\``)

    if (!queue.playing) {
      queue.playing = true;
      queue.connection.dispatcher.resume();
      return queue.textChannel.send(resumed).catch(console.error);
    }

    return message.reply("The queue is not paused.").catch(console.error);
  }
};
