const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getHeaders } = require("../../utils/fetchUtils");

module.exports.help = {
    name: `feelin`,
    desc: `Get a random roadmap`,
    cat: `Navigo`,
    data: new SlashCommandBuilder()
        .setName(`feelin`)
        .setDescription(`Get a random roadmap`)
        .addSubcommand((subcommand) => {
            return subcommand
                .setName(`lucky`)
                .setDescription(`Get a random roadmap`);
        })
};

module.exports.interaction = async (interaction, client) => {
    await interaction.deferReply({ ephemeral: false })
    // fetch the api
    const initialapi = await fetch(`https://navigolearn.com/api/search/feeling-lucky`, getHeaders());
    const initialjson = await initialapi.json();
    // Get the ID given
    const roadmapid = initialjson.data;
    // fetch the api again with the roadmap
    const api = await fetch(`https://navigolearn.com/api/roadmaps/${roadmapid}`, headers);
    const json = await api.json();

    // check if it returns "success": true
    if (json.success === true) {
        // Pass
    }
    else {
        return interaction.editReply({ content: `${json.message}`, ephemeral: true });
    }

  // Start embed
  const embed = new MessageEmbed()
    .setThumbnail(json.data.userAvatar)
    .setTitle(`${json.data.name}`)
    .setDescription(`${json.data.description}`)
    .addFields(
      { name: "ID", value: `${json.data.id}`, inline: true },
      { name: "URL", value: `https://navigolearn.com/roadmap/${json.data.id}`, inline: true },
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
  interaction.editReply({ embeds: [embed], ephemeral: false });
}

/**
 * Issues
 * 
 * - Once command is ran it never gets anything but the first ID it retrieves
*/