const fs = require('fs');
const path = require('path');
var dateFormat = require('dateformat');
var now = new Date();

module.exports = {
	name: 'ready',
	async execute(client) {
		console.log('-------------------READY-------------------');

		// Bot information
		console.log('\x1b[44m%s\x1b[0m', '===================INFO====================');
		console.log(`Bot tag/Client: ${client.user.tag}`); // Bot tag
		console.log('Time: ' + dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT")); // Start time
		console.log(`In guilds: ${client.guilds.cache.size}`); // Count of guilds the bot is in
		console.log(`Users: ${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}`) // Count of members in all guilds
		client.user.setPresence({
			status: 'online', //online, idle & dnd
			activities: [{
				name: '/help',
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
					registerCmd.push(`Registering (/) command: ${file.slice(0, -3)}`);
					i++;
				}
			}
		}
		registerCmds('../slashData');
		console.log('Registering ' + i + ' commands');
		registerCmd.forEach(reg => {
			console.log(reg);
		});

		// All the other things
		console.log('\x1b[44m%s\x1b[0m', '==================OTHERS===================');

		// Databases
		await client.revive.sync();
		console.log("Database Synced");

		console.log('-------------------DONE--------------------');
	},
};