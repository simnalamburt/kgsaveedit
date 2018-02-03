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
			name: "systemShock",
			title: "System Shock",
			description: "I'm sorry Dave, I'm afraid I can't do that.",
			unethical: true,
			condition: function () {
				return this.game.systemShockMode;
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
	}],

	hatsData: [{
			id: 1,
			name: "simpleHat",
			title: "Simple Hat",
			description: "The hat to rule them all",
			difficulty: "F"
		}, {
			id: 2,
			name: "lotusHat",
			title: "Lotus Hat",
			description: "Hat in the shape of louts",
			difficulty: "A",
			condition: function () {
				return this.game.stats.getStat("totalResets").val >= 50;
			}
		}, {
			id: 3,
			name: "ivoryTowerHat",
			title: "Ivory Tower Hat",
			description: "A tall hat in a form of a tower",
			difficulty: "S+"
		}, {
			id: 4,
			name: "uselessHat",
			title: "Useless Hat",
			description: "This hat is totally useless",
			difficulty: "F",
			condition: function () {
				var leader = this.game.village.leader;
				return leader != null && leader.trait.name == "none";
			}
		}, {
			id: 5,
			name: "voidHat",
			title: "Void Hat",
			description: "Hat is made of void",
			difficulty: ""
		}, {
			id: 6,
			name: "nullHat",
			title: "Null Hat",
			description: "The hat is a lie",
			difficulty: ""
		}, {
			id: 7,
			name: "betaHat",
			title: "Beta Hat",
			description: "The hat is a bit glitchy and rough around the edges",
			difficulty: "B",
			// condition: function () {
			// 	return (this.game.server.donateAmt == 0);
			// }
		}, {
			id: 8,
			name: "silentHat",
			title: "Silent Hat",
			description: "This hat is totally silent",
			difficulty: "S",
			// condition: function () {
			// 	return (this.game.server.motdContent == "");
			// }
		}, {
			id: 9,
			name: "treetrunkHat",
			title: "Treetrunk Hat",
			description: "A hat made of branches and leaves",
			difficulty: "F",
			condition: function () {
				return this.game.workshop.getCraft("wood").value > 0;
			}
		}, {
			id: 10,
			name: "wizardHat",
			title: "Wizard Hat",
			description: "Abracadabra!",
			difficulty: ""
		}, {
			id: 11,
			name: "nekomimiHat",
			title: "Nekomimi Hat",
			description: "*^_^*",
			difficulty: ""
		}, {
			id: 12,
			name: "eldritchHat",
			title: "Eldritch Hat",
			description: "",
			difficulty: ""
		}, {
			id: 13,
			name: "tesseractHat",
			title: "Tesseract Hat",
			description: "",
			difficulty: ""
		}, {
			id: 14,
			name: "crimsonHat",
			title: "Crimson Hat",
			description: "",
			difficulty: ""
		}, {
			id: 15,
			name: "skeletonHat",
			title: "Skeleton Hat",
			description: "",
			difficulty: ""
		}, {
			id: 16,
			name: "gladosHat",
			title: "Glados Hat",
			description: "",
			difficulty: ""
		}, {
			id: 17,
			name: "marioHat",
			title: "Mario Hat",
			description: "",
			difficulty: ""
		}, {
			id: 18,
			name: "fedoraHat",
			title: "Fedora",
			description: "Classy fedora",
			difficulty: ""
		}, {
			id: 19,
			name: "necrocornHat",
			title: "Necrocorn Hat",
			description: "",
			difficulty: "S",
			condition: function () {
				var kittens = this.game.resPool.get("kittens");
				return (kittens.value >= 1000 && kittens.maxValue == 0);
			}
		}, {
			id: 20,
			name: "alicornHat",
			title: "Alicorn Hat",
			description: "",
			difficulty: "S",
			condition: function () {
				return (this.game.resPool.get("kittens").value > 500 && this.game.resPool.get("alicorn").value == 0);
			}
		}, {
			id: 21,
			name: "unicornHat",
			title: "Unicorn Hat",
			description: "",
			difficulty: "A"
		}, {
			id: 22,
			name: "dragonHat",
			title: "Dragon Hat",
			description: "",
			difficulty: ""
		}, {
			id: 23,
			name: "glitchyHat",
			title: "Glitchy Hat",
			description: "♋︎⬧︎⧫︎♏︎❒︎🕯︎⬧︎ ●︎♋︎■︎♑︎◆︎♋︎♑︎♏︎ 🖳︎✆",
			difficulty: "S"
		}, {
			id: 24,
			name: "topHat",
			title: "Tophat",
			description: "",
			difficulty: ""
		}, {
			id: 25,
			name: "jesterHat",
			title: "Jester Hat",
			description: "",
			difficulty: ""
		}, {
			id: 26,
			name: "fezHat",
			title: "Fez Hat",
			description: "A prism-shaped red fez hat.",
			difficulty: "A"
	}],

	tabName: "Achievements",

	achievements: null,
	achievementsByName: null,

	councilUnlocked: false,

	constructor: function () {
		this.registerMetaItems(this.achievementsData, classes.KGSaveEdit.AchievementMeta, "achievements", function (ach) {
			ach.starUnlocked = Boolean(ach.starUnlocked);
		});

		this.registerMetaItems(this.hatsData, classes.KGSaveEdit.AchievementMeta, "hats");
	},

	get: function (name) {
		return this.achievementsByName[name];
	},

	getHat: function (name) {
		return this.hatsByName[name];
	},

	renderTabBlock: function () {
		this.achievementsBlock = dojo.create("table", {
			id: "achievementsBlock",
			class: "bottom-margin"
		}, this.tabBlockNode);

		this.hatsBlock = dojo.create("table", {
			id: "hatsBlock",
			innerHTML: '<tr><th colspan="2">A Secret Council of Hats</th></tr>'
		}, this.tabBlockNode);
		this.hatsBlockHeader = this.hatsBlock.children[0];
	},

	render: function () {
		this.game.callMethods(this.achievements, "render", this.achievementsBlock, "achievement");
		this.game.callMethods(this.hats, "render", this.hatsBlock, "hat");
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
		var hasNewMarker = false;

		for (var i = this.achievements.length - 1; i >= 0; i--) {
			var ach = this.achievements[i];
			ach.update();
			hasNewMarker = hasNewMarker || ach.isNewStar || ach.isNew;
		}

		var councilUnlocked = this.councilUnlocked;
		for (i = this.hats.length - 1; i >= 0; i--) {
			var hat = this.hats[i];
			hat.update();
			councilUnlocked = councilUnlocked || hat.unlocked;
			hasNewMarker = hasNewMarker || hat.isNew;
		}
		this.councilUnlocked = councilUnlocked;

		dojo.toggleClass(this.hatsBlockHeader, "spoiler", !this.councilUnlocked || !this.game.science.get("metaphysics").owned());

		dojo.toggleClass(this.tabWrapper, "newMarker", hasNewMarker);
	},

	updateTabMarker: function () {
		var hasNewMarker = false;
		for (var i = this.achievements.length - 1; i >= 0; i--) {
			var ach = this.achievements[i];
			if (ach.isNewStar || ach.isNew) {
				hasNewMarker = true;
				break;
			}
		}

		if (!hasNewMarker) {
			for (i = this.hats.length - 1; i >= 0; i--) {
				if (this.hats[i].isNew) {
					hasNewMarker = true;
					break;
				}
			}
		}
		dojo.toggleClass(this.tabWrapper, "newMarker", hasNewMarker);
	},

	save: function (saveData) {
		saveData.achievements = this.game.filterMetadata(this.achievements, ["name", "unlocked", "starUnlocked"]);
		saveData.ach = {
			councilUnlocked: this.councilUnlocked,
			hats: this.game.filterMetadata(this.hats, ["name", "unlocked"])
		};
	},

	load: function (saveData) {
		this.loadMetadata(saveData, "achievements", "get", function (ach, saveAch) {
			ach.set("unlocked", saveAch.unlocked);
			ach.isNew = false;
			if (ach.hasStar) {
				ach.isNewStar = false;
				ach.set("starUnlocked", saveAch.starUnlocked);
			}
		}, true);

		if (saveData.ach) {
			this.councilUnlocked = saveData.ach.councilUnlocked || false;
			this.loadMetadata(saveData, "ach.hats", "getHat", function (hat, saveHat) {
				hat.isNew = false;
				hat.set("unlocked", saveHat.unlocked);
			});
		}
	}
});


dojo.declare("classes.KGSaveEdit.AchievementMeta", [classes.KGSaveEdit.GenericItem], {
	constructor: function () {
		this.unlocked = Boolean(this.unlocked);
		this.isNew = false;
	},

	render: function (parent) {
		this.domNode = dojo.create("tr", {
			class: "achievement",
			innerHTML: '<td title="' + this.description + '">' +
				(this.title || this.name) + "</td><td></td><td></td>"
		}, parent);
		this.nameNode = this.domNode.children[0];

		var input = this.game._createCheckbox("Earned", this.domNode.children[1], this, "unlocked");
		this.unlockedLabel = input.label;
		on(input.label, mouse.enter, dojo.hitch(this, function () {
			if (this.isNew) {
				this.isNew = false;
				dojo.removeClass(this.unlockedLabel, "newMarker");
				this.metaObj.updateTabMarker();
			}
		}));

		if (this.hasStar) {
			input = this.game._createCheckbox((this.starUnlocked ? "&#9733;" : "&#9734;"),
				this.domNode.children[2], this, "starUnlocked");
			this.starUnlockedLabel = input.label;
			this.starText = input.text;
			if (this.starDescription) {
				input.label.title = this.starDescription;
			}
			on(input.label, mouse.enter, dojo.hitch(this, function () {
				if (this.isNewStar) {
					this.isNewStar = false;
					dojo.removeClass(this.starUnlockedLabel, "newMarker");
					this.metaObj.updateTabMarker();
				}
			}));
		}
	},

	update: function () {
		var wasUnlocked = this.unlocked;
		if (this.condition) {
			var unlocked = this.condition();

			if (unlocked) {
				this.game.setCheckbox(this.unlockedNode, unlocked, true, true);
			} else if (this.unlocked !== this.unlockedNode.prevChecked) {
				this.game.setCheckbox(this.unlockedNode, this.unlockedNode.prevChecked, true, true);
			}
			this.game.toggleDisabled(this.unlockedNode, unlocked);

			if (wasUnlocked !== this.unlocked) {
				this.isNew = this.unlocked;
			}
			dojo.toggleClass(this.unlockedLabel, "newMarker", this.isNew);

			dojo.toggleClass(this.domNode, "hidden", this.hidden && !this.unlocked);
		}

		if (this.hasStar) {
			var starWasUnlocked = this.starUnlocked;

			var starUnlocked = this.starCondition();
			if (starUnlocked) {
				this.game.setCheckbox(this.starUnlockedNode, starUnlocked, true, true);
			} else if (this.starUnlocked !== this.starUnlockedNode.prevChecked) {
				this.game.setCheckbox(this.starUnlockedNode, this.starUnlockedNode.prevChecked, true, true);
			}
			this.game.toggleDisabled(this.starUnlockedNode, starUnlocked);

			if (starWasUnlocked !== this.starUnlocked) {
				this.isNewStar = this.starUnlocked;
			}
			dojo.toggleClass(this.starUnlockedLabel, "newMarker", this.isNewStar);

			this.starText.innerHTML = this.starUnlocked ? "&#9733;" : "&#9734;";
		}
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
		this.loadMetadata(saveData, "stats", "getStat", function (stat, saveStat) {
			stat.set("val", num(saveStat.val));
		}, true);
		this.loadMetadata(saveData, "statsCurrent", "getStatCurrent", function (stat, saveStat) {
			stat.set("val", num(saveStat.val));
		}, true);
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
