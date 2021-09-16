const config = require("../../config.json");
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
		// join embed
		const Embed = {
			"title": `Joined my ${ord(client.guilds.cache.size)} server!`,
			"description": `**Name:** ${guild.name} \n**ID:** \`${guild.id}\` \n**Members:** ${guild.memberCount}`,
			"color": 3066993,
			"timestamp": new Date(),
		}
		if(client.guilds.cache.size % 10 === 0) Embed.title += ' :tada:';
		
		client.channels.cache.get(config.channel.joins).send({ embeds: [Embed] });
	}
};