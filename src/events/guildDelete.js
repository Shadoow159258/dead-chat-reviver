const config = require("../../config.json");
const moment = require("moment");

module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {
		// delete all revive message channels
		await client.revive.destroy({ where: { guildId: guild.id } });

		// leave embed
		let utcTime = new Date(guild.me.joinedAt).toISOString();
		utcTime = utcTime.replace('T', ' ');
		utcTime = utcTime.split('.');
		utcTime = utcTime[0];
		const joinedAt = `\`${utcTime} UTC\` (${moment.utc(guild.me.joinedAt).fromNow()})`;

		const Embed = {
			"description": `**Name:** ${guild.name} \n**ID:** \`${guild.id}\` \n**Members:** ${guild.memberCount} \n**Joined At:** ${joinedAt}`,
			"color": 15158332,
			"footer": {
				"text": "Removed from a server"
			},
			"timestamp": new Date(),
		}
		
		client.channels.cache.get(config.channel.joins).send({ embeds: [Embed] });
	}
}