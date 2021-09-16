module.exports = {
	name: 'channelDelete',
	async execute(channel, client) {
		// delete if revive message channel
		await client.revive.destroy({ where: { channelId: channel.id } });
	}
}