const { msToTime } = require("@utils/functions");

module.exports = {
	name: 'list',
	description: 'Display all active revive message channel',
	permissions: "manager",
	async execute(int, client) {
		const cmd = await client.stats.findOne({ where: { name: this.name } });
		cmd.increment('uses'); // +1

		await int.deferReply();

		const revives = await client.revive.findAll();
		const printSettings = [];
		revives.forEach((elem) => {
			if (elem.guildId === int.guild.id) {
				let role = "";
				elem.role = elem.role ?? "";
				if (elem.role.length > 0) role = ` | <@&${elem.role}>`;
				const str = `<#${elem.channelId}> | ${msToTime(elem.time)}${role}`;
				printSettings.push(str);
			}
		});
		const ogLength = printSettings.length;
		if (printSettings.length <= 0) printSettings.push("There are **no active revive message channels** on this server.")

		const HelpEmbed = {
			"title": "List of all active channels",
			"description": `This is a list of all revive message channels and their settings on this server. \n\n**${ogLength}** revive message channels\n${printSettings.join("\n")}`,
			"color": 14052462,
			"timestamp": new Date(),
			"footer": {
				"text": `Requested by ${int.user.tag}`
			},
		};
		return int.editReply({ embeds: [HelpEmbed] }).catch(() => { });
	},
};