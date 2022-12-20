// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import("isomorphic-fetch");
const realtimeTrains = require('realtime-trains-scraper');

import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("uk-trains")
    .setDescription("Get realtime UK train information.")
    .addStringOption((option) =>
      option
        .setName("station")
        .setDescription("Enter a station code (or name)")
        .setRequired(true)
    ),
  async execute(interaction) {
    const value = interaction.options.getString("station");
    await interaction.deferReply();

    (async () => {
      try {
        
        const res = await realtimeTrains.getTrains(`${value}`);
        console.log(res)
        
        // Define the constants.
        const operator = res[0].operator.name;
        const origin = res[0].origin.name;
        const origincode = res[0].origin.code;
        const planneddeparture = res[0].plannedDeparture;
        const actualdeparture = res[0].actualDeparture;
        const destination = res[0].destination;
        const destinationcode = res[0].destination.code;
        const platform = res[0].platform;
        const uid = res[0].uid;
        const trainid = res[0].trainid;
        const sourceurl = res[0].sourceURL;
        const ispassengertrain = res[0].isPassengerTrain;
        
        // Send the embed.
        await interaction.editReply(`This command isn't ready yet.`);
        
        // Catch any errors.
      } catch (err) {
        await interaction.editReply("Unable to find a station with that code/name.");
        console.error(err);
      }
    })();
  },
};
