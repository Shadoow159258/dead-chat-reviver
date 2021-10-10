// reuquire
const express = require("express");
const app = express();
const config = require("@root/config.json");

// routes
const stats = require("@src/api/stats");

// app
app.listen(config.api.port, () => {
	console.log(`API on port ${config.api.port}!`);
});

app.use('/stats', stats);