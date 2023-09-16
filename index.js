const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");

const { token, Debuglogging, activity } = require("./config.json");

// Data imports for ping, uptime, ram usage, etc
const moment = require("moment");
let os = require("os");
let cpuStat = require("cpu-stat");

// Every hour send important data to the console such as memory usage, ping, etc
setInterval(function () {
  // Get the uptime
  const duration = moment.duration(client.uptime);
  const uptime = `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;
  // Get the ping
  const ping = `${client.ws.ping}ms`;
  // Get the memory usage
  const memusage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
    2
  )} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`;
  // Get the cpu usage
  /*cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
        return console.log(err);
    } 
  })*/
  // Start the logging
  console.log(`-----------------------------`);
  console.log(`| ${FgYellow}Important data${Reset} |`);
  console.log(`| ${FgYellow}Uptime: ${Reset}${uptime} |`);
  console.log(`| ${FgYellow}Ping: ${Reset}${ping} |`);
  console.log(`| ${FgYellow}Memory usage: ${Reset}${memusage} |`);
  //console.log(`| ${FgYellow}CPU usage: ${Reset}${percent.toFixed(2)}% |`); // Need to get fixed
  console.log(`-----------------------------`);
}, 3600000 /* 1 hour */);

// Import the colors from /functions/colors.js
const {
  Reset,
  FgYellow,
  FgRed,
  FgGreen,
  Underscore,
  FgMagenta,
} = require("./functions/colors.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.commands = new Collection();

const commandFolders = fs.readdirSync("./commands");
console.log(`${FgYellow}Loading commands to memory${Reset}`);
try {
  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./commands/${folder}`)
      .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      const commandName = command.help.name.toLowerCase();
      console.log(`-----------------------------`);
      console.log(`| Loaded command: ${Underscore}${commandName}${Reset} |`);
      console.log(
        `| Command category: ${Underscore}${command.help.cat}${Reset} |`
      );

      client.commands.set(commandName, command);
    }
  }
} catch (err) {
  console.log(`${FgRed}[ERROR] ${err}${Reset}`);
}
console.log(`----------------------------`);
console.log(`${FgGreen}Successfully loaded commands to memory${Reset}`);

client.on("ready", () => {
  console.log(
    `${FgGreen}Logged in as ${Underscore}${client.user.tag}${Reset}!`
  );
  client.user.setActivity(
    `${activity[Math.round(Math.random() * (activity.length - 1))]}`
  );

  setInterval(function () {
    client.user.setActivity(
      `${activity[Math.floor(Math.random() * (activity.length - 1))]}`
    );
  }, 10000);
});
// A debug error
if (Debuglogging === true) {
  client.on("debug", async (debugerr) => {
    console.log(`${FgYellow}[DEBUG] ${debugerr}${Reset}`);
  });
}
// A warning error
client.on("warn", async (warnerr) => {
  console.log(`${FgYellow}[WARN] ${warnerr}${Reset}`);
});
// A error error
client.on("error", async (error) => {
  console.log(`${FgRed}[ERROR] ${error}${Reset}`);
});

// When slash commands are ran
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    // Run the command
    await command.interaction(interaction, client);
    console.log(
      `Command ${FgGreen}${interaction.commandName}${Reset} was ran by ${FgMagenta}${interaction.user.tag} (${interaction.user.id})${Reset}`
    ); // Logs the command
  } catch (error) {
    console.error(FgRed + error + Reset);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
