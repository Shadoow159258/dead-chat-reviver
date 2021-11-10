module.exports = {
	msToTime: (ms) => {
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
}