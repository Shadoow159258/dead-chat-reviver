module.exports = {
	name: 'interactionCreate',
	async execute(int, client) {
		if (!int.member) return;
		const { user, member, guild, message } = int;
		const { authors } = client;

		if (int.isCommand()) {
			if (!client.commands.has(int.commandName)) return;
			const command = client.commands.get(int.commandName);

			if(command.permissions) {
				if(typeof command.permissions === "string") {
					command.permissions = [command.permissions];
				}

				for(const perm of command.permissions) {
					switch (perm) {
						case "admin":
							if(!member.permissions.has("ADMINISTRATOR")) return int.reply({ content: `You do not have the permissions to use this command!` });
							break;
						case "manager":
							if(!member.permissions.has("MANAGE_CHANNELS") || !member.permissions.has("MANAGE_GUILD")) return int.reply({ content: `You do not have the permissions to use this command!` });
							break;
					
						default:
							console.log(`unknown permissions requested in "${command.name}.js"`)
							break;
					}
				}
			}

			try {
				command.execute(int, client);
			} catch (error) {
				console.error(error);
				return int.reply({ content: `There was an error trying to execute that command!` });
			}
		}
		if (int.isButton()) {
			if (int.customId === 'close') {
				let author = false;
				if(authors.has(message.id) && authors.get(message.id) === user.id) author = true;

				if (author) {
					authors.delete(message.id);
					message.removeAttachments();
					return int.update({ content: 'This menu was closed!', embeds: [], components: [] });
				} else {
					return int.reply({ content: `You do not have the permissions to close this menu!`, ephemeral: true });
				}

			}
		}
		if (int.isSelectMenu()) {
			if (int.customId === 'help') {
				let author = {};
				if (message.reference) {
					author = (await message.channel.messages.fetch(message.reference.messageId)).author;
				}

				if (author.id === user.id) {
					return require('../interactions/help.js').execute(int, [int.values[0]], client);
				} else {
					return int.reply({ content: `You do not have the permissions to close this menu!`, ephemeral: true });
				}
			}
		}
	}
};