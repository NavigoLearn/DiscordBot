const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports.help = {
    name: "apiping",
    desc: "Get the latency of the API",
    cat: "Info",
    data: new SlashCommandBuilder()
        .setName("apiping")
        .setDescription("Get the latency of the API")
}

module.exports.interaction = async (interaction, client) => {
    // function to get the latency
    const ping = async () => {
        await interaction.deferReply({ ephemeral: false });
        now = Date.now();
        const m = await interaction.editReply(`Pinging...`);
        // await getting the success: true from the api
        const api = await fetch(`https://navigolearn.com/api/roadmaps/1`);
        const json = await api.json();
        // check if it returns "success": true
        if (json.success === true) {
            let latency = Date.now() - now;
            m.edit(`API Latency is ${latency}ms`);
        }
    }

    // run the function
    ping();
    // For all I know this could be false asf
}