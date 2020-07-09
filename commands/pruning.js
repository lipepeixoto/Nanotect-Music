const fs = require("fs");
const config = require("../config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "pruning",
  description: "Toggle pruning of bot messages",
  execute(message) {
    config.PRUNING = !config.PRUNING;

    fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.log(err);
        return message.channel.send("There was an error writing to the file.").catch(console.error);
      }

      let pruneEmbed = new MessageEmbed()

      .setAuthor("💬 Pruning massage...")
      .setDescription(`**❯ Message pruning is:** ${config.PRUNING ? "✅" : "❎"}`)
      .setColor("RANDOM")
      .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

      return message.channel.send(pruneEmbed);
    });
  }
};
