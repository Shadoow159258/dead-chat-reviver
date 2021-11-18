const { MessageActionRow, MessageButton } = require("discord.js");
const config = require("@root/config.json");

module.exports = {
	name: 'help',
	description: 'Display some help and information about the bot',
	async execute(int, client) {
		const cmd = await client.stats.findOne({ where: { name: this.name } });
		cmd.increment('uses'); // +1

		const setup = [
			"`channel` - The channel on which these rules should apply",
			"`time` - Amount of time the channel should be inactive for the bot to activate",
			"`role` - The role you want to ping when the chat dies"
		];

		const HelpEmbed = {
			"title": "Help - Overview",
			"description": `Helps preventing servers / channels from dying by sending a revive message after some time, as well as a ping and a random conversation starter. \nExtra Info: There *can* be a deviation of up to 4 minutes. \n\nIf you want to speak to someone because you think you've found a bug or have a question about the bot, you can [join the support server](${config.support.invite}).`,
			"color": 14052462,
			"fields": [
				{
					"name": "**/help**",
					"value": "Outputs the message you're looking at right now.",
				},
				{
					"name": "**/setup**",
					"value": `Sets up a revive message for a channel. Use the same command to change your settings. \n${setup.join("\n")}`,
				},
				{
					"name": "**/delete**",
					"value": "Remove a revive message channel.",
				},
				{
					"name": "**/list**",
					"value": "Displays a list of all revive message channels and their settings on the server.",
				},
				{
					"name": "**/topic**",
					"value": "Sends a random conversation starter to help reviving the chat.",
				},
				{
					"name": "**__Dev Info__**",
					"value": `[Developer's Website](${config.dev.web} "poldisweb.de") | Discord Tag: ${config.dev.tag}`,
				}
			],
			"footer": {
				"text": `Requested by ${int.user.tag}`
			},
		};

		const btn1 = new MessageActionRow()
			.addComponents(new MessageButton().setCustomId('uptime').setLabel('Uptime').setStyle('PRIMARY'))
			.addComponents(new MessageButton().setCustomId('ping').setLabel('Ping').setStyle('PRIMARY'))
			.addComponents(new MessageButton().setCustomId('info').setLabel('Live Info').setStyle('PRIMARY'))
			.addComponents(new MessageButton().setCustomId('statistics').setLabel('Statistics').setStyle('PRIMARY'))
			.addComponents(new MessageButton().setCustomId('version').setLabel('Version').setStyle('PRIMARY'))
		const btn2 = new MessageActionRow()
			.addComponents(new MessageButton().setLabel('Invite Me').setStyle('LINK').setURL(`${config.client.invite}`))
			.addComponents(new MessageButton().setLabel('Vote').setStyle('LINK').setURL(`https://top.gg/bot/${client.user.id}/vote`))
			.addComponents(new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(`${config.support.invite}`))
			.addComponents(new MessageButton().setLabel('Website').setStyle('LINK').setURL(`${config.client.web}`))


		int.reply({ embeds: [HelpEmbed], components: [btn1, btn2] });
	},
};