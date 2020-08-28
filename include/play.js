const ytdlDiscord = require("ytdl-core-discord");
const scdl = require("soundcloud-downloader");
const { MessageEmbed } = require("discord.js");
const { canModifyQueue } = require("../util/updatevoice");

module.exports = {
  async play(song, message) {
    const { PRUNING, SOUNDCLOUD_CLIENT_ID } = require("../config.json");
    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      return queue.textChannel.send(`${message.author} | 🚫 Music has ended.`).catch(console.error);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
      if (song.url.includes("youtube.com")) {
        stream = await ytdlDiscord(song.url, { highWaterMark: 1 << 25 });
      } else if (song.url.includes("soundcloud.com")) {
        try {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined);
        } catch (error) {
          stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, SOUNDCLOUD_CLIENT_ID ? SOUNDCLOUD_CLIENT_ID : undefined);
          streamType = "unknown";
        }
      }
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      console.error(error);
      return message.channel.send(`Error: ${error.message ? error.message : error}`);
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
      .play(stream, { type: streamType })
      .on("finish", () => {
        if (collector && !collector.ended) collector.stop();

        if (queue.loop) {
          // if loop is on, push the song back at the end of the queue
          // so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", (err) => {
        console.error(err);
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    const videoId = getVideoIdFromUrl(song.url);
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    const playedEmbed = new MessageEmbed()
    .setAuthor("Started playing...", "https://cdn.discordapp.com/emojis/741605543046807626.gif?v=1")
    .setDescription(`**[${song.title}](${song.url})**`)
    .setThumbnail(thumbnailUrl)
    .addField(`Current Duration: \`[00:00:00 / ${(song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8))}]\``, `\`\`\`🔴 | 🎶──────────────────────────────\`\`\``)
    .setColor("#C00000")
    .setFooter(`Requested By ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp();  

    try {
      var playingMessage = await queue.textChannel.send(playedEmbed);
      await playingMessage.react("⏭");
      await playingMessage.react("⏯");
      await playingMessage.react("🔁");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
      time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
      if (!queue) return;
      const member = message.guild.member(user);

      switch (reaction.emoji.name) {
        case "⏭":
          queue.playing = true;
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;

          const skipped = new MessageEmbed()
          .setDescription(`\`\`\`⏭ | Song is now: **Skipped**\`\`\``)
          
          queue.connection.dispatcher.end();
          queue.textChannel.send(skipped).catch(console.error);
          collector.stop();
          break;

        case "⏯":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;

          const paused = new MessageEmbed()
          .setDescription(`\`\`\`⏯ | Song is now: **Paused**\`\`\``)

          if (queue.playing) {
            queue.playing = !queue.playing;
            queue.connection.dispatcher.pause(true);
            queue.textChannel.send(paused).catch(console.error);
          } else {

            const resumed = new MessageEmbed()
            .setDescription(`\`\`\`⏯ | Song is now: **Resumed**\`\`\``)

            queue.playing = !queue.playing;
            queue.connection.dispatcher.resume();
            queue.textChannel.send(resumed).catch(console.error);
          }
          break;

        case "🔁":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;
          queue.loop = !queue.loop;

          const looped = new MessageEmbed()
          .setDescription(`\`\`\`🔁 | Song is now: ${queue.loop ? "**Looped**" : "**Unlooped**"}\`\`\``)

          queue.textChannel.send(looped).catch(console.error);
          break;

        case "⏹":
          reaction.users.remove(user).catch(console.error);
          if (!canModifyQueue(member)) return;

          const stopped = new MessageEmbed()
          .setDescription(`\`\`\`⏹ | Song is now: **Stopped**\`\`\``)

          queue.songs = [];
          queue.textChannel.send(stopped).catch(console.error);
          try {
            queue.connection.dispatcher.end();
          } catch (error) {
            console.error(error);
            queue.connection.disconnect();
          }
          collector.stop();
          break;

        default:
          reaction.users.remove(user).catch(console.error);
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll().catch(console.error);
      if (PRUNING && playingMessage && !playingMessage.deleted) {
        playingMessage.delete({ timeout: 3000 }).catch(console.error);
      }
    });
  }
};

function getVideoIdFromUrl(url) {
  const VIDEO_PARAM = 'v=';
  const videoIdStartIndex = url.indexOf(VIDEO_PARAM) + VIDEO_PARAM.length;
  const videoId = url.slice(videoIdStartIndex);
  return videoId;
}
