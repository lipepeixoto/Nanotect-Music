const { canModifyQueue } = require("../util/updatevoice");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "stop",
  description: "Stops the music",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    if (!canModifyQueue(message.member)) return;

    const stopped = new MessageEmbed()
    .setDescription(`\`\`\`⏹ | Song is now: **Stopped**\`\`\``)

    queue.songs = [];
    queue.connection.dispatcher.end();
    queue.textChannel.send(stopped).catch(console.error);
  }
};
