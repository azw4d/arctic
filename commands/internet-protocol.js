// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("internet-protocol")
    .setDescription("Get information about an Internet Protocol address.")
    .addStringOption(option =>
      option
        .setName("ip")
        .setDescription("Internet Protocol Address")
        .setRequired(true)
    ),

  // Store the given value, then make bot think.
  async execute(interaction) {
    const value = interaction.options.getString("ip");
    await interaction.deferReply();

    // Execute.
    (async () => {
      try {
        const colour = process.env.colour;
        const res = await fetch(
          `http://ip-api.com/json/${value}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query`
        );
        const user = await res.json();

        // Define the constants.
        const statuss = user.status;
        const countryy = user.country;
        const continentt = user.continent;
        const latt = user.lat;
        const lonn = user.lon;
        const zipp = user.zip;
        const cityy = user.city;
        const currencyy = user.currency;
        const ispp = user.isp;
        const reversee = user.reverse;
        const mobilee = user.mobile;
        const proxyy = user.proxy;
        const regionn = user.region;

        // Make an embed message.
        const ipEmbed = new MessageEmbed()
          .setColor(`${colour}`)
          .setTitle(`${value}`)
          .setAuthor("IP Address Information of", "", "")
          .addFields(
            {
              name: "📍 City",
              value: `${cityy}`,
              inline: true
            },
            {
              name: "📍 Region",
              value: `${regionn}`,
              inline: true
            },
            {
              name: "📍 Country",
              value: `${countryy}`,
              inline: true
            },
            {
              name: "📍 Continent",
              value: `${continentt}`,
              inline: true
            },
            {
              name: "🗺️ Latitude",
              value: `${latt}`,
              inline: true
            },
            {
              name: "🗺️ Longitude",
              value: `${lonn}`,
              inline: true
            },
            {
              name: "💵 Currency",
              value: `${currencyy}`,
              inline: true
            },
            {
              name: "📍 Zip Code",
              value: `${zipp}`,
              inline: true
            },
            {
              name: "⏪ Reverse",
              value: `${reversee}`,
              inline: true
            },
            {
              name: "⁉️ Is mobile network?",
              value: `${mobilee}`,
              inline: false
            },
            {
              name: "⁉️ Is using VPN/Proxy/Tor?",
              value: `${proxyy}`,
              inline: false
            }
          )
          .setImage(
            `https://stadiamaps.com/static/alidade_smooth?api_key=23fe682b-ac7c-4f2b-83db-39dcf2a8b9ac&center=${latt},${lonn}&zoom=5&markers=${latt},${lonn}&size=250x150`
          )
          .setFooter(`💥 ISP: ${ispp}`, "");

        // If the information exists, send the embed. If not, error.
        if (countryy) {
          await interaction.editReply({ embeds: [ipEmbed] });
        } else {
          return interaction.editReply("That isn't a valid IP.");
        }

        // Catch any errors.
      } catch (err) {
        console.error(err);
        return interaction.editReply("That isn't a valid IP.");
      }
    })();
  }
};
