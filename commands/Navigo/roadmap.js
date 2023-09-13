const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { UA } = require("../../config.json");

module.exports.help = {
  name: "roadmap",
  category: "Navigo",
  description: "Get information about a roadmap",
  data: new SlashCommandBuilder()
    .setName("roadmap")
    .setDescription("Get information about a roadmap")
    .addIntegerOption((option) => {
      return option
        .setName("id")
        .setDescription("The roadmap ID")
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
  const api = await fetch(
    `https://navigolearn.com/api/roadmaps/${id}`,
    headers
  );
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

  // Start embed
  const embed = new MessageEmbed()
    .setThumbnail(json.data.userAvatar)
    .setTitle(`${json.data.name}`)
    .setDescription(`${json.data.description}`)
    .addFields(
      { name: "ID", value: `${json.data.id}`, inline: true },
      { name: "Topic", value: `${json.data.topic}`, inline: true },
      { name: "Is Draft", value: `${json.data.isDraft}`, inline: true },
      { name: " ", value: ` `, inline: false },
      { name: "User ID", value: `${json.data.userId}`, inline: true },
      { name: "User Name", value: `${json.data.userName}`, inline: true },
      { name: "Like Count", value: `${json.data.likeCount}`, inline: true },
      { name: "View Count", value: `${json.data.viewCount}`, inline: true },
      { name: "Version", value: `${json.data.version}`, inline: true }
    );

  // Send embed
  interaction.reply({ embeds: [embed], ephemeral: true });
};
