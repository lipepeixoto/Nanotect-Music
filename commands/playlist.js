const { MessageEmbed } = require("discord.js");
const { play } = require("../include/play");
const { YOUTUBE_API_KEY, MAX_PLAYLIST_SIZE } = require("../config.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);

module.exports = {
  name: "playlist",
  aliases: ["pl"],
  description: "🛎 เล่นเพลย์ลิสต์จากยูทูป",
  async execute(message, args) {
    const { PRUNING } = require("../config.json");
    const { channel } = message.member.voice;

    if (!args.length)
      return message
        .reply(`**วิธีใช้** ***➽***  **${message.client.prefix}playlist <ลิ้งเพลงเพลย์ลิสต์ | ชื่อเพลงเพลย์ลิสต์>**`)
        .catch(console.error);
    if (!channel) return message.reply("📛 ***➽***  **คุณต้องเข้าห้องพูดคุยก่อน**").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("📛 ***➽***  **ไม่สามารถเข้าห้องพูดคุยต้องการยศที่เข้าห้องได้**");
    if (!permissions.has("SPEAK"))
      return message.reply("📛 ***➽***  **ไม่สามารถพูดคุยได้ ต้องการยศที่พูดคุยได้**");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
      }
    }

    videos.forEach((video) => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        serverQueue.songs.push(song);
        if (!PRUNING)
          message.channel
            .send(`✅ ***➽***  **${song.title}** **ถูกเพิ่มเข้าไปในคิว** ${message.author}`)
            .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    let playlistEmbed = new MessageEmbed()
      .setTitle(`${playlist.title}`)
      .setURL(playlist.url)
      .setColor("#F8AA2A")
      .setTimestamp();

    if (!PRUNING) {
      playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
      if (playlistEmbed.description.length >= 2048)
        playlistEmbed.description =
          playlistEmbed.description.substr(0, 2007) + "\n📛 ***➽***  **เพลย์ลิสต์ยาวเกินไป...**";
    }

    message.channel.send(`${message.author} **กำลังเล่นเพลย์ลิสต์**`, playlistEmbed);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`⛔ ***➽***  ไม่สามารถเข้าห้องพูดคุยได้ ***➽***  ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`⛔ ***➽***  ไม่สามารถเข้าห้องได้ ***➽***  ${error}`).catch(console.error);
      }
    }
  }
};
