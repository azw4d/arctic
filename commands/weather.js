// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
var weather = require("weather-js");
const safeStringify = require("fast-safe-stringify");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get information about the weather of a city.")
    .addStringOption(option =>
      option
        .setName("city")
        .setDescription("City of a country")
        .setRequired(true)
    ),

  // Store the given value, then make bot think.
  async execute(interaction) {
    const value = interaction.options.getString("city");
    await interaction.deferReply();

    // Execute.
    (async () => {
      try {
        const colour = process.env.colour;

        weather.find({ search: `${value}`, degreeType: "C" }, function(
          err,
          result
        ) {
          if (err) console.log(err);

          console.log(JSON.stringify(result, null, 2));
          const resulty = JSON.stringify(result, null, 2)

          // Define the constants.
          const name = result[0].location.name;
          const lat = result[0].location.lat;
          const long = result[0].location.long;
          const timezone = result[0].location.timeone;
          const imagerelativeurl = result[0].location.imagerelativeurl;
          const temperature = result[0].current.temperature;
          const skytext = result[0].current.skytext;
          const date = result[0].current.date;
          const feelslike = result[0].current.feelslike;
          const humidity = result[0].current.humidity;
          const winddisplay = result[0].current.winddisplay;
          const day = result[0].current.day;
          const observationtime = result[0].current.observationtime;
          const imageurl = result[0].current.imageUrl;

          // Make an embed message.
          const invEmbed = new MessageEmbed()
            .setColor(`${colour}`)
            .setTitle(`${name}`)
            .setURL(`${imagerelativeurl}`)
            .setAuthor(`Weather in`, ``, ``)
            .addFields(
              {
                name: "🌡️ Temperature",
                value: `**${temperature}** °C`,
                inline: true
              },
              {
                name: "🌡️ Feels Like",
                value: `**${feelslike}** °C`,
                inline: true
              },
              {
                name: "💦 Humidity",
                value: `**${humidity}**%`,
                inline: true
              },
              {
                name: "💨 Wind",
                value: `${winddisplay}`,
                inline: true
              },
              {
                name: "🔭 Observation Time",
                value: `${observationtime}`,
                inline: true
              },
              {
                name: "🗺️ Location",
                value: `Latitude: **${lat}** \nLongitude: **${long}**`,
                inline: true
              }
            )
            .setThumbnail(`${imageurl}`)
            .setFooter(`🌏 Timezone: GMT ${timezone}`);

          interaction.editReply({ embeds: [invEmbed] });
        });

        // Catch any errors.
      } catch (err) {
        console.error(err);
        return interaction.editReply("That city does not exist.");
      }
    })();
  }
};
