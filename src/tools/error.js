module.exports = (int, err, custom) => {
	// switch for all possible errors
	let errMsg;
	switch (err) {
		case 403:
			errMsg = "You do not have the permissions to use this command!";
			break;
		case 404:
			errMsg = "There was an error trying to execute that command, please get in touch if this persists.";
			break;
		case "text-channel-req":
			errMsg = "Please enter a valid, existing text channel!"
			break;
		case "no-revive-channel":
			errMsg = "The selected channel is no revive message channel!"
			break;
		case "time":
			errMsg = custom;
			break;
		default:
			errMsg = "An unknown error has occurred, please get in touch if this persists."
			break;
	}

	// reply to the interaction or send a follow up if already replied
	if (!int.replied && !int.deferred)
		int.reply({ content: `<:error:887414219845292052> ${errMsg}` })
	else if (!int.deferred && int.replied)
		int.followUp({ content: `<:error:887414219845292052> ${errMsg}` });
	else
		int.editReply({ content: `<:error:887414219845292052> ${errMsg}` });
}