const { MessageActionRow, MessageButton, SnowflakeUtil } = require("discord.js");
const config = require("@root/config.json");
const { topics } = config;

module.exports = async (client) => {
	const revives = await client.revive.findAll();

	const btnLinks = new MessageActionRow()
		.addComponents(
			new MessageButton().setLabel('Invite Me').setStyle('LINK').setURL(`${config.client.invite}`),
			new MessageButton().setLabel('Vote').setStyle('LINK').setURL(`https://top.gg/bot/${client.user.id}/vote`),
			new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(`${config.support.invite}`),
			new MessageButton().setLabel('Website').setStyle('LINK').setURL(`${config.client.web}`)
		);

	for (const revive of revives) {
		try {
			const channel = client.channels.cache.get(revive.channelId);
			if (!channel) continue;
			const lastMsg = channel?.lastMessageId ?? "";
			const lastMsgTime = SnowflakeUtil.deconstruct(lastMsg).timestamp;

			if (typeof lastMsgTime !== "number") return;

			const diff = Math.floor(Date.now() - lastMsgTime);
			if (diff < revive.time) return;

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
			revive.role = revive.role ?? "";
			if (revive.role.length > 0) {
				msgObj.content = `<@&${revive.role}>`;
			}

			await channel.send(msgObj);
			const stats = await client.reviveMsgs.findByPk(1);
			stats.increment('count'); // +1
		} catch (err) {
			// ignore some common errors (missing access (2x), unknown message, server error, bad gateway)
			const ignore = [50013, 50001, 10008, 500, 502];
			if (!ignore.includes(err.code))
				console.error(err);
		}
	}
}