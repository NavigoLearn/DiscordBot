const {
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { UA } = require("../../config.json");

module.exports.help = {
  name: `explore`,
  desc: `Explore Navigo roadmaps`,
  cat: `Navigo`,
  data: new SlashCommandBuilder()
    .setName(`explore`)
    .setDescription(`Explore Navigo roadmaps`)
    .addStringOption((option) => {
      return option
        .setName(`sortby`)
        .setDescription(`Sort by`)
        .setRequired(true)
        .addChoices(
          { name: `Likes`, value: `likes` },
          { name: `Views`, value: `views` },
          { name: `New`, value: `new` }
        );
    })
    .addStringOption((option) => {
      return option
        .setName(`order`)
        .setDescription(`Order`)
        .setRequired(true)
        .addChoices(
          { name: `Ascending`, value: `asc` },
          { name: `Descending`, value: `desc` }
        );
    }),
};

module.exports.interaction = async (interaction, client) => {
  // It's 3am rn I got school in 4 hours I am going to love this
  const sortBy = interaction.options.getString(`sortby`);
  const order = interaction.options.getString(`order`);
  let headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": UA, // User agent
  });
  const api = await fetch(
    `https://navigolearn.com/api/search/roadmaps?limit=10&sortby=${sortBy}&order=${order}`,
    headers
  ); // Idk if I wanna add stuff to limit it or not
  const data = await api.json();
  // Check for errors before the whole embed thing
  if (data.success === false) {
    return interaction.reply({
      content: `There was an error with the API`,
      ephemeral: true,
    });
  }

  const embed = new MessageEmbed();
  // Time for the fun part of iterating through each int given from the API
  // Start the for each loop
  data.data.forEach((roadmap) => {
    // Add multiple fields to the embed
    embed.addFields(
      { name: `\n `, value: `**${roadmap.name}**`, inline: false },
      { name: `Author`, value: `${roadmap.userName}`, inline: false },
      { name: `Views`, value: `${roadmap.viewCount}`, inline: false },
      { name: `Likes`, value: `${roadmap.likeCount}`, inline: false },
      { name: `ID`, value: `${roadmap.id}`, inline: false }
    );
  });

    // Send the embed
    interaction.reply({ embeds: [embed], ephemeral: true }); // Set to ephemeral due to it being able to clog channels
};
