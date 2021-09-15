const config = require("../../config.json");

module.exports = {
	name: 'help',
	description: 'Display some help and information about the bot',
	async execute(int, client) {
		const setup = 	[
							"`channel` - The channel on which these rules should apply",
							"`time` - Amount of time the channel should be inactive for the bot to activate",
							"`role` - The role you want to ping when the chat dies"
						];

		const HelpEmbed = {
			"title": "Help - Overview",
			"description": `To use this bot, you need to consider several aspects. They are listed below. \n\nExtra Info: If you chose a really small amount of time, it can still take up to 3 minutes to work!`,
			"color": int.guild.me.displayColor,
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
					"value": `[Invite Link](${config.client.invite} "discord.com") | [Top.gg](https://top.gg/bot/${client.user.id} "top.gg") | [Developer's Website](${config.creator.web} "poldisweb.de") | Creator's Tag: ${config.creator.tag}`,
				}
			]
		};
		int.reply({ embeds: [HelpEmbed] });
	},
};