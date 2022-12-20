const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Search Reddit.")
    .addStringOption((option) =>
      option.setName("search").setDescription("Search Reddit").setRequired(true)
    ),
  async execute(interaction) {
    const value = interaction.options.getString("search");
    await interaction.deferReply();

    (async () => {
      try {
        const colour = process.env.colour;
        const res = await fetch(
          `https://www.reddit.com/search.json?q=${value}`
        );
        const user = await res.json();
        const subreddit = user.data.children[0].data.subreddit_name_prefixed;
        const author = user.data.children[0].data.author;
        const title = user.data.children[0].data.title;
        const url = user.data.children[0].data.url;
        const selftext = user.data.children[0].data.selftext;
        const ups = user.data.children[0].data.ups;
        const downs = user.data.children[0].data.downs;
        const img = user.data.children[0].data.thumbnail;

        const appEmbed = new MessageEmbed()
          .setColor(`${colour}`)
          .setTitle(`${title}`)
          .setAuthor(`${author}`, "", "")
          .setURL(`${url}`)
          .setDescription(`${selftext}`)
          .setThumbnail(`${img}`)
          .setFooter(`👍: ${ups} | 👎: ${downs}`, "");

        console.log("hiii");
        await interaction.editReply({ embeds: [appEmbed] });
      } catch (err) {
        await interaction.editReply("Unable to find anything for your query.");
        console.error(err);
      }
    })();
  },
};
