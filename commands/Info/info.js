const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, version} = require("discord.js");
const { UA } = require("../../config.json");
const moment = require("moment");
let os = require('os')
let cpuStat = require("cpu-stat")

module.exports.help = {
    name: `info`,
    desc: `Gets info on the bot`,
    cat: `Info`,
    data: new SlashCommandBuilder()
        .setName(`info`)
        .setDescription(`Gets info on the bot`)
}

module.exports.interaction = async (interaction, client) => {

    cpuStat.usagePercent(function(err, percent, seconds) {
        if (err) {
            return console.log(err);
        }
        const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]")
    
    const embed = new MessageEmbed()
        .setColor("#FFFFFE")
        .setTitle("About")
        .setTitle("**Stats:**")
        .setColor("#9603fd")
        .addFields(
            { name: "⌚️ Uptime ", value: duration },
            { name: "⏳ API Latency", value: `${(client.ws.ping)}ms` },
            { name: "📝 Mem Usage", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`},
            { name: "CPU usage", value: `\`${percent.toFixed(2)}%\`` },
            { name: "📁 User Agent (Info)", value: `${UA}` },
        )
        .setTimestamp()
    interaction.reply({ embeds: [embed] });
});
}