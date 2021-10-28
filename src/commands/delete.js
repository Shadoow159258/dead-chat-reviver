const outputErr = require("@tools/error");

module.exports = {
	name: 'delete',
	description: 'Remove a revive message channel',
	permissions: "manager",
	async execute(int, client) {
		const cmd = await client.stats.findOne({ where: { name: this.name } });
		cmd.increment('uses'); // +1

		// check channel type
		const channel = int.options.getChannel('channel');
		if (channel.type !== "GUILD_TEXT") return outputErr(int, "text-channel-req");
		if (!int.guild.channels.cache.has(channel.id)) return outputErr(int, "text-channel-req");

		// delete
		const entry = await client.revive.destroy({ where: { channelId: channel.id } });

		if (!entry) return outputErr(int, "no-revive-channel");
		else return int.reply(`<:success:887414468324253737> Success! <#${channel.id}> won't receive any revive messages anymore!`)
	},
};