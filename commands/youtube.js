// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("Search for a YouTube channel or video.")
    .addStringOption((option) =>
      option
        .setName("search")
        .setDescription("Search YouTube")
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
          `https://ytscrape.maceratime.com/api/search?q=${value}&page=1`
        );
        const user = await res.json();

        // Define the constants.
        const videotitle = user.results[0].video.title;
        const videourl = user.results[0].video.url;
        const videoduration = user.results[0].video.duration;
        const videouploaddate = user.results[0].video.upload_date;
        const videothumbnailsrc = user.results[0].video.thumbnail_src;
        const videoviews = user.results[0].video.views;
        const uploaderusername = user.results[0].uploader.username;
        const uploaderurl = user.results[0].uploader.url;
        const uploaderverified = user.results[0].uploader.verified;

        // Make an embed message.
        const vidEmbed = new MessageEmbed()
          .setColor(`${colour}`)
          .setTitle(`${videotitle}`)
          .setURL(`${videourl}`)
          .setAuthor(`${uploaderusername}`, "", `${uploaderurl}`)
          .addFields(
            {
              name: "Duration",
              value: `${videoduration}`,
              inline: true,
            },
            {
              name: "Views",
              value: `${videoviews}`,
              inline: true,
            },
            {
              name: "Uploaded",
              value: `${videouploaddate}`,
              inline: true,
            }
          )
          .setImage(`${videothumbnailsrc}`)
          .setFooter(`Verified channel? ${uploaderverified}.`, "");

        await interaction.editReply({ embeds: [vidEmbed] });
      } catch (err) {
        // If a video wasn't found, then it must've been a channel. (Or/and otherwise log the error.)
        const res = await fetch(
          `https://ytscrape.maceratime.com/api/search?q=${value}&page=1`
        );
        const user = await res.json();
        const channelurl = user.results[0].channel.url;
        const channeltitle = user.results[0].channel.title;
        const channelsnippet = user.results[0].channel.snippet;
        const channelthumbnailsrc = user.results[0].channel.thumbnail_src;
        const channelvideocount = user.results[0].channel.video_count;
        const channelsubscribercount = user.results[0].channel.subscriber_count;
        const verifiedchannel = user.results[0].channel.verified;
        const colour = process.env.colour;

        // Make an embed message.
        const ytEmbed = new MessageEmbed()
          .setColor(`${colour}`)
          .setTitle(`${channeltitle}`)
          .setURL(`${channelurl}`)
          .setDescription(`${channelsnippet}`)
          .addFields(
            {
              name: "Subscribers",
              value: `${channelsubscribercount}`,
              inline: true,
            },
            {
              name: "Videos",
              value: `${channelvideocount}`,
              inline: true,
            }
          )
          .setFooter(`Verified channel? ${verifiedchannel}.`)
          .setImage(`https:${channelthumbnailsrc}`);
        await interaction.editReply({ embeds: [ytEmbed] });
        console.error(err);
      }
    })();
  },
};
