const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('delete')
	.setDescription('Remove a revive message channel')

	.addChannelOption(opt => opt.setName('channel').setDescription('The channel which revive message should be removed').setRequired(true))

module.exports = data;