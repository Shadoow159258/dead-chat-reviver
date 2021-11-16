const { Router } = require("express");
const route = Router();
const client = require("@root/dcr").client;

route.get('/commands', async (req, res) => {
	const allStats = await client.stats.findAll();
	res.send(allStats);
});
route.get('/servers', (req, res) => {
	const guilds = client.guilds.cache.size;
	const users = client.guilds.cache.filter((e) => e.memberCount).reduce((a, g) => a + g.memberCount, 0);

	res.send({ guilds: guilds, users: users });
});
route.get('/revives', async (req, res) => {
	const allRevives = await client.revive.findAll();
	let array = allRevives.map(v => v.time);
	let sum = 0;
	for (let i = 0; i < array.length; i++) sum += array[i];

	const avg = sum / array.length;
	const channels = await client.revive.count();
	const msgs = (await client.reviveMsgs.findAll({ attributes: ['count'] }))[0].count;

	res.send({ channels: channels, msgs: msgs, average: avg });
});

module.exports = route;