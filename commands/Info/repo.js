const { Octokit } = require("@octokit/rest");
const { MessageEmbed } = require("discord.js");
const { getHeaders } = require("../../utils/fetchUtils");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { ghtoken } = require("../../config.json");

module.exports.help = {
    name: "repo",
    cat: "Info",
    description: "Get information about a navigo repository",
    data: new SlashCommandBuilder()
        .setName("repo")
        .setDescription("Get information about a navigo repository")
        .addStringOption((option) => {
            return option
                .setName("repo")
                .setDescription("The repo name")
                .setRequired(true)
                .addChoices({ name: 'Discord Bot', value: `DiscordBot` }, { name: 'Front End', value: 'Navigo-FrontEnd' }, { name: 'Backend', value: 'API' })
        })
}

module.exports.interaction = async (interaction, client) => {
    const octokit = new Octokit({
        auth: ghtoken
    });
    const repo = interaction.options.getString("repo");
    const { data } = await octokit.repos.get({
        owner: "NavigoLearn",
        repo: repo
    });

    const embed = new MessageEmbed()
        .setTitle(`${data.name}`)
        .setDescription(`${data.description}`)
        .addFields(
            // Star count
            { name: "Stars", value: `${data.stargazers_count}`, inline: false },
            // Fork count
            { name: "Forks", value: `${data.forks_count}`, inline: false },
            // Watcher count
            { name: "Watchers", value: `${data.watchers_count}`, inline: false },
            // Open issues
            { name: "Open Issues", value: `${data.open_issues_count}`, inline: false },
        )
        .setURL(`${data.html_url}`)

    interaction.reply({ embeds: [embed] });
}