const config = require("@root/config.json");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
	name: 'topic',
	description: 'Sends a random conversation starter to revive the chat',
	async execute(int, client) {
		const cmd = await client.stats.findOne({ where: { name: this.name } });
		cmd.increment('uses'); // +1

		const { topics } = config;

		const Embed = {
			"title": "Random Conversation Starter",
			"description": `__**${topics[Math.floor(Math.random() * topics.length)]}**__`,
			"color": 14052462,
			"footer": {
				"text": `Requested by ${int.user.tag}`
			},
		};
		const btn = new MessageActionRow().addComponents(new MessageButton().setCustomId('newTopic').setLabel('New Topic').setStyle('PRIMARY'));
		const dbtn = new MessageActionRow().addComponents(new MessageButton().setCustomId('newTopic').setLabel('New Topic').setStyle('PRIMARY').setDisabled(true));
		const filter = (i) => i.customId === 'newTopic' && i.user.id === int.user.id;

		const newTopic = async (msg) => {
			msg.awaitMessageComponent({ filter, time: 60000 })
				.then(async (int) => {
					// interaction (button) received
					Embed.description = `__**${topics[Math.floor(Math.random() * topics.length)]}**__`;
					const msg = await int.update({ embeds: [Embed], components: [btn], fetchReply: true });
					newTopic(msg);
				}).catch(() => {
					// nothing received after 1 minute
					if (!msg.deleted && msg.editable) return msg.edit({ embeds: [Embed], components: [dbtn] });
					return;
				});
		}

		const msg = await int.reply({ embeds: [Embed], components: [btn], fetchReply: true });
		return newTopic(msg);
	},
};