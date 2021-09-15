const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('list')
	.setDescription('Display all active revive message channel')

module.exports = data;