// When the bot is online, set a status and log it.
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
    client.user.setStatus('dnd');
    client.user.setActivity("hello", { type: 'PLAYING' });
    console.log(`Bot online as ${client.user.tag}`);
	},
};
