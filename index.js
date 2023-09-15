const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");

const { token, Debuglogging, activity } = require("./config.json");

// Things?
const Reset = "\x1b[0m";
const Bright = "\x1b[1m";
const Dim = "\x1b[2m";
const Underscore = "\x1b[4m";
const Blink = "\x1b[5m";
const Reverse = "\x1b[7m";
const Hidden = "\x1b[8m";
//Foreground
const FgBlack = "\x1b[30m";
const FgRed = "\x1b[31m";
const FgGreen = "\x1b[32m";
const FgYellow = "\x1b[33m";
const FgBlue = "\x1b[34m";
const FgMagenta = "\x1b[35m";
const FgCyan = "\x1b[36m";
const FgWhite = "\x1b[37m";
// Background
const BgBlack = "\x1b[40m";
const BgRed = "\x1b[41m";
const BgGreen = "\x1b[42m";
const BgYellow = "\x1b[43m";
const BgBlue = "\x1b[44m";
const BgMagenta = "\x1b[45m";
const BgCyan = "\x1b[46m";
const BgWhite = "\x1b[47m";

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

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    const commandName = command.help.name.toLowerCase();
    console.log(`-----------------------------`);
    console.log(`| Loaded command: ${commandName} |`);
    console.log(`| Command category: ${command.help.cat} |`);

    client.commands.set(commandName, command);
  }
}
console.log(`----------------------------`);
console.log("Successfully loaded commands to memory");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
    await command.interaction(interaction, client);
    console.log(
      `Command ${FgGreen}${interaction.commandName}${Reset} was ran by ${FgMagenta}${interaction.user.tag} (${interaction.user.id})${Reset}`
    ); // Logs the command
  } catch (error) {
    console.error(FgRed + Blink + error + Reset);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(token);
