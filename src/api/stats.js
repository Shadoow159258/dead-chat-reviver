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
	let array = [];
	for (const v of Object.values(allRevives)) {
		array.push(v.time);
	}
	let sum = 0;
	for (let i = 0; i < array.length; i++) {
		sum += parseInt(array[i], 10);
	}

	const avg = sum / array.length;
	const count = await client.revive.count();

	res.send({ count: count, average: avg });
});

module.exports = route;