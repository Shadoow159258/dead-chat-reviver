const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require("@root/config.json");
const fs = require("fs");

module.exports = (client, reg) => {
	// get slashData
	const commands = [];
	const commandFiles = fs.readdirSync('./src/slashData').filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		if (file === "admin.js") continue;
		const command = require(`../slashData/${file}`);
		commands.push(command.toJSON());
	}

	// deploy slash commands
	const rest = new REST({ version: '9' }).setToken(config.client.token);
	try {
		// global or guild-wide deployment of slash commands
		if (reg.type === "guild" && typeof reg.guildId === "string") {
			rest.put(
				Routes.applicationGuildCommands(config.client.id, reg.guildId),
				{ body: commands },
			);
		} else if (reg.type === "admin" && typeof reg.guildId === "string") {
			rest.put(
				Routes.applicationGuildCommands(config.client.id, reg.guildId),
				{ body: [require("../slashData/admin.js").toJSON()] },
			);
		} else {
			rest.put(
				Routes.applicationCommands(client.user.id),
				{ body: commands }
			);
		}
		console.log("Deployed Slash Commands");
	} catch (error) {
		console.error(error);
	}
}