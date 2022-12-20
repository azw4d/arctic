// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require('canvas');
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("snapcode")
    .setDescription("Get a scannable Snapchat snapcode for a username.")
    .addStringOption(option =>
      option
        .setName("username")
        .setDescription("Snapchat username")
        .setRequired(true)
    ),

  // Store the given value, then make bot think.
  async execute(interaction) {
    const value = interaction.options.getString("username");
    await interaction.deferReply();

    // Execute.
    (async () => {
      try {
        const colour = process.env.colour;
        
        const canvas = Canvas.createCanvas(240, 240);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage(`https://app.snapchat.com/web/deeplink/snapcode?username=${value}&type=PNG&size=240`);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'snapcode.png');

        // If the information exists, send the image. If not, error.
        if (colour) {
          await interaction.editReply({ files: [attachment] });
        } else {
          return interaction.editReply("That isn't a valid username.");
        }

        // Catch any errors.
      } catch (err) {
        console.error(err);
        return interaction.editReply("That isn't a valid username.");
      }
    })();
  }
};
