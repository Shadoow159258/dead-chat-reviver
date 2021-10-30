const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');
const now = new Date();

module.exports = {
	name: 'ready',
	async execute(client) {
		console.log('-------------------READY-------------------');

		// Bot information
		console.log('\x1b[44m%s\x1b[0m', '===================INFO====================');
		console.log(`Bot tag/Client: ${client.user.tag}`); // Bot tag
		console.log('Time: ' + dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"));
		console.log(`In guilds: ${client.guilds.cache.size}`);
		console.log(`Users: ${client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0)}`);
		client.user.setPresence({
			status: 'online', //online, idle & dnd
			activities: [{
				name: `/help | Reviving ${client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0)} users`,
				type: 'PLAYING' // PLAYING, LISTENING, STREAMING & WATCHING
			}]
		});
		console.log(`Status: ${client.user.presence.status}`);
		console.log(`Activity: ${client.user.presence.activities.map(activity => activity.type)} ${client.user.presence.activities}`);

		// Events
		console.log('\x1b[44m%s\x1b[0m', '==================EVENTS===================');
		const registerEv = [];
		let i = 0;
		const registerEvs = (dir) => {
			const files = fs.readdirSync(path.join(__dirname, dir))
			for (const file of files) {
				const stat = fs.lstatSync(path.join(__dirname, dir, file))
				if (stat.isDirectory()) {
					registerCmds(path.join(dir, file))
				} else if (file.endsWith('.js')) {
					registerEv.push(`Registering event: ${file.slice(0, -3)}`);
					i++;
				}
			}
		}
		registerEvs('./');
		console.log('Registering ' + i + ' events');
		registerEv.forEach(reg => {
			console.log(reg);
		});

		// Commands
		console.log('\x1b[44m%s\x1b[0m', '=================COMMANDS==================');
		const registerCmd = [];
		i = 0;
		const registerCmds = (dir) => {
			const files = fs.readdirSync(path.join(__dirname, dir))
			for (const file of files) {
				const stat = fs.lstatSync(path.join(__dirname, dir, file))
				if (stat.isDirectory()) {
					registerCmds(path.join(dir, file))
				} else if (file.endsWith('.js')) {
					registerCmd.push({ name: file.slice(0, -3), filename: file.toString() });
					i++;
				}
			}
		}
		registerCmds('../slashData');
		console.log('Registering ' + i + ' commands');
		registerCmd.forEach((reg) => {
			console.log(`Registering (/) command: ${reg.name}`);
		});

		// All the other things
		console.log('\x1b[44m%s\x1b[0m', '==================OTHERS===================');

		// Databases
		await client.revive.sync();
		await client.stats.sync();
		registerCmd.forEach(async (reg) => {
			await client.stats.create({
				name: reg.name,
				uses: 0,
			}).catch(() => { });
		});
		console.log("Databases Synced");

		// Deploy Slash Commands
		const reg = require("@tools/register");
		await reg(client, { "type": "global" });
		// await reg(client, { "type": "guild", "guildId": "866435905782808606" });

		console.log('-------------------DONE--------------------');


		setInterval(async () => {
			// Update bot pressence (user count)
			client.user.setPresence({ activities: [{ name: `/help | Reviving ${client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0)} users`, type: 'PLAYING' }] });

			// API
			await require("@api/initialize");
		}, 3600000) // 1 hour
		await require("@api/initialize");
	},
};