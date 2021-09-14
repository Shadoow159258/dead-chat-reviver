const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('setup')
	.setDescription('Set up the bot!')

	.addChannelOption(opt => opt.setName('channel').setDescription('The channel on which these rules should apply').setRequired(true))
	.addStringOption(opt => opt.setName('time').setDescription('The amount of time the channel should be inactive for the bot to activate').setRequired(true))
	.addRoleOption(opt => opt.setName('role').setDescription('The role you want to ping when the chat dies'))

module.exports = data;