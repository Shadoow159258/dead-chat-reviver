const outputErr = require("@tools/error");
const { msToTime, timeToMs } = require("@tools/functions");

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
			role: null,
		}
		if (int.options.getRole('role')) opt.role = int.options.getRole('role').id;


		// ++ CHANNEL ++
		if (opt.channel.type !== "GUILD_TEXT") return outputErr(int, "text-channel-req");
		if (!int.guild.channels.cache.has(opt.channel.id)) return outputErr(int, "text-channel-req");


		// ++ TIME ++
		// time to ms
		const ms = timeToMs(opt.time);

		// time not meeting reqs
		if (ms < 1800000 || ms > 604800000) {
			if (opt.role) return outputErr(int, "time");
		}
		if (ms < 600000) {
			return outputErr(int, "time-2")
		}

		// ++ CHECK PERMISSIONS ++
		const chPe = opt.channel.permissionsFor(int.guild.me);
		if (!chPe.has("SEND_MESSAGES") || !chPe.has("READ_MESSAGE_HISTORY") || !chPe.has("EMBED_LINKS")) {
			await client.revive.destroy({ where: { channelId: opt.channel.id } });
			return int.reply(`<:error:887414219845292052> I don't have the necessary permissions in that channel! \nI deleted the settings for the channel, please set up the permissions and then try again! \n\nRequired Permissions: \`SEND_MESSAGES\`, \`READ_MESSAGE_HISTORY\`, \`EMBED_LINKS\``);
		}
		if (opt.role && !chPe.has("MENTION_EVERYONE")) {
			return int.reply(`<:error:887414219845292052> I don't have the necessary permissions in that channel! \n\nMissing Permissions: \`MENTION_EVERYONE\``);
		}


		// ++ DATABASE ++
		await client.revive.destroy({ where: { channelId: opt.channel.id } });
		await client.revive.create({
			guildId: int.guild.id.toString(),
			channelId: opt.channel.id.toString(),
			role: opt.role,
			time: ms,
		});

		return int.reply({ content: `<:success:887414468324253737> Success! I will send a message if <#${opt.channel.id}> has no activity for ${msToTime(ms)}` });
	},
};