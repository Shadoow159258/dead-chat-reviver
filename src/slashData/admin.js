const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('admin')
	.setDescription('Bot administrator tools')
	.addSubcommand(subcommand =>
		subcommand
			.setName('tools')
			.setDescription('Bot administrator tools')
			.addStringOption(opt =>
				opt
					.setName('command')
					.setDescription('The command you want to execute')
					.setRequired(true)
			)
	);


module.exports = data;