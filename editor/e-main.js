/*global dojo, require, LZString, classes, num*/

require(["dojo/on"], function (on) {
"use strict";

dojo.declare('classes.KGSaveEdit.EffectsManager', null, {
	effectMeta: {
		//=====================
		//      catnip
		//=====================

		//effect id
		"catnipPerTickBase" : {
			//title to be displayed for effect, id if not defined
			title: "Catnip production",

			//effect will be hidden if resource is not unlocked
			resName: "catnip",

			//value will be affected by opts.usePerSecondValues
			type: "perTick"
		},
		"catnipPerTick" : {
			title: "Catnip conversion",
			resName: "catnip",
			type: "perTick"
		},

		"catnipDemandRatio" : {
			title: "Catnip demand reduction",
			resName: "catnip",
			type: "ratio"
		},
		"catnipRatio" : {
			title: "Catnip bonus",
			resName: "catnip",
			type: "ratio"
		},
		"catnipJobRatio" : {
			title: "Farmer tools",
			resName: "catnip",
			type: "ratio"
		},
		"catnipMax" : {
			title: "Max Catnip",
			resName: "catnip"
		},

		/* Worker pseudoeffect */
		"catnip" : {
			title: "catnip",
			resName: "catnip",
			type: "perTick"
		},

		//wood

		"woodMax" : {
			title: "Max Wood",
			resName: "wood"
		},

		"woodRatio" : {
			title: "Wood bonus",
			resName: "wood",
			type: "ratio"
		},

		"woodJobRatio" : {
			title: "Woodcutter tools",
			resName: "wood",
			type: "ratio"
		},

		"wood" : {
			title: "wood",
			resName: "wood",
			type: "perTick"
		},

		"woodPerTick" : {
			title: "Wood conversion",
			resName: "wood",
			type: "perTick"
		},

		//minerals

		"mineralsMax" : {
			title: "Max Minerals",
			resName: "minerals"
		},

		"mineralsRatio" : {
			title: "Minerals bonus",
			resName: "minerals",
			type: "ratio"
		},

		"mineralsPerTick" : {
			title: "Minerals conversion",
			resName: "minerals",
			type : "perTick"
		},

		"minerals" : {
			title: "minerals",
			resName: "minerals",
			type: "perTick"
		},

		//iron

		"ironMax" : {
			title: "Max Iron",
			resName: "iron"
		},

		"ironPerTick" : {
			title: "Iron conversion",
			resName: "iron",
			type: "perTick"
		},

		//coal

		"coalMax" : {
			title: "Max Coal",
			resName: "coal"
		},

		"coalPerTickBase" : {
			title: "Coal production",
			resName: "coal",
			type : "perTick"
		},

		"coalRatioGlobal" : {
			title: "Coal production penalty",
			resName: "coal",
			type: "ratio"
		},

		"coalPerTick" : {
			title: "Coal conversion",
			resName: "coal",
			type: "perTick"
		},

		//steel

		"steelPerTick" : {
			title: "Steel conversion",
			type : "perTick"
		},

		//gold

		"goldMax" : {
			title: "Max Gold",
			resName: "gold"
		},

		"gold" : {
			title: "gold",
			resName: "gold",
			type: "perTick"
		},

		"goldPerTick" : {
			title: "Gold conversion",
			resName: "gold",
			type: "perTick"
		},

		//titanium

		"titaniumMax" : {
			title: "Max Titanium",
			resName: "titanium"
		},

		"titaniumPerTick" : {
			title: "Titanium conversion",
			resName: "titanium",
			type: "perTick"
		},

		//oil

		"oilReductionRatio" : {
			title: "Oil consumption reduction",
			type: "ratio"
		},



		//kittens

		"maxKittens" : {
			title: "Kittens",
		},

		//catpower

		"manpowerMax": {
			title: "Max Catpower",
			resName: "manpower"
		},

		"manpower" : {
			title: "catpower",
			resName: "manpower",
			type: "perTick"
		},

		"manpowerJobRatio" : {
			title: "Hunter tools",
			resName: "manpower",
			type: "ratio"
		},

		"manpowerPerTick" : {
			title: "Catpower conversion",
			resName: "manpower",
			type: "perTick"
		},

		//science

		"scienceRatio" : {
			title: "Science bonus",
			type: "ratio"
		},

		"scienceMax" : {
			title: "Max Science"
		},

		"learnRatio" : {
			title: "Skills learning",
			type: "perTick"
		},

		"science" : {
			title: "science",
			resName: "science",
			type: "perTick"
		},

		"observatoryRatio" : {
			title: "Observatory's science ratio",
			type: "ratio"
		},

		//culture

		"cultureMax" : {
			resName: "culture",
			title: "Max Culture"
		},

		"culturePerTickBase" : {
			resName: "culture",
			title: "Culture",
			type: "perTick"
		},

		//oil

		"magnetoBoostRatio" : {
			title: "Magneto boost",
			resName: "oil", //this is sort of hack to prevent early spoiler on magnetos
			type: "ratio"
		},

		"oilMax" : {
			resName: "oil",
			title: "Max Oil"
		},

		"oilPerTickBase" : {
			resName: "oil",
			title: "Oil production",
			type: "perTick"
		},

		"oilPerTick" : {
			resName: "oil",
			title: "Oil conversion",
			type: "perTick"
		},

		//faith

		"faithMax" : {
			title: "Max Faith",
			resName: "faith"
		},

		"faith" : {
			title: "faith",
			resName: "faith",
			type: "perTick"
		},

		"faithPerTickBase" : {
			title: "Faith",
			resName: "faith",
			type: "perTick"
		},

		//uranium

		"uraniumMax" : {
			title: "Max Uranium",
			resName: "uranium"
		},

		"uraniumPerTick": {
			title: "Uranium conversion",
			resType: "uranium",
			type: "perTick"
		},

		//unobtainium

		"unobtainiumMax" : {
			title: "Max Unobtainium",
			resName: "unobtainium"
		},

		"unobtainiumPerTick": {
			title: "Unobtainium conversion",
			resType: "unobtainium",
			type: "perTick"
		},

		//antimatter
		"antimatterProduction": {
			title: "Antimatter production"
		},

		//unicorns

		"unicornsPerTickBase": {
			title: "Unicorn production",
			resType: "unicorns",
			type: "perTick"
		},

		//manuscripts

		"manuscriptPerTick": {
			title: "Manuscript automated production",
			resType: "manuscript",
			type: "perTick"
		},

		//starchart

		"starchart" : {
			title: "starchart",
			resName: "starchart",
			type: "perTick"
		},

		"starchartPerTickBase": {
			title: "Starchart production",
			resType: "starchart",
			type: "perTick"
		},

		//miscellaneous

		"refineRatio": {
			title: "Catnip refine bonus",
			type: "ratio"
		},

		"craftRatio": {
			title: "Craft bonus",
			type: "ratio"
		},

		"fursDemandRatio" : {
			title: "Furs demand reduction",
			resName: "furs",
			type: "ratio"
		},

		"fursPerTick": {
			title: "Furs conversion",
			resType: "furs",
			type: "perTick"
		},

		"ivoryDemandRatio" : {
			title: "Ivory demand reduction",
			resName: "ivory",
			type: "ratio"
		},

		"ivoryPerTick": {
			title: "Ivory conversion",
			resType: "ivory",
			type: "perTick"
		},

		"spiceDemandRatio" : {
			title: "Spice demand reduction",
			resName: "spice",
			type: "ratio"
		},

		"happiness": {
			title: "Happiness"
		},

		"unhappinessRatio": {
			title: "Unhappiness reduction",
			type: "ratio"
		},

		"mintEffect": {
			title: "Mint effect",
		},

		"tradeRatio": {
			title: "Trade ratio",
			type: "ratio"
		},

		"standingRatio": {
			title: "Standing ratio",
			type: "ratio"
		},

		"resStasisRatio": {
			title: "Res-Stasis ratio",
			type: "ratio"
		},

		// energy

		"energyProduction": {
			title: "Energy production"
		},
		"energyConsumption": {
			title: "Energy consumption"
		},

		//production

		"productionRatio" : {
			title: "Production bonus",
			type: "ratio"
		},

		"magnetoRatio" : {
			title: "Production bonus",
			type: "ratio"
		},

		"spaceRatio" : {
			title: "Space production bonus",
			type: "ratio"
		},

		"prodTransferBonus": {
			title: "Transferred cath production bonus",
			type: "ratio"
		},

		//starEvent

		"starEventChance" : {
			title: "Astronomical event chance",
			type: "ratio"
		},

		"starAutoSuccessChance" : {
			title: "Auto astronomical event chance",
			type: "ratio"
		},

		//in the tab workshop
		"lumberMillRatio" : {
			title: "Lumber Mill bonus",
			type: "ratio"
		},

		"barnRatio" : {
			title: "Barn expansion",
			type: "ratio"
		},

		"warehouseRatio" : {
			title: "Warehouse expansion",
			type: "ratio"
		},

		"acceleratorRatio" : {
			title: "Accelerator expansion",
			type: "ratio"
		},

		"harborRatio" : {
			title: "Harbor'ship expansion",
			type: "ratio"
		},

		"harborCoalRatio" : {
			title: "Harbor coal expansion",
			type: "ratio"
		},

		"catnipMaxRatio" : {
			title: "Catnip storage expansion",
			type: "ratio"
		},

		"hunterRatio" : {
			title: "Hunts know-how",
			type: "ratio"
		},

		"solarFarmRatio" : {
			title: "Solar Farm bonus",
			type: "ratio"
		},

		"shipLimit" : {
			title: "Ship limit effect",
			type: "ratio"
		},

		"hutPriceRatio" : {
			title: "Hut price reduction",
			type: "ratio"
		},

		"coalSuperRatio" : {
			title: "Coal bonus",
			type: "ratio"
		},

		"smelterRatio" : {
			title: "Smelter bonus",
			type: "ratio"
		},

		"calcinerRatio" : {
			title: "Calciner bonus",
			type: "ratio"
		},

		"calcinerSteelRatio" : {
			title: "Calciner steel production",
			type: "ratio"
		},

		"calcinerSteelCraftRatio" : {
			title: "Calciner steel production bonus",
			type: "ratio"
		},

		"libraryRatio" : {
			title: "Library bonus",
			type: "ratio"
		},

		"hydroPlantRatio" : {
			title: "Hydro Plant bonus",
			type: "ratio"
		},

		"spaceScienceRatio" : {
			title: "Space science bonus",
			type: "ratio"
		},

		"oilWellRatio" : {
			title: "Oil bonus",
			type: "ratio"
		},

		"unicornsGlobalRatio" : {
			title: "Unicorns bonus",
			type: "ratio"
		},

		"biofuelRatio" : {
			title: "Bio Fuel bonus",
			type: "ratio"
		},

		"blueprintCraftRatio" : {
			title: "Blueprint craft bonus",
			type: "ratio"
		},

		"skillMultiplier" : {
			title: "Kitten's skill effect",
			type: "ratio"
		},

		"uraniumRatio" : {
			title: "Uranium savings",
			type: "ratio"
		},

		"reactorEnergyRatio" : {
			title: "Reactor energy bonus",
			type: "ratio"
		},

		"starchartGlobalRatio" : {
			title: "Starchart bonus",
			type: "ratio"
		},

		"satnavRatio" : {
			title: "Ship's cost savings",
			type: "ratio"
		},

		"broadcastTowerRatio" : {
			title: "Broadcast Tower bonus",
			type: "ratio"
		},

		"lunarOutpostRatio" : {
			title: "Lunar Outpost bonus",
			type: "ratio"
		},

		"crackerRatio" : {
			title: "Cracker bonus",
			type: "ratio"
		},

		"factoryRefineRatio" : {
			title: "Factory refine bonus",
			type: "ratio"
		},

		// cycleEffects
		"prodTransferBonus_cycleEffect" : {
			title: "Zodiac effect Production transfer bonus",
			type: "ratio"
		},
		"starchartPerTickBase_cycleEffect" : {
			title: "Zodiac effect Starchart production",
			type: "ratio"
		},
		"observatoryRatio_cycleEffect" : {
			title: "Zodiac effect Observatory's science ratio",
			type: "ratio"
		},
		"energyConsumption_cycleEffect" : {
			title: "Zodiac effect Energy consumption",
			type: "ratio"
		},
		"uraniumPerTick_cycleEffect" : {
			title: "Zodiac effect Uranium production",
			type: "ratio"
		},
	}
});

dojo.declare('classes.KGSaveEdit.saveEdit', classes.KGSaveEdit.core, {
	rate: 5,

	karmaKittens: 0,
	karmaZebras: 0,
	paragonPoints: 0,
	deadKittens: 0,
	ironWill: true,
	cheatMode: false,

	saveVersion: 3,

	opts: null,

	forceShowLimits: false,
	forceHighPrecision: false,
	useWorkers: false,

	breaksIronWillList: null,

	tabs: null,
	managers: null,

	editorOptions: { //options about the editor
		fixStats: true, //automatically calculate certain stats that may be off due to the game not tracking them before they existed
		includeSpentParagon: true //include price of researched metaphysics perks when calculating the totalParagon stat
	},

	rand: function (ratio) {
		return Math.floor(Math.random() * ratio);
	},

	//shamelessly copied from Sandcastle Builder code
	postfixes: [
		{limit:1e210,divisor:1e210,postfix:['Q',' Quita']},
		{limit: 1e42,divisor: 1e42,postfix:['W',' Wololo']},
		{limit: 1e39,divisor: 1e39,postfix:['L',' Lotta']},
		{limit: 1e36,divisor: 1e36,postfix:['F',' Ferro']},
		{limit: 1e33,divisor: 1e33,postfix:['H',' Helo']}, //or Ballard
		{limit: 1e30,divisor: 1e30,postfix:['S',' Squilli']},
		{limit: 1e27,divisor: 1e27,postfix:['U',' Umpty']},
		{limit: 1e24,divisor: 1e24,postfix:['Y',' Yotta']},
		{limit: 1e21,divisor: 1e21,postfix:['Z',' Zeta']},
		{limit: 1e18,divisor: 1e18,postfix:['E',' Exa']},
		{limit: 1e15,divisor: 1e15,postfix:['P',' Peta']},
		{limit: 1e12,divisor: 1e12,postfix:['T',' Tera']},
		{limit:  1e9,divisor:  1e9,postfix:['G',' Giga']},
		{limit:  1e6,divisor:  1e6,postfix:['M',' Mega']},
		{limit:  9e3,divisor:  1e3,postfix:['K',' Kilo']} //WHAT
	],

	/**
	 * Parses a input element's .value into a numeric value with a minimum of 0
	 * Strips all non-alphanumeric, non-"+", "-", or "." characters and parseFloat()s
	 * Can read a single display postfix if the input displays its value with postfixes
	**/
	parseInput: function (ele) {
		if (ele.type !== 'text' || dojo.hasClass(ele, 'textInput')) {
			return ele.value;
		}

		var str = ele.value.replace(/[^\d\-\+\.A-Z]/gi, '');
		var value = parseFloat(str);

		if (dojo.hasClass(ele, 'abbrInput') && !isNaN(value) && /\d[A-Z]$/i.test(str)) {
			var post = str.slice(-1).toUpperCase();
			for (var i = 0, len = ele.game.postfixes.length; i < len; i++) {
				var p = ele.game.postfixes[i];
				if (post === p.postfix[0]) {
					value *= p.divisor;
					break;
				}
			}
		}

		if (dojo.hasClass(ele, 'integerInput')) {
			value = Math.floor(value);
		}
		if (dojo.isFunction(ele.parseFn)) {
			value = ele.parseFn(value);
		}
		value = Math.max(value, num(ele.minValue));
		return value || 0;
	},

	/**
	 * Calls the applicable function to set a form element's value
	 * Passes arguments to the function
	**/
	setEle: function (ele, value) {
		if (!ele) {
			return value;
		}
		var args = [].slice.call(arguments);
		var fn = this.setInput;

		if (ele.nodeName.toLowerCase() === 'select') {
			fn = this.setSelectByValue;
		} else if (ele.type === 'checkbox') {
			fn = this.setCheckbox;
		}
		return fn.apply(this, args);
	},

	/**
	 * Sets a numeric input's checked states and also updates its associated data property (if applicable)
	 * Passing no value just causes it to redisplay its parsed value (used for .abbrInput onBlur)
	 * Calls handlers on the input and associated object unless noHandlers is truthy
	 * Sets prevChecked (used to revert automatic changes) unless noPrev is truthy
	**/
	setInput: function (ele, value, noHandlers, noPrev) {
		if (dojo.hasClass(ele, 'textInput')) {
			if (typeof value === 'string' && ele !== document.activeElement) {
				ele.value = value;
			}
			return ele.value;
		}

		if (arguments.length > 1) {
			if (dojo.isFunction(ele.parseFn)) {
				value = ele.parseFn(value);
			}
			value = Math.max(value, num(ele.minValue));

			if (value !== ele.parsedValue) {
				ele.parsedValue = value;
				if (!noPrev) {
					ele.prevValue = value;
				}

				if (ele.metaObj && ele.dataProp) {
					ele.metaObj[ele.dataProp] = value;
				}
				if (!noHandlers) {
					this._callHandlers(ele);
				}
			}
		}

		value = ele.parsedValue;
		var abbr = dojo.hasClass(ele, 'abbrInput');

		if (ele !== document.activeElement) {
			ele.value = abbr ? this.getDisplayValueExt(value) : value;
		}
		if (abbr) {
			ele.title = value;
		}
		return value;
	},

	/**
	 * Sets a checkbox's checked states and also updates its associated data property (if applicable)
	 * Sets prevChecked (used to revert automatic changes) unless noPrev is truthy
	 * Calls handlers on the checkbox and associated object unless noHandlers is truthy
	**/
	setCheckbox: function (ele, checked, noPrev, noHandlers) {
		if (!ele || ele.type !== 'checkbox') {
			return;
		}
		ele.checked = checked;
		if (!noPrev) {
			ele.prevChecked = checked;
		}

		if (ele.metaObj && ele.dataProp) {
			ele.metaObj[ele.dataProp] = ele.checked;
		}

		if (!noHandlers) {
			this._callHandlers(ele);
		}
		return ele.checked;
	},

	/**
	 * Selects a select element's option element that matches the given value
	 * Defaults to the select's defaultVal, or the first option if no option matches
	 * Not using select.value = value because that doesn't guarantee an option selected
	**/
	setSelectByValue: function (ele, value) {
		if (!ele) {
			return;
		}
		var option = dojo.query('option[value="' + value + '"]', ele)[0];
		if (!option && 'defaultVal' in ele) {
			option = dojo.query('option[value="' + ele.defaultVal + '"]', ele)[0];
		}
		if (!option) {
			option = ele.options[0] || {}; //ah safety nets
		}
		option.selected = true;
		return ele.value;
	},

	/**
	 * Toggles an input's disabled attribute, and toggles a class on its parentNode
	**/
	toggleDisabled: function (ele, disabled) {
		if (!ele) {
			return;
		}
		ele.disabled = disabled;
		dojo.toggleClass(ele.parentNode, 'locked', Boolean(disabled));
	},

	filterMetadata: function(meta, fields) {
		var filtered = [];
		for (var i = 0, len = meta.length; i < len; i++){
			var clone = this.filterMetaObj(meta[i], fields);
			filtered.push(clone);
		}
		return filtered;
	},

	filterMetaObj: function (meta, fields) {
		var clone = {};
		for (var i = 0, len = fields.length; i < len; i++) {
			clone[fields[i]] = meta[fields[i]];
		}
		return clone;
	},

	getDisplayValueExt: function (value, prefix, usePerTickHack, precision) {
		if (!value) { return "0"; }
		if (!isFinite(value)) {
			return this.getDisplayValue(value, prefix) + (usePerTickHack ? "/s" : "");
		}

		if (usePerTickHack) {
			usePerTickHack = this.opts.usePerSecondValues;
		}
		if (usePerTickHack) {
			value = value * this.rate;
		}

		var postfix = "";
		var absValue = Math.abs(value);
		for (var i = 0; i < this.postfixes.length; i++) {
			var p = this.postfixes[i];
			while (absValue >= p.limit) {
				value = value / p.divisor;
				absValue = Math.abs(value);
				postfix += p.postfix[0];
			}
		}

		return this.getDisplayValue(value, prefix, precision) + postfix + (usePerTickHack ? "/s" : "");
	},

	getDisplayValue: function (floatVal, plusPrefix, precision) {
		var plusSign = "+";
		if (floatVal <= 0 || !plusPrefix) {
			plusSign = "";
		}

		if (isNaN(precision)) {
			precision = this.forceHighPrecision ? 3 : 2;
		}

		if (!floatVal.toFixed) {
			return plusSign + floatVal;
		}

		if (floatVal.toFixed() == floatVal) {
			return plusSign + floatVal.toFixed();
		} else {
			return plusSign + floatVal.toFixed(precision);
		}
	},

	getUnlockByName: function (unlockId, type) {
		switch(type) {
			case 'tech':
				return this.science.get(unlockId);
			case 'jobs':
				return this.village.getJob(unlockId);
			case 'crafts':
				return this.workshop.getCraft(unlockId);
			case 'upgrades':
				return this.workshop.get(unlockId);
			/* case 'tabs':
				return this.getTab(unlockId); */
			case 'buildings':
				return this.bld.get(unlockId);
			case 'stages':
				return this.bld.get(unlockId.bld);
			case 'program':
				return this.space.getProgram(unlockId);
			case 'perk':
				return this.prestige.getPerk(unlockId);
			case 'ZU':
				return this.religion.getZU(unlockId);
			default:
				console.log('Couldn\'t get unlock ', unlockId, ' of type ', type);
				return false;
		}
	},

	upgradeItems: function (list) {
		for (var type in list) {
			for (var i = list[type].length - 1; i >= 0; i--) {
				var meta = this.getUnlockByName(list[type][i], type);
				if (meta) {
					if (meta.calculateEffects) {
						meta.calculateEffects(meta, this);
					}
					if (meta.metaObj && meta.metaObj.invalidateCachedEffects) {
						meta.metaObj.invalidateCachedEffects();
					}
				}
			}
		}
	},

	calculateAllEffects: function () {
		this.workshop.invalidateCachedEffects();
		this.prestige.invalidateCachedEffects();
		this.religion.invalidateCachedEffects();
		this.space.invalidateCachedEffects();

		// TODO: delegate this to managers? Can't be done in load unfortunately.
		this.upgradeItems({
			buildings: this.bld.buildingsNames,
			jobs: this.village.jobNames
		});
	},

	getTriValue: function (value, stripe) {
		return (Math.sqrt(1 + 8 * value / stripe) - 1) / 2;
	},

	reverseTriValue: function (value, stripe) {
		return (Math.pow(value * 2 + 1, 2) - 1) * stripe / 8;
	},

	getResCraftRatio: function(res) {
		var ratio;
		if (res.name === "wood") {
			var refineRatio = this.bld.getEffect("refineRatio");
			if (this.ironWill) {
				return ((1 + refineRatio) * (1 + this.bld.getEffect("woodRatio"))) - 1;
			} else {
				return refineRatio;
			}
		}

		if (res.name === "blueprint") {
			var bpRatio = this.workshop.getEffect("blueprintCraftRatio");
			var scienceBldAmt = this.bld.get("library").val + this.bld.get("academy").val +
				this.bld.get("observatory").val + this.bld.get("biolab").val;

			ratio = this.bld.getEffect("craftRatio");

			return ratio + scienceBldAmt * bpRatio;
		}

		if (res.name === "oil"){
			var fRatio = this.workshop.getEffect("factoryRefineRatio");

			var amt = this.bld.get("factory").val;
			ratio = this.bld.getEffect("craftRatio");

			return ratio * (1 + amt * fRatio);
		}

		//get resource specific craft ratio (like factory bonus)
		var resCraftRatio = this.bld.getEffect(res.name + "CraftRatio") || 0;

		return this.bld.getEffect("craftRatio") + resCraftRatio;
	},

	renderPrices: function (tooltip, prices) {
		if (!prices || !prices.length) {
			return;
		}
		for (var i = 0, len = prices.length; i < len; i++) {
			this._renderPriceLine(tooltip, prices[i]);
		}
	},

	_renderPriceLine: function (tooltip, price, indent) {
		var priceItemNode = dojo.create('div', {'class': 'tooltipPriceNode'}, tooltip);

		var res = this.resPool.get(price.name);
		var resValue = res.getValue();
		var hasRes = (resValue >= price.val);


		var nameSpan = dojo.create('span', {
			'class': 'tooltipPriceName',
			innerHTML: res.title || res.name
		}, priceItemNode);

		var asterisk = res.maxValue && ((price.val > res.maxValue && !indent) || price.baseVal > res.maxValue) ? "*" : ""; //mark limit issues with asterisk

		var priceSpan = dojo.create('span', {
			'class': 'tooltipPriceSpan' + (hasRes ? '' : ' noRes'),
			innerHTML: hasRes ? this.getDisplayValueExt(price.val) :
				this.getDisplayValueExt(resValue) + " / " + this.getDisplayValueExt(price.val) + asterisk
		}, priceItemNode);

		if (!hasRes && res.perTickUI > 0) {
			var eta = (price.val - resValue) / (res.perTickUI * this.rate);
			if (eta >= 1) {
				priceSpan.textContent += " (" + this.game.toDisplaySeconds(eta) + ")";
			}
		}

		//unroll prices to the raw resources
		if (!hasRes && res.craftable && res.name !== "wood") {
			var craft = this.workshop.getCraft(res.name);
			if (!craft) { console.log(craft, res, res.name); }
			if (craft.unlocked) {
				var craftRatio = this.getResCraftRatio(res);
				nameSpan.textContent = "+ " + nameSpan.textContent;

				if (!indent) {
					indent = 1;
				}

				var components = this.game.workshop.getCraftPrice(craft);
				for (var j = 0, len = components.length; j < len; j++) {

					var diff = price.val - resValue;

					// Round up to the nearest craftable amount
					var val = Math.ceil(components[j].val * diff / (1 + craftRatio));
					var remainder = val % components[j].val;
					if (remainder !== 0) {
						val += components[j].val - remainder;
					}

					var comp = {name: components[j].name, val: val, baseVal: components[j].val};

					var compSpan = this._renderPriceLine(tooltip, comp, indent + 1);
					for (var k = 0; k < indent; ++k) {
						compSpan.name.innerHTML = "&nbsp;&nbsp;&nbsp;" + compSpan.name.innerHTML;
					}
					compSpan.name.style.color = "gray"; //mark unrolled price component as raw
				}
			}
		}

		return {name: nameSpan, price: priceSpan};
	},

	renderEffects: function (tooltip, effectsList, hideTitle) {
		if (!hideTitle) {
			dojo.create('div', {
				'class': 'tooltipEffectsTitle',
				innerHTML: 'Effects:'
			}, tooltip);
		}

		//-----------------------------------------

		for (var effectName in effectsList) {
			var effectValue = effectsList[effectName];
			if (effectValue !== 0) {
				var effectMeta = this.getEffectMeta(effectName);
				var effectClass = 'tooltipEffect';

				if (!effectMeta) {
					effectMeta = {};
				}
				var displayEffectName = effectMeta.title || effectName;

				if (effectMeta.resName && this.resPool.get(effectMeta.resName).getValue() === 0) {
					effectClass += ' spoiler'; //mark resource-related effects if we did not unlocked this effect yet
				}

				//display resMax values with global ratios like Refrigeration and Paragon
				if (effectName.substr(-3) === "Max") {
					effectValue += effectValue * this.workshop.getEffect(effectName + "Ratio");
					effectValue += effectValue * this.game.prestige.getParagonStorageRatio();

					var res = this.game.resPool.get(effectMeta.resName || effectName.slice(0, -3));
					if (!this.game.resPool.isNormalCraftableResource(res) && !res.transient) {
						effectValue += effectValue * this.game.religion.getEffect("tcResourceRatio");
					}
				}

				var displayEffectValue;

				if (effectMeta.type === "perTick" && this.opts.usePerSecondValues) {
					displayEffectValue = this.getDisplayValueExt(effectValue * this.rate) + "/sec";
				} else if (effectMeta.type === "ratio") {
					displayEffectValue = (effectValue * 100).toFixed(1) + "%";
				} else {
					displayEffectValue = this.getDisplayValueExt(effectValue);
				}

				dojo.create('div', {
					'class': effectClass,
					innerHTML: displayEffectName + ': ' + displayEffectValue
				}, tooltip);
			}
		}
	},

	getEffectMeta: function(effectName) {
		return this.effectsMgr.effectMeta[effectName];
	},

	getEffect: function(effectName) {
		return this.bld.getEffect(effectName) +
			this.space.getEffect(effectName);
	},

	getDetailedResMap: function (res) {
		var resString = "";
		var resStack = this.getResourcePerTickStack(res.name);
		var resValue = res.getValue();

		resString = this.processResourcePerTickStack(resStack, 0);

		if (this.opts.usePercentageResourceValues) {
			resString += "<br> Net gain: " + this.getDisplayValueExt(res.perTickUI, true, true);
		}

		if (res.perTickUI < 0) {
			var toZero = resValue / (-res.perTickUI * this.rate);
			resString += "<br>To zero: " + this.toDisplaySeconds(toZero);
		} else {
			if (res.maxValue) {
				var toCap = (res.maxValue - resValue) / (res.perTickUI * this.rate);
				if (toCap) {
					resString += "<br>To cap: " + this.toDisplaySeconds(toCap);
				}
			}
		}
		return resString;
	},

	processResourcePerTickStack: function (resStack, depth) {
		var resString = "";
		var hasFixed = false;

		for (var i = 0; i < resStack.length; i++) {
			var stackElem = resStack[i];

			if (stackElem.length) {
				var subStack = this.processResourcePerTickStack(stackElem, depth + 1);
				if (subStack.length) {
					resString += subStack;
					hasFixed = true;
				}
			}

			if (!stackElem.value || (stackElem.type === "ratio" && !hasFixed)) {
				continue;
			}

			for (var j = 0; j < depth; j++) {
				resString += "*";
			}

			resString += this.getStackElemString(stackElem);
			if (stackElem.type === "fixed") {
				hasFixed = true;
			}
		}

		return resString;
	},

	getStackElemString: function (stackElem) {
		var resString = stackElem.name + ": ";

		if (stackElem.type === "fixed") {
			resString += " " + this.getDisplayValueExt(stackElem.value, true, true);
		} else {
			resString += " " + this.getDisplayValueExt((stackElem.value * 100).toFixed(), true) + "%";
		}

		resString += "<br>";

		return resString;
	},

	toDisplaySeconds: function (secondsRaw) {
		var sec_num = Math.round(secondsRaw);

		var year_secs = 86400 * 365;

		var years   = Math.floor(sec_num / year_secs);
		var days    = Math.floor((sec_num - (years * year_secs)) / 86400);
		var hours   = Math.floor((sec_num - (years * year_secs) - (days * 86400)) / 3600);
		var minutes = Math.floor((sec_num - (years * year_secs) - (days * 86400 + hours * 3600)) / 60);
		var seconds = sec_num - (years * year_secs) - (days * 86400) - (hours * 3600) - (minutes * 60);

		if (years > 0) {
			years = this.getDisplayValueExt(years);
		}

		var timeFormated = "";
		if (years) { timeFormated = years + "y "; }
		if (days) { timeFormated += days + "d "; }
		if (!years) {
			if (hours) {  timeFormated += hours + "h "; }
			if (minutes) { timeFormated += minutes + "m "; }
			if (seconds) { timeFormated += seconds + "s "; }
		}

		return timeFormated;
	},

	calcResourcePerTick: function (resName, season) {

		//STRUCTURES PRODUCTION
		var res = this.resPool.get(resName);

		var weatherMod = 0;
		//SEASON MODIFIERS
		if (!season) {
			season = this.calendar.getCurSeason();
		}

		weatherMod = this.calendar.getWeatherMod();
		weatherMod = (season.modifiers[res.name] + weatherMod);
		if (weatherMod < -0.95) {
			weatherMod = -0.95;
		}

		var perTick = this.getEffect(res.name + "PerTickBase"); //per tick accumulator

		if (season.modifiers[res.name]) {
			perTick = perTick * weatherMod;
		}

		//VILLAGE JOB PRODUCTION

		var resMapProduction = this.village.getResProduction();
		var resProduction = num(resMapProduction[res.name]);

		perTick += resProduction;

		//UPGRADE EFFECTS GENERAL
		var workshopResRatio = this.workshop.getEffect(res.name + "Ratio");
		if (workshopResRatio && res.name !== "coal") {
			perTick += resProduction * workshopResRatio;
		}
		var workshopResGlobalRatio = this.workshop.getEffect(res.name + "GlobalRatio");
		perTick *= (1 + workshopResGlobalRatio);

		//BUILDINGS AND SPACE EFFECTS
		var resRatio = this.getEffect(res.name + "Ratio");
		if (resRatio) {
			perTick += perTick * resRatio;
		}

		//UPGRADE EFFECTS FOR COAL (HACK, TO BE FIXED)
		workshopResRatio = this.workshop.getEffect(res.name + "Ratio");
		if (workshopResRatio && res.name === "coal") {
			perTick += perTick * workshopResRatio;
		}

		//---------- RELIGION EFFECTS -----------
		var relResEffect = this.religion.getEffect(resName + "Ratio");
		if (relResEffect) {
			perTick += perTick * relResEffect;
		}

		//---------  PARAGON BONUS ------------
		perTick += perTick * this.prestige.getParagonProductionRatio();

		//---------  FAITH BONUS --------------
		if (this.religion.getRU("solarRevolution").owned()) {
			perTick += perTick * (this.religion.getProductionBonus() / 100);
		}

		//--------- YEY ANOTHER HACK FOR MAGNETOS ------
		var steamworks = this.bld.get("steamworks");
		var steamWorksOn = steamworks.getOn();
		if (!res.transient && this.bld.get("magneto").getOn() > 0) {

			if (res.name !== "oil") {
				var swRatio = steamWorksOn > 0 ? (1 + steamworks.effects["magnetoBoostRatio"] * steamWorksOn) : 1;
				perTick += perTick * this.bld.getEffect("magnetoRatio") * swRatio;
			}

		}

		//--------- GENERAL PRODUCTION RATIO --------------
		if (!res.transient) {
			perTick += perTick * this.bld.getEffect("productionRatio");
		}

		//SPECIAL STEAMWORKS HACK FOR COAL
		var swEffectGlobal = steamworks.effects[res.name + "RatioGlobal"];
		if (steamWorksOn > 0 && swEffectGlobal) {
			perTick += perTick * swEffectGlobal;
		}

		//---------  RESOURCE CONSUMPTION -------------
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;

		resConsumption *= 1 + this.bld.getEffect(res.name + "DemandRatio", true); //use hyp reduction

		perTick += resConsumption;

		if (isNaN(perTick)) {
			return 0;
		}

		return perTick;
	},

	getResourcePerTickStack: function (resName, calcAutomatedEffect, season) {
		var res = null;
		for (var i = 0; i < this.resPool.resources.length; i++) {
			if (this.resPool.resources[i].name === resName) {
				res = this.resPool.resources[i];
				break;
			}
		}

		if (!season) {
			season = this.calendar.getCurSeason();
		}

		var stack = [];

		stack.push({
			name: "Base",
			type: "fixed",
			value: this.getEffect(res.name + "PerTickBase")
		});

		var weatherMod = this.calendar.getWeatherMod();
		weatherMod = (season.modifiers[res.name] + weatherMod);
		if (weatherMod < -0.95) {
			weatherMod = -0.95;
		}

		stack.push({
			name: "Weather",
			type: "ratio",
			value: weatherMod - 1
		});

		//----------- production -----------

		var resMapProduction = this.village.getResProduction();
		var villageStack = [];

		villageStack.push({
			name: "Village",
			type: "fixed",
			value: resMapProduction[res.name] || 0
		});

		if (res.name !== "coal") {
			villageStack.push({
				name: "Upgrades",
				type: "ratio",
				value: this.workshop.getEffect(res.name + "Ratio")
			});
		}

		stack.push(villageStack);

		stack.push({
			name: "Upgrades",
			type: "ratio",
			value: this.workshop.getEffect(res.name + "GlobalRatio")
		});

		stack.push({
			name: "Buildings",
			type: "ratio",
			value: this.bld.getEffect(res.name + "Ratio")
		});

		stack.push({
			name: "Space",
			type: "ratio",
			value: this.space.getEffect(res.name + "Ratio")
		});

		stack.push({
			name: "Religion",
			type: "ratio",
			value: this.religion.getEffect(res.name + "Ratio")
		});

		stack.push({
			name: "Paragon",
			type: "ratio",
			value: this.prestige.getParagonProductionRatio()
		});

		if (this.religion.getRU("solarRevolution").owned()) {
			stack.push({
				name: "Faith",
				type: "ratio",
				value: this.religion.getProductionBonus() / 100
			});
		}

		//--------- YEY ANOTHER HACK FOR MAGNETOS ------
		var steamworks = this.bld.get("steamworks");
		var steamWorksOn = steamworks.getOn();
		if (!res.transient && this.bld.get("magneto").getOn() > 0) {

			if (res.name !== "oil") {
				var swRatio = steamWorksOn > 0 ? (1 + steamworks.effects["magnetoBoostRatio"] * steamWorksOn) : 1;
				stack.push({
					name: "Magnetos",
					type: "ratio",
					value: this.bld.getEffect("magnetoRatio") * swRatio
				});
			}
		}

		if (!res.transient) {
			stack.push({
				name: "Reactors",
				type: "ratio",
				value: this.bld.getEffect("productionRatio")
			});
		}

		stack.push({
			name: "Automated",
			type: "fixed",
			automated: true,
			value: this.getEffect(res.name + "PerTick")
		});

		var swEffectGlobal = steamworks.effects[res.name + "RatioGlobal"];
		if (steamWorksOn > 0 && swEffectGlobal) {
			stack.push({
				name: "Steamworks",
				type: "ratio",
				value: swEffectGlobal
			});
		}

		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[res.name] || 0;

		resConsumption *= 1 + this.bld.getEffect(res.name + "DemandRatio", true);

		stack.push({
			name: "Demand",
			type: "fixed",
			value: resConsumption
		});

		return stack;
	},

	getCraftRatio: function() {
		var craftRatio = this.bld.getEffect("craftRatio");
		if (this.village.leader && this.village.leader.trait.name === "engineer") {
			craftRatio += 0.05;
		}
		return craftRatio;
	},

	/**
	 * Checks whether everything in a given meta.requires is owned
	 * Returns defaultUnlocked if no .requires, else unlocked
	 * Has a hack for stages (>_>)
	**/
	checkRequirements: function (meta, defaultUnlocked, isStage) {
		if (!meta) {
			return false;
		}

		var metaReqs = meta[isStage ? 'stageRequires' : 'requires'];
		if (!metaReqs) {
			if (defaultUnlocked !== undefined && defaultUnlocked !== null) {
				return Boolean(defaultUnlocked);
			}
			return Boolean(meta[isStage ? 'stageUnlocked' : 'unlocked']);
		}

		for (var type in metaReqs) {
			var req = metaReqs[type];
			for (var i = req.length - 1; i >= 0; i--) {
				var u = this.getUnlockByName(req[i], type);
				if (!u || !u.owned || !u.owned()) {
					return false;
				}
			}
		}

		return true;
	},

	/**
	 * Create a numeric input element and attaches an 'input' event handler to it
	 * Automatically updates metaObj[dataProp] if both are set
	**/
	_createInput: function (attrs, parentNode, metaObj, dataProp, pos, noUpdate) {
		var input = dojo.create('input', attrs, parentNode, pos || 'last');
		input.type = 'text';
		input.game = this;

		if (dojo.hasClass(input, 'textInput')) {
			return input;
		}

		input.placeholder = num(input.placeholder);
		var value = this.parseInput(input);

		if (metaObj) {
			input.game = metaObj.game;
			input.metaObj = metaObj;
			if (dataProp) {
				input.dataProp = dataProp;
				metaObj[dataProp + 'Node'] = input;
				value = metaObj[dataProp];
			}
		}

		input.value = value;
		input.parsedValue = value;
		input.prevValue = value;

		on(input, 'input', function () {
			var value = this.game.parseInput(this);

			if (this.parsedValue !== value) {
				this.parsedValue = value;
				this.prevValue = value;

				if (this.metaObj && this.dataProp) {
					this.metaObj[this.dataProp] = value;
				}
				this.game._callHandlers(this);

				if (!noUpdate) {
					this.game.update();
				}
			}
		});

		on(input, 'blur', function () {
			this.game.setInput(this);
		});

		on(input, 'focus', function () {
			var val = this.parsedValue || 0;
			if (String(val) !== this.value) {
				this.value = val;
			}
		});

		return input;
	},

	/**
	 * Creates a checkbox and a label wrapper, and attaches a click event handler
	 * Automatically updates metaObj[dataProp] if both are set
	**/
	_createCheckbox: function (text, parentNode, metaObj, prop) {
		var label = dojo.create('label', {innerHTML: ' '}, parentNode);
		var cbox = dojo.create('input', {type: 'checkbox'}, label, 'first');
		var span = dojo.create('span', {innerHTML: text || ''}, label);

		if (metaObj) {
			label.metaObj = metaObj;
			cbox.metaObj = metaObj;
			if (prop) {
				cbox.dataProp = prop;
				metaObj[prop + 'Node'] = cbox;
				cbox.checked = metaObj[prop];
			}
		}
		cbox.game = this;
		cbox.prevChecked = cbox.checked;

		on(cbox, 'click', function () {
			this.prevChecked = this.checked;
			if (this.metaObj && this.dataProp) {
				this.metaObj[this.dataProp] = this.checked;
			}
			this.game._callHandlers(this);
			this.game.update();
		});

		return {label: label, cbox: cbox, text: span};
	},

	/**
	 * Call handler methods, and recalculate things as necessary
	**/
	_callHandlers: function (ele) {
		if (dojo.isFunction(ele.handler)) {
			ele.handler();
		}

		if (ele.metaObj) {
			var meta = ele.metaObj;
			if (dojo.isFunction(meta.handler)) {
				meta.handler(meta);
			}

			if (dojo.hasClass(ele, 'ownedInput')) {
				if (meta.metaObj && meta.metaObj.invalidateCachedEffects) {
					meta.metaObj.invalidateCachedEffects();
				}
				if (meta.upgrades) {
					this.upgradeItems(meta.upgrades);
				}
			}
		}
	},

	/**
	 * Loop through a list, calling a method by the given name on each of its members, with arguments passed through
	**/
	callMethods: function (list, method) {
		var args = [].slice.call(arguments, 2);
		if (list && list.length) {
			for (var i = 0, len = list.length; i < len; i++) {
				if (dojo.isFunction(list[i][method])) {
					list[i][method].apply(list[i], args);
				}
			}
		}
	},

	/**
	 * Loop through a list, calling a method by the given name on each of its members,
	 * and returns an array of the returned values
	**/
	mapMethods: function (list, method) {
		var args = [].slice.call(arguments, 2);
		var map = [];
		if (list && list.length) {
			for (var i = 0, len = list.length; i < len; i++) {
				if (dojo.isFunction(list[i][method])) {
					map.push(list[i][method].apply(list[i], args));
				}
			}
		}
		return map;
	},

	loadMetaFields: function (meta, saveMeta, fields) {
		if (saveMeta) {
			for (var i = fields.length - 1; i >= 0; i--) {
				var field = fields[i];
				if (field in saveMeta) {
					meta.set(field, saveMeta[field]);
				}
			}
		}
	},

	exportSave: function (compress) {
		var saveData = {
			saveVersion: this.saveVersion
		};

		this.resPool.save(saveData);
		this.village.save(saveData);
		this.calendar.save(saveData);
		this.console.save(saveData);

		this.callMethods(this.managers, 'save', saveData);

		saveData.game = {
			forceShowLimits: this.forceShowLimits,
			forceHighPrecision: this.forceHighPrecision,
			useWorkers: this.useWorkers,
			colorScheme: this.colorScheme,
			karmaKittens: this.karmaKittens,
			karmaZebras: this.karmaZebras,
			paragonPoints: this.resPool.get('paragon').value,
			ironWill: this.ironWill,
			deadKittens: this.deadKittens,
			cheatMode: this.cheatMode,

			opts: this.filterMetaObj(this.opts, ["usePerSecondValues", "usePercentageResourceValues",
				"highlightUnavailable", "hideSell", "noConfirm", "IWSmelter"])
		};

		if (compress) {
			//console.log(JSON.stringify(saveData));
			saveData = LZString.compressToBase64(JSON.stringify(saveData));
		}
		return saveData;
	},

	migrateSave: function(save) {
		if (save.saveVersion === undefined) {
			save.saveVersion = 1;
		}

		var i, buildings, program;
		if (save.saveVersion === 1) {
			// Move Lunar Outpost and Moon Base from programs to moon planet
			if (save.space && save.space.programs && save.space.planets) {
				buildings = [];
				for (i = save.space.programs.length - 1; i >= 0; i--) {
					program = save.space.programs[i];
					if (program.name === "moonOutpost" || program.name === "moonBase") {
						program.unlocked = true;
						buildings.push(program);
						save.space.programs.splice(i, 1);
					}
				}
				for (i = save.space.planets.length - 1; i >= 0; i--) {
					if (save.space.planets[i].name === "moon") {
						save.space.planets[i].buildings = buildings;
						break;
					}
				}
			}

			save.saveVersion = 2;
		}

		if (save.saveVersion === 2) {
			// Move upgradable programs from programs to cath planet
			if (save.space && save.space.programs && save.space.planets) {
				buildings = [];
				for (i = save.space.programs.length - 1; i >= 0; i--) {
					program = save.space.programs[i];
					if (program.name === "spaceElevator" || program.name === "sattelite" || program.name === "spaceStation") {
						program.unlocked = true;
						buildings.push(program);
						save.space.programs.splice(i, 1);
					}
				}
				save.space.planets.push({name: "cath", buildings: buildings});
			}

			save.saveVersion = 3;
		}

		return save;
	},

	importSave: function (data) {
		if (!data) {
			return;
		}

		var success = false;
		var rollback = false;
		try {
			var decompress = LZString.decompressFromBase64(data);
			var json;
			if (decompress) {
				json = decompress;
			} else {
				json = atob(data);
			}

			if (!json) {
				return false;
			}

			//console.log(json);
			var saveData = JSON.parse(json);


			//reset everything before loading
			this._loadJSON(this.blankSaveData);
			rollback = true;
			this._loadJSON(saveData);

			success = true;

		} catch (ex) {
			console.error("Unable to load game data: ", ex);
			// console.trace();
			success = 'ERROR';
			if (rollback) {
				this._loadJSON(this.blankSaveData);
			}
		}

		this.village.synchKittens(true);
		// this.callMethods(this.managers, 'invalidateCachedEffects');
		this.calculateAllEffects();
		this.update();

		return success;
	},

	_loadJSON: function (saveData) {
		if (!saveData) {
			return;
		}

		this.migrateSave(saveData);

		this.resPool.load(saveData);
		this.village.load(saveData);
		this.calendar.load(saveData);
		this.console.load(saveData);

		this.callMethods(this.managers, 'load', saveData);

		if (saveData.game) {
			var data = saveData.game;

			this.loadMetaFields(this, data, ["forceShowLimits", "colorScheme", "karmaKittens",
				"deadKittens", "useWorkers", "cheatMode", "forceHighPrecision"]);

			this.OptionsTab.scheme.value = this.colorScheme;
			this.ironWill = ('ironWill' in data) ? Boolean(data.ironWill) : true;

			var paragonPoints = num(data.paragonPoints);

			if (paragonPoints > this.resPool.get('paragon').value) {
				this.resPool.get('paragon').set('value', paragonPoints);
			}

			this.loadMetaFields(this.opts, data.opts, ["usePerSecondValues", "usePercentageResourceValues",
				"highlightUnavailable", "hideSell", "noConfirm", "IWSmelter"]);
		}
	},


	constructor: function (container) {
		this.container = container;
		this.game = this;

		this.breaksIronWillList = [];

		this.update = dojo.hitch(this, this.update); //ugh

		this.opts = new classes.KGSaveEdit.GenericItem(this, {
			usePerSecondValues: true,
			usePercentageResourceValues: false,
			highlightUnavailable: false,
			hideSell: false,
			noConfirm: false,
			IWSmelter: true
		});

		this.toolbar = new classes.KGSaveEdit.ui.Toolbar(this);

		this.effectsMgr = new classes.KGSaveEdit.EffectsManager();

		this.OptionsTab = new classes.KGSaveEdit.OptionsTab(this);
		this.calendar = new classes.KGSaveEdit.Calendar(this);
		this.console = new classes.KGSaveEdit.Console(this);
		this.resPool = new classes.KGSaveEdit.Resources(this);
		this.village = new classes.KGSaveEdit.VillageManager(this);
		this.time = new classes.KGSaveEdit.TimeManager(this);

		this.workshop = new classes.KGSaveEdit.WorkshopManager(this);
		this.diplomacy = new classes.KGSaveEdit.DiplomacyManager(this);
		this.bld = new classes.KGSaveEdit.BuildingsManager(this);
		this.science = new classes.KGSaveEdit.ScienceManager(this);
		this.achievements = new classes.KGSaveEdit.AchievementsManager(this);
		this.religion = new classes.KGSaveEdit.ReligionManager(this);
		this.space = new classes.KGSaveEdit.SpaceManager(this);
		this.prestige = new classes.KGSaveEdit.PrestigeManager(this);
		this.stats = new classes.KGSaveEdit.StatsManager(this);

		this.tabs = [this.OptionsTab, this.bld, this.village, this.science, this.workshop,
			this.diplomacy, this.religion, this.space, this.time, this.achievements, this.stats];
		this.managers = [this.workshop, this.diplomacy, this.bld, this.science,
			this.achievements, this.religion, this.space, this.time, this.prestige, this.stats];

		this.render();

		//Store a fresh state, used for resetting state when importing
		this.blankSaveData = this.exportSave();
	},

	render: function () {
		var span = dojo.byId('toolbarBlock');
		dojo.empty(span);
		this.toolbar.render(span);

		var tabContainer = dojo.byId('tabContainer');
		var tabBlocksContainer = dojo.byId('tabBlocksContainer');

		dojo.empty(tabContainer);
		dojo.empty(tabBlocksContainer);

		this.calendar.render();
		this.console.render();

		this.resPool.render();

		for (var i = 0, len = this.tabs.length; i < len; i++) {
			var tab = this.tabs[i];
			tab.renderTab();

			dojo.place(tab.tabWrapper, tabContainer);
			dojo.place(tab.tabBlockNode, tabBlocksContainer);
			tab.renderTabBlock();
		}

		this.callMethods(this.managers, 'render');

		this.calculateAllEffects();
		this.update();
	},


	updateTimeDelay: 5000, //5 seconds
	updateTimer: null,


	update: function (rerun) {
		clearTimeout(this.updateTimer);

		this.brokenIronWill = this.resPool.get('kittens').value > 0;
		for (var i = this.breaksIronWillList.length - 1; !this.brokenIronWill && i >= 0; i--) {
			if (this.breaksIronWillList[i].owned()) {
				this.brokenIronWill = true;
			}
		}

		if (this.brokenIronWill) {
			if (this.ironWill) {
				this.ironWill = false;
			}
		} else if (!this.ironWill && this.ironWillNode.prevChecked) {
			this.ironWill = true;
		}
		this.ironWillNode.checked = this.ironWill;
		this.toggleDisabled(this.ironWillNode, this.brokenIronWill);

		// this.callMethods(this.managers, 'invalidateCachedEffects');
		this.callMethods(this.tabs, 'updateTab');

		this.calendar.update();
		this.resPool.updateMax();

		var tab = this.activeTab;
		if (!tab || !tab.tabNode || dojo.hasClass(tab.tabWrapper, 'hidden')) {
			tab = this.tabs[0];
		}

		if (tab && tab.tabNode) {
			tab.tabNode.click();
		} else {
			dojo.query('.activeTab', 'tabContainer').removeClass('activeTab');
			dojo.query('.tabBlock', 'tabBlocksContainer').addClass('hidden');
		}

		this.callMethods(this.managers, 'update', rerun);

		var energyProd = this.getEffect("energyProduction");
		var energyCons = this.getEffect("energyConsumption");

		//recalculate because some building.action()s are directly dependant on energy
		//the game can get away with not doing this because it ticks
		if (energyProd !== this.resPool.energyProd ||
		energyCons !== this.resPool.energyCons) {
			this.resPool.energyProd = energyProd;
			this.resPool.energyCons = energyCons;

			dojo.forEach(this.bld.buildings, function (bld) {
				if (bld.action) {
					bld.action(bld, bld.game);
				}
			});
			dojo.forEach(this.space.allPrograms, function (bld) {
				if (bld.action) {
					bld.action(bld.game, bld);
				}
			});
			this.bld.invalidateCachedEffects();
			this.space.invalidateCachedEffects();
		}

		this.village.update();
		this.resPool.update();
		this.toolbar.update();

		if (rerun) {
			if (dojo.isFunction(this.tooltipUpdateFunc)) {
				this.tooltipUpdateFunc();
			} else {
				dojo.addClass('tooltipBlock', 'hidden');
			}

			this.updateTimer = setTimeout(this.update, this.updateTimeDelay);
		} else {
			// run twice to make sure everything's up to date
			// since some things are dependent on other things being run and it's a complicated mess
			// the game masks this problem because it ticks and renders parts only some of the time
			this.update(true);
			return;
		}
	}
});

});