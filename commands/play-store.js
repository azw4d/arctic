// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("play-store")
    .setDescription("Search the Google Play Store.")
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("Search Google Play Store")
        .setRequired(true)
    ),
  async execute(interaction) {
    const value = interaction.options.getString("search");
    await interaction.deferReply();

    (async () => {
      try {
        const res = await fetch(
          `https://play-store-api.vercel.app/search/?query=${value}`
        );
        const user = await res.json();
        if (user[0].app_id) {
          
          // Define the constants.
          let appid = user[0].app_id;
          const description = user[0].description;
          const developer = user[0].developer;
          const developerid = user[0].developer_id;
          const free = user[0].free;
          const price = user[0].price;
          const score = user[0].score;
          const title = user[0].title;
          const url = user[0].url;
          const icon = user[0].icon;

          // Create and send the embed.
          const appEmbed = new MessageEmbed()
            .setColor("#2c88ff")
            .setTitle(`${title}`)
            .setAuthor("Play Store App Information of", "", "")
            .setURL(`https://play.google.com${url}`)
            .setDescription(`${description}`)
            .setThumbnail(`${icon}`)
            .addFields(
              {
                name: "Price",
                value: `${price}`,
                inline: true
              },
              {
                name: "Score",
                value: `${score}`,
                inline: true
              },
              {
                name: "Is it free?",
                value: `${free}`,
                inline: true
              }
            )
            .setFooter(`App ID: ${appid}  \nDeveloper ID: ${developerid}`, "");

          console.log(appid);
          await interaction.editReply({ embeds: [appEmbed] });
        }
        
        // Catch any errors.
      } catch (err) {
        await interaction.editReply("Unable to find an app with that name.");
        console.error(err);
      }
    })();
  }
};
