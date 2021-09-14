const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('topic')
	.setDescription('Sends a random conversation starter')

module.exports = data;