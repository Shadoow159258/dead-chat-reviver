const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Display some help and info about the bot')

module.exports = data;