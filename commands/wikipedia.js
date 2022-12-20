// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("wikipedia")
    .setDescription("Search for a Wikipedia article.")
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("Search Wikipedia")
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
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=opensearch&search=${value}`
        );
        const user = await res.json();

        // Define the constants.
        const name = user[1][0];
        const url = user[3][0];

        await interaction.editReply(`**${name}**: ${url}`);

        // Catch any errors.
      } catch (err) {
        console.error(err);
        return interaction.editReply(
          "Unable to find an article with that name."
        );
      }
    })();
  }
};
