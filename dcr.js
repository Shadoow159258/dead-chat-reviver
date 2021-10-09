// ++ REQUIRE ++
require('module-alias/register');
const Sequelize = require('sequelize');
const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const revive = require("./src/revive.js");


// ++ CLIENT ++
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
client.commands = new Discord.Collection();


// ++ SEQUELIZE ++
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});
client.revive = sequelize.define('revive', {
	guildId: Sequelize.STRING,
	channelId: Sequelize.STRING,
	role: Sequelize.STRING,
	time: Sequelize.INTEGER,
});
client.stats = sequelize.define('stats', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	uses: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});


// ++ EVENTS ++
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./src/events/${file}`);
	if (event.name === 'ready') {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}


// ++ SLASH COMMANDS ++
const commandFiles = fs.readdirSync(`./src/commands`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.name, command);
}


// ++ REVIVE CHAT MESSAGES ++
setInterval(() => {
	revive.execute(client);
}, 120000); // 2 minutes


// ++ LOGIN ++
client.login(config.client.token);

module.exports = {
	client: client
};