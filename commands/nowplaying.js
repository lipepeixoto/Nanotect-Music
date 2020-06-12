const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
  description: "🛎 ดูเพลงที่กำลังเล่นอยู่",
  execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("🚫 ***➽***  **ไม่มีเพลงเล่นอยู่ตอนนี้**").catch(console.error);
    const song = serverQueue.songs[0];

    let nowPlaying = new MessageEmbed()
      .setTitle("🔔 กำลังเล่นเพลง")
      .setDescription(`${song.title}\n${song.url}`)
      .setColor("#F8AA2A")
      .setAuthor("Adivise.")
      .setTimestamp();

    if (song.duration > 0) nowPlaying.setFooter(new Date(song.duration * 1000).toISOString().substr(11, 8));

    return message.channel.send(nowPlaying);
  }
};
