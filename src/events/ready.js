const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');
const now = new Date();

module.exports = {
	name: 'ready',
	async execute(client) {
		console.log('-------------------READY-------------------');

		// ++ BOT INFO ++
		console.log('\x1b[44m%s\x1b[0m', '===================INFO====================');
		console.log(`Bot tag/Client: ${client.user.tag}`); // Bot tag
		console.log('Time: ' + dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
		console.log(`In guilds: ${client.guilds.cache.size}`);
		console.log(`Users: ${client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0)}`);
		client.user.setPresence({
			status: 'online', //online, idle & dnd
			activities: [{
				name: `/help | Reviving ${client.guilds.cache.size} servers`,
				type: 'PLAYING' // PLAYING, LISTENING, STREAMING & WATCHING
			}]
		});
		console.log(`Status: ${client.user.presence.status}`);
		console.log(`Activity: ${client.user.presence.activities.map(activity => activity.type)} ${client.user.presence.activities}`);


		// ++ EVENTS ++
		console.log('\x1b[44m%s\x1b[0m', '==================EVENTS===================');
		console.log('Registering ' + client.events.size + ' events');
		for (const name of client.events.keys()) {
			console.log(`Registering event: ${name}`);
		}


		// ++ COMMANDS ++
		console.log('\x1b[44m%s\x1b[0m', '=================COMMANDS==================');
		console.log('Registering ' + client.commands.size + ' commands');
		for (const name of client.commands.keys()) {
			console.log(`Registering command: ${name}`);
		}


		// ++ OTHERS ++
		console.log('\x1b[44m%s\x1b[0m', '==================OTHERS===================');

		// Databases
		await client.revive.sync();
		await client.reviveMsgs.sync();
		await client.stats.sync();
		for await (const name of client.commands.keys()) {
			if (name === "admin") continue;
			client.stats.create({
				name: name,
				uses: 0,
			}).catch(() => { });
		}
		console.log("Databases Synced");

		// Deploy Slash Commands
		const reg = require("@utils/register");
		// await reg(client, { "type": "global" });
		// await reg(client, { "type": "guild", "guildId": "866435905782808606" });

		// Initialize API
		await require("@api/initialize");

		console.log('-------------------DONE--------------------');


		// ++ UPDATE BOT PRESENCE ++
		setInterval(() => {
			client.user.setActivity(`/help | Reviving ${client.guilds.cache.size} servers`);
		}, 3600000) // 1 hour
	},
};