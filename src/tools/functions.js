const msToTime = (ms) => {
	let day, hour, minute, seconds;
	seconds = Math.floor(ms / 1000);
	minute = Math.floor(seconds / 60);
	seconds = seconds % 60;
	hour = Math.floor(minute / 60);
	minute = minute % 60;
	day = Math.floor(hour / 24);
	hour = hour % 24;

	let units = [];
	switch (day) { case 0: break; case 1: units.push("1 day"); break; default: units.push(day + " days"); };
	switch (hour) { case 0: break; case 1: units.push("1 hour"); break; default: units.push(hour + " hours"); };
	switch (minute) { case 0: break; case 1: units.push("1 minute"); break; default: units.push(minute + " minutes"); };
	switch (seconds) { case 0: break; case 1: units.push("1 second"); break; default: units.push(seconds + " seconds"); };

	return units.join(", ");
}
const timeToMs = (str) => {
	const timeRegex = /([0-9]+)( |)(s|m|h|d)/g;
	const numRegex = /([0-9]+)/g;
	const unitRegex = /(s|m|h|d)/g;
	const initialMatch = str.match(timeRegex);

	if (!initialMatch) {
		return [false, "Please enter time in the valid format. \nFor example, `30m` will activate the bot if no messages are sent for 30 minutes. \nUse the letters m, h, and d to specify **m**inutes, **h**ours, and **d**ays."];
	} else {
		const msValues = [];
		initialMatch.forEach(match => {
			let num = Number(match.match(numRegex)[0]);
			const unit = match.match(unitRegex)[0];

			switch (unit) {
				case "s":
					var ms = num * 1000;
					break;
				case "m":
					var ms = num * 60000;
					break;
				case "h":
					var ms = num * 3.6e+6;
					break;
				case "d":
					var ms = num * 8.64e+7;
					break;
			}
			msValues.push(ms);
		});

		var totalMs = 0;
		msValues.forEach(val => totalMs += val);

		return totalMs;
	}
}

module.exports = {
	msToTime: msToTime,
	timeToMs: timeToMs,
}