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
			"title": `Removed from a server! <:sad:871028590781820929>`,
			"description": `**Name:** ${guild.name} \n**ID:** \`${guild.id}\` \nMembers: ${guild.memberCount} \nJoined At: ${joinedAt}`,
			"color": 15158332,
			"timestamp": new Date(),
		}
		
		client.channels.cache.get(config.channel.joins).send({ embeds: [Embed] });
	}
}