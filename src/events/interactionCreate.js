const msToTime = (ms) => {
	let day, hour, minute, seconds;
	seconds = Math.floor(ms / 1000);
	minute = Math.floor(seconds / 60);
	seconds = seconds % 60;
	hour = Math.floor(minute / 60);
	minute = minute % 60;
	day = Math.floor(hour / 24);
	hour = hour % 24;

	let units = [];
	switch (day) { case 0: break; case 1: units.push("1 day"); break; default: units.push(day + " days"); };
	switch (hour) { case 0: break; case 1: units.push("1 hour"); break; default: units.push(hour + " hours"); };
	switch (minute) { case 0: break; case 1: units.push("1 minute"); break; default: units.push(minute + " minutes"); };
	switch (seconds) { case 0: break; case 1: units.push("1 second"); break; default: units.push(seconds + " seconds"); };

	return units.join(", ");
}

module.exports = {
	name: 'interactionCreate',
	async execute(int, client) {
		if (!int.member) return;
		const { user, member, guild, message } = int;

		if (int.isCommand()) {
			if (!client.commands.has(int.commandName)) return;
			const command = client.commands.get(int.commandName);

			if (command.permissions) {
				if (typeof command.permissions === "string") {
					command.permissions = [command.permissions];
				}

				for (const perm of command.permissions) {
					switch (perm) {
						case "admin":
							if (!member.permissions.has("ADMINISTRATOR")) return int.reply({ content: `You do not have the permissions to use this command!` });
							break;
						case "manager":
							if (!member.permissions.has("MANAGE_CHANNELS") || !member.permissions.has("MANAGE_GUILD")) return int.reply({ content: `You do not have the permissions to use this command!` });
							break;

						default:
							console.log(`unknown permissions requested in "${command.name}.js"`)
							break;
					}
				}
			}

			try {
				command.execute(int, client);
			} catch (error) {
				console.error(error);
				return int.reply({ content: `There was an error trying to execute that command!` });
			}
		}
		if (int.isButton()) {
			let Embed = false;
			switch (int.customId) {
				case "uptime":
					Embed = {
						"title": "Uptime",
						"description": `The Bot's uptime is **${msToTime(client.uptime)}**`,
						"color": int.guild.me.displayColor,
						"timestamp": new Date(),
					};
					int.reply({ embeds: [Embed] });
					break;
				case "ping":
					Embed = {
						"title": "Ping",
						"description": `Websocket heartbeat: **${client.ws.ping}ms**`,
						"color": int.guild.me.displayColor,
						"timestamp": new Date(),
					};
					int.reply({ embeds: [Embed] });
					break;
				case "info":
					Embed = {
						"title": "Live Information",
						"description": `**Tag:** ${client.user.tag} \n**ID:** ${client.user.id} \n**In guilds:** ${client.guilds.cache.size} \n**Users:** ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} \n**Status:** ${client.user.presence.status} \n**Activity:** ${client.user.presence.activities.map(activity => activity.type)} ${client.user.presence.activities}`,
						"color": int.guild.me.displayColor,
						"timestamp": new Date(),
					};
					int.reply({ embeds: [Embed] });
					break;
				case "changelog":
					Embed = {
						"title": "Changelog",
						"description": `You can view the Bot's changelog [here](https://github.com/poldis/dead-chat-reviver/commits/master "github.com")`,
						"color": int.guild.me.displayColor,
					};
					int.reply({ embeds: [Embed] });
					break;
			}
		}
	}
};