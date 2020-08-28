const createBar = require("string-progressbar");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "np",
  description: "Show now playing song",
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply("There is nothing playing.").catch(console.error);
    const song = queue.songs[0];
    const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
    const left = song.duration - seek;
    const videoId = getVideoIdFromUrl(song.url);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    let nowPlaying = new MessageEmbed()
      .setAuthor("Now playing...", "https://cdn.discordapp.com/emojis/741605543046807626.gif?v=1")
      .setDescription(`[${song.title}](${song.url})`)
      .setThumbnail(thumbnailUrl)
      .setColor("#000001")
      .addField("**Current Duration:**" + "`[" + new Date(seek * 1000).toISOString().substr(11, 8) + " / " + new Date(song.duration * 1000).toISOString().substr(11, 8) + "]`", `\`\`\`🔴 | ` + createBar((song.duration == 0 ? seek : song.duration), seek, 20)[0] + `\`\`\``)
      .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    return message.channel.send(nowPlaying);
  }
};

function getVideoIdFromUrl(url) {
  const VIDEO_PARAM = 'v=';
  const videoIdStartIndex = url.indexOf(VIDEO_PARAM) + VIDEO_PARAM.length;
  const videoId = url.slice(videoIdStartIndex);
  return videoId;
}