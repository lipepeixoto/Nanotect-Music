const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: ["h"],
  description: "🛎 คำสั่งทั่งหมดของบอทเพลง",
  execute(message) {
    let commands = message.client.commands.array();

    let helpEmbed = new MessageEmbed()
      .setTitle("🔔 Music Help 🔔")
      .setDescription("🛎 คำสั่งเพลงทั่งหมด")
	  .setFooter("2020 ©️ Developer Adivise.", "https://i.imgur.com/0nTWDMk.png")
      .setColor("RANDOM");

    commands.forEach((cmd) => {
      helpEmbed.addField(
        `**${message.client.prefix}${cmd.name} ${cmd.aliases ? `(${cmd.aliases})` : ""}**`,
        `${cmd.description}`,
        true
      );
    });

    helpEmbed.setTimestamp();

    return message.channel.send(helpEmbed);
  }
};
