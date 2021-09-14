
module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
		const { guildSettings } = client;
		await guildSettings.create({
			guildId: guild.id.toString(),
			pingRole: "",
			timesADay: 3,
			timeToWait: 0,
		});
	}
}