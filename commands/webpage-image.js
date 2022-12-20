// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("webpage-image")
    .setDescription("Get an image of any website.")
    .addStringOption(option =>
      option
        .setName("url")
        .setDescription("Website URL")
        .setRequired(true)
    ),

  // Store the given value, then make bot think.
  async execute(interaction) {
    const value = interaction.options.getString("url");
    await interaction.deferReply();

    // Execute.
    (async () => {
      try {
        const colour = process.env.colour;
        const res = await fetch(
          `https://urlscan.io/liveshot/?url=${value}`
        );
        const user = await res.json();
        
        // Define the constants.
        const checky = user.type;
        return interaction.editReply("The link you provided is incorrect. (Put http:// or https:// if you haven't)");
        
        // Catch any errors.
      } catch (err) {
        console.error(err);
        const attachment = new MessageAttachment(`https://urlscan.io/liveshot/?url=${value}`, 'webpage.png'); 
        await interaction.editReply({ files: [attachment] });
      }
    })();
  }
};
