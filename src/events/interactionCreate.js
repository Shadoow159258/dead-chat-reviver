const outputErr = require("@tools/error");
const config = require("@root/config.json");

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
	switch (day) { case 0: break; case 1: units.push("1 day"); break; default: units.push(day + " days"); }
	switch (hour) { case 0: break; case 1: units.push("1 hour"); break; default: units.push(hour + " hours"); }
	switch (minute) { case 0: break; case 1: units.push("1 minute"); break; default: units.push(minute + " minutes"); }
	switch (seconds) { case 0: break; case 1: units.push("1 second"); break; default: units.push(seconds + " seconds"); }

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
				// transform strings into an array
				if (typeof command.permissions === "string") {
					command.permissions = [command.permissions];
				}

				// loop through array of permissions
				for (const perm of command.permissions) {
					switch (perm) {
						case "admin":
							if (!member.permissions.has("ADMINISTRATOR")) return outputErr(int, 403);
							break;
						case "manager":
							if (!member.permissions.has("MANAGE_CHANNELS") || !member.permissions.has("MANAGE_GUILD")) return outputErr(int, 403);
							break;

						default:
							console.error(`Unknown permissions requested in "${command.name}.js": permission: "${perm}"`);
							break;
					}
				}
			}

			try {
				return command.execute(int, client);
			} catch (error) {
				console.error(error);
				return outputErr(int, 404);
			}
		}
		if (int.isButton()) {
			// switch for all possible buttons
			let Embed = {};
			switch (int.customId) {
				case "uptime":
					Embed = {
						"title": "Uptime",
						"description": `The Bot's uptime is **${msToTime(client.uptime)}**`,
						"color": 14052462,
						"timestamp": new Date(),
						"footer": {
							"text": `Requested by ${user.tag}`
						},
					}
					int.reply({ embeds: [Embed] });
					break;
				case "ping":
					Embed = {
						"title": "Ping",
						"description": `Websocket heartbeat: **${client.ws.ping}ms**`,
						"color": 14052462,
						"timestamp": new Date(),
						"footer": {
							"text": `Requested by ${user.tag}`
						},
					}
					int.reply({ embeds: [Embed] });
					break;
				case "info":
					Embed = {
						"title": "Live Information",
						"description": `**Tag:** ${client.user.tag} \n**ID:** \`${client.user.id}\` \n**In guilds:** ${client.guilds.cache.size} \n**Users:** ${client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0)} \n**Status:** ${client.user.presence.status} \n**Activity:** ${client.user.presence.activities.map(activity => activity.type)} ${client.user.presence.activities}`,
						"color": 14052462,
						"timestamp": new Date(),
						"footer": {
							"text": `Requested by ${user.tag}`
						},
					}
					int.reply({ embeds: [Embed] });
					break;
				case "statistics":
					Embed = {
						"title": "Command Statistics",
						"fields": [],
						"color": 14052462,
						"timestamp": new Date(),
						"footer": {
							"text": `Requested by ${user.tag}`
						},
					}
					const stats = await client.stats.findAll();
					stats.forEach((stat) => {
						Embed.fields.push({
							"name": `**/${stat.name}**`,
							"value": `${stat.uses}`,
							"inline": true,
						});
					});
					int.reply({ embeds: [Embed] });
					break;
				case "version":
					Embed = {
						"title": "Version",
						"description": `This is bot is running DCR version \`${config.github.version}\`. \nYou can view the Bot's github repository [here](${config.github.repo} "github.com").`,
						"color": 14052462,
						"footer": {
							"text": `Requested by ${user.tag}`
						},
					}
					int.reply({ embeds: [Embed] });
					break;
				default:
					const ignoredButtons = ["newTopic", "cet", "changelog"];
					if (!ignoredButtons.includes(int.customId))
						console.error(`Unknown button used: customId: "${int.customId}"`);
					break;
			}
		}
	}
}