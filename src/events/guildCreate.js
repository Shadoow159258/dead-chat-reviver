const { MessageActionRow, MessageButton } = require("discord.js");
const config = require("@root/config.json");
function ord(i) {
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + "st";
	}
	if (j == 2 && k != 12) {
		return i + "nd";
	}
	if (j == 3 && k != 13) {
		return i + "rd";
	}
	return i + "th";
}

module.exports = {
	name: 'guildCreate',
	async execute(guild, client) {
		// added to a new guild embed
		const JoinEmbed = {
			"description": `**Name:** ${guild.name} \n**ID:** \`${guild.id}\` \n**Members:** ${guild.memberCount}`,
			"color": 3066993,
			"footer": {
				"text": `Added to a server (${ord(client.guilds.cache.size)})`
			},
			"timestamp": new Date(),
		}
		client.channels.cache.get(config.channel.joins).send({ embeds: [JoinEmbed] });

		const ThanksEmbed = {
			"title": "Thank you for adding me to this server!",
			"description": `To start, use \`/setup\`. \nIf you want to know more about me and my commands, use \`/help\`.`,
			"color": 14052462,
			"timestamp": new Date(),
		}
		const btnLinks = new MessageActionRow()
			.addComponents(new MessageButton().setLabel('Invite Me').setStyle('LINK').setURL(`${config.client.invite}`))
			.addComponents(new MessageButton().setLabel('Vote').setStyle('LINK').setURL(`https://top.gg/bot/${client.user.id}/vote`))
			.addComponents(new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(`${config.support.invite}`))
			.addComponents(new MessageButton().setLabel('Website').setStyle('LINK').setURL(`${config.client.web}`))

		const channel = guild.channels.cache.find(c => c.type === 'GUILD_TEXT' && guild.me.permissionsIn(c).has('VIEW_CHANNEL') && guild.me.permissionsIn(c).has('SEND_MESSAGES') && guild.me.permissionsIn(c).has('EMBED_LINKS'));
		if (channel)
			channel.send({ embeds: [ThanksEmbed], components: [btnLinks] });
	}
};