module.exports = {
	name: 'delete',
	description: 'Remove a revive message channel',
	permissions: "manager",
	async execute(int, client) {
		// check channel type
		const channel = int.options.getChannel('channel');
		if (channel.type !== "GUILD_TEXT") return int.reply("<:error:887414219845292052> Please enter a valid, existing text channel!");
		if (!int.guild.channels.cache.has(channel.id)) return int.reply("<:error:887414219845292052> Please enter a valid, existing text channel!");

		// delete
		const entry = await client.revive.destroy({ where: { channelId: channel.id } });
		if (!entry) {
			return int.reply("<:error:887414219845292052> That revive message channel did not exist!");
		} else {
			return int.reply(`<:success:887414468324253737> Success! <#${channel.id}> won't receive any revive messages anymore!`)
		}
	},
};