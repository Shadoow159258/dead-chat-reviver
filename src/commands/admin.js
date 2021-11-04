const outputErr = require("@tools/error");
const config = require("@root/config.json");
const { MessageActionRow, MessageButton } = require("discord.js");
const { inspect } = require("util");

module.exports = {
	name: 'admin',
	description: 'Bot administrator tools',
	async execute(int, client) {
		// only owners
		if (config.client.owners.includes(int.user.id)) return outputErr(int, 403);

		const cmdForStats = await client.stats.findOne({ where: { name: this.name } });
		cmdForStats.increment('uses'); // +1

		// defer the reply (answer could take time)
		await int.deferReply();

		const cmd = int.options.getString("command");
		const args = cmd.split(" ").splice(0, 1);

		switch (cmd.split(" ")[0]) {
			case "eval":
				// evaluate given string
				const code = cmd.replace("eval ", "");
				let err = false;

				let output;
				try {
					output = await eval(code);
					output = `**<:success:887414468324253737> Output** \n\`\`\`yaml\n${inspect(output, { depth: 0 })}\`\`\``;
				} catch (error) {
					err = {
						"string": error,
						"stack": error.stack
					};
					output = `**<:error:887414219845292052> Error** \n\`\`\`yaml\n${error}\`\`\``;
				}

				const InputEmbed = {
					"author": {
						"name": `${int.user.tag} (${int.user.id})`,
						"icon_url": `${int.user.displayAvatarURL({ dynamic: true, size: 2048 })}`
					},
					"description": `**<:input:904114054061236224> Input** \n\`\`\`js\n${code}\`\`\``,
					"color": 14052462,
				}
				const OutputEmbed = {
					"description": `${output}`,
					"color": 14052462,
					"timestamp": new Date(),
				}
				const btn = new MessageActionRow().addComponents(new MessageButton().setCustomId('cet').setLabel('Change Error Type').setStyle('PRIMARY'));
				const dbtn = new MessageActionRow().addComponents(new MessageButton().setCustomId('cet').setLabel('Change Error Type').setStyle('PRIMARY').setDisabled(true));
				const filter = (i) => i.customId === 'cet' && i.user.id === int.user.id;

				let typeCh = false;
				const changeErrorType = async (msg) => {
					msg.awaitMessageComponent({ filter, time: 60000 })
						.then(async (int) => {
							// interaction (button) received
							let nMsg;
							if (typeCh) {
								OutputEmbed.description = `**<:error:887414219845292052> Error** \n\`\`\`yaml\n${err.string}\`\`\``;
								nMsg = await int.update({ embeds: [InputEmbed, OutputEmbed], components: [btn], fetchReply: true });
								typeCh = false;
							} else {
								OutputEmbed.description = `**<:error:887414219845292052> Error** \n\`\`\`yaml\n${err.stack}\`\`\``;
								nMsg = await int.update({ embeds: [InputEmbed, OutputEmbed], components: [btn], fetchReply: true });
								typeCh = true;
							}
							changeErrorType(nMsg);
						}).catch(() => {
							if (!msg.deleted) return msg.edit({ embeds: [InputEmbed, OutputEmbed], components: [dbtn] });
						});
				}

				if (!err) {
					int.editReply({ embeds: [InputEmbed, OutputEmbed] });
				} else {
					const msg = await int.editReply({ embeds: [InputEmbed, OutputEmbed], components: [btn], fetchReply: true });
					return changeErrorType(msg);
				}
				break;
			case "test":
				int.editReply("test");
				break;
			default:
				break;
		}
	},
};