const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getHeaders } = require("../../utils/fetchUtils");

module.exports.help = {
  name: "user",
  cat: "Navigo",
  description: "Get information about a user",
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Get information about a user")
    .addIntegerOption((option) => {
      return option
        .setName("id")
        .setDescription("The user ID")
        .setRequired(true);
    }),
};

module.exports.interaction = async (interaction, client) => {
  await interaction.deferReply({ ephemeral: false });
  const id = interaction.options.getInteger("id");
  const api = await fetch(
    `https://navigolearn.com/api/users/${id}`,
    getHeaders()
  );
  // Since the api now correctly reports 404
  if (api.status === 404) {
    return interaction.editReply({
      content: `There was an error with the API`,
      ephemeral: true,
    });
  }
  const json = await api.json();

  // check if it returns "success": true
  if (json.success === true) {
    // Pass
  } else {
    return interaction.editReply({
      content: `${json.message}`,
      ephemeral: true,
    });
  }

  // Check if ID is under 1
  if (id < 1) {
    return interaction.editReply({
      content: `ID cannot be under 0`,
      ephemeral: true,
    });
  }

  // ISO 8601 conversion to linux epoch
  // Will do later

  // Start embed
  const embed = new MessageEmbed()
    .setThumbnail(json.data.avatar)
    .setTitle(`${json.data.name}`)
    .addFields(
      { name: "ID", value: `${json.data.id}`, inline: true },
      { name: "Github", value: `${json.data.githubUrl}`, inline: true },
      { name: "Website", value: `${json.data.websiteUrl}`, inline: true },
      { name: " ", value: ` `, inline: false },
      {
        name: "Total roadmaps",
        value: `${json.data.roadmapsCount}`,
        inline: true,
      },
      {
        name: "Total views",
        value: `${json.data.roadmapsViews}`,
        inline: true,
      },
      { name: "Total likes", value: `${json.data.roadmapsLikes}`, inline: true }
    );
  // Send embed
  interaction.editReply({ embeds: [embed], ephemeral: false });
};
