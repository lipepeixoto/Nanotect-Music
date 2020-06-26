const { MessageEmbed } = require("discord.js");
const { YOUTUBE_API_KEY } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "search",
  description: "🛎 ค้นหาเพลงในยูทูป",
  async execute(message, args) {
    if (!args.length)
      return message.reply(`**วิธีใช้** ***➽***  **${message.client.prefix}${module.exports.name} <ชื่อเพลง>**`).catch(console.error);
    if (message.channel.activeCollector)
      return message.reply("🔔 ***➽***  **คำสั่งได้เริ่มไปแล้ว**");
    if (!message.member.voice.channel)
      return message.reply("📛 ***➽***  **คุณต้องเข้าห้องพูดคุยก่อน**").catch(console.error);

    const search = args.join(" ");

    let resultsEmbed = new MessageEmbed()
      .setTitle(`**ระบุเลขคิว เพลงที่ต้องการเล่น**`)
      .setDescription(`เพลงทั่งหมด ***➽***  ${search}`)
      .setFooter("2020 ©️ Developer Adivise.", "https://i.imgur.com/0nTWDMk.png")
      .setColor("RANDOM");

    try {
      const results = await youtube.searchVideos(search, 10);
      results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

      var resultsMessage = await message.channel.send(resultsEmbed);

      function filter(msg) {
        const pattern = /(^[1-9][0-9]{0,1}$)/g;
        return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
      }

      message.channel.activeCollector = true;
      const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
      const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;

      message.channel.activeCollector = false;
      message.client.commands.get("play").execute(message, [choice]);
      resultsMessage.delete().catch(console.error);
    } catch (error) {
      console.error(error);
      message.channel.activeCollector = false;
    }
  }
};
