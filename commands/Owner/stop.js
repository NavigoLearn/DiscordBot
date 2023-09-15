const { SlashCommandBuilder } = require('@discordjs/builders');
const { authusers, othernavigodevs } = require("../../config.json");
const { BgReded, Reset, Blink } = require("../../functions/colors.js");
module.exports.help = {
    name: "stop",
    cat: "Dev",
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the bot")
}

module.exports.interaction = async (interaction, client) => {
    await interaction.deferReply({ ephemeral: false })
    const user = interaction.user.id;

    // Check if user equals something in othernavigodevs
    if (othernavigodevs.includes(user)) {
        // Unauthorized due to not being assigned to discord project
        return interaction.reply({ content: `You are not apart of the team assigned to the bot!`, ephemeral: true });
    };
    // Check if user not in authusers
    if (!authusers.includes(user)) {
        return interaction.reply({ content: `You are not authorized to use this command!`, ephemeral: true });
    };

    // Stop the bot
    await interaction.editReply({ content: `Stopping the bot...`, ephemeral: true });
    await client.destroy(); // Destroy the client
    console.log(`${BgReded}Bot stopped${Reset}`) // Make sure to log it
    process.exit(); // Effectivly ctrl + c
}