const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
  description: "🛎 ดูเพลงที่กำลังเล่นอยู่",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
    const song = queue.songs[0];

    let nowPlaying = new MessageEmbed()
      .setTitle("🔔 กำลังเล่นเพลง")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("RANDOM")
      .setAuthor("Adivise")
      .setFooter("2020 ©️ Developer Adivise.", "https://i.imgur.com/0nTWDMk.png")
      .setTimestamp();

    if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
