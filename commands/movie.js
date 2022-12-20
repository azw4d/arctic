// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("movie")
    .setDescription("Search for a movie on IMDb.")
    .addStringOption(option =>
      option
        .setName("search")
        .setDescription("Search for a movie")
        .setRequired(true)
    ),

  // Store the given value, then make bot think.
  async execute(interaction) {
    const value = interaction.options.getString("search");
    await interaction.deferReply();
    
    // (Make sure to add your OMDB API key in the .env file)
    const apikey = process.env.omdbapikey;

    // Execute.
    (async () => {
      try {
        const colour = process.env.colour;
        const res2 = await fetch(
          `https://www.omdbapi.com/?s=${value}&apikey=${apikey}`
        );
        const user2 = await res2.json();

        // Define the constants.
        const titlecheck = user2.Search[0].Title;

        const res = await fetch(
          `https://www.omdbapi.com/?t=${titlecheck}&apikey=${apikey}`
        );
        const user = await res.json();

        const title = user.Title;
        const year = user.Year;
        const rated = user.Rated;
        const released = user.Released;
        const duration = user.Runtime;
        const genre = user.Genre;
        const director = user.Director;
        const poster = user.Poster;
        const language = user.Language;
        const country = user.Country;
        const plot = user.Plot;
        const actors = user.Actors;
        const writers = user.Writers;
        const imdbid = user.imdbID;
        const awards = user.Awards;

        // Make an embed message.
        const movEmbed = new MessageEmbed()
          .setColor(`${colour}`)
          .setTitle(`${title}`)
          .setAuthor(`${genre}`)
          .setURL(`https://www.imdb.com/title${imdbid}`)
          .setDescription(`${plot}`)
          .setImage(`${poster}`)
          .addFields(
            {
              name: "Rated",
              value: `${rated}`,
              inline: true
            },
            {
              name: "Duration",
              value: `${duration}`,
              inline: true
            },
            {
              name: "Language",
              value: `${language}`,
              inline: true
            },
            {
              name: "Counrty",
              value: `${country}`,
              inline: true
            },
            {
              name: "Director",
              value: `${director}`,
              inline: true
            },
            {
              name: "Awards",
              value: `${awards}`,
              inline: true
            },
            {
              name: "People Involved",
              value: `Writers: ${writers} \nActors: ${actors}`,
              inline: false
            }
          )
          .setFooter(`Released: ${released}`);

        console.log(title);
        await interaction.editReply({ embeds: [movEmbed] });

        // Catch any errors.
      } catch (err) {
        await interaction.editReply("Unable to find a movie with that name.");
        console.error(err);
      }
    })();
  }
};
