module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {
		// delete all revive message channels
		await client.revive.destroy({ where: { guildId: guild.id } });
	}
}