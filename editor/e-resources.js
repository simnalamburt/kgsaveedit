/*global dojo, require, classes, num*/

function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

require([], function () {
"use strict";

dojo.declare('classes.KGSaveEdit.Resources', classes.KGSaveEdit.Manager, {
	game: null,

	resources: null,
	resourcesByName: null,

	energyProd: 0,
	energyCons: 0,

	isLocked: false,

	resourceData: [
		{name: "catnip"},
		{
			name: "wood",
			craftable: true,
			tableID: 'resourceBlock'
		},
		{name: "minerals"},
		{name: "coal"},
		{name: "iron"},
		{name: "titanium"},
		{name: "gold"},
		{name: "oil"}, {
			name: "uranium",
			color: "#4EA24E"
		}, {
			name: "unobtainium",
			color: "#A00000"
		}, {
			name: "manpower",
			title: "catpower",
			transient: true,
			color: "#DBA901"
		}, {
			name: "science",
			transient: true,
			color: "#01A9DB"
		}, {
			name: "culture",
			transient: true,
			color: "#DF01D7"
		}, {
			name: "faith",
			transient: true,
			color: "gray"
		}, {
			name: "kittens",
			transient: true,
			inputClass: "integerInput",
			showMax: true,
			inputHandler: function() {
				this.game.village.synchKittens();
			},
			getMaxValue: function() {
				return this.game.getEffect('maxKittens');
			}
		}, {
			name: "zebras",
			transient: true,
			inputClass: "integerInput",
			getMaxValue: function () {
				var zMax = 0;
				if (this.game.ironWill) {
					zMax = num(Math.max(this.game.karmaZebrasNode.parsedValue,
						this.game.science.get('archery').researched));
				} else if (this.game.prestige.getPerk('zebraDiplomacy').owned()) {
					zMax = Math.floor(0.10 * this.game.karmaZebrasNode.parsedValue);
				}
				return zMax;
			}
		}, {
			name: "starchart",
			transient: true,
			color: "#9A2EFE"
		}, {
			name: "antimatter",
			transient: true,
			color: "#5A0EDE"
		}, {
			name: "furs",
			type: "uncommon",
			transient: true
		}, {
			name: "ivory",
			type: "uncommon",
			transient: true
		}, {
			name: "spice",
			type: "uncommon",
			transient: true
		}, {
			name: "unicorns",
			type: "rare",
			transient: true
		}, {
			name: "alicorn",
			title: "alicorns",
			type: "rare"
		}, {
			name: "necrocorn",
			title: "necrocorns",
			type: "rare",
			color: "#E00000"
		}, {
			name: "tears",
			type: "rare"
		}, {
			name: "karma",
			type: "rare",
			inputParseFn: function (value) {
				return this.game.getTriValue(Math.round(this.game.reverseTriValue(value, 5)), 5);
			},
			inputHandler: function() {
				this.game.setInput(this.game.karmaKittensNode, Math.round(this.game.reverseTriValue(this.parsedValue, 5)), true);
				this.game.setInput(this.game.karmaKittensKarma, this.parsedValue, true);
			}
		}, {
			name: "paragon",
			color: "#6141CD",
			inputClass: "integerInput"
		}, {
			name: "timeCrystal",
			title: "time crystal",
			color: "#14CD61"
		}, {
			name: "sorrow",
			visible: false,
			color: "black",
			getMaxValue: function() {
				return 11 + this.game.religion.getEffect("blsLimit");
			},
			hardMaxLimit: true
		}, {
			name: "beam",
			craftable: true
		}, {
			name: "slab",
			craftable: true
		}, {
			name: "concrate",
			title: "concrete",
			craftable: true
		}, {
			name: "plate",
			craftable: true
		}, {
			name: "steel",
			craftable: true,
			color: "gray"
		}, {
			name: "alloy",
			craftable: true,
			color: "gray"
		}, {
			name: "eludium",
			craftable: true,
			color: "darkViolet"
		}, {
			name: "gear",
			craftable: true,
			color: "gray"
		}, {
			name: "scaffold",
			craftable: true,
			color: "#FF7F50"
		}, {
			name: "ship",
			craftable: true,
			color: "#FF7F50",
			upgrades: {
				buildings: ["harbor"]
			}
		}, {
			name: "tanker",
			craftable: true,
			color: "#CF4F20",
			upgrades: {
				buildings: ["harbor"]
			}
		}, {
			name: "parchment",
			craftable: true,
			color: "#DF01D7"
		}, {
			name: "manuscript",
			craftable: true,
			color: "#01A9DB"
		}, {
			name: "compedium",
			title: "compendium",
			craftable: true,
			color: "#01A9DB"
		}, {
			name: "relic",
			title: "relic",
			type: "exotic",
			color: "#5A0EDE",
			style: {
				"textShadow": "1px 0px 10px #9A2EFE",
				"animation": "neon1 1.5s ease-in-out infinite alternate"
			}
		}, {
			name: "elderBox",
			title: "present box",
			description: "Merry Eldermass!",
			type: "exotic",
			color: "#FA0EDE",
			style: {
				"textShadow": "1px 0px 10px #FA2E9E",
				"animation": "neon1 1.5s ease-in-out infinite alternate"
			}
		}, {
			name: "blueprint",
			transient: true,
			craftable: true,
			color: "#01A9DB"
		}, {
			name: "megalith",
			craftable: true,
			color: "gray"
		}, {
			name: "kerosene",
			craftable: true,
			color: "darkYellow"
		}, {
			name: "void",
			type: "exotic",
			color: "#5A0EDE",
			style: {
				"textShadow": "1px 0px 10px #9A2EFE",
				"animation": "neon1 1.5s ease-in-out infinite alternate"
			},
			visible: false
		}
	],

	constructor: function (game) {
		this.game = game;
		this.resources = [];
		this.resourcesByName = {};

		for (var i = 0, len = this.resourceData.length; i < len; i++) {
			var res = new classes.KGSaveEdit.ResourceMeta(game, this.resourceData[i]);
			this.resources.push(res);
			this.resourcesByName[res.name] = res;
		}
	},

	render: function () {
		dojo.empty('resourceBlock');
		dojo.empty('craftableBlock');

		for (var i = 0, len = this.resources.length; i < len; i++) {
			var res = this.resources[i];
			var block = res.craftable ? 'craftableBlock' : 'resourceBlock';
			res.render();
			dojo.place(res.domNode, res.tableID || block);
		}
	},

	get: function (name) {
		return this.resourcesByName[name] /* || {name: name, val: 0} */;
	},

	update: function () {
		this.game.callMethods(this.resources, 'update');

		// this.energyProd = this.game.getEffect("energyProduction");
		// this.energyCons = this.game.getEffect("energyConsumption");
	},

	updateMax: function () {
		var game = this.game;
		for (var i = this.resources.length - 1; i >= 0; i--) {
			var res = this.resources[i];
			var maxValue = game.bld.getEffect(res.name + "Max") || 0;

			if (dojo.isFunction(res.getMaxValue)) {
				res.maxValue = res.getMaxValue();
				continue;
			}

			// fixed bonus
			maxValue += game.workshop.getEffect(res.name + "Max");
			maxValue += game.space.getEffect(res.name + "Max");

			//Stuff for Refrigiration and (potentially) similar effects
			maxValue += maxValue * game.workshop.getEffect(res.name + "MaxRatio");

			maxValue += maxValue * game.prestige.getParagonStorageRatio();

			if (!this.isNormalCraftableResource(res) && !res.transient) {
				maxValue *= (1 + this.game.religion.getEffect("tcResourceRatio"));
			}

			if (maxValue < 0) {
				maxValue = 0;
			}

			res.maxValue = maxValue;
		}
	},

	addBarnWarehouseRatio: function(effects){
		var newEffects = {};
		var barnRatio = this.game.workshop.getEffect("barnRatio");
		var warehouseRatio = 1 + this.game.workshop.getEffect("warehouseRatio");

		for (var name in effects) {
			var effect = effects[name];

			if (name === "catnipMax" && this.game.workshop.get("silos").researched){
				effect *= 1 + barnRatio * 0.25;
			}

			if (name === "woodMax" || name === "mineralsMax" || name === "ironMax") { //that starts to look awful
				effect *= 1 + barnRatio;
				effect *= warehouseRatio;
			}

			if (name === "coalMax" || name === "goldMax" || name === "titaniumMax") {
				effect *= warehouseRatio;
			}
			newEffects[name] = effect;
		}
		return newEffects;
	},

	hasRes: function (prices, amt) {
		if (!amt) {
			amt = 1;
		}

		if (prices.length) {
			for (var i = 0; i < prices.length; i++) {
				var price = prices[i];

				var res = this.get(price.name);
				if (res.getValue() < (price.val * amt)) {
					return false;
				}
			}
		}
		return true;
	},

	isStorageLimited: function(prices) {
		if (prices && prices.length) {
			for (var i = 0, len = prices.length; i < len; i++) {
				var price = prices[i];

				var res = this.get(price.name);
				if (res.maxValue > 0 && price.val > res.maxValue) {
					return true;
				}
				if (res.craftable && price.val > res.value) { //account for chronosphere resets etc
					var craft = this.game.workshop.getCraft(res.name);
					if (craft.unlocked && craft.isLimited) {
						return true;
					}
				}
			}
		}
		return false;
	},

	getEnergyDelta: function() {
		if (this.game.opts.noEnergyPenalty) {
			return 1.0;
		}

		var delta = this.energyProd / this.energyCons;
		if (delta < 0.25) {
			delta = 0.25;
		}
		return delta;
	},

	isNormalCraftableResource: function(res) {
		return res.craftable && res.name !== "wood";
	},

	save: function (saveData) {
		saveData.res = {
			isLocked: Boolean(this.isLocked)
		};
		saveData.resources = this.game.mapMethods(this.resources, 'save');
	},

	load: function (saveData) {
		if (saveData.res) {
			this.set('isLocked', Boolean(saveData.res.isLocked));
		}
		this.loadMetaData.call(this, saveData.resources, 'get', function (res, saveRes) {
			res.set('value', num(saveRes.value));
			res.set('isHidden', num(saveRes.isHidden));
		});
	}
});


dojo.declare('classes.KGSaveEdit.ResourceMeta', [classes.KGSaveEdit.GenericItem, classes.KGSaveEdit.TooltipItem], {
	game: null,
	domNode: null,
	valueIn: null,

	name: 'Undefined',
	value: 0,
	perTick: 0,
	maxValue: 0,
	isHidden: false,
	type: 'common',

	render: function () {
		var tr = dojo.create('tr', {'class': 'resource'});
		this.domNode = tr;
		if (this.type) {
			dojo.addClass(tr, this.type);
		}

		var td = dojo.create('td', {}, tr);
		var isHiddenNode = this.game._createCheckbox(null, td, this, 'isHidden');
		isHiddenNode.label.title = 'Resource hidden';

		this.nameNode = dojo.create('td', {
			'class': 'nameNode',
			innerHTML: capitalize(this.title || this.name)
		}, tr);
		this.registerTooltip(this.nameNode);

		if (this.color) {
			dojo.setStyle(this.nameNode, 'color', this.color);
		}
		if (this.style) {
			for (var styleKey in this.style) {
				dojo.setStyle(this.nameNode, styleKey, this.style[styleKey]);
			}
		}

		td = dojo.create('td', null, tr);
		this.game._createInput({'class': this.inputClass || 'abbrInput'},
			td, this, 'value');
		if (this.inputParseFn) {
			this.valueNode.parseFn = this.inputParseFn;
		}
		if (this.inputHandler) {
			this.valueNode.handler = this.inputHandler;
		}

		this.maxValueNode = dojo.create('td', null, tr);
		this.perTickNode = dojo.create('td', {'class': 'perTickNode'}, tr);
		this.registerTooltip(this.perTickNode);

		if(this.name == "catnip"){
			this.weatherModNode = dojo.create('td', null, tr);
		}
	},

	owned: function () {
		return this.getValue() > 0;
	},

	getValue: function () {
		var value = this.value;
		if (this.hardMaxLimit && this.maxValue > 0) {
			value = Math.min(this.value, this.maxValue);
		}
		return num(value);
	},

	setValue: function (value, noHandlers) {
		this.value = this.game.setInput(this.valueNode, value, noHandlers);
	},

	getTooltip: function (node) {
		var tooltipBlock = dojo.byId('tooltipBlock');

		if (node === this.nameNode) {
			tooltipBlock.innerHTML = this.description || '';
			tooltipBlock.className = this.description ? 'res_desc_tooltip' : 'hidden';
			return;
		}

		if (!this.perTickUI) {
			tooltipBlock.className = 'hidden';
			return;
		}

		tooltipBlock.className = 'pertick_tooltip';
		tooltipBlock.innerHTML = this.game.getDetailedResMap(this);
	},

	getTooltipOffset: function (node) {
		var pos = dojo.position(node);
		return {
			left: pos.x + pos.w + 60,
			top: pos.y
		};
	},

	update: function () {
		var value = this.value;
		var maxValue = this.maxValue;
		dojo.toggleClass(this.valueNode, 'resLimitNotice', maxValue > 0 && value > maxValue * 0.95);
		dojo.toggleClass(this.valueNode, 'resLimitWarn',
			maxValue > 0 && value > maxValue * 0.75 && value <= maxValue * 0.95);

		this.perTickNoAutomate = this.game.calcResourcePerTick(this.name);
		//AUTOMATED STRUCTURES EFFECTS
		var resRatioTick = this.game.getEffect(this.name + "PerTick");
		this.perTickUI = this.perTickNoAutomate + resRatioTick;

		this.maxValueNode.textContent =
			maxValue || this.showMax ? "/" + this.game.getDisplayValueExt(maxValue) : "";

		var perTick = this.game.opts.usePerSecondValues ? this.perTickUI * this.game.rate : this.perTickUI;
		var postfix = this.game.opts.usePerSecondValues ? "/sec" : "";
		if (this.game.opts.usePercentageResourceValues && maxValue) {
			perTick = perTick / maxValue * 100;
			postfix = "%" + postfix;
		}

		var perTickValue = perTick ? "(" + this.game.getDisplayValueExt(perTick, true, false) + postfix + ")" : "";
		this.perTickNode.textContent = perTickValue;
		dojo.toggleClass(this.perTickNode, 'tooltipped', Boolean(perTick));

		//weather mod
		if(this.name == "catnip"){
			var season = this.game.calendar.getCurSeason();
			var modifier = 0;
			var modText = "";

			if (season.modifiers[this.name] && this.perTickUI !== 0) {
				modifier = (season.modifiers[this.name] + this.game.calendar.getWeatherMod() - 1) * 100;
				modText = modifier ? "[" + (modifier > 0 ? "+" : "") + modifier.toFixed() + "%]" : "";
			}

			this.weatherModNode.textContent = modText;
			dojo.toggleClass(this.weatherModNode, 'green', modifier > 0);
			dojo.toggleClass(this.weatherModNode, 'red', modifier < 0);
		}
	},

	save: function () {
		return {name: this.name, value: this.getValue(), isHidden: this.isHidden};
	}
});

});
