const outputErr = require("@tools/error");
const config = require("@root/config.json");
const { MessageActionRow, MessageButton } = require("discord.js");
const { inspect } = require("util");

module.exports = {
	name: 'admin',
	description: 'Bot administrator tools',
	async execute(int, client) {
		if (int.user.id !== "645580301057392650") return outputErr(int, 403);

		await int.deferReply();

		const cmd = int.options.getString("command");
		const args = cmd.split(" ").splice(0, 1);

		switch (cmd.split(" ")[0]) {
			case "eval":
				let output;
				try {
					output = await eval(cmd.replace("eval ", ""));
					output = `\`\`\`yaml\n${inspect(output, { depth: 0 })}\`\`\``;
				} catch (err) {
					output = `\`ERROR:\`\n\`\`\`yaml\n${err}\`\`\``;
				}
				int.editReply({ content: `${output}` });
				break;
			case "test":
				int.editReply("test");
				break;
			default:
				break;
		}
	},
};