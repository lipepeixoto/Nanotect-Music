const { play } = require("../include/play");
const { YOUTUBE_API_KEY, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(YOUTUBE_API_KEY);
const scdl = require("soundcloud-downloader");

module.exports = {
  name: "play",
  cooldown: 3,
  aliases: ["p"],
  description: "🛎 เล่นเพลงจากยูทูป หรือ ซาวคาว",
  async execute(message, args) {
    const { channel } = message.member.voice;

    const serverQueue = message.client.queue.get(message.guild.id);
    if (!channel) return message.reply("You need to join a voice channel first!").catch(console.error);
    if (serverQueue && channel !== message.guild.me.voice.channel)
      return message.reply(`💥 **คุณต้องไปอยู่ห้องเดียวกันกับบอท** ${message.client.user}`).catch(console.error);

    if (!args.length)
      return message
        .reply(`**วิธีใช้** ***➽***  **${message.client.prefix}play <ลิ้งเพลง | ชื่อเพลง | ลิ้งซาวคาว>**`)
        .catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.reply("📛 ***➽***  **ไม่สามารถเข้าห้องพูดคุย ต้องการยศที่เข้าห้องได้**");
    if (!permissions.has("SPEAK"))
      return message.reply("📛 ***➽***  **ไม่สามารถพูดคุยได้ ต้องการยศที่พูดคุยได้**");

    const search = args.join(" ");
    const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
    const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
    const url = args[0];
    const urlValid = videoPattern.test(args[0]);

    // Start the playlist if playlist url was provided
    if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
      return message.client.commands.get("playlist").execute(message, args);
    }

    const queueConstruct = {
      textChannel: message.channel,
      channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 100,
      playing: true
    };

    let songInfo = null;
    let song = null;

    if (urlValid) {
      try {
        songInfo = await ytdl.getInfo(url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply(error.message).catch(console.error);
      }
    } else if (scRegex.test(url)) {
      // It is a valid Soundcloud URL
      if (!SOUNDCLOUD_CLIENT_ID)
        return message.reply("📛 ***➽**  **คุณต้อง ใส่ SoundCloud ID ใน Config ก่อนถึงคุณจะสามารถใช้ได้**").catch(console.error);
      try {
        const trackInfo = await scdl.getInfo(url, SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: url
        };
      } catch (error) {
        if (error.statusCode === 404)
          return message.reply("📛 ***➽**  **ค้นหาเพลงในซาวคาวไม่เจอ**").catch(console.error);
        return message.reply("📛 ***➽**  **เกิดข้อผิดพลาดในการเล่นเพลงในซาวคาว**").catch(console.error);
      }
    } else {
      try {
        const results = await youtube.searchVideos(search, 1);
        songInfo = await ytdl.getInfo(results[0].url);
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
          duration: songInfo.videoDetails.lengthSeconds
        };
      } catch (error) {
        console.error(error);
        return message.reply("⛔ ***➽***  **ไม่เจอเพลงที่ค้นหา**").catch(console.error);
      }
    }

    if (serverQueue) {
      serverQueue.songs.push(song);
      return serverQueue.textChannel
        .send(`✅ ***➽***  **${song.title}** ถูกเพิ่มเข้าไปในคิวโดย ***➽***  ${message.author}`)
        .catch(console.error);
    }

    queueConstruct.songs.push(song);
    message.client.queue.set(message.guild.id, queueConstruct);

    try {
      queueConstruct.connection = await channel.join();
      play(queueConstruct.songs[0], message);
    } catch (error) {
      console.error(`⛔ ***➽***  ไม่สามารถเข้าห้องพูดคุยได้ ***➽***  ${error}`);
      message.client.queue.delete(message.guild.id);
      await channel.leave();
      return message.channel.send(`⛔ ***➽***  ไม่สามารถเข้าห้องได้ ***➽***  ${error}`).catch(console.error);
    }
  }
};