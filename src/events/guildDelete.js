const config = require("@root/config.json");
const moment = require("moment");

module.exports = {
	name: 'guildDelete',
	async execute(guild, client) {
		if (!client.isReady()) return;
		// delete all revive message channels
		await client.revive.destroy({ where: { guildId: guild.id } });

		// removed from a guild embed
		let utcTime = guild.me.joinedAt.toISOString();
		utcTime = utcTime.replace('T', ' ');
		utcTime = utcTime.split('.');
		utcTime = utcTime[0];
		const joinedAt = `\`${utcTime} UTC\` (${moment.utc(guild.me.joinedAt).fromNow()})`;

		let Embed = {
			"description": `**Name:** ${guild.name} \n**ID:** \`${guild.id}\` \n**Members:** ${guild.memberCount} \n**Joined At:** ${joinedAt}`,
			"color": 15158332,
			"footer": {
				"text": "Removed from a server"
			},
			"timestamp": new Date(),
		};

		client.channels.cache.get(config.channel.joins).send({ embeds: [Embed] });
	}
}