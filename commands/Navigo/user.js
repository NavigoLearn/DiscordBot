const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { UA } = require("../../config.json");

module.exports.help = {
  name: "user",
  category: "Navigo",
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
  const id = interaction.options.getInteger("id");
  let headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent": UA, // User agent
  });
  const api = await fetch(`https://navigolearn.com/api/users/${id}`, headers);
  const json = await api.json();

  // check if it returns "success": true
  if (json.success === true) {
    // Pass
  } else {
    return interaction.reply({ content: `${json.message}`, ephemeral: true });
  }

  // Check if ID is under 1
  if (id < 1) {
    return interaction.reply({
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
  interaction.reply({ embeds: [embed], ephemeral: true });
};
