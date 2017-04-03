/*global dojo, require, classes, num*/

require(["dojo/on", "dojo/mouse"], function (on, mouse) {
"use strict";

dojo.declare("classes.KGSaveEdit.AchievementsManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	achievementsData: [{
			name: "theElderLegacy",
			title: "The Elder Legacy",
			description: "Be a first player to test Kittens Game Mobile",
			condition: function () {
                var date = new Date();
                return (date.getMonth() == 0 && date.getFullYear() == 2017);
			},
			hidden: true
		}, {
			name: "unicornConspiracy",
			title: "Unicorn Conspiracy",
			description: "Lift the shroud of the Unicorn conspiracy!",
			condition: function () {
				return this.game.resPool.get("unicorns").owned();
			}
		}, {
			name: "uniception",
			title: "Uniception",
			description: "Find the conspiracy within the conspiracy",
			condition: function () {
				return this.game.resPool.get("tears").owned();
			}
		}, {
			name: "sinsOfEmpire",
			title: "Sins of a Solar Empire",
			description: "Wait, seriously?",
			condition: function () {
				return this.game.resPool.get("alicorn").owned();
			}
		}, {
			name: "anachronox",
			title: "Anachronox",
			description: "Please stop",
			condition: function () {
				return this.game.resPool.get("timeCrystal").owned();
			}
		}, {
			name: "deadSpace",
			title: "Dead Space",
			description: "In space no one can hear you meow.",
			condition: function () {
				return this.game.resPool.get("necrocorn").owned();
			}
		}, {
			name: "ironWill",
			title: "Iron Will",
			description: "You truly deserved this",
			condition: function () {
				return this.game.ironWill && !this.game.resPool.get("kittens").owned() && this.game.bld.get("mine").owned();
			}
		}, {
			name: "uberkatzhen",
			title: "Uberkatzchen",
			description: "What does not kill you makes you stronger",
			condition: function () {
				return this.game.ironWill && !this.game.resPool.get("kittens").owned() && this.game.bld.get("warehouse").owned();
			}
		}, {
			name: "hundredYearsSolitude",
			title: "One Hundred Years of Solitude",
			description: "How far is too far?",
			condition: function () {
				return this.game.ironWill && !this.game.resPool.get("kittens").owned() && this.game.bld.get("steamworks").owned();
			}
		}, {
			name: "soilUptuned",
			title: "Virgin Soil Upturned",
			description: "Have 45 pastures in Iron Will mode",
			condition: function () {
				return this.game.ironWill && !this.game.resPool.get("kittens").owned() && this.game.bld.get("pasture").val >= 45;
			}
		}, {
			name: "atlasUnmeowed",
			title: "Atlas Unmeowed",
			description: "Construct a magneto in Iron Will mode",
			condition: function () {
				return this.game.ironWill && !this.game.resPool.get("kittens").owned() && this.game.bld.get("magneto").owned();
			}
		}, {
			name: "meowMeowRevolution",
			title: "Meow Meow Revolution",
			description: "Construct a factory in Iron Will mode",
			condition: function () {
				return this.game.ironWill && !this.game.resPool.get("kittens").owned() && this.game.bld.get("factory").owned();
			}
		}, {
			name: "spaceOddity",
			title: "Space Oddity",
			description: "Complete a Moon Program in Iron Will mode",
			condition: function () {
				return this.game.ironWill && this.game.space.getProgram("moonMission").owned();
			},
			hasStar: true,
			starDescription: "Get Moon Program in IW without any paragon points",
			starCondition: function () {
				return this.game.ironWill && this.game.space.getProgram("moonMission").owned() && this.game.resPool.get("paragon").value < 10;
			}
		}, {
			name: "jupiterAscending",
			title: "Jupiter Ascending",
			description: "Get to the space on a first year",
			condition: function () {
				return this.game.space.getProgram("orbitalLaunch").owned() && this.game.calendar.year <= 1;
			}
		}, {
			name: "shadowOfTheColossus",
			title: "Shadow Of The Colossus",
			description: "Build a Ziggurat having only one kitten",
			condition: function () {
				return this.game.bld.get("ziggurat").owned() && this.game.village.maxKittens === 1;
			}
		}, {
			name: "sunGod",
			title: "Sun God",
			description: "Gain a total of 696,342 accumulated faith",
			condition: function () {
				return this.game.religion.faith >= 696342;
			}
		}, {
			name: "heartOfDarkness",
			title: "Heart Of Darkness",
			description: "Become the chieftain of a zebra tribe. (How is this even possible?)",
			condition: function () {
				return this.game.resPool.get("zebras").value > 1;
			}
		}, {
			name: "winterIsComing",
			title: "Winter Is Coming",
			description: "Have 10 kittens dead",
			unethical: true,
			condition: function () {
				return this.game.deadKittens >= 10;
			}
		}, {
			name: "youMonster",
			title: "You Monster",
			unethical: true,
			description: "Poor kittens.",
			condition: function () {
				return this.game.deadKittens >= 100;
			}
		}, {
			name: "superUnethicalClimax",
			title: "Super Unethical Climax",
			description: "Cheat your way through the game.",
			unethical: true,
			condition: function () {
				return this.game.cheatMode;
			}
		}, {
			name: "lotusMachine",
			title: "Lotus Eater Machine",
			description: "Break the cycle of reincarnations",
			condition: function () {
				return this.game.resPool.get("karma").owned();
			}
		}, {
			name: "serenity",
			title: "Serenity",
			description: "Have 50 kittens without losing any of them",
			condition: function () {
				return this.game.resPool.get("kittens").value >= 50 && this.game.deadKittens === 0;
			}
		}, {
			name: "utopiaProject",
			title: "Utopia Project",
			description: "Get a total happiness of over 150%",
			condition: function () {
				return this.game.village.happiness >= 1.5 && this.game.resPool.get("kittens").value > 35;
			},
			hasStar: true,
			starDescription: "Get a total happiness of over 500%",
			starCondition: function () {
				return this.game.village.happiness >= 5 && this.game.resPool.get("kittens").value > 35;
			}
		}, {
			name: "cathammer",
			title: "Cathammer 40K",
			description: "In the grim and dark future of a catkind",
			condition: function () {
				return this.game.stats.getStat("totalYears").val >= 40000;
			},
			hasStar: true,
			starDescription: "In the grim and dark future of a catkind there are no resets",
			starCondition: function () {
				return this.game.calendar.year >= 40000 + this.game.time.flux;
			}
		}, {
			name: "limitlessClicker",
			title: "Limitless Clicker",
			description: "Accumulate 100,000 clicks.",
			condition: function () {
				return this.game.stats.getStat("totalClicks").val >= 100000;
			},
			hasStar: true,
			starDescription: "Accumulate 1,000,000 clicks.",
			starCondition: function () {
				return this.game.stats.getStat("totalClicks").val >= 1000000;
			}
	}],

	tabName: "Achievements",

	achievements: null,
	achievementsByName: null,

	constructor: function () {
		this.registerMetaItems(this.achievementsData, classes.KGSaveEdit.GenericItem, "achievements", function (ach) {
			ach.unlocked = Boolean(ach.unlocked);
			ach.newAch = false;

			ach.starUnlocked = Boolean(ach.starUnlocked);
		});
	},

	get: function (name) {
		return this.achievementsByName[name];
	},

	renderTabBlock: function () {
		this.achievementsBlock = dojo.create("table", {
			id: "achievementsBlock"
		}, this.tabBlockNode);
	},

	render: function () {
		var enterU = function () {
			if (this.newAch) {
				this.newAch = false;
				dojo.removeClass(this.unlockedLabel, "newMarker");
				this.metaObj.updateTabMark();
			}
		};
		var enterS = function () {
			if (this.newStarAch) {
				this.newStarAch = false;
				dojo.removeClass(this.starUnlockedLabel, "newMarker");
				this.metaObj.updateTabMark();
			}
		};

		for (var i = 0, len = this.achievements.length; i < len; i++) {
			var ach = this.achievements[i];

			ach.domNode = dojo.create("tr", {
				class: "achievement",
				innerHTML: '<td title="' + ach.description + '">' +
					(ach.title || ach.name) + "</td><td></td><td></td>"
			}, this.achievementsBlock);
			ach.nameNode = ach.domNode.children[0];

			var input = this.game._createCheckbox("Earned", ach.domNode.children[1], ach, "unlocked");
			ach.unlockedLabel = input.label;
			on(input.label, mouse.enter, dojo.hitch(ach, enterU));

			if (ach.hasStar) {
				input = this.game._createCheckbox((ach.starUnlocked ? "&#9733;" : "&#9734;"),
					ach.domNode.children[2], ach, "starUnlocked");
				ach.starUnlockedLabel = input.label;
				ach.starText = input.text;
				if (ach.starDescription) {
					input.label.title = ach.starDescription;
				}
				on(input.label, mouse.enter, dojo.hitch(ach, enterS));
			}
		}
	},

	hasUnlocked: function () {
		for (var i = this.achievements.length - 1; i >= 0; i--) {
			if (this.achievements[i].unlocked) {
				return true;
			}
		}
		return false;
	},

	getVisible: function () {
		return this.hasUnlocked();
	},

	update: function () {
		var newAch = false;

		for (var i = this.achievements.length - 1; i >= 0; i--) {
			var ach = this.achievements[i];
			var u = ach.unlocked;
			var unlocked = ach.condition();

			if (ach.hasStar) {
				var s = ach.starUnlocked;

				var starUnlocked = ach.starCondition();
				if (starUnlocked) {
					this.game.setCheckbox(ach.starUnlockedNode, starUnlocked, true, true);
				} else if (ach.starUnlocked !== ach.starUnlockedNode.prevChecked) {
					this.game.setCheckbox(ach.starUnlockedNode, ach.starUnlockedNode.prevChecked, true, true);
				}
				this.game.toggleDisabled(ach.starUnlockedNode, starUnlocked);

				if (s !== ach.starUnlocked) {
					ach.newStarAch = ach.starUnlocked;
				}
				dojo.toggleClass(ach.starUnlockedLabel, "newMarker", ach.newStarAch);

				ach.starText.innerHTML = ach.starUnlocked ? "&#9733;" : "&#9734;";
			}

			if (unlocked) {
				this.game.setCheckbox(ach.unlockedNode, unlocked, true, true);
			} else if (ach.unlocked !== ach.unlockedNode.prevChecked) {
				this.game.setCheckbox(ach.unlockedNode, ach.unlockedNode.prevChecked, true, true);
			}
			this.game.toggleDisabled(ach.unlockedNode, unlocked);

			if (u !== ach.unlocked) {
				ach.newAch = ach.unlocked;
			}
			dojo.toggleClass(ach.unlockedLabel, "newMarker", ach.newAch);

			dojo.toggleClass(ach.domNode, "hidden", ach.hidden && !ach.unlocked);
			newAch = newAch || ach.newStarAch || ach.newAch;
		}

		dojo.toggleClass(this.tabWrapper, "newMarker", newAch);
	},

	updateTabMark: function () {
		var newAch = false;
		for (var i = this.achievements.length - 1; i >= 0; i--) {
			var ach = this.achievements[i];
			if (ach.newStarAch || ach.newAch) {
				newAch = true;
				break;
			}
		}
		dojo.toggleClass(this.tabWrapper, "newMarker", newAch);
	},

	save: function (saveData) {
		saveData.achievements = this.game.filterMetadata(this.achievements, ["name", "unlocked", "starUnlocked"]);
	},

	load: function (saveData) {
		//ugh
		this.game.bld.loadMetaData.call(this, saveData.achievements, "get", function (ach, saveAch) {
			ach.set("unlocked", saveAch.unlocked);
			ach.newAch = false;
			if (ach.hasStar) {
				ach.set("starUnlocked", saveAch.starUnlocked);
			}
		});
	}
});


dojo.declare("classes.KGSaveEdit.StatsManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	statsData: [{
			name: "totalKittens",
			title: "Total kittens",
			val: 0,
			compareVal: function (game) {
				return game.resPool.get("kittens").value;
			},
			unlocked: true
		}, {
			name: "kittensDead",
			title: "Kittens dead",
			val: 0,
			compareVal: function (game) {
				return game.deadKittens;
			},
			unlocked: true
		}, {
			name: "totalYears",
			title: "Total years played",
			val: 0,
			compareVal: function (game) {
				return game.calendar.year;
			},
			unlocked: true
		}, {
			name: "totalResets",
			title: "Resets made",
			val: 0
		}, {
			name: "totalParagon",
			title: "Total paragon",
			val: 0,
			compareVal: function (game) {
				var paragon = game.resPool.get("paragon").value;
				if (game.editorOptions.includeSpentParagon) {
					var burnedParagon = game.resPool.get("burnedParagon").value;
					paragon += burnedParagon + game.prestige.getSpentParagon();
				}
				return paragon;
			}
		}, {
			name: "eventsObserved",
			title: "Rare events observed",
			val: 0
		}, {
			name: "unicornsSacrificed",
			title: "Unicorns sacrificed",
			val: 0,
			inputClass: "integerInput abbrInput"
		}, {
			name: "buildingsConstructed",
			title: "Buildings Constructed",
			val: 0
		}, {
			name: "totalClicks",
			title: "Total Clicks",
			val: 0
		}, {
			name: "totalTrades",
			title: "Trades Completed",
			val: 0
		}, {
			name: "totalCrafts",
			title: "Crafting Times",
			val: 0
		}, {
			name: "averageKittens",
			title: "Avg. Kittens Born (Per Century)",
			val: 0,
			calculate: function (game) {
				var years = game.stats.getStat("totalYears").val;
				var kittens = game.stats.getStat("totalKittens").val;
				return years != 0 ? kittens / Math.ceil(years / 100) : 0;
			}
	}],

	statsCurrentData: [{
			name: "totalTrades",
			title: "Trades Completed",
			val: 0
		}, {
			name: "totalCrafts",
			title: "Crafting Times",
			val: 0
		}, {
			name: "averageKittens",
			title: "Avg. Kittens Born (Per Century)",
			val: 0,
			calculate: function (game) {
				var years = game.calendar.year;
				var kittens = game.resPool.get("kittens").value;
				return years != 0 ? kittens / Math.ceil(years / 100) : 0;
			}
		}, {
			name: "timePlayed",
			title: "Time Played (Hours)",
			val: 0,
			calculate: function (game) {
				var cDay = ((game.calendar.year * 400) + ((game.calendar.season - 1) * 100) + game.calendar.day);
				return Math.round(cDay / 1800 * 10) / 10;
			}
	}],

	tabName: "Stats",
	getVisible: function () {
		return this.game.karmaKittens > 0 || this.game.science.get("math").owned();
	},

	stats: null,
	statsByName: null,
	allStats: null,

	statsCurrent: null,
	statsCurrentByName: null,

	constructor: function () {
		this.allStats = [];

		var statHandler = function (stat) {
			this.allStats.push(stat);
		};

		this.registerMetaItems(this.statsData, classes.KGSaveEdit.StatsMeta, "stats", statHandler);
		this.registerMetaItems(this.statsCurrentData, classes.KGSaveEdit.StatsMeta, "statsCurrent", statHandler);
	},

	renderTabBlock: function () {
		dojo.create("div", {innerHTML: "ALL-TIME STATS"}, this.tabBlockNode);
		this.statsBlock = dojo.create("table", {
			id: "statsBlock",
			class: "bottom-margin"
		}, this.tabBlockNode);

		dojo.create("div", {innerHTML: "CURRENT GAME STATS"}, this.tabBlockNode);
		this.statsCurrentBlock = dojo.create("table", {id: "statsCurrentBlock"}, this.tabBlockNode);
	},

	render: function () {
		this.game.callMethods(this.stats, "render", this.statsBlock);
		this.game.callMethods(this.statsCurrent, "render", this.statsCurrentBlock);
	},

	getStat: function (name) {
		return this.statsByName[name];
	},

	getStatCurrent: function (name) {
		return this.statsCurrentByName[name];
	},

	update: function () {
		this.game.callMethods(this.allStats, "update");
	},

	save: function (saveData) {
		saveData.stats = this.game.filterMetadata(this.stats, ["name", "val"]);
		saveData.statsCurrent = this.game.filterMetadata(this.statsCurrent, ["name", "val"]);
	},

	load: function (saveData) {
		this.loadMetaData(saveData.stats, "getStat", function (stat, saveStat) {
			stat.set("val", num(saveStat.val));
		});
		this.loadMetaData(saveData.statsCurrent, "getStatCurrent", function (stat, saveStat) {
			stat.set("val", num(saveStat.val));
		});
	}
});


dojo.declare("classes.KGSaveEdit.StatsMeta", classes.KGSaveEdit.GenericItem, {
	render: function (parent) {
		this.domNode = dojo.create("tr", {
			class: "statastic",
			innerHTML: "<td>" + this.title + "</td><td></td>"
		}, parent);

		if (this.calculate) {
			this.valText = dojo.create("span", {
				innerHTML: this.val
			}, this.domNode.children[1]);
		} else {
			this.game._createInput({
				class: this.inputClass || "integerInput"
			}, this.domNode.children[1], this, "val");
		}
	},

	update: function () {
		var val = this.val;

		if (this.calculate) {
			// val = this.calculate(this.game) || 0;
		}

		if (this.compareVal && this.game.editorOptions.fixStats) {
			val = Math.max(val, this.compareVal(this.game)) || 0;
		}

		if (val !== this.val) {
			this.set("val", val, true, true);
		}

		if (this.calculate) {
			this.valText.innerHTML = this.val;
		}
	}
});

});
