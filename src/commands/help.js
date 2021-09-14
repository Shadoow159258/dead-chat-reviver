const config = require("../../config.json");

module.exports = {
	name: 'help',
	description: 'Display some help and information about the bot',
	async execute(int, client) {
		const setup = ["`channel` - _Channel_ - The channel on which these rules should apply",
			"`time` - _Time to wait_ - Amount of time the channel should be inactive for the bot to activate",
			"`role` - _Pinged Role_ - The role you want to ping when the chat dies",
			"`-/-` - _Maximum pings per day_ - __3__; __this is fixed and can't be changed__ at the moment"];

		const HelpEmbed = {
			"title": "Help - Overview",
			"description": `To use this bot, you need to consider several aspects. They are listed below.`,
			"color": int.guild.me.displayColor,
			"fields": [
				{
					"name": "**/setup**",
					"value": `${setup.join("\n")}`,
				},
				{
					"name": "**/help**",
					"value": "Outputs the message you're looking at right now.",
				},
				{
					"name": "**/topic**",
					"value": "Sends a random conversation starter to help reviving the chat.",
				},
				{
					"name": "**__Bot Info__**",
					"value": `[Invite Link](${config.client.invite} "Discord Bot Invite Link") | [Developer's Website](${config.creator.web} "poldisweb.de") | Creator's Tag: ${config.creator.tag}`,
				}
			]
		};
		int.reply({ embeds: [HelpEmbed] });
	},
};