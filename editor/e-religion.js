/* global require dojo classes num*/

require([], function () {
"use strict";

dojo.declare("classes.KGSaveEdit.ReligionManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	zigguratUpgradesData: [{
			name: "unicornTomb",
			label: "Unicorn Tomb",
			description: "Improves your unicorns generation by 5%",
			prices: [
				{name: "ivory", val: 500},
				{name: "tears", val: 5}
			],
			priceRatio: 1.15,
			// unlocks: {"zigguratUpgrades": ["ivoryTower"]},
			unlocked: true,
			effects: {
				"unicornsRatioReligion": 0.05
			}
		}, {
			name: "ivoryTower",
			label: "Ivory Tower",
			description: "Improves your unicorns generation by 10%, unlocks Unicorn Rifts",
			prices: [
				{name: "ivory", val: 25000},
				{name: "tears", val: 25}
			],
			priceRatio: 1.15,
			// unlocks: {"zigguratUpgrades": ["ivoryCitadel"]},
			requires: {zigguratUpgrades: ["unicornTomb"]},
			effects: {
				"unicornsRatioReligion": 0.1,
				"riftChance":            5
			}
		}, {
			name: "ivoryCitadel",
			label: "Ivory Citadel",
			description: "Improves your unicorns generation by 25%, summons Ivory Meteors",
			prices: [
				{name: "ivory", val: 50000},
				{name: "tears", val: 50}
			],
			priceRatio: 1.15,
			// unlocks: {"zigguratUpgrades": ["skyPalace"]},
			requires: {zigguratUpgrades: ["ivoryTower"]},
			effects: {
				"unicornsRatioReligion": 0.25,
				"ivoryMeteorChance":     5
			}
		}, {
			name: "skyPalace",
			label: "Sky Palace",
			description: "Improves your unicorns generation by 50%.\nThere was a legend of ancient and mysterious beings inhabitings this place long ago.",
			prices: [
				{name: "ivory", val: 250000},
				{name: "tears", val: 500}
			],
			priceRatio: 1.15,
			// unlocks: {"zigguratUpgrades": ["unicornUtopia"]},
			requires: {zigguratUpgrades: ["ivoryCitadel"]},
			effects: {
				"unicornsRatioReligion": 0.5,
				"ivoryMeteorRatio":      0.05,
				"alicornChance":         5,
				"alicornPerTick":        0
			},
			calculateEffects: function (self, game) {
				var alicorns = 0;
				if (game.resPool.get("alicorn").value > 0) {
					alicorns = 0.00001;
				}
				self.effects["alicornPerTick"] = alicorns;
			}
		}, {
			name: "unicornUtopia",
			label: "Unicorn Utopia",
			description: "Improves your unicorns generation by 250%. Increase alicorn summon chance. Improves TC refine ratio by 5%",
			prices: [
				{name: "ivory", val: 1000000},
				{name: "tears", val: 5000}
			],
			priceRatio: 1.15,
			// unlocks: {"zigguratUpgrades": ["sunspire"]},
			requires: {zigguratUpgrades: ["skyPalace"]},
			effects: {
				"unicornsRatioReligion": 2.5,
				"ivoryMeteorRatio":      0.15,
				"alicornChance":         15,
				"alicornPerTick":        0,
				"tcRefineRatio":         0.05
			},
			calculateEffects: function (self, game) {
				var alicorns = 0;
				if (game.resPool.get("alicorn").value > 0) {
					alicorns = 0.000025;
				}
				self.effects["alicornPerTick"] = alicorns;
			}
		}, {
			name: "sunspire",
			label: "Sunspire",
			description: "Improves your unicorns generation by 500%. Increase alicorn summon chance by significant amount. Improves TC refine ratio by 10%",
			prices: [
				{name: "ivory", val: 1500000},
				{name: "tears", val: 25000}
			],
			priceRatio: 1.15,
			requires: {zigguratUpgrades: ["unicornUtopia"]},
			effects: {
				"unicornsRatioReligion": 5,
				"ivoryMeteorRatio":      0.5,
				"alicornChance":         30,
				"alicornPerTick":        0,
				"tcRefineRatio":         0.1
			},
			calculateEffects: function (self, game) {
				var alicorns = 0;
				if (game.resPool.get("alicorn").value > 0) {
					alicorns = 0.00005;
				}
				self.effects["alicornPerTick"] = alicorns;
			}
		}, {
			name: "marker",
			label: "Marker",
			description: "A strange structure made of unknown metal and serving unidentified purpose.",
			prices: [
				{name: "spice",       val: 50000},
				{name: "tears",       val: 5000},
				{name: "unobtainium", val: 2500},
				{name: "megalith",    val: 750}
			],
			priceRatio: 1.15,
			requires: {perks: ["megalomania"]},
			effects: {
				"corruptionRatio": 0.000001
			}
		}, {
			name: "unicornGraveyard",
			label: "Unicorn Graveyard",
			description: "Grave of the fireflies.",
			prices: [
				{name: "necrocorn", val: 5},
				{name: "megalith",  val: 1000}
			],
			priceRatio: 1.15,
			requires: {perks: ["blackCodex"]},
			effects: {
				"cultureMaxRatioBonus": 0.01
			},
			upgrades: {buildings: ["ziggurat"]}
		}, {
			name: "unicornNecropolis",
			label: "Unicorn Necropolis",
			description: "The ocean of blood at the end of the lane",
			prices: [
				{name: "void",      val: 5},
				{name: "necrocorn", val: 25},
				{name: "megalith",  val: 2500}
			],
			priceRatio: 1.15,
			requires: {zigguratUpgrades: ["unicornGraveyard"]},
			effects: {
				"corruptionBoostRatio": 0.10
			}
		}, {
			name: "blackPyramid",
			label: "Black Pyramid",
			description: "A dark relic of unspeakable horrors.",
			prices: [
				{name: "spice",       val: 150000},
				{name: "sorrow",      val: 5},
				{name: "unobtainium", val: 5000},
				{name: "megalith",    val: 2500}
			],
			priceRatio: 1.15,
			requires: {perks: ["megalomania"]},
			effects: {}
	}],

	religionUpgradesData: [{
			name: "solarchant",
			label: "Solar Chant",
			description: "Improves your faith generation rate by 10%",
			prices: [
				{name: "faith", val: 100}
			],
			priceRatio: 2.5,
			upgradable: true,
			faith: 150,
			effects: {
				"faithRatio": 0.1
			}
		}, {
			name: "scholasticism",
			label: "Scholasticism",
			description: "Temples will give a bonus to science",
			prices: [
				{name: "faith", val: 250}
			],
			priceRatio: 2.5,
			upgradable: true,
			faith: 300,
			upgrades: {buildings: ["temple"]}
		}, {
			name: "goldenSpire",
			label: "Golden Spire",
			description: "Temples can store 50% more max faith",
			prices: [
				{name: "faith", val: 350},
				{name: "gold",  val: 150}
			],
			priceRatio: 2.5,
			upgradable: true,
			faith: 500,
			upgrades: {buildings: ["temple"]}
		}, {
			name: "sunAltar",
			label: "Sun Altar",
			description: "Every temple will improve happiness by 0.5%",
			prices: [
				{name: "faith", val: 500},
				{name: "gold",  val: 250}
			],
			priceRatio: 2.5,
			upgradable: true,
			faith: 750,
			upgrades: {buildings: ["temple"]}
		}, {
			name: "stainedGlass",
			label: "Stained Glass",
			description: "Every temple will generate twice as much culture",
			prices: [
				{name: "faith", val: 500},
				{name: "gold",  val: 250}
			],
			priceRatio: 2.5,
			upgradable: true,
			faith: 750,
			upgrades: {buildings: ["temple"]}
		}, {
			name: "solarRevolution",
			label: "Solar Revolution",
			description: "Accumulated faith will give a small boost to resource production.",
			prices: [
				{name: "faith", val: 750},
				{name: "gold",  val: 500}
			],
			faith: 1000
		}, {
			name: "basilica",
			label: "Basilica",
			description: "Temples are generating more culture and expanding cultural limits",
			prices: [
				{name: "faith", val: 1250},
				{name: "gold",  val: 750}
			],
			priceRatio: 2.5,
			upgradable: true,
			faith: 10000,
			upgrades: {buildings: ["temple"]}
		}, {
			name: "templars",
			label: "Templars",
			description: "Temples have a small impact on the catpower limit",
			prices: [
				{name: "faith", val: 3500},
				{name: "gold",  val: 3000}
			],
			priceRatio: 2.5,
			upgradable: true,
			faith: 75000,
			upgrades: {buildings: ["temple"]}
		}, {
			name: "apocripha",
			label: "Apocrypha",
			description: "Grants the ability to discard accumulated faith to improve effectiveness of praying",
			prices: [
				{name: "faith", val: 5000},
				{name: "gold",  val: 5000}
			],
			faith: 100000
		}, {
			name: "transcendence",
			label: "Transcendence",
			description: "Unlocks additional religion upgrades",
			prices: [
				{name: "faith", val: 7500},
				{name: "gold",  val: 7500}
			],
			// unlocks: {challenges: ["atheism"]},
			faith: 125000
	}],

	transcendenceUpgradesData: [{
			name: "blackObelisk",
			label: "Black Obelisk",
			description: "Improves your faith bonus.<br>Every Obelisk will improve your transcendance level bonus by 5%",
			prices: [
				{name: "relic", val: 100}
			],
			tier: 1,
			priceRatio: 1.15,
			effects: {},
			flavor: "TBD" // flavor is TBD but the faith bonus improvement is already done
		}, {
			name: "blackNexus",
			label: "Black Nexus",
			description: "Improves the rate you refine time crystals into relics.<br>Every Black Pyramid will improve your Relic Refine ratio by 100%. Every level of Black Nexus will increase this bonus by additional 100%<br>This effect also boosts the effectiveness of Relic Stations",
			prices: [
				{name: "relic", val: 5000}
			],
			tier: 3,
			priceRatio: 1.15,
			effects: {
				"relicRefineRatio": 1.0
			},
			flavor: "Eye in the sky."
		}, {
			name: "blackCore",
			label: "Black Core",
			description: "Alter and corrupt the laws of the reality on a minor scale. Every level of Black Core increases BLS limit by 1%.",
			prices: [
				{name: "relic", val: 10000}
			],
			tier: 5,
			priceRatio: 1.15,
			effects: {
				"blsLimit": 1
			},
			flavor: "Built with the bones of kitten sacrifices."
		}, {
			name: "singularity",
			label: "Event Horizon",
			description: "Improve global resource limits by 10%",
			prices: [
				{name: "relic", val: 25000}
			],
			tier: 7,
			priceRatio: 1.15,
			effects: {
				"globalResourceRatio": 0.10
			},
			flavor: "A gateway... To what?"
		}, {
			name: "blazar",
			label: "Blazar",
			description: "Improve time-related structures",
			prices: [
				{name: "relic", val: 50000}
			],
			tier: 15,
			priceRatio: 1.15,
			effects: {
				//Should at least improve impedance scaling by some value (5%? 10%). Probably something else
				"timeRatio": 0.10,
				"rrRatio": 0.02
			},
			unlocked: false,
			flavor: "Tiger tiger burning bright."
		}, {
			name: "darkNova",
			label: "Dark Nova",
			description: "Improves global energy production",
			prices: [
				{name: "relic", val: 75000},
				{name: "void",  val: 7500}
			],
			tier: 20,
			priceRatio: 1.15,
			effects: {
				"energyProductionRatio": 0.02
			},
			unlocked: false,
			flavor: "The stars are dead. Just like our hopes and dreams."
		}, {
			name: "holyGenocide",
			label: "Holy Genocide",
			description: "And tear will not fall down",
			prices: [
				{name: "relic", val: 100000},
				{name: "void",  val: 25}
			],
			tier: 25,
			priceRatio: 1.15,
			effects: {},
			flavor: "We live on a placid island of ignorance in the midst of black seas of infinity, and it was not meant that we should voyage far."
		}
	],

	zigguratUpgrades: null,
	zigguratUpgradesByName: null,
	religionUpgrades: null,
	religionUpgradesByName: null,
	transcendenceUpgrades: null,
	transcendenceUpgradesByName: null,

	faith: 0,
	faithRatio: 0,
	corruption: 0,
	tcratio: 0,

	hasTranscendeceUpgrade: false, //cache for getRU("transcendence").owned()

	tabName: "Religion",
	getVisible: function () {
		return this.game.resPool.get("faith").unlocked || (this.game.challenges.currentChallenge === "atheism" && this.game.bld.get("ziggurat").owned());
	},

	constructor: function () {
		this.registerMetaItems(this.zigguratUpgradesData, classes.KGSaveEdit.ZigguratMeta, "zigguratUpgrades");
		this.registerMetaItems(this.religionUpgradesData, classes.KGSaveEdit.ReligionMeta, "religionUpgrades");
		this.registerMetaItems(this.transcendenceUpgradesData, classes.KGSaveEdit.TranscendenceMeta, "transcendenceUpgrades");

		this.meta.push(this.zigguratUpgrades, this.religionUpgrades, this.transcendenceUpgrades);
	},

	getZU: function (name) {
		return this.zigguratUpgradesByName[name];
	},

	getRU: function (name) {
		return this.religionUpgradesByName[name];
	},

	getTU: function (name) {
		return this.transcendenceUpgradesByName[name];
	},

	getFaithBonus: function () {
		return this.getTriValueReligion(this.faithRatio);
	},

	getTriValueReligion: function (ratio) {
		return this.game.getTriValue(ratio, 0.1) * 0.1;
	},

	getTranscendenceLevel: function () {
		var bonus = this.getTriValueReligion(this.tcratio) * 100;
		return Math.max(Math.round(Math.log(bonus)), 0);
	},

	getProductionBonus: function () {
		var rate = this.getRU("solarRevolution").owned() ? this.game.getTriValue(this.faith, 1000) : 0;
		//Solar Revolution capped to 1000% so it doesn't become game-breaking
		var atheismBonus = this.game.challenges.getChallenge("atheism").researched ? this.getTranscendenceLevel() * 0.1 : 0;
		var blackObeliskBonus = this.getTranscendenceLevel() * this.getTU("blackObelisk").val * 0.005;
		rate = this.game.getHyperbolicEffect(rate, 1000) * (1 + atheismBonus + blackObeliskBonus);
		return rate;
	},

	getEffect: function (name) {
		var cached = this.effectsCached[name];
		if (!isNaN(cached)) {
			return cached;
		}

		var effect = 0;
		var effectMeta;

		for (var i = this.zigguratUpgrades.length - 1; i >= 0; i--) {
			effectMeta = this.zigguratUpgrades[i].getEffect(name);
			effect += effectMeta;
		}

		for (i = this.religionUpgrades.length - 1; i >= 0; i--) {
			effectMeta = this.religionUpgrades[i].getEffect(name);
			effect += effectMeta;
		}

		for (i = this.transcendenceUpgrades.length - 1; i >= 0; i--) {
			effectMeta = this.transcendenceUpgrades[i].getEffect(name);
			effect += effectMeta;
		}

		this.effectsCached[name] = effect;
		return effect;
	},

	renderTabBlock: function () {
		this.zigguratBlock = dojo.create("table", {
			id: "zigguratBlock",
			class: "bottom-margin",
			innerHTML: '<tr><th colspan="2">Ziggurats</th></tr>'
		}, this.tabBlockNode);
		this.zigguratBlockHeader = this.zigguratBlock.children[0];

		var table = dojo.create("table", {class: "bottom-margin"}, this.tabBlockNode);

		var tr = dojo.create("tr", {
			innerHTML: '<td>Total faith</td><td></td><td id="solarBonusSpan"></td>'
		}, table);
		this.game._createInput({class: "abbrInput"}, tr.children[1], this, "faith");
		this.solarBonusSpan = tr.children[2];

		tr = dojo.create("tr", {
			innerHTML: '<td>Apocrypha bonus</td><td></td><td id="apocryphaBonusSpan"></td>'
		}, table);
		this.game._createInput({class: "abbrInput"}, tr.children[1], this, "faithRatio");
		this.apocryphaBonusSpan = tr.children[2];

		tr = dojo.create("tr", {
			innerHTML: "<td>Corruption timer</td><td></td><td></td>"
		}, table);
		this.game._createInput({class: "abbrInput"}, tr.children[1], this, "corruption");

		tr = dojo.create("tr", {
			innerHTML: "<td>Transcendence Ratio</td><td></td><td></td>"
		}, table);
		this.game._createInput({class: "abbrInput"}, tr.children[1], this, "tcratio");
		this.transcendenceLevelSpan = tr.children[2];

		this.religionBlock = dojo.create("table", {
			id: "religionBlock",
			class: "bottom-margin",
			innerHTML: '<tr><th colspan="2">Order of the Sun</th></tr>'
		}, this.tabBlockNode);
		this.religionBlockHeader = this.religionBlock.children[0];

		this.transcendenceBlock = dojo.create("table", {
			id: "transcendenceBlock",
			innerHTML: '<tr><th colspan="2">Cryptotheology</th></tr>'
		}, this.tabBlockNode);
		this.transcendenceBlockHeader = this.transcendenceBlock.children[0];
	},

	render: function () {
		for (var i = 0, len = this.zigguratUpgrades.length; i < len; i++) {
			var zu = this.zigguratUpgrades[i];
			zu.render();
			dojo.place(zu.domNode, this.zigguratBlock);
		}

		for (i = 0, len = this.religionUpgrades.length; i < len; i++) {
			var ru = this.religionUpgrades[i];
			ru.render();
			dojo.place(ru.domNode, this.religionBlock);
		}

		for (i = 0, len = this.transcendenceUpgrades.length; i < len; i++) {
			var tu = this.transcendenceUpgrades[i];
			tu.render();
			dojo.place(tu.domNode, this.transcendenceBlock);
		}
	},

	update: function () {
		this.hasTranscendeceUpgrade = this.getRU("transcendence").owned(true);
		this.game.callMethods(this.zigguratUpgrades, "update");
		this.game.callMethods(this.religionUpgrades, "update");
		this.game.callMethods(this.transcendenceUpgrades, "update");

		var isAtheism = this.game.challenges.currentChallenge === "atheism";

		dojo.toggleClass(this.zigguratBlockHeader, "spoiler", !this.game.bld.get("ziggurat").owned());
		dojo.toggleClass(this.religionBlockHeader, "spoiler", isAtheism);
		dojo.toggleClass(this.transcendenceBlockHeader, "spoiler", isAtheism || !this.game.science.get("cryptotheology").owned());

		var text = "";

		if (this.getRU("solarRevolution").owned()) {
			var bonus = this.getProductionBonus();
			text = " (+" + this.game.getDisplayValueExt(bonus) + "% bonus)";
		}
		this.solarBonusSpan.textContent = text;

		var ratio = this.getFaithBonus();
		this.apocryphaBonusSpan.textContent = " [" + this.game.getDisplayValueExt(ratio * 100, true, false, 1) + "%]";

		text = "";
		var level = this.getTranscendenceLevel();
		if (level > 0) {
			text = "[" + level + "]";
		}
		this.transcendenceLevelSpan.textContent = text;
	},

	save: function (saveData) {
		var isAtheism = this.game.challenges.currentChallenge === "atheism";

		saveData.religion = {
			faith: isAtheism ? 0 : this.faith,
			corruption: this.corruption,
			faithRatio: this.faithRatio,
			tcratio: this.tcratio,
			zu: this.game.filterMetadata(this.zigguratUpgrades, ["name", "val", "on", "unlocked"]),
			ru: this.game.filterMetadata(this.religionUpgrades, ["name", "val", "on"], function (saveRU) {
				if (isAtheism) {
					saveRU.val = 0;
					saveRU.on = 0;
				}
			}),
			tu: this.game.filterMetadata(this.transcendenceUpgrades, ["name", "val", "on", "unlocked"])
		};
	},

	load: function (saveData) {
		if (!saveData.religion) {
			return;
		}

		this.set("faith", num(saveData.religion.faith));
		this.set("corruption", num(saveData.religion.corruption));
		this.set("faithRatio", num(saveData.religion.faithRatio));
		this.set("tcratio", num(saveData.religion.tcratio));

		this.loadMetaData(saveData.religion.zu, "getZU");
		this.loadMetaData(saveData.religion.ru, "getRU");
		this.loadMetaData(saveData.religion.tu, "getTU");
	}
});


dojo.declare("classes.KGSaveEdit.ZigguratMeta", classes.KGSaveEdit.MetaItem, {
	val: 0,
	on: 0,
	unlocked: false,

	getName: function () {
		return (this.label || this.name) + " (" + this.val + ")";
	},

	owned: function () {
		return this.val > 0;
	},

	render: function () {
		this.domNode = dojo.create("tr", {
			class: "zigguratUpgrade",
			innerHTML: "<td>" + (this.label || this.name) + "</td><td></td>"
		});
		this.nameNode = this.domNode.children[0];
		this.game._createValInput(null, this.domNode.children[1], this);

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	getEffect: function (name) {
		var effect = 0;
		if (this.effects) {
			effect = this.effects[name] * this.val;
		}
		return effect || 0;
	},

	update: function () {
		this.updateEnabled();
		this.unlocked = this.game.checkRequirements(this);
		dojo.toggleClass(this.nameNode, "spoiler", !this.unlocked);
	},

	load: function (saveData) {
		this.set("val", num(saveData.val));
		this.set("unlocked", Boolean(saveData.unlocked));
	}
});


dojo.declare("classes.KGSaveEdit.ReligionMeta", classes.KGSaveEdit.MetaItem, {
	val: 0,
	on: 0,
	upgradable: false,

	owned: function (override) {
		if (!override && this.game.challenges.currentChallenge === "atheism") {
			return false;
		}
		return this.val > 0;
	},

	getName: function () {
		var name = this.label || this.name;
		if (this.owned()) {
			if (this.upgradable && this.game.religion.hasTranscendeceUpgrade) {
				name += " (" + this.val + ")";
			} else {
				name += " (complete)";
			}
		}
		return name;
	},

	getPrices: function () {
		var prices = dojo.clone(this.prices) || [];
		var priceRatio = this.priceRatio || 2.5;
		if (!this.upgradable || !this.game.religion.hasTranscendeceUpgrade) {
			priceRatio = 1;
		}

		for (var i = prices.length - 1; i >= 0; i--) {
			prices[i].val *= Math.pow(priceRatio, this.val);
		}
		return this.game.village.getEffectLeader("wise", prices);
	},

	getEffect: function (name) {
		var effect = this.effects && this.owned() ? num(this.effects[name]) : 0;
		if (this.upgradable && this.game.religion.hasTranscendeceUpgrade) {
			effect *= this.val;
		}
		return num(effect);
	},

	render: function () {
		this.domNode = dojo.create("tr", {
			class: "religionUpgrade",
			innerHTML: "<td>" + (this.label || this.name) + "</td><td></td>"
		});
		this.nameNode = this.domNode.children[0];

		var input = this.game._createCheckbox("Bought", this.domNode.children[1], this);
		this.ownedCheckbox = input.cbox;
		dojo.addClass(input.cbox, "ownedInput");
		input.cbox.handler = function () {
			var ru = this.metaObj;
			if (this.checked !== Boolean(ru.val)) {
				var value = this.checked ? Math.max(ru.valNode.prevValue, 1) : 0;
				ru.val = this.game.setInput(ru.valNode, num(value), true, true);
				ru.on = value;
			}
		};

		this.game._createValInput(null, this.domNode.children[1], this);
		this.valNode.handler = function () {
			this.game.setCheckbox(this.metaObj.ownedCheckbox, this.parsedValue, true, true);
			this.metaObj.on = this.parsedValue;
		};

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	update: function () {
		this.updateEnabled();
		dojo.toggleClass(this.nameNode, "spoiler", this.game.religion.faith < this.faith);

		var t = Boolean(this.upgradable && this.game.religion.hasTranscendeceUpgrade);
		dojo.toggleClass(this.ownedCheckbox.parentNode, "hidden", t);
		dojo.toggleClass(this.valNode, "invisible", !t);
	},

	load: function (saveData) {
		this.set("val", num(saveData.val));
	}
});


dojo.declare("classes.KGSaveEdit.TranscendenceMeta", classes.KGSaveEdit.MetaItem, {
	val: 0,
	on: 0,
	unlocked: false,

	getName: function () {
		return (this.label || this.name) + " (" + this.val + ")";
	},

	owned: function () {
		return this.val > 0;
	},

	render: function () {
		this.domNode = dojo.create("tr", {
			class: "transcendenceUpgrade",
			innerHTML: "<td>" + (this.label || this.name) + "</td><td></td>"
		});
		this.nameNode = this.domNode.children[0];
		this.game._createValInput(null, this.domNode.children[1], this);

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	getEffect: function (name) {
		var effect = this.effects && this.owned() ? num(this.effects[name]) : 0;
		return effect * this.val || 0;
	},

	update: function () {
		this.updateEnabled();
		this.unlocked = this.game.religion.getTranscendenceLevel() >= this.tier;
		dojo.toggleClass(this.nameNode, "spoiler", !this.unlocked);
	},

	load: function (saveData) {
		this.set("val", num(saveData.val));
		this.set("unlocked", Boolean(saveData.unlocked));
	}
});


});
