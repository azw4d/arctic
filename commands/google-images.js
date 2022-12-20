// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const safeStringify = require("fast-safe-stringify");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");
const image_finder = require("image-search-engine");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("google-images")
    .setDescription("Search Google for images.")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("Google images username")
        .setRequired(true)
    ),

  // Store the given value, then make bot think.
  async execute(interaction) {
    const value = interaction.options.getString("search");
    await interaction.deferReply();

    // Execute.
    (async () => {
      try {
        const colour = process.env.colour;
        const result = await image_finder.find(`${value}`);
        console.log(result);
        console.log("normal");
        const attachment = new MessageAttachment(`${result}`, "result.png");
        await interaction.editReply({ files: [attachment] });
        // Catch any errors.
      } catch (err) {
        console.error(err);
        return interaction.editReply("No results found.");
      }
    })();
  },
};
