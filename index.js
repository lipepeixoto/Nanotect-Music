/**
 * Module Imports
 */
const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./config.json");

const client = new Client({ disableMentions: "everyone" });

client.login(TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();

/**
 * Client Events
 */
client.on("ready", () => {
  console.log(`${client.user.username} ready!`);
setInterval(function () {
    let activityTypes = ['PLAYING','STREAMING','LISTENING','WATCHING'];
    let randomType = activityTypes[Math.floor((Math.random()*activityTypes.length))];
    client.user.setActivity('Using Command! #play | #help', {
       type: randomType,
       url: 'https://www.twitch.tv/synyanize'
     });
 }, 30000);
});
client.on("warn", (info) => console.log(info));
client.on("error", console.error);

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("📛 ***➽***  ไม่มีคำสั่งนี้").catch(console.error);
    }
  }
});
