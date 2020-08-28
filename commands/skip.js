const { canModifyQueue } = require("../util/updatevoice");
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

    const skipped = new MessageEmbed()
    .setDescription(`\`\`\`⏭ | Song is now: **Skipped**\`\`\``)

    queue.playing = true;
    queue.connection.dispatcher.end();
    queue.textChannel.send(skipped).catch(console.error);
  }
};
