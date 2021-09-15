const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require("../config.json");

module.exports = {
	async execute(client) {
		// get slashData
		const commands = [];
		const commandFiles = fs.readdirSync('./src/slashData').filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const command = require(`./slashData/${file}`);
			commands.push(command.toJSON());
		}

		// deploy slash commands
		const rest = new REST({ version: '9' }).setToken(config.client.token);
		try {
			await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
			console.log("Deployed Slash Commands");
		} catch (error) {
			console.error(error);
		}
	}
}