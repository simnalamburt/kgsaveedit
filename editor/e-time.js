/* global require dojo classes num*/

require(["dojo/on"], function (on) {
"use strict";

dojo.declare("classes.KGSaveEdit.TimeManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	game: null,

	flux: 0, /* Amount of years skipped by CF time jumps */
	heat: 0,
	timestamp: null,

	cfu: null,
	cfuByName: null,
	vsu: null,
	vsuByName: null,

	cfuData: [{
		name: "temporalBattery",
		label: "Temporal Battery",
		description: "Improves your flux energy capacity by 25%",
		prices: [
			{name: "timeCrystal", val: 5}
		],
		priceRatio: 1.25,
		unlocked: true
    }, {
        name: "blastFurnace",
        label: "Chrono Furnace",
        description: "Operates on chronoheat. Increases the maximum heat limit by 100. Can automatically shatter time crystals.",
        prices: [
            {name: "timeCrystal", val: 25},
            {name: "relic",       val: 5}
        ],
        priceRatio: 1.25,
        effects: {
            "heatMax":      100,
            "heatPerTick": -0.02
        },
        unlocked: true
	}, {
		name: "temporalAccelerator",
		label: "Temporal Accelerator",
		description: "Improves the flux energy generation by 5%",
		prices: [
			{name: "timeCrystal", val: 10},
			{name: "relic",       val: 1000}
		],
		priceRatio: 1.25,
		effects: {
			"timeRatio": 0.05
		},
		unlocked: true
    }, {
        name: "temporalImpedance",
        label: "Time Impedance",
        description: "Suppress effect of Dark Future temporal penalty by 1000 years.",
        prices: [
            {name: "timeCrystal", val: 100},
            {name: "relic",       val: 250}
        ],
        priceRatio: 1.05,
        effects: {
            "timeImpedance": 1000
        },
        unlocked: true  //TODO: only unlock past 40K?
	}, {
		name: "ressourceRetrieval",
		label: "Resource Retrieval",
		description: "Retrieve part of your yearly resources when you shatter TC",
		prices: [
			{name: "timeCrystal", val: 1000}
		],
		priceRatio: 1.25,
		requires: {"tech": ["paradoxalKnowledge"]},
		effects: {
			"shatterTCGain": 0.01
		}
	}],

	vsuData: [{
		name: "cryochambers",
		label: "Cryochambers",
		description: "What!",
		prices: [
			{name: "timeCrystal", val: 2},
			{name: "void",        val: 100},
			{name: "karma",       val: 1}
		],
		priceRatio: 1.25,
		requires: {tech: ["voidSpace"]},
		effects: {
			"maxKittens": 1
		},
		// handled elsewhere
		// calculateEffects: function (self, game) {
		// 	self.on = Math.min(self.val, game.bld.get("chronosphere").val);
		// }
	}, {
		name: "usedCryochambers",
		label: "Used Cryochambers",
		description: "Those are unusable cryochambers...",
		prices: [],
		priceRatio: 1.25,
		effects: {}
	}, {
		name: "voidHoover",
		label: "Void Hoover",
		description: "Increase the maximum of void per days in Temporal Paradox",
		prices: [
			{name: "timeCrystal", val: 10},
			{name: "void",        val: 250},
			{name: "antimatter",  val: 1000}
		],
		priceRatio: 1.25,
		requires: {upgrades: ["voidAspiration"]},
		effects: {
			"temporalParadoxVoid": 1
		}
	}, {
		name: "chronocontrol",
		label: "Chronocontrol",
		description: "Increase the number of days in Temporal Paradox",
		prices: [
			{name: "timeCrystal",  val: 30},
			{name: "void",         val: 500},
			{name: "temporalFlux", val: 3000}
		],
		priceRatio: 1.25,
		// unlocks: {upgrades: ["turnSmoothly"]},
		requires: {tech: ["paradoxalKnowledge"]},
		effects: {
			"temporalParadoxDay": 1,
			"energyConsumption": 15
		},
		calculateEffects: function (self, game) {
			self.effects = {
				"temporalParadoxDay": 1 + game.getEffect("temporalParadoxDayBonus"),
				"energyConsumption": 15
			};
			if (game.challenges.currentChallenge === "energy") {
				self.effects["energyConsumption"] *= 2;
			}
		}
	}],

	tabName: "Time",
	getVisible: function () {
		return this.game.science.get("calendar").owned() || this.getVSU("usedCryochambers").owned();
	},

	effectsBase: {
		"temporalFluxMax": 60 * 10 * 5,  //10 minutes (5 == this.game.rate)
        "heatMax":         100,
        "heatPerTick":    -0.01
	},

	getEffectBase: function (name) {
		return num(this.effectsBase[name]);
	},

	constructor: function (game) {
		this.game = game;
		this.timestamp = Date.now();

		this.registerMetaItems(this.cfuData, classes.KGSaveEdit.CFUMeta, "cfu");
		this.registerMetaItems(this.vsuData, classes.KGSaveEdit.VSUMeta, "vsu");

		this.meta.push(this.cfu, this.vsu);
	},

	get: function (name) {
		return this.getCFU(name);
	},

	getCFU: function (name) {
		return this.cfuByName[name];
	},

	getVSU: function (name) {
		return this.vsuByName[name];
	},

	renderTabBlock: function () {
		var game = this.game;

		// Timestamp Node
		var div = dojo.create("div", {
			id: "timestampBlock",
			class: "bottom-margin",
			innerHTML: '<span class="nameNode">Last save time</span> '
		}, this.tabBlockNode);

		dojo.create("small", {
			title: "Times are in milliseconds since January 1, 1970, 00:00:00 UTC.\nFor more information, click here.",
			innerHTML: '<a class="help" href="http://www.epochconverter.com/" target="_blank">[?]</a>'
		}, div);

		dojo.place(document.createTextNode(" "), div);

		game._createInput({
			id: "timestampNode",
			class: "integerInput timeInput",
			title: "Timestamp of last save"
		}, div, this, "timestamp");

		dojo.place(document.createTextNode(" "), div);
		var btn = dojo.create("a", {
			href: "#",
			innerHTML: "Set to current time"
		}, div);
		on(btn, "click", dojo.hitch(this, function () {
			this.set("timestamp", Date.now());
		}));

		this.timeBlock = dojo.create("table", {
			id: "timeBlock",
			class: "bottom-margin",
			innerHTML: '<tr><th colspan="3">Time</th></tr>'
		}, this.tabBlockNode);

		// Energy Node
		var temporalFlux = this.game.resPool.get("temporalFlux");
		var str = "/" + temporalFlux.maxValue;
		if (temporalFlux.value > 0) {
			str +=  " (" + this.game.toDisplaySeconds(temporalFlux.value / this.game.rate) + ")";
		}

		var tr = dojo.create("tr", {
			innerHTML: '<td><span class="nameNode">Temporal Flux</span></td><td></td><td>' + str + "</td>"
		}, this.timeBlock);

		// dojo.place(temporalFlux.valueNode, tr.children[1]);

		var input = game._createInput({
			id: "energyNode",
			class: "integerInput"
		}, tr.children[1], this);
		this.temporalFluxNode = input;

		input.parseFn = function (value) {
			return Math.min(value, temporalFlux.maxValue);
		};
		input.handler = function () {
			temporalFlux.set("value", this.parsedValue, true);
		};

		this.energyMaxBlock = tr.children[2];

		// Flux Node
		tr = dojo.create("tr", {
			innerHTML: '<td><span class="nameNode">Years skipped</span></td><td></td><td></td>',
			title: "Amount of years skipped by shattering time crystals"
		}, this.timeBlock);

		input = game._createInput({
			id: "fluxNode"
		}, tr.children[1], this, "flux");
		input.minValue = -Number.MAX_VALUE;

		// Heat Node
		tr = dojo.create("tr", {
			innerHTML: '<td><span class="nameNode">Heat</span></td><td></td><td></td>'
		}, this.timeBlock);

		this.heatNameNode = tr.children[0].children[0];

		input = game._createInput({
			id: "heatNode",
		}, tr.children[1], this, "flux");
		this.heatBlock = tr.children[2];


		this.chronoforgeBlock = dojo.create("table", {
			id: "cfuBlock",
			class: "bottom-margin"
		}, this.tabBlockNode);

		this.chronoforgeHeader = dojo.create("tr", {
			innerHTML: '<th colspan="3">Chronoforge</th>'
		}, this.chronoforgeBlock);

		for (var i = 0; i < this.cfu.length; i++) {
			var item = this.cfu[i];
			item.render();
			dojo.place(item.domNode, this.chronoforgeBlock);
		}

		//hack
		item = this.getCFU("ressourceRetrieval");
		item.valNode.parseFn = function (value) {
			return Math.min(value, 100) || 0;
		};


		this.voidspaceBlock = dojo.create("table", {
			id: "cfuBlock",
			class: "bottom-margin"
		}, this.tabBlockNode);

		this.voidspaceHeader = dojo.create("tr", {
			innerHTML: '<th colspan="3">Void Space</th>'
		}, this.voidspaceBlock);

		for (i = 0; i < this.vsu.length; i++) {
			item = this.vsu[i];
			item.render();
			dojo.place(item.domNode, this.voidspaceBlock);
		}
	},

	update: function () {
		var hasChronoforge = this.game.workshop.get("chronoforge").owned();
		var temporalFlux = this.game.resPool.get("temporalFlux");
		var str = "/" + temporalFlux.maxValue;

		var seconds = temporalFlux.value / this.game.rate;
		if (seconds > 0) {
			str +=  " (" + this.game.toDisplaySeconds(seconds) + ")";
		}
		this.energyMaxBlock.innerHTML = str;

		this.heatBlock.innerHTML = "/" + this.game.getEffect("heatMax");

		this.game.callMethods(this.cfu, "update");
		this.game.callMethods(this.vsu, "update");

		dojo.toggleClass(this.heatNameNode, "spoiler", !hasChronoforge);
		dojo.toggleClass(this.chronoforgeHeader, "spoiler", !hasChronoforge);
		dojo.toggleClass(this.voidspaceHeader, "spoiler",
			!this.game.science.get("voidSpace").owned() && !this.getVSU("usedCryochambers").owned());
	},

	save: function (saveData) {
		saveData.time = {
			timestamp: this.timestamp,
			flux: this.flux,
			heat: this.heat,
			cfu: this.game.mapMethods(this.cfu, "save"),
			vsu: this.game.mapMethods(this.vsu, "save")
		};
	},

	load: function (saveData) {
		if (!saveData.time) {
			return;
		}

		var data = saveData.time;
		this.game.loadMetaFields(this, data, ["flux", "heat", "timestamp"]);

		this.loadMetaData(data.cfu, "getCFU");
		this.loadMetaData(data.vsu, "getVSU");

		if (data.usedCryochambers) {
			this.loadMetaData(data.usedCryochambers, "getVSU");
		}
	}
});


dojo.declare("classes.KGSaveEdit.CFUMeta", classes.KGSaveEdit.MetaItem, {
	domNode: null, // Here is the HTML Node
	val: 0,
	on: 0,
	unlocked: false,

	priceRatio: 1.25,

	constructor: function () {
		this.defaultUnlocked = this.unlocked;
	},

	owned: function () {
		return this.val > 0;
	},

	getName: function () {
		var name = this.label || this.name;
		var paren = "";
		if (this.owned()) {
			paren = " (" + this.val + ")";
			var on = this.getOn();
			if (on !== this.val) {
				paren = " (" + on + "/" + this.val + ")";
			}
		}
		return name + paren;
	},

	getOn: function () {
		return this.val;
	},

	getPrices: function () {
		var prices = this.prices ? dojo.clone(this.prices) : [];
		var priceRatio = this.priceRatio || 1.25;
		for (var i = prices.length - 1; i >= 0; i--) {
			prices[i].val *= Math.pow(priceRatio, this.val);
			if (prices[i].name === "karma" && this.name === "cryochambers") {
				prices[i].val -= prices[i].val * this.game.getHyperbolicEffect(0.01 * this.game.prestige.getBurnedParagonRatio(), 1.0);
			}
		}
		return prices;
	},

	getEffect: function (name) {
		var effects = this.effects || {};
		var effect = num(effects[name]);
		return effect * this.getOn();
	},

	render: function () {
		var tr = dojo.create("tr", {
			// class: "building",
			innerHTML: "<td></td><td></td><td></td>"
		});
		this.domNode = tr;

		this.nameNode = dojo.create("span", {
			class: "nameNode",
			innerHTML: this.getName()
		}, tr.children[0]);

		this.game._createValInput({
			title: "Number of Upgrades"
		}, tr.children[1], this);

		// this.game._createCheckbox("Unlocked", tr.children[2], this, "unlocked");

		this.registerHighlight(this.domNode); // MetaItem
		this.registerTooltip(this.domNode); // ToolTip
	},

	update: function () { // if researched
		var req = this.game.checkRequirements(this, this.defaultUnlocked);
		// this.set("unlocked", this.unlockedNode.prevChecked || req, true);
		this.unlocked = req;
		dojo.toggleClass(this.nameNode, "spoiler", !this.unlocked);
		// this.game.toggleDisabled(this.unlockedNode, this.defaultUnlocked || req);

		this.updateEnabled();

		if (this.name === "usedCryochambers") {
			dojo.addClass(this.nameNode, "btnDisabled");
		}
	},

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "val", "on"]);
		saveData.on = this.getOn();
		return saveData;
	},

	load: function (saveData) {
		this.set("val", num(saveData.val));
		this.set("unlocked", Boolean(saveData.unlocked) || this.defaultUnlocked);
	}
});


dojo.declare("classes.KGSaveEdit.VSUMeta", classes.KGSaveEdit.CFUMeta, {
	getOn: function () {
		var on = this.val;
		if (this.name === "cryochambers") {
			on = Math.min(this.val, this.game.bld.get("chronosphere").val) || 0;
		}
		return on;
	}
});


});
