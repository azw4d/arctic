// Requirements. (Don't forget to add "clientId" and "guildId" on the .env file.)
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientId = process.env.clientId
const guildId = process.env.guildId


// Find the command files to send them to Discord.
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}


// Authorise as bot to send JSON data. (Don't forget to specify token on the .env file.)
const rest = new REST({ version: '9' }).setToken(process.env.token);


// Send the commands to Discord, 
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
