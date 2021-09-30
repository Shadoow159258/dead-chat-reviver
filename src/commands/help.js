const { MessageActionRow, MessageButton } = require('discord.js');
const config = require("../../config.json");

module.exports = {
	name: 'help',
	description: 'Display some help and information about the bot',
	async execute(int, client) {
		const setup = [
			"`channel` - The channel on which these rules should apply",
			"`time` - Amount of time the channel should be inactive for the bot to activate",
			"`role` - The role you want to ping when the chat dies"
		];

		const HelpEmbed = {
			"title": "Help - Overview",
			"description": `Helps preventing servers / channels from dying by sending a revive message after some time, as well as a ping and a random conversation starter. \nExtra Info: If you chose a really small amount of time, it can still take up to 3 minutes to work! \n\nIf you want to speak to someone because you think you've found a bug or have a question about the bot, you can [join the support server](${config.support.invite}).`,
			"color": int.14052462,
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
					"name": "**__Bot Info__**",
					"value": `[Developer's Website](${config.creator.web} "poldisweb.de") | Creator's Tag: ${config.creator.tag}`,
				}
			]
		};

		const btn1 = new MessageActionRow()
			.addComponents(new MessageButton().setCustomId('uptime').setLabel('Uptime').setStyle('PRIMARY'))
			.addComponents(new MessageButton().setCustomId('ping').setLabel('Ping').setStyle('PRIMARY'))
			.addComponents(new MessageButton().setCustomId('info').setLabel('Live Info').setStyle('PRIMARY'))
			.addComponents(new MessageButton().setCustomId('changelog').setLabel('Changelog').setStyle('PRIMARY'))
		const btn2 = new MessageActionRow()
			.addComponents(new MessageButton().setLabel('Support Server').setStyle('LINK').setURL(`${config.support.invite}`))
			.addComponents(new MessageButton().setLabel('Invite Me').setStyle('LINK').setURL(`${config.client.invite}`))
			.addComponents(new MessageButton().setLabel('Top.gg').setStyle('LINK').setURL(`https://top.gg/bot/${client.user.id}`))


		int.reply({ embeds: [HelpEmbed], components: [btn1, btn2] });
	},
};