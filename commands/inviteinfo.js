// Requirements.
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const discordInv = require("discord-inv");
const safeStringify = require("fast-safe-stringify");
import("isomorphic-fetch");
import("cross-fetch/dist/node-polyfill.js");

// Command information.
module.exports = {
  data: new SlashCommandBuilder()
    .setName("inviteinfo")
    .setDescription("Get information about a Discord invite link.")
    .addStringOption(option =>
      option
        .setName("code")
        .setDescription("Discord invite url or code")
        .setRequired(true)
    ),

  // Store the given value, then make bot think.
  async execute(interaction) {
    const value = interaction.options.getString("code");
    await interaction.deferReply();

    // Execute.
    (async () => {
      try {
        const colour = process.env.colour;

        discordInv
          .getInv(
            discordInv.getCodeFromUrl(value),
            (imgSize = 4096),
            (withCounts = true)
          )
          .then(invite => {
            console.log(invite);

            // Define the constants.
            const code = invite.code;
            const expiresat = invite.expires_at;
            const guildid = invite.guild.id;
            const guildname = invite.guild.name;
            const guildicon = invite.guild.iconURL;
            const channelid = invite.channel.id;
            const channelname = invite.channel.name;
            const inviterid = invite.inviter.id;
            const inviterusername = invite.inviter.username;
            const invitertag = invite.inviter.tag;
            const inviteravatar = invite.inviter.avatarURL;
            const members = invite.approximate_member_count;
            const colour = process.env.colour;

            // Make an embed message.
            const invEmbed = new MessageEmbed()
              .setColor(`${colour}`)
              .setTitle(`${guildname}`)
              .setURL(`https://discord.gg/${code}`)
              .setAuthor(`${invitertag}`, `${inviteravatar}`, ``)
              .addFields(
                {
                  name: "Channel",
                  value: `**Name**: ${channelname} \n**ID**: ${channelid} \n**Server Members**: ${members}`,
                  inline: false
                },
                {
                  name: "Links",
                  value: `**Invite**: [Click here](https://discord.gg/${code}) \n**Channel**: [Click here](https://discord.com/channels/${guildid}/${channelid})`,
                  inline: false
                }
              )
              .setThumbnail(`${guildicon}`)
              .setFooter(`Code: ${code} \nExpires: ${expiresat}.`, "");

            interaction.editReply({ embeds: [invEmbed] });
          });

        // Catch any errors.
      } catch (err) {
        console.error(err);
        return interaction.editReply("That isn't a valid invite url.");
      }
    })();
  }
};
