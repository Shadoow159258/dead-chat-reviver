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
const timeToMs = (str) => {
	const timeRegex = /([0-9]+)( |)(s|m|h|d)/g;
	const numRegex = /([0-9]+)/g;
	const unitRegex = /(s|m|h|d)/g;
	const initialMatch = str.match(timeRegex);

	if (!initialMatch) {
		return [false, "<:error:887414219845292052> Please enter time in the valid format. \nFor example, `2m` will activate the bot if no messages are sent for 2 minutes. \nUse the letters s, m, h, and d to specify **s**econds, **m**inutes, **h**ours, and **d**ays."];
	} else {
		const msValues = [];
		initialMatch.forEach(match => {
			let num = Number(match.match(numRegex)[0]);
			const unit = match.match(unitRegex)[0];

			switch (unit) {
				case "s":
					var ms = num * 1000;
					break;
				case "m":
					var ms = num * 60000;
					break;
				case "h":
					var ms = num * 3.6e+6;
					break;
				case "d":
					var ms = num * 8.64e+7;
					break;
			}

			if (ms > 604800000) {
				return [false, "<:error:887414219845292052> Your timer is either too short or too long. It must last at least 1 minute and a maximum of 7 days."];
			} else {
				msValues.push(ms);
			}
		});

		var totalMs = 0;
		msValues.forEach(val => {
			totalMs += val;
		});

		if (totalMs < 60000 || totalMs > 604800000) {
			return [false, "<:error:887414219845292052> Your timer is either too short or too long. It must last at least 1 minute and a maximum of 7 days."];
		} else {
			const successstr = `<:success:887414468324253737> Success! I will send a message if CHANNEL_MENTION_HERE has no activity for ${msToTime(totalMs)}`;
			return [true, successstr, totalMs];
		}
	}
}
const error = (int, type, custom) => {
	let reason;
	switch (type) {
		case "channel":
			reason = "<:error:887414219845292052> Please enter a valid, existing text channel!";
			break;
		case "time":
			reason = custom;
			break;
		case "role":
			reason = "<:error:887414219845292052> Please enter a valid, existing role!";
			break;

		default:
			reason = "<:error:887414219845292052> An error occured!"
			break;
	}
	int.reply({ content: `${reason}` });
}

module.exports = {
	name: 'setup',
	description: 'Find out how to setup the bot!',
	permissions: "manager",
	async execute(int, client) {
		const cmd = await client.stats.findOne({ where: { name: this.name } });
		cmd.increment('uses'); // +1
		
		// ++ GENERAL ++ 
		const opt = {
			channel: int.options.getChannel('channel'),
			time: int.options.getString('time'),
		}
		if (int.options.getRole('role')) opt.role = int.options.getRole('role');


		// ++ CHANNEL ++
		if (opt.channel.type !== "GUILD_TEXT") return error(int, "channel");
		if (!int.guild.channels.cache.has(opt.channel.id)) return error(int, "channel");


		// ++ TIME ++
		// time to ms
		// 0: error | 1: msg | 2: ms
		const ms = timeToMs(opt.time);

		// time not meeting reqs
		if (!ms[0]) return error(int, "time", ms[1]);

		const time = ms[2];

		// ++ SERVER SIZE **
		if(time < 3600000) {
			if(int.guild.memberCount < 10000) {
				return int.reply("<:error:887414219845292052> Your timer is either too short or too long. It must last at least 1 hour (can be less if the server has more than 10.000 members) and a maximum of 7 days.");
			}
		}


		// ++ ROLE ++
		let roleId;
		if (opt.role) {
			roleId = opt.role.id;
		} else {
			roleId = "";
		}


		// ++ CHECK PERMISSIONS ++
		const chPe = opt.channel.permissionsFor(int.guild.me);
		if(!chPe.has("SEND_MESSAGES") || !chPe.has("READ_MESSAGE_HISTORY") || !chPe.has("EMBED_LINKS")) {
			return int.reply(`<:error:887414219845292052> I don't have the necessary permissions in that channel! \nI deleted the settings for the channel, please set up the permissions and then try again! \n\nRequired Permissions: \`SEND_MESSAGES\`, \`READ_MESSAGE_HISTORY\`, \`EMBED_LINKS\``);
		}


		// ++ DATABASE ++
		await client.revive.destroy({ where: { channelId: opt.channel.id } });
		await client.revive.create({
			guildId: int.guild.id.toString(),
			channelId: opt.channel.id.toString(),
			role: roleId,
			time: time,
		});

		ms[1] = ms[1].replace("CHANNEL_MENTION_HERE", `<#${opt.channel.id}>`);
		return int.reply({ content: `${ms[1]}` });
	},
};