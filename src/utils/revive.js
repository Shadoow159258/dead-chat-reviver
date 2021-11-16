const { MessageActionRow, MessageButton } = require("discord.js");
const config = require("@root/config.json");
const { topics } = config;

module.exports = async (client) => {
	const revives = await client.revive.findAll();

	const btnLinks = new MessageActionRow()
		.addComponents(new MessageButton().setLabel('Invite Me').setStyle('LINK').setURL(`${config.client.invite}`))
		.addComponents(new MessageButton().setLabel('Vote').setStyle('LINK').setURL(`https://top.gg/bot/${client.user.id}/vote`))
		.addComponents(new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(`${config.support.invite}`))
		.addComponents(new MessageButton().setLabel('Website').setStyle('LINK').setURL(`${config.client.web}`))

	for (const entry of revives) {
		const channel = await client.channels.fetch(entry.channelId);

		channel.messages.fetch({ limit: 1 })
			.then(async (msgs) => {
				msgs = [...msgs.values()];
				const msg = msgs[0];

				// if there are messages in the channel
				if (msgs.length > 0) {
					if (msg.author.id === client.user.id) return;
					const diff = Math.floor(Date.now() - msg.createdAt);

					// time difference between last message and now
					if (diff < entry.time) return;
				}

				const msgObj = {
					content: null,
					embeds: [{
						"title": "Revive the chat!",
						"description": `If you don't know what to talk about, here's a random topic (Use \`/topic\` to generate these manually):
							\n__**${topics[Math.floor(Math.random() * topics.length)]}**__`,
						"color": 14052462,
					}],
					components: [btnLinks],
				}
				// if role is defined
				entry.role = entry.role ?? "";
				if (entry.role.length > 0) {
					msgObj.content = `<@&${entry.role}>`;
				}

				await channel.send(msgObj);
				const stats = await client.reviveMsgs.findByPk(1);
				stats.increment('count'); // +1
			}).catch((err) => {
				// ignore some common errors (missing access (2x), unknown message, server error, bad gateway)
				const ignore = [50013, 50001, 10008, 500, 502];
				if (!ignore.includes(err.code))
					console.error(err);
				return;
			});
	}
}