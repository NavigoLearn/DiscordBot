const {
  SlashCommandBuilder,
} = require("@discordjs/builders");
const { MessageEmbed, MessageActionRow, MessageButton  } = require("discord.js");
const { getHeaders } = require("../../utils/fetchUtils");

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
  const sortby = interaction.options.getString("sortby");
  const order = interaction.options.getString("order");
  await interaction.deferReply({})

  var page = 1; // Will be incremented by 1 later on

  // fetch the api
  const api = await fetch(
    `https://navigolearn.com/api/search/roadmaps?sortBy=${sortby}&order=${order}&limit=10&page=${page}`,
    getHeaders()
  );

  // Since the api now correctly reports 404
  if (api.status === 404) {
    return interaction.editReply({
      content: `There was an error with the API`,
      ephemeral: true,
    });
  }

  const data = await api.json();

  // Make the enabled buttons (previous and next) in a row
  // Start the embed
  const initembed = new MessageEmbed();
  // Time for the fun part of iterating through each int given from the API
  // Start the for each loop
  data.data.forEach((roadmap) => {
    // Add multiple fields to the embed
    initembed.addFields(
      { name: `\n `, value: `**${roadmap.name}**`, inline: false },
      { name: `Author`, value: `${roadmap.userName}`, inline: false },
      { name: `Views`, value: `${roadmap.viewCount}`, inline: false },
      { name: `Likes`, value: `${roadmap.likeCount}`, inline: false },
      { name: `ID`, value: `${roadmap.id}`, inline: false },
      {
        name: `URL`,
        value: `https://navigolearn.com/roadmap/${roadmap.id}`,
        inline: false,
      }
    );
  });

    // Create the buttons
    const previous = new MessageButton()
    .setCustomId(`previous`)
    .setLabel(`Previous`)
    .setStyle(`SECONDARY`);
  const next = new MessageButton()
    .setCustomId(`next`)
    .setLabel(`Next`)
    .setStyle(`PRIMARY`);

  // Create the row
  const row = new MessageActionRow().addComponents([previous, next]);
  const disabledrow = new MessageActionRow().addComponents([
    previous.setDisabled(true),
    next.setDisabled(true),
  ]);

  interaction.editReply({ embed: [initembed], components: [row], ephemeral: false })

  // start the collector
  const collector = interaction.channel.createMessageComponentCollector({
    filter: (i) => i.user.id === interaction.user.id,
    time: 60000,
  });

  // collector on prev button
  collector.on("collect", async (i) => {
    // if the button is previous
    if (i.customId === `previous`) {
      // if the page is =< 1
      if (page < 1) {
        interaction.editReply({ text: `You are already on the first page`, components: [row], ephemeral: false });
      } else {
        // Set the page to --page
        --page;
        // fetch the api
        const api = await fetch(
          `https://navigolearn.com/api/search/roadmaps?sortBy=${sortby}&order=${order}&limit=10&page=${page}`,
          getHeaders()
        );

        // Since the api now correctly reports 404
        if (api.status === 404) {
          return interaction.editReply({
            content: `There was an error with the API`,
            ephemeral: true,
          });
        }

        const data = await api.json();

        // Start the embed
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
            { name: `ID`, value: `${roadmap.id}`, inline: false },
            {
              name: `URL`,
              value: `https://navigolearn.com/roadmap/${roadmap.id}`,
              inline: false,
            }
          );
        })
        // Edit the message
        interaction.editReply({
          embeds: [embed],
          components: [row],
          ephemeral: false,
        });
      }
    }
    // if the button is next
    if (i.customId === `next`) {
      // Check if the next pages are empty (aka json is just "[]")
      if (json.data.length === 0) {
        interaction.editReply({ components: [disabledrow], ephemeral: false });
      } else {
        ++page;
        // fetch the api
        const api = await fetch(
          `https://navigolearn.com/api/search/roadmaps?sortBy=${sortby}&order=${order}&limit=10&page=${page}`,
          getHeaders()
        );

        // Since the api now correctly reports 404
        if (api.status === 404) {
          return interaction.editReply({
            content: `There was an error with the API`,
            ephemeral: true,
          });
        }

        const data = await api.json();

        // Start the embed
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
            { name: `ID`, value: `${roadmap.id}`, inline: false },
            {
              name: `URL`,
              value: `https://navigolearn.com/roadmap/${roadmap.id}`,
              inline: false,
            }
          );
        })

        // Edit the message
        interaction.editReply({
          embeds: [embed],
          components: [row],
          ephemeral: false,
        });
      }
    }
  });
};

// Placed here due to the fact it isn't sending the embed, I will fix later