const config = require("../../config.json");
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	name: 'topic',
	description: 'Sends a random conversation starter to revive the chat',
	async execute(int, client) {
		const questions = [
			"If You Had Three Wishes, What Would You Wish For?",
			"What Would You Rather Throw Away: Love Or Money?",
			"What’s The Most Beautiful Place You’ve Ever Seen?",
			"What Was Your Fondest Memory Of High School?",
			"What’s Your Favorite TV Show?",
			"What’s The Strangest Thing In Your Refrigerator?",
			"Would You Rather Hear The Music Of Johann Sebastian Bach Played By A Barbershop Quartet, Or A Heavy Metal Band?",
			"Have You Ever Been To A Five Star Resort?",
			"What Was Your Favorite Toy Growing Up?",
			"What’s The Funniest Way You’ve Ever Broken The Law?",
			"What’s Your Favorite Sports Team?",
			"What Talent Would You Want To Possess If You Could?",
			"If You Could Trade Lives With Someone, Who Would It Be?",
			"If You Could Erase One Event From History, Which One Would You Erase?",
			"What Was Your Favorite Toy As A Child?",
			"Who Do You Most Like To Poke Fun At?",
			"If You Were Suddenly Transported To Another Planet, How Would You Assess The Situation?",
			"When Do You Feel The Most In Control?",
			"Would You Rather Have 10 Hobbies Or One Passion?",
			"What’s Your Favorite Movie?",
			"If You Could Interview A Famous Person, Who Would You Choose?",
			"If Your Food Is Bad At A Restaurant, Would You Say Something?",
			"If You Could Only Use One Word The Rest Of Your Life, What Word Would You Choose?",
			"What Are Your Dreams And Ambitions?",
			"You’ve Been Given An Elephant. You Can’t Get Rid Of It. What Would You Do With It?",
			"What’s The Funniest Thing You’ve Seen On The News?",
			"If You Had The World’s Attention For 30 Seconds, What Would You Say?",
			"If You Could Be Best Friends With A Celebrity, Who Would It Be?",
			"If You Were To Play A Song You Love Right Now, What Would It Be?",
			"Would You Rather Look Like A Potato, Or Feel Like A Potato?",
			"What Would You Do With 10 Million Dollars?",
			"How Can You Tell If Someone Has A Sense Of Humor?",
			"If You Were To Name Your Own Song, What Would You Name It?",
			"If You Were In A Room Filled With You And Your Doppelganger And 2 Million Dollars, What Would You Do?",
			"What Is In Your Fridge Right Now?",
			"What Have You Learned About Life From Kids?",
			"How Would You Want To Be Remembered?",
			"What Do You Hope Your Deceased Relative Would Say About You If They Saw You Now?",
			"If You Could Change Your Name, What Would You Change It To?",
			"What’s The Strangest Thing That You’ve Ever Fallen In Love With?",
			"If You Could Have Any Super Power, Which One Would You Choose?",
			"If You Were Invited To Attend Hogwarts, Which Hogwarts House Would You Choose?",
			"What Were The Highlights Of Your Childhood?",
			"Have You Ever Kept A Secret For More Than A Decade?",
			"What’s The Most Important Thing You’ve Learned From A Celebrity?",
			"Do You Care About Reviews?",
			"What Would Be The Perfect Crime?",
			"What’s The Stupidest Thing You’ve Ever Done?",
			"Spontaneity Or Stability?",
			"What’s The Funniest Movie You’ve Ever Seen?",
			"When Did You Last Meet A Stranger You Thought You’d Never Meet Again?",
			"Do You Save Or Spend?",
			"How Much Does The Amount Of Traffic Affect Your Mood?",
			"If You Had To Choose One Animal To Have As A Pet, Which Animal Would You Choose?",
			"What’s Your Worst Habit?",
			"Do they like to take a stand or just let things go?",
			"What’s Your Favorite Song?",
			"How Do You Think The World Would Be Different If Bananas Were Illegal?",
			"Would You Rather Be Able To Control Time, Or Be Able To Know What Other People Are Thinking?",
			"Is It Difficult To Do What You Do?",
			"Who Is Your Favorite Celebrity?",
			"If You Found $2,000 On The Ground, What Would You Do With It?",
			"What’s Your Favorite Pizza Topping?",
			"What Would You Do If You Could Possess The Abilities Of Your Dog?",
			"What’s The Smartest Thing You’ve Ever Done?"
		];

		const Embed = {
			"title": "Random Conversation Starter",
			"description": `__**${questions[Math.floor(Math.random() * questions.length)]}**__`,
			"color": int.guild.me.displayColor,
		};
		const btn = new MessageActionRow().addComponents(new MessageButton().setCustomId('newTopic').setLabel('New Topic').setStyle('PRIMARY'));
		const dbtn = new MessageActionRow().addComponents(new MessageButton().setCustomId('newTopic').setLabel('New Topic').setStyle('PRIMARY').setDisabled(true));
		const filter = (i) => i.customId === 'newTopic' && i.user.id === int.user.id;
		const newTopic = async (msg) => {
			msg.awaitMessageComponent({ filter, time: 60000 })
				.then(async (int) => {
					// interaction (button) received
					Embed.description = `__**${questions[Math.floor(Math.random() * questions.length)]}**__`;
					const msg = await int.update({ embeds: [Embed], components: [btn], fetchReply: true });
					newTopic(msg);
				}).catch(() => {
					// nothing received after 1 minute
					return msg.edit({ embeds: [Embed], components: [dbtn] });
				});
		}

		const msg = await int.reply({ embeds: [Embed], components: [btn], fetchReply: true });
		return newTopic(msg);
	},
};