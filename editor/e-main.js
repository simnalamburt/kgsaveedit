/*global dojo, require, LZString, classes, num*/

require(["dojo/on"], function (on) {
"use strict";

dojo.declare("classes.KGSaveEdit.EffectsManager", null, {
	game: null,

	constructor: function (game) {
		this.game = game;
	},

	effectMeta: function (effectName) {
		var game = this.game;
		for (var i = 0; i < game.resPool.resources.length; i++) {
			var res = game.resPool.resources[i];
			if (effectName.indexOf(res.name) === 0) {
				var resname = res.name;
				var restitle = res.title || resname;
				restitle = restitle.charAt(0).toUpperCase() + restitle.substring(1, restitle.length);
				var type = effectName.substring(resname.length, effectName.length);
			}
		}

		switch (type) {
			/* Worker pseudoeffect */
			case "":
				return {
					//title to be displayed for effect, id if not defined
					title: restitle,
					//effect will be hidden if resource is not unlocked
					resname: resname,
					//value will be affected by opts.usePerSecondValues
					type: "perTick"
				};
			case "PerTick":
				return {
					title: restitle,
					resname: resname,
					type: "perTick"
				};
			case "Max":
				return {
					title: "Max " + restitle,
					resname: resname
				};
			case "Ratio":
				return {
					title: restitle + " bonus",
					resname: resname,
					type: "ratio"
				};
			case "DemandRatio":
				return {
					title: restitle + " demand reduction",
					resname: resname,
					type: "ratio"
				};
			case "PerTickBase":
			case "PerTickBaseSpace":
				return {
					title: restitle + " production",
					resname: resname,
					type: "perTick"
				};
			case "PerTickCon":
			case "PerTickAutoprod":
			case "PerTickProd":
			case "PerTickSpace":
			case "PerTickAutoprodSpace":
				return {
					title: restitle + " conversion",
					resname: resname,
					type: "perTick"
				};
			case "CraftRatio":
				return {
					title: restitle + " craft bonus",
					resname: resname,
					type: "ratio"
				};
			default:
				return 0;
		}
	},

	statics: {
		effectMeta: {
			// Specials meta of resources
			"catnipJobRatio": {
				title: "Farmer tools",
				resName: "catnip",
				type: "ratio"
			},

			"catnipDemandWorkerRatioGlobal": {
				title: "Workers catnip demand reduction",
				resName: "catnip",
				type: "ratio"
			},

			"woodJobRatio": {
				title: "Woodcutter tools",
				resName: "wood",
				type: "ratio"
			},

			"manpowerJobRatio": {
				title: "Hunter tools",
				resName: "manpower",
				type: "ratio"
			},

			"coalRatioGlobal": {
				title: "Coal production penalty",
				resName: "coal",
				type: "ratio"
			},

			"coalRatioGlobalReduction": {
				title: "Coal production penalty reduction",
				resName: "coal",
				type: "ratio"
			},

			"oilReductionRatio": {
				title: "Oil consumption reduction",
				type: "ratio"
			},

			//kittens

			"maxKittens": {
				title: "Kittens"
			},

			"antimatterProduction": {
				title: "Antimatter production",
				type: "perYear"
			},

			"temporalFluxProduction": {
				title: "Temporal Flux production",
				type: "perYear"
			},

			"temporalFluxProductionChronosphere": {
				title: "Chronosphere's temporal flux production",
				type: "perYear"
			},

			// Miscellaneous

			"observatoryRatio": {
				title: "Observatory's science ratio",
				type: "ratio"
			},

			"magnetoBoostRatio": {
				title: "Magneto boost",
				resName: "oil", //this is sort of hack to prevent early spoiler on magnetos
				type: "ratio"
			},

			"learnRatio": {
				title: "Skills learning",
				type: "perTick"
			},

			"refineRatio": {
				title: "Catnip refine bonus",
				type: "ratio"
			},

			"craftRatio": {
				title: "Craft bonus",
				type: "ratio"
			},

			"happiness": {
				title: "Happiness"
			},

			"unhappinessRatio": {
				title: "Unhappiness reduction",
				type: "ratio"
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

			"beaconRelicsPerDay": {
				title: "Relic production",
				type: "perDay"
			},

			"relicPerDay": {
				title: "Relic production",
				type: "perDay"
			},

			"routeSpeed": {
				title: "Space travel speed",
				type: "fixed"
			},

			// energy

			"energyProduction": {
				title: "Energy production",
				type: "energy"
			},
			"energyConsumption": {
				title: "Energy consumption",
				type: "energy"
			},

			"energyProductionRatio": {
				title: "Energy production bonus",
				type: "ratio"
			},

			//production

			"productionRatio": {
				title: "Production bonus",
				type: "ratio"
			},

			"magnetoRatio": {
				title: "Production bonus",
				type: "ratio"
			},

			"spaceRatio": {
				title: "Space production bonus",
				type: "ratio"
			},

			"prodTransferBonus": {
				title: "Transferred production bonus",
				type: "ratio"
			},

			//starEvent

			"starEventChance": {
				title: "Astronomical event chance",
				type: "ratio"
			},

			"starAutoSuccessChance": {
				title: "Auto astronomical event chance",
				type: "ratio"
			},

			//in the tab workshop
			"lumberMillRatio": {
				title: "Lumber Mill bonus",
				type: "ratio"
			},

			"barnRatio": {
				title: "Barn expansion",
				type: "ratio"
			},

			"warehouseRatio": {
				title: "Warehouse expansion",
				type: "ratio"
			},

			"acceleratorRatio": {
				title: "Accelerator expansion",
				type: "ratio"
			},

			"harborRatio": {
				title: "Harbor'ship expansion",
				type: "ratio"
			},

			"harborCoalRatio": {
				title: "Harbor coal expansion",
				type: "ratio"
			},

			"catnipMaxRatio": {
				title: "Catnip storage expansion",
				type: "ratio"
			},

			"hunterRatio": {
				title: "Hunting effectiveness",
				type: "ratio"
			},

			"solarFarmRatio": {
				title: "Solar Farm bonus",
				type: "ratio"
			},

			"shipLimit": {
				title: "Ship limit effect",
				type: "ratio"
			},

			"hutPriceRatio": {
				title: "Hut price reduction",
				type: "ratio"
			},

			"coalSuperRatio": {
				title: "Coal bonus",
				type: "ratio"
			},

			"smelterRatio": {
				title: "Smelter bonus",
				type: "ratio"
			},

			"calcinerRatio": {
				title: "Calciner bonus",
				type: "ratio"
			},

			"calcinerSteelRatio": {
				title: "Calciner steel production",
				type: "ratio"
			},

			"calcinerSteelCraftRatio": {
				title: "Steel plants's calciner bonuss",
				type: "ratio"
			},

			"calcinerSteelReactorBonus": {
				title: "Calciner steel production bonus",
				type: "ratio"
			},

			"libraryRatio": {
				title: "Library bonus",
				type: "ratio"
			},

			"hydroPlantRatio": {
				title: "Hydro Plant bonus",
				type: "ratio"
			},

			"spaceScienceRatio": {
				title: "Space science bonus",
				type: "ratio"
			},

			"oilWellRatio": {
				title: "Oil bonus",
				type: "ratio"
			},

			"unicornsGlobalRatio": {
				title: "Unicorns bonus",
				type: "ratio"
			},

			"biofuelRatio": {
				title: "Bio Fuel bonus",
				type: "ratio"
			},

			"cadBlueprintCraftRatio": {
				title: "Blueprint craft bonus",
				type: "ratio"
			},

			"skillMultiplier": {
				title: "Kitten's skill effect",
				type: "ratio"
			},

			"uraniumRatio": {
				title: "Uranium savings",
				type: "ratio"
			},

			"reactorEnergyRatio": {
				title: "Reactor energy bonus",
				type: "ratio"
			},

			"reactorThoriumPerTick": {
				title: "Reactor thorium consumption",
				type: "perTick"
			},

			"starchartGlobalRatio": {
				title: "Starchart bonus",
				type: "ratio"
			},

			"satnavRatio": {
				title: "Ship's cost savings",
				type: "ratio"
			},

			"broadcastTowerRatio": {
				title: "Broadcast Tower bonus",
				type: "ratio"
			},

			"cultureMaxRatio": {
				title: "Max Culture bonus",
				type: "ratio"
			},

			"lunarOutpostRatio": {
				title: "Lunar Outpost bonus",
				type: "ratio"
			},

			"crackerRatio": {
				title: "Cracker bonus",
				type: "ratio"
			},

			"factoryRefineRatio": {
				title: "Factory refine bonus",
				type: "ratio"
			},

			"timeRatio": {
				title: "Temporal flux bonus",
				type: "ratio"
			},

			"temporalParadoxVoid": {
				title: "Max void",
				type: "perDay"
			},

			"temporalParadoxDay": {
				title: "Day in temporal paradox",
				type: "fixed"
			},

			"temporalParadoxDayBonus": {
				title: "Day in temporal paradox",
				type: "fixed"
			},

			"unicornsRatioReligion": {
				title: "Unicorns bonus",
				type: "ratio"
			},

			"riftChance": {
				title: "Unicorns rift chance",
				type: "fixed"
			},

			"ivoryMeteorChance": {
				title: "Ivory meteor chance",
				type: "fixed"
			},

			"ivoryMeteorRatio": {
				title: "Ivory meteor bonus",
				type: "ratio"
			},

			"alicornChance": {
				title: "Alicorns descent chance",
				type: "fixed"
			},

			"tcRefineRatio": {
				title: "Alicorns sacrifice bonus",
				type: "ratio"
			},

			"corruptionRatio": {
				title: "Corruption ratio",
				type: "ratio"
			},

			"cultureMaxRatioBonus": {
				title: "Ziggurat's max culture bonus",
				type: "ratio"
			},

			"faithRatioReligion": {
				title: "Faith bonus",
				type: "ratio"
			},

			"relicRefineRatio": {
				title: "Relic refine bonus",
				type: "ratio"
			},

			"blsLimit": {
				title: "Max BLS",
				type: "integerRatio"
			},

			"globalResourceRatio": {
				title: "Max resources bonus",
				type: "ratio"
			},

            "shatterTCGain": {
                title: "Shatter TC resources retrieved",
                type: "ratio"
            },

            "rrRatio": {
                title: "Shatter TC resources retrieval bonus",
                type: "ratio"
            },

			"priceRatio": {
				title: "Building's prices",
				type: "ratio"
			},

			"kittenGrowthRatio": {
				title: "Kittens birth rate",
				type: "ratio"
			},

			"t1CraftRatio": {
				title: "Class 1 engineer's know-how",
				type: "fixed"
			},

			"t2CraftRatio": {
				title: "Class 2 engineer's know-how",
				type: "fixed"
			},

			"t3CraftRatio": {
				title: "Class 3 engineer's know-how",
				type: "fixed"
			},

			"t4CraftRatio": {
				title: "Class 4 engineer's know-how",
				type: "fixed"
			},

			"t5CraftRatio": {
				title: "Class 5 engineer's know-how",
				type: "fixed"
			},

			// cycleEffects
			"spaceElevator-prodTransferBonus": {
				title: "Space Elevator - Transferred cath production bonus",
				type: "ratio"
			},

			"sattelite-starchartPerTickBaseSpace": {
				title: "Satellite - Starchart production",
				type: "ratio"
			},

			"sattelite-observatoryRatio": {
				title: "Satellite - Observatory's science ratio",
				type: "ratio"
			},

			"spaceStation-scienceRatio": {
				title: "Space Station - Science bonus",
				type: "ratio"
			},

			"moonOutpost-unobtainiumPerTickSpace": {
				title: "Lunar Outpost - Unobtainium conversion",
				type: "ratio"
			},

			"planetCracker-uraniumPerTickSpace": {
				title: "Planet Cracker - Uranium conversion",
				type: "ratio"
			},

			"hydrofracturer-oilPerTickAutoprodSpace": {
				title: "Hydraulic Fracturer - Oil conversion",
				type: "ratio"
			},

			"researchVessel-starchartPerTickBaseSpace": {
				title: "Research Vessel - Starchart production",
				type: "ratio"
			},

			"sunlifter-energyProduction": {
				title: "Sunlifter - Energy production",
				type: "ratio"
			},

			"spaceBeacon-starchartPerTickBaseSpace": {
				title: "Space Beacon - Starchart production",
				type: "ratio"
			}

		}
	}
});


dojo.declare("classes.KGSaveEdit.SaveEdit", classes.KGSaveEdit.core, {
	rate: 5,

	karmaKittens: 0,
	karmaZebras: 0,
	paragonPoints: 0,
	deadKittens: 0,
	ironWill: true,
	cheatMode: false,

	saveVersion: 15,

	opts: null,

	isCMBREnabled: false,

	colorScheme: "",
	forceShowLimits: false,
	useWorkers: false,

	tabs: null,
	managers: null,

	editorOptions: { //options about the editor
		fixStats: true, //automatically calculate certain stats that may be off due to the game not tracking them before they existed
		includeSpentParagon: true, //include price of researched metaphysics perks when calculating the totalParagon stat
		showAllKittenSkills: true //show all of a kitten's job skills in the census (game caps at displaying three jobs)
	},

	rand: function (ratio) {
		return Math.floor(Math.random() * ratio);
	},

	//shamelessly copied from Sandcastle Builder code
	postfixes: [
		{limit: 1e210, divisor: 1e210, postfix: ["Q", " Quita"]},
		{limit:  1e42, divisor:  1e42, postfix: ["W", " Wololo"]},
		{limit:  1e39, divisor:  1e39, postfix: ["L", " Lotta"]},
		{limit:  1e36, divisor:  1e36, postfix: ["F", " Ferro"]},
		{limit:  1e33, divisor:  1e33, postfix: ["H", " Helo"]}, //or Ballard
		{limit:  1e30, divisor:  1e30, postfix: ["S", " Squilli"]},
		{limit:  1e27, divisor:  1e27, postfix: ["U", " Umpty"]},
		{limit:  1e24, divisor:  1e24, postfix: ["Y", " Yotta"]},
		{limit:  1e21, divisor:  1e21, postfix: ["Z", " Zeta"]},
		{limit:  1e18, divisor:  1e18, postfix: ["E", " Exa"]},
		{limit:  1e15, divisor:  1e15, postfix: ["P", " Peta"]},
		{limit:  1e12, divisor:  1e12, postfix: ["T", " Tera"]},
		{limit:   1e9, divisor:   1e9, postfix: ["G", " Giga"]},
		{limit:   1e6, divisor:   1e6, postfix: ["M", " Mega"]},
		{limit:   9e3, divisor:   1e3, postfix: ["K", " Kilo"]} //WHAT
	],

	/**
	 * Parses a input element's .value into a numeric value with a minimum of 0
	 * Strips all non-alphanumeric, non-"+", "-", or "." characters and parseFloat()s
	 * Can read a single display postfix if the input displays its value with postfixes
	**/
	parseInput: function (ele) {
		if (ele.type !== "text" || dojo.hasClass(ele, "textInput")) {
			return ele.value;
		}

		var str = ele.value.replace(/[^\d\-\+\.A-Z]/gi, "");
		var value = parseFloat(str);

		if (dojo.hasClass(ele, "abbrInput") && !isNaN(value) && /\d[A-Z]$/i.test(str)) {
			var post = str.slice(-1).toUpperCase();
			for (var i = 0, len = ele.game.postfixes.length; i < len; i++) {
				var p = ele.game.postfixes[i];
				if (post === p.postfix[0]) {
					value *= p.divisor;
					break;
				}
			}
		}

		if (dojo.hasClass(ele, "integerInput")) {
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

		if (ele.nodeName.toLowerCase() === "select") {
			fn = this.setSelectByValue;
		} else if (ele.type === "checkbox") {
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
		if (dojo.hasClass(ele, "textInput")) {
			if (typeof value === "string" && ele !== document.activeElement) {
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
		var abbr = dojo.hasClass(ele, "abbrInput");

		if (ele !== document.activeElement) {
			var displayValue = value;
			if (ele.displayFn) {
				displayValue = ele.displayFn(value);
			} else if (abbr) {
				displayValue = this.getDisplayValueExt(value);
			}
			ele.value = displayValue;
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
		if (!ele || ele.type !== "checkbox") {
			return;
		}
		ele.indeterminate = false;
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
		if (!option && "defaultVal" in ele) {
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
	toggleDisabled: function (ele, disabled, extraClass) {
		if (!ele) {
			return;
		}
		ele.disabled = disabled;
		dojo.toggleClass(ele.parentNode, "locked", Boolean(disabled));
		if (extraClass) {
			dojo.toggleClass(ele.parentNode, extraClass, Boolean(disabled));
		}
	},

	/**
	 * Clones an array of meta objects by passing them through filterMetaObj
	 */
	filterMetadata: function (meta, fields, callback) {
		var filtered = [];
		for (var i = 0, len = meta.length; i < len; i++) {
			var clone = this.filterMetaObj(meta[i], fields, callback);
			filtered.push(clone);
		}
		return filtered;
	},

	/**
	 * Clones an object, but only the keys in the fields array
	 * Calls callback in the context of the object if passed
	 */
	filterMetaObj: function (meta, fields, callback) {
		var clone = {};
		for (var i = 0, len = fields.length; i < len; i++) {
			clone[fields[i]] = meta[fields[i]];
		}
		if (dojo.isFunction(callback)) {
			callback.call(meta, clone);
		}
		return clone;
	},

	toDisplayDays: function (daysRaw) {
		var daysNum = parseInt(daysRaw, 10); // don't forget the second param

		var years = Math.floor(daysNum / (4 * 100));
		var days = daysNum - (years * 4 * 100);

		if (years > 0) {
			years = this.getDisplayValueExt(years);
		}

		var timeFormated = "";
		if (years) { timeFormated = years + "y "; }
		if (days) { timeFormated += days + "d "; }

		return timeFormated;
	},

	toDisplayPercentage: function (percentage, precision, precisionFixed) {
		percentage *= 100;
		if (precisionFixed) {
			// Prevent 100% whereas it's not really reached
			percentage -= 1 / Math.pow(10, precision);
			if (percentage < 0) {
				percentage = 0;
			}
		} else {
			percentage = this.fixFloatPointNumber(percentage);
			// Seek optimal precision
			if (percentage - Math.floor(percentage) !== 0) {
				precision = 1;
				if (percentage * 10 - Math.floor(percentage * 10) !== 0) {
					precision = 2;
					if (percentage * 100 - Math.floor(percentage * 100) !== 0) {
						precision = 3;
						if (percentage * 1000 - Math.floor(percentage * 1000) !== 0) {
							precision = 4;
							if (percentage * 10000 - Math.floor(percentage * 10000) !== 0) {
								precision = 5;
								if (percentage * 100000 - Math.floor(percentage * 100000) !== 0) {
									precision = 6;
									if (percentage * 1000000 - Math.floor(percentage * 1000000) !== 0) {
										precision = 7;
										if (percentage * 10000000 - Math.floor(percentage * 10000000) !== 0) {
											precision = 8;
										}
									}
								}
							}
						}
					}
				}
			}
		}

		return percentage.toFixed(precision);
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

		var mantisa = "";

		if (floatVal != 0) {
			var absVal = Math.abs(floatVal);
			if (absVal < 0.01 && precision === 2 || absVal < 0.001 && precision === 3) {
				mantisa = "(...)";
			}
		}

		if (!floatVal.toFixed) {
			return plusSign + floatVal;
		}

		if (floatVal.toFixed() == floatVal) {
			var toFixed = floatVal.toFixed();
			return plusSign + toFixed;
		} else {
			toFixed = floatVal.toFixed(precision);
			return plusSign + toFixed + mantisa;
		}
	},

	fixFloatPointNumber: function (number) {
		// Adjust value because of floating-point error
		var numberAdjusted = Math.floor(number * 10000000) / 10000000;
		if (Math.round((number - numberAdjusted) * 10000000)) {
			numberAdjusted = Math.floor((number + 0.000000000000010) * 10000000) / 10000000;
		}
		return numberAdjusted;
	},

	getUnlockByName: function (unlockId, type) {
		switch (type) {
			case "tech":
				return this.science.get(unlockId);
			case "jobs":
				return this.village.getJob(unlockId);
			case "crafts":
				return this.workshop.getCraft(unlockId);
			case "upgrades":
				return this.workshop.get(unlockId);
			/* case "tabs":
				return this.getTab(unlockId); */
			case "buildings":
				return this.bld.get(unlockId);
			case "stages":
				return this.bld.get(unlockId.bld);
			case "program":
			case "spaceMission":
			case "spaceBuilding":
				return this.space.getProgram(unlockId);
			case "perks":
				return this.prestige.getPerk(unlockId);
			case "zigguratUpgrades":
				return this.religion.getZU(unlockId);
			case "religionUpgrades":
				return this.religion.getRU(unlockId);
			case "chronoforge":
				return this.time.getCFU(unlockId);
			case "voidSpace":
				return this.time.getVSU(unlockId);
			default:
				console.log("Couldn't get unlock ", unlockId, " of type ", type);
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
						if (type === "spaceBuilding") {
							this.calendar.cycleEffectsBasics(meta.effects, meta.name);
						}
					}
					if (meta.metaObj && meta.metaObj.invalidateCachedEffects) {
						meta.metaObj.invalidateCachedEffects();
					}
				}
			}
		}
	},

	getRateUI: function () {
		return this.rate;
	},

	calculateAllEffects: function () {
		this.workshop.invalidateCachedEffects();
		this.prestige.invalidateCachedEffects();
		this.religion.invalidateCachedEffects();
		this.space.invalidateCachedEffects();
		this.time.invalidateCachedEffects();

		// TODO: delegate this to managers? Can't be done in load unfortunately.
		this.upgradeItems({
			buildings: this.bld.buildingsNames,
			program: this.space.allPrograms,
			jobs: this.village.jobNames
		});
	},

	getTriValue: function (value, stripe) {
		return (Math.sqrt(1 + 8 * value / stripe) - 1) / 2;
	},

	getTriValueOrigin: function (value, stripe) {
		return (Math.pow(value * 2 + 1, 2) - 1) * stripe / 8;
	},

	//CMBR is capped by 20%

	getCMBRBonus: function () {
		if (this.isCMBREnabled) {
			return this.getHyperbolicEffect(1.0, 0.2);
		}
		return 0;
	},

	getCraftRatio: function () {
		return this.getEffect("craftRatio") + this.village.getEffectLeader("engineer", 0);
	},

	getResCraftRatio: function (res) {
		if (res.name === "wood") {
			var refineRatio = this.getEffect("refineRatio");
			if (this.ironWill) {
				return ((1 + refineRatio) * (1 + this.getEffect("woodRatio"))) - 1;
			} else {
				return refineRatio;
			}
		}

		var ratio = this.getCraftRatio();

		if (res.name === "blueprint") {
			var bpRatio = this.getEffect("cadBlueprintCraftRatio");
			var scienceBldAmt = this.bld.get("library").val + this.bld.get("academy").val +
				this.bld.get("observatory").val + this.bld.get("biolab").val;

			ratio += scienceBldAmt * bpRatio;
		}

		if (res.name == "kerosene") {
			var fRatio = this.getEffect("factoryRefineRatio");

			var amt = this.bld.get("factory").on;

			ratio *= (1 + amt * fRatio * 0.75);	//25% penalty
		}

		//get resource specific craft ratio (like factory bonus)
		var resCraftRatio = this.getEffect(res.name + "CraftRatio") || 0;

		return ratio + resCraftRatio;
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
		var priceItemNode = dojo.create("div", {class: "tooltipPriceNode"}, tooltip);

		var res = this.resPool.get(price.name);
		var resValue = res.getValue();
		var hasRes = (resValue >= price.val);


		var nameSpan = dojo.create("span", {
			class: "tooltipPriceName",
			innerHTML: res.title || res.name
		}, priceItemNode);

		var asterisk = res.maxValue && ((price.val > res.maxValue && !indent) || price.baseVal > res.maxValue) ? "*" : ""; //mark limit issues with asterisk

		var priceSpan = dojo.create("span", {
			class: "tooltipPriceSpan" + (hasRes ? "" : " noRes"),
			innerHTML: hasRes ? this.getDisplayValueExt(price.val) :
				this.getDisplayValueExt(resValue) + " / " + this.getDisplayValueExt(price.val) + asterisk
		}, priceItemNode);

		var resPerTick = this.getResourcePerTick(res.name, true);
		if (!hasRes && resPerTick > 0) {
			var eta = (price.val - resValue) / (resPerTick * this.rate);
			if (eta >= 1) {
				priceSpan.textContent += " (" + this.toDisplaySeconds(eta) + ")";
			}
		}


		//unroll prices to the raw resources
		if (!hasRes && res.craftable && res.name !== "wood") {
			var craft = this.workshop.getCraft(res.name);
			if (craft.unlocked) {
				var craftRatio = this.getResCraftRatio(res);
				nameSpan.textContent = "+ " + nameSpan.textContent;

				if (!indent) {
					indent = 1;
				}

				var components = this.workshop.getCraftPrice(craft);
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
		if (Object.keys(effectsList).length === 0) {
			return;
		}

		if (!hideTitle) {
			dojo.create("div", {
				class: "tooltipEffectsTitle",
				innerHTML: "Effects:"
			}, tooltip);
		}

		//-----------------------------------------

		for (var effectName in effectsList) {
			var effectValue = effectsList[effectName];
			if (effectValue !== 0) {
				var effectMeta = this.getEffectMeta(effectName);
				var effectClass = "tooltipEffect";

				if (!effectMeta) {
					effectMeta = {};
				}
				var displayEffectName = effectMeta.title || effectName;

				var res = this.resPool.get(effectMeta.resName);

				if (effectMeta.resName && res && !res.unlocked) {
					effectClass += " spoiler"; //mark resource-related effects if we did not unlocked this effect yet
				}

				//display resMax values with global ratios like Refrigeration and Paragon
				if (effectName.substr(-3) === "Max") {
					res = res || this.game.resPool.get(effectName.slice(0, -3));
					if (res) {
						effectValue = this.game.resPool.addResMaxRatios(res, effectValue);
					}
				}

				var displayEffectValue;

				if (effectMeta.type === "perTick" && this.opts.usePerSecondValues) {
					displayEffectValue = this.getDisplayValueExt(effectValue * this.rate) + "/sec";
				} else if (effectMeta.type === "perDay") {
					displayEffectValue = this.getDisplayValueExt(effectValue) + "/day";
				} else if (effectMeta.type === "perYear") {
					displayEffectValue = this.getDisplayValueExt(effectValue) + "/year";
				} else if (effectMeta.type === "ratio") {
					displayEffectValue = this.toDisplayPercentage(effectValue, 0, false) + "%";
				} else if (effectMeta.type === "integerRatio") {
					displayEffectValue = this.getDisplayValueExt(effectValue) + "%";
				} else if (effectMeta.type === "energy") {
					displayEffectValue = this.getDisplayValueExt(effectValue) + "Wt";
				} else {
					displayEffectValue = this.getDisplayValueExt(effectValue);
				}

				dojo.create("div", {
					class: effectClass,
					innerHTML: displayEffectName + ": " + displayEffectValue
				}, tooltip);
			}
		}
	},

	getEffectMeta: function (effectName) {
		// Try to create Meta automatically, if it fails, check statics, if it fails, by default
		var effectMeta = this.effectsMgr.effectMeta(effectName);
		if (!effectMeta) {
			effectMeta = this.effectsMgr.statics.effectMeta[effectName] || {title: effectName};
		}
		return effectMeta;
	},

	getEffect: function (effectName) {
		var effect =
			this.bld.getEffect(effectName) +
			this.space.getEffect(effectName) +
			this.workshop.getEffect(effectName) +
			this.prestige.getEffect(effectName) +
			this.religion.getEffect(effectName) +
			this.time.getEffect(effectName);
		return effect;
	},

	getHyperbolicEffect: function (effect, limit) {
		var absEffect = Math.abs(effect);
		var maxUndiminished = 0.75 * limit; //first 75% is free from diminishing returns
		if (absEffect <= maxUndiminished) {
			//Not high enough for diminishing returns to apply
			return effect < 0 ? -absEffect : absEffect;
		}

		var diminishedPortion = absEffect - maxUndiminished;
		var delta = 0.25 * limit; //Lower values will approach 1 more quickly.
		// The last 25% will approach .25 but cannot actually reach it
		var diminishedEffect = (1 - (delta / (diminishedPortion + delta))) * 0.25 * limit;
		var totalEffect = maxUndiminished + diminishedEffect;
		return effect < 0 ? -totalEffect : totalEffect;
	},

	isHyperbolic: function (name) {
		return (name === "catnipDemandRatio" ||
			name === "fursDemandRatio" ||
			name === "ivoryDemandRatio" ||
			name === "spiceDemandRatio" ||
			name === "unhappinessRatio");
	},

	getDetailedResMap: function (res) {
		var resString = "";
		var resStack = this.getResourcePerTickStack(res.name);

		resString = this.processResourcePerTickStack(resStack, res, 0);

		var resPertick = this.getResourcePerTick(res.name, true);

		if (this.opts.usePercentageResourceValues) {
			resString += "<br> Net gain: " + this.getDisplayValueExt(resPertick, true, true);
		}

		if (resPertick < 0) {
			var toZero = res.value / (-resPertick * this.getRateUI());
			resString += "<br>To zero: " + this.toDisplaySeconds(toZero.toFixed());
		} else {
			if (res.maxValue && res.value < res.maxValue) {
				var toCap = (res.maxValue - res.value) / (resPertick * this.getRateUI());
				if (toCap) {
					resString += "<br>To cap: " + this.toDisplaySeconds(toCap.toFixed());
				}
			}
		}
		return resString;
	},

	processResourcePerTickStack: function (resStack, res, depth) {
		var resString = "";
		var hasFixed = false;

		for (var i = 0, len = resStack.length; i < len; i++) {
			var stackElem = resStack[i];

			if (stackElem.length) {
				var subStack = this.processResourcePerTickStack(stackElem, res, depth + 1);
				if (subStack.length) {
					resString += subStack;
					hasFixed = true;
				}
			}

			if (!stackElem.value || (stackElem.type === "ratio" && !hasFixed)) {
				continue;
			}

			if (i !== 0) {
				for (var j = 0; j < depth; j++) {
					resString += "|-> ";
				}
			}

			resString += this.getStackElemString(stackElem, res);
			if (stackElem.type === "fixed") {
				hasFixed = true;
			}
		}

		return resString;
	},

	getStackElemString: function (stackElem) {
		var resString = stackElem.name + ":&nbsp;<div style=\"float: right;\">";

		if (stackElem.type === "fixed") {
			resString += this.getDisplayValueExt(stackElem.value, true, true);
		} else {
			resString += this.getDisplayValueExt((stackElem.value * 100).toFixed(), true) + "%";
		}

		resString += "</div><br>";

		return resString;
	},

	getResourcePerTick: function (resName, withConversion) {
		var res = this.resPool.get(resName);
		if (res.calculatePerTick) {
			return withConversion ? res.perTickCached + this.getResourcePerTickConvertion(res.name) : res.perTickCached;
		} else {
			return 0;
		}
	},

	getResourcePerTickConvertion: function (resName) {
		return this.fixFloatPointNumber(this.getEffect(resName + "PerTickCon"));
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
		var res = this.resPool.get(resName);

		// BUILDING PerTickBase
		var perTick = this.getEffect(resName + "PerTickBase");

		// SPACE RATIO CALCULATION
		var spaceRatio = 1 + this.getEffect("spaceRatio");
		if (this.workshop.get("spaceManufacturing").owned() && resName !== "uranium") {
			var factory = this.bld.get("factory");
			spaceRatio *= (1 + factory.getOn() * factory.effects["craftRatio"] * 0.75);
		}

		// +SPACE PerTickBase
		var perTickBaseSpace = this.getEffect(resName + "PerTickBaseSpace") * spaceRatio;

		perTick += perTickBaseSpace;

		// *SEASON MODIFIERS
		if (!season) {
			season = this.calendar.getCurSeason();
		}
		var weatherMod = this.calendar.getWeatherMod();
		weatherMod = (season.modifiers[resName] + weatherMod);
		if (weatherMod < -0.95) {
			weatherMod = -0.95;
		}

		if (season.modifiers[resName]) {
			perTick *= weatherMod;
		}

		// +VILLAGE JOB PRODUCTION
		var resMapProduction = this.village.getResProduction();
		var resProduction = resMapProduction[resName] ? resMapProduction[resName] : 0;

		perTick += resProduction;

		// +VILLAGE JOB PRODUCTION (UPGRADE EFFECTS JOBS)
		var workshopResRatio = this.getEffect(resName + "JobRatio");

		perTick += resProduction * workshopResRatio;

		// +*BEFORE PRODUCTION BOOST (UPGRADE EFFECTS GLOBAL)
		perTick *= 1 + this.getEffect(resName + "GlobalRatio");

		// +*BUILDINGS AND SPACE PRODUCTION
		perTick *= 1 + this.getEffect(resName + "Ratio");

		// +*RELIGION EFFECTS
		perTick *= 1 + this.getEffect(resName + "RatioReligion");

		// +*AFTER PRODUCTION BOOST (UPGRADE EFFECTS SUPER)
		perTick *= 1 + this.getEffect(resName + "SuperRatio");

		// +*AFTER PRODUCTION REDUCTION (SPECIAL STEAMWORKS HACK FOR COAL)
		var steamworks = this.bld.get("steamworks");
		var steamworksOn = steamworks.getOn();
		var swEffectGlobal = steamworks.effects[resName + "RatioGlobal"];
		if (steamworksOn > 0 && swEffectGlobal) {
			perTick *= 1 + swEffectGlobal;
		}

		// *PARAGON BONUS
		var paragonProductionRatio = this.prestige.getParagonProductionRatio();
		if (resName === "catnip" && this.challenges.currentChallenge === "winterIsComing") {
			paragonProductionRatio = 0; //winter has come
		}

		perTick *= 1 + paragonProductionRatio;

		//ParagonSpaceProductionRatio definition 1/4
		var paragonSpaceProductionRatio = 1 + paragonProductionRatio * 0.05;

		// +BUILDING AUTOPROD
		var perTickAutoprod = this.getEffect(resName + "PerTickAutoprod");
		perTickAutoprod *= paragonSpaceProductionRatio;

		perTick += perTickAutoprod;

		// *MAGNETOS PRODUCTION BONUS
		if (!res.transient && this.bld.get("magneto").getOn() > 0 && resName !== "catnip") {

			var swRatio = steamworksOn > 0 ? (1 + steamworks.effects["magnetoBoostRatio"] * steamworksOn) : 1;
			if (resName !== "oil") {
				perTick *= 1 + (this.getEffect("magnetoRatio") * swRatio);
			}

			//ParagonSpaceProductionRatio definition 2/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("magnetoRatio") * swRatio; //These special cases need to die in a hole
		}

		// +*REACTOR PRODUCTION BONUS
		if (!res.transient && resName !== "uranium" && resName !== "catnip") {
			perTick *= 1 + this.getEffect("productionRatio");

			//ParagonSpaceProductionRatio definition 3/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("productionRatio");
		}

		// +*FAITH BONUS
		var religionProductionBonus = this.religion.getProductionBonus();
		perTick *= 1 + (religionProductionBonus / 100);

		//+COSMIC RADIATION
		if (!this.opts.disableCMBR) {
			perTick *= (1 + this.getCMBRBonus());
		}

		//ParagonSpaceProductionRatio definition 4/4
		paragonSpaceProductionRatio += paragonSpaceProductionRatio * religionProductionBonus / 100;

		// +AUTOMATED PRODUCTION BUILDING
		perTick += this.getEffect(resName + "PerTickProd");

		// +AUTOMATED PRODUCTION SPACE (FULL BONUS)
		perTick += (this.getEffect(resName + "PerTickAutoprodSpace") * spaceRatio) * (1 + (paragonSpaceProductionRatio - 1) * this.getEffect("prodTransferBonus"));
		// +AUTOMATED PRODUCTION SPACE (NOT FULL BONUS)
		perTick += this.getEffect(resName + "PerTickSpace") * spaceRatio;

		//CYCLE EFFECTS
		// Already added because it's space building improvements.

		//CYCLE FESTIVAL EFFECTS

		var effects = {};
		effects[resName] = perTick;
		this.calendar.cycleEffectsFestival(effects);
		perTick = effects[resName];

		// +BUILDING AND SPACE PerTick
		perTick += this.getEffect(resName + "PerTick");

		// -EARTH CONSUMPTION
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[resName] || 0;
		resConsumption *= 1 + this.getEffect(resName + "DemandRatio");
		if (resName === "catnip" && this.village.kittens.length > 0 && this.village.happiness > 1) {
			if (this.challenges.currentChallenge === "anarchy") {
				resConsumption += resConsumption * this.village.happiness * (1 + this.getEffect(resName + "DemandWorkerRatioGlobal"));
			} else {
				resConsumption += resConsumption * (this.village.happiness - 1) * (1 + this.getEffect(resName + "DemandWorkerRatioGlobal")) * (1 - this.village.getFreeKittens() / this.village.kittens.length);
			}
		}

		perTick += resConsumption;

		if (isNaN(perTick)) {
			return 0;
		}

		return perTick;
	},

	getResourcePerTickStack: function (resName, calcAutomatedEffect, season) {
		var res = this.resPool.get(resName);

		var stack = [];

		// BUILDING PerTickBase
		stack.push({
			name: "Production",
			type: "fixed",
			value: this.getEffect(resName + "PerTickBase")
		});

		// SPACE RATIO CALCULATION
		var spaceRatio = 1 + this.getEffect("spaceRatio");
		if (this.workshop.get("spaceManufacturing").owned() && resName !== "uranium") {
			var factory = this.bld.get("factory");
			spaceRatio *= (1 + factory.getOn() * factory.effects["craftRatio"] * 0.75);
			spaceRatio -= 1;
		}

		// +SPACE PerTickBase
		var perTickBaseSpaceStack = [{
				name: "Space Production",
				type: "fixed",
				value: this.getEffect(resName + "PerTickBaseSpace")
			}, {
				name: "Space production bonus",
				type: "ratio",
				value: spaceRatio - 1
		}];
		stack.push(perTickBaseSpaceStack);

		// *SEASON MODIFIERS
		if (!season) {
			season = this.calendar.getCurSeason();
		}
		var weatherMod = this.calendar.getWeatherMod();
		weatherMod = (season.modifiers[resName] + weatherMod);
		if (weatherMod < -0.95) {
			weatherMod = -0.95;
		}

		stack.push({
			name: "Weather",
			type: "ratio",
			value: weatherMod - 1
		});

		// +VILLAGE JOB PRODUCTION
		var resMapProduction = this.village.getResProduction();
		var villageStack = [{
				name: "(:3) Village",
				type: "fixed",
				value: resMapProduction[resName] || 0
			}, {
				name: "Tools",
				type: "ratio",
				value: this.getEffect(resName + "JobRatio")
		}];
		stack.push(villageStack);

		// +*BEFORE PRODUCTION BOOST (UPGRADE EFFECTS GLOBAL)
		stack.push({
			name: "Upgrades",
			type: "ratio",
			value: this.getEffect(resName + "GlobalRatio")
		});

		// +*BUILDINGS AND SPACE PRODUCTION
		stack.push({
			name: "Buildings",
			type: "ratio",
			value: this.getEffect(resName + "Ratio")
		});

		// +*RELIGION EFFECTS
		stack.push({
			name: "Religion",
			type: "ratio",
			value: this.getEffect(resName + "RatioReligion")
		});

		// +*AFTER PRODUCTION BOOST (UPGRADE EFFECTS SUPER)
		stack.push({
			name: "Boost",
			type: "ratio",
			value: this.getEffect(resName + "SuperRatio")
		});

		// +*AFTER PRODUCTION REDUCTION (SPECIAL STEAMWORKS HACK FOR COAL)
		var steamworks = this.bld.get("steamworks");
		var steamworksOn = steamworks.getOn();
		var swEffectGlobal = steamworks.effects[resName + "RatioGlobal"];
		if (steamworksOn > 0 && swEffectGlobal) {
			stack.push({
				name: "Steamworks",
				type: "ratio",
				value: swEffectGlobal
			});
		}

		// *PARAGON BONUS
		var paragonProductionRatio = this.prestige.getParagonProductionRatio();
		if (resName === "catnip" && this.challenges.currentChallenge === "winterIsComing") {
			paragonProductionRatio = 0; //winter has come
		}

		stack.push({
			name: "Paragon",
			type: "ratio",
			value: paragonProductionRatio
		});

		//ParagonSpaceProductionRatio definition 1/4
		var paragonSpaceProductionRatio = 1 + paragonProductionRatio * 0.05;

		// +BUILDING AUTOPROD
		var buildingAutoprod = [{
				name: "Conversion Production",
				type: "fixed",
				value: this.getEffect(resName + "PerTickAutoprod")
			}, {
				name: "Paragon",
				type: "ratio",
				value: paragonProductionRatio * 0.05
		}];
		stack.push(buildingAutoprod);

		// *MAGNETOS PRODUCTION BONUS
		if (!res.transient && this.bld.get("magneto").on > 0 && resName !== "catnip") {

			var swRatio = steamworksOn > 0 ? (1 + steamworks.effects["magnetoBoostRatio"] * steamworksOn) : 1;
			if (resName !== "oil") {
				stack.push({
					name: "Magnetos",
					type: "ratio",
					value: this.getEffect("magnetoRatio") * swRatio
				});
			}

			//ParagonSpaceProductionRatio definition 2/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("magnetoRatio") * swRatio; //These special cases need to die in a hole
		}

		// +*REACTOR PRODUCTION BONUS
		if (!res.transient && resName !== "uranium" && resName !== "catnip") {
			stack.push({
				name: "Reactors",
				type: "ratio",
				value: this.getEffect("productionRatio")
			});

			//ParagonSpaceProductionRatio definition 3/4
			paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.getEffect("productionRatio");

		}

		// +*FAITH BONUS
		stack.push({
			name: "Faith",
			type: "ratio",
			value: this.religion.getProductionBonus() / 100
		});

		//ParagonSpaceProductionRatio definition 4/4
		paragonSpaceProductionRatio += paragonSpaceProductionRatio * this.religion.getProductionBonus() / 100;

		// +AUTOMATED PRODUCTION BUILDING
		stack.push({
			name: "Conversion Production",
			type: "fixed",
			value: this.getEffect(resName + "PerTickProd")
		});
		stack.push({ // extra-compare with this.calcResourcePerTick
			name: "Conversion Consumption",
			type: "fixed",
			value: this.getEffect(resName + "PerTickCon")
		});

		// +AUTOMATED PRODUCTION SPACE
		var perTickAutoprodSpaceStack = [{
				name: "Space Conversion Production",
				type: "fixed",
				value: this.getEffect(resName + "PerTickAutoprodSpace")
			}, {
				name: "Space production bonus",
				type: "ratio",
				value: spaceRatio - 1
			}, {
				name: "Space Paragon",
				type: "ratio",
				value: paragonSpaceProductionRatio - 1
			}, {
				name: "Bonus Transferred",
				type: "ratio",
				value: this.getEffect("prodTransferBonus")
		}];
		stack.push(perTickAutoprodSpaceStack);

		// +AUTOMATED PRODUCTION SPACE
		var perTickSpace = [{
				name: "Space Conversion Production",
				type: "fixed",
				value: this.getEffect(resName + "PerTickSpace")
			}, {
				name: "Space production bonus",
				type: "ratio",
				value: spaceRatio - 1
		}];
		stack.push(perTickSpace);

		//CYCLE EFFECT
		// Can't be displayed because it's space building improvements.

		//CYCLE FESTIVAL EFFECTS
		var effects = {};
		effects[resName] = 1;
		this.calendar.cycleEffectsFestival(effects);
		var cycleEffect = effects[resName] - 1;

		stack.push({
			name: "Cycle Festival Effect",
			type: "ratio",
			value: cycleEffect
		});

		// +BUILDING AND SPACE PerTick
		stack.push({
			name: "Without Improvement",
			type: "fixed",
			value: this.getEffect(resName + "PerTick")
		});

		// +CRAFTING JOB PRODUCTION
		stack.push({
			name: "(:3) Engineer",
			type: "fixed",
			value: this.workshop.getEffectEngineer(resName, true)
		});

		// -EARTH CONSUMPTION && -SPACE CONSUMPTION
		var resMapConsumption = this.village.getResConsumption();
		var resConsumption = resMapConsumption[resName] || 0;
		resConsumption *= 1 + this.getEffect(resName + "DemandRatio");
		if (resName === "catnip" && this.village.kittens.length > 0 && this.village.happiness > 1) {
			if (this.challenges.currentChallenge === "anarchy") {
				resConsumption += resConsumption * this.village.happiness * (1 + this.getEffect(resName + "DemandWorkerRatioGlobal"));
			} else {
				resConsumption += resConsumption * (this.village.happiness - 1) * (1 + this.getEffect(resName + "DemandWorkerRatioGlobal")) * (1 - this.village.getFreeKittens() / this.village.kittens.length);
			}
		}

		stack.push({
			name: "(:3) Demand",
			type: "fixed",
			value: resConsumption
		});

		// TIME extra-compare with this.calcResourcePerTick
		stack.push({
			name: "Time",
			type: "ratio",
			value: (this.getRateUI() - this.rate) / this.rate
		});

		return stack;
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

		var metaReqs = meta[isStage ? "stageRequires" : "requires"];
		if (!metaReqs) {
			if (defaultUnlocked !== undefined && defaultUnlocked !== null) {
				return Boolean(defaultUnlocked);
			}
			return Boolean(meta[isStage ? "stageUnlocked" : "unlocked"]);
		}

		if (dojo.isFunction(metaReqs)) {
			return meta.requires(this);
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

	_toggleLightbox: function (ele) {
		dojo.query(".lightbox").addClass("hidden");
		if (ele && dojo.hasClass(ele, "lightbox")) {
			dojo.removeClass(ele, "hidden");
		}
	},

	_createLinkList: function (metaObj, parentNode, listData, handler) {
		var game = this;

		var data = listData[0];
		var root = dojo.create("div", {
			class: "linkListRoot",
			innerHTML: "<a>" + data.html + "</a>"
		}, parentNode);
		root.children[0].valueProp = data.value;

		var tooltip = dojo.create("div", {
			class: "linkListTooltip"
		}, root);

		for (var i = 1; i < listData.length; i++) {
			data = listData[i];
			var link = dojo.create("div", {
				class: "linkListTooltipLink",
				innerHTML: "<a>" + data.html + "</a>"
			}, tooltip);
			link.children[0].valueProp = data.value;
		}

		on(root, "click", function (event) {
			if (!event || !event.target) { return; }
			var link = event.target;
			if (link.tagName.toLowerCase() === "a" && "valueProp" in link) {
				handler.call(metaObj, link.valueProp);
				game.update();
			}
		});
	},

	/**
	 * Create a numeric input element and attaches an "input" event handler to it
	 * Automatically updates metaObj[dataProp] if both are set
	**/
	_createInput: function (attrs, parentNode, metaObj, dataProp, pos, noUpdate) {
		var input = dojo.create("input", attrs, parentNode, pos || "last");
		input.type = "text";
		input.game = this;

		if (dojo.hasClass(input, "textInput")) {
			return input;
		}

		input.placeholder = num(input.placeholder);
		var value = this.parseInput(input);

		if (metaObj) {
			input.game = metaObj.game;
			input.metaObj = metaObj;
			if (dataProp) {
				input.dataProp = dataProp;
				metaObj[dataProp + "Node"] = input;
				value = metaObj[dataProp];
			}
		}

		input.value = value;
		input.parsedValue = value;
		input.prevValue = value;

		on(input, "input", function () {
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

		on(input, "blur", function () {
			this.game.setInput(this);
		});

		on(input, "focus", function () {
			var val = this.parsedValue || 0;
			if (String(val) !== this.value) {
				this.value = val;
			}
		});

		return input;
	},

	/**
	 * Special case of _createInput for metaObj.val
	 * Sets default html classes and a handler to update .on if not .togglable or if .togglableOnOff
	 */
	_createValInput: function (attrs, parentNode, metaObj, pos, noUpdate) {
		if (!attrs) {
			attrs = {};
		}
		var c = attrs["class"];
		attrs["class"] = "ownedInput integerInput" + (c ? " " + c : "");

		var input = this._createInput(attrs, parentNode, metaObj, "val", pos, noUpdate);

		input.handler = function () {
			if (!metaObj.togglable || (metaObj.togglableOnOff && metaObj.on > 0)) {
				metaObj.set("on", this.parsedValue, true);
			}
		};
		return input;
	},

	/**
	 * Creates a checkbox and a label wrapper, and attaches a click event handler
	 * Automatically updates metaObj[dataProp] if both are set
	**/
	_createCheckbox: function (text, refNode, metaObj, prop, pos) {
		var label = dojo.create("label", {innerHTML: " "}, refNode, pos || "last");
		var cbox = dojo.create("input", {type: "checkbox"}, label, "first");
		var span = dojo.create("span", {innerHTML: text || ""}, label);

		if (metaObj) {
			label.metaObj = metaObj;
			cbox.metaObj = metaObj;
			if (prop) {
				cbox.dataProp = prop;
				metaObj[prop + "Node"] = cbox;
				cbox.checked = metaObj[prop];
			}
		}
		cbox.game = this;
		cbox.prevChecked = cbox.checked;

		on(cbox, "click", function () {
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

			if (dojo.hasClass(ele, "ownedInput")) {
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

		this.server.save(saveData);
		this.resPool.save(saveData);
		this.village.save(saveData);
		this.calendar.save(saveData);
		this.console.save(saveData);

		this.callMethods(this.managers, "save", saveData);

		saveData.game = {
			forceShowLimits: this.forceShowLimits,
			isCMBREnabled: this.isCMBREnabled,
			useWorkers: this.useWorkers,
			colorScheme: this.colorScheme,
			karmaKittens: this.karmaKittens,
			karmaZebras: this.karmaZebras,
			ironWill: this.ironWill,
			deadKittens: this.deadKittens,
			cheatMode: this.cheatMode,

			opts: this.filterMetaObj(this.opts, ["usePerSecondValues", "forceHighPrecision", "usePercentageResourceValues",
				"highlightUnavailable", "hideSell", "noConfirm", "IWSmelter", "disableCMBR", "disableTelemetry", "enableRedshift"])
		};

		this.telemetry.save(saveData);

		if (compress) {
			saveData = LZString.compressToBase64(JSON.stringify(saveData));
		}
		return saveData;
	},

	migrateSave: function (save) {
		if (isNaN(save.saveVersion)) {
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

		if (save.saveVersion === 3) {
			// Use .on instead of .val and .enabled for all buildings
			if (save.buildings) {
				for (i = 0; i < save.buildings.length; i++) {
					save.buildings[i].on = save.buildings[i].val;
				}
			}

			save.saveVersion = 4;
		}

		if (save.saveVersion === 4) {
			// Use .on instead of .val and .enabled for all buildings
			if (save.religion && save.religion.ru) {
				for (i = 0; i < save.religion.ru.length; i++) {
					var saveRU = save.religion.ru[i];
					// Hack to fix old saves
					if (saveRU.researched && (saveRU.val == 0 || saveRU.val == null)) {
						saveRU.val = 1;
					}
					saveRU.on = saveRU.val;
				}
			}
			if (save.space) {
				if (save.space.programs) {
					for (i = 0; i < save.space.programs.length; i++) {
						if (save.space.programs[i].researched) {
							save.space.programs[i].on = 1;
							save.space.programs[i].val = 1;
						}
					}
				}
				if (save.space.planets) {
					for (i = 0; i < save.space.planets.length; i++) {
						var planet = save.space.planets[i];
						if (planet.buildings) {
							for (var j = 0; j < planet.buildings.length; j++) {
								var building = planet.buildings[j];
								building.on = building.val;
							}
						}
					}
				}
			}

			save.saveVersion = 5;
		}

		if (save.saveVersion === 5) {
			// Move energy into a true resource
			if (save.time && save.time.energy && save.resources) {
				var changement = false;
				for (i = 0; i < save.resources.length; i++) {
					var res = save.resources[i];
					if (res.name === "temporalFlux") {
						res.value = save.time.energy;
						changement = true;
						break;
					}
				}
				if (!changement) {
					var resTE = {
						name: "temporalFlux",
						value: save.time.energy
					};
					save.resources.push(resTE);
				}
			}

			save.saveVersion = 6;
		}

		if (save.saveVersion === 6) {
			if (save.religion) {
				if (save.religion.zu) {
					for (i = 0; i < save.religion.zu.length; i++) {
						save.religion.zu[i].on = save.religion.zu[i].val;
					}
				}
				if (save.religion.tu) {
					for (i = 0; i < save.religion.tu.length; i++) {
						save.religion.tu[i].on = save.religion.tu[i].val;
					}
				}
			}
			if (save.time) {
				if (save.time.usedCryochambers) {
					for (i = 0; i < save.time.usedCryochambers.length; i++) {
						save.time.usedCryochambers[i].on = save.time.usedCryochambers[i].val;
					}
				}
				if (save.time.cfu) {
					for (i = 0; i < save.time.cfu.length; i++) {
						save.time.cfu[i].on = save.time.cfu[i].val;
					}
				}
				if (save.time.vsu) {
					for (i = 0; i < save.time.vsu.length; i++) {
						save.time.vsu[i].on = save.time.vsu[i].val;
					}
				}
			}

			save.saveVersion = 8;
		}

		if (save.saveVersion === 8) {
			if (!save.challenges) {
				save.challenges = {};
			}
			save.challenges.currentChallenge = null;

			save.saveVersion = 9;
		}

		if (save.saveVersion === 9) {
			if (save.buildings) {
				for (i = 0; i < save.buildings.length; i++) {
					save.buildings[i].unlockable = save.buildings[i].unlocked;
					save.buildings[i].unlocked = false;
				}
			}
			if (save.space && save.space.programs) {
				for (i = 0; i < save.space.programs.length; i++) {
					if (save.space.programs[i].name === "rorschachMission" && save.space.programs[i].on) {
						var centaurusSystemMission = {
							name: "centaurusSystemMission",
							val: 0,
							on: 0,
							unlocked: true
						};
						save.space.programs.push(centaurusSystemMission);
					}
				}
			}

			save.saveVersion = 10;
		}

		if (save.saveVersion === 10) {
			if (save.resources) {
				for (i = 0; i < save.resources.length; i++) {
					save.resources[i].unlocked = false;
				}
			}

			save.saveVersion = 11;
		}

		if (save.saveVersion === 11) {
			if (!save.challenges) {
				save.challenges = {};
			}
			if (save.religion && save.religion.ru) {
				for (i = 0; i < save.religion.ru.length; i++) {
					if (save.religion.ru[i].name === "transcendence" && save.religion.ru[i].on) {
						var atheism = {
							name: "atheism",
							researched: false,
							unlocked: true
						};
						if (!Array.isArray(save.challenges.challenges)) {
							save.challenges.challenges = [];
						}
						save.challenges.challenges.push(atheism);
						break;
					}
				}
			}

			save.saveVersion = 12;
		}

		if (save.saveVersion === 12) {
			if (save.religion && save.religion.tcratio && save.religion.tu) {
				var transcendenceLevel = this.religion.getTriValueReligion(save.religion.tcratio) * 100;
				transcendenceLevel = Math.round(Math.log(transcendenceLevel));
				if (transcendenceLevel < 0) {
					transcendenceLevel = 0;
				}
				for (i = 0; i < save.religion.tu.length; i++) {
					if (transcendenceLevel >= this.religion.getTU(save.religion.tu[i].name).tier) {
						save.religion.tu[i].unlocked = true;
					}
				}
			}

			save.saveVersion = 13;
		}

		if (save.saveVersion === 13) {
			if (save.challenges && save.challenges.challenges) {
				for (i = 0; i < save.challenges.challenges.length; i++) {
					if (save.challenges.challenges[i].name === "atheism") {
						save.challenges.challenges[i].unlocked = false;

						if (save.science && save.science.techs) {
							for (j = 0; j < save.science.techs.length; j++) {
								if (save.science.techs[j].name === "voidSpace" && save.science.techs[j].researched) {
									save.challenges.challenges[i].unlocked = true;
									break;
								}
							}
						}
						break;
					}
				}
			}

			save.saveVersion = 14;
		}

		if (save.saveVersion === 14) {
			//removed
			save.saveVersion = 15;
		}

		return save;
	},

	decompressSave: function (data) {
		if (typeof data !== "string") {
			return;
		}
		data = data.replace(/\s/g, "");
		if (!data) {
			return;
		}

		var decompress = LZString.decompressFromBase64(data);
		return decompress || atob(data);
	},

	importSave: function (data) {
		var success = false;
		var rollback = false;
		try {
			var json = this.decompressSave(data);

			if (!json) {
				return false;
			}

			var saveData = JSON.parse(json);

			//reset everything before loading
			this._loadBlankJSON();

			rollback = true;
			this._loadJSON(saveData);

			success = true;
			if (this.devMode && this.devMode.overwriteCompareOnImport) {
				this.devMode.setCompareData(json);
			}

		} catch (ex) {
			console.error("Unable to load game data: ", ex);
			// console.trace();
			success = "ERROR";
			if (rollback) {
				this.__loadBlankJSON();
			}
		}

		this.village.synchKittens(true);
		// this.callMethods(this.managers, "invalidateCachedEffects");
		this.calculateAllEffects();
		this.update();

		return success;
	},

	_loadBlankJSON: function () {
		this._loadJSON(this.blankSaveJSON);

		this.time.set("timestamp", Date.now());
		this.telemetry.setGuid();
	},

	_loadJSON: function (saveData) {
		if (!saveData) {
			return;
		}

		if (saveData.server) {
			this.server.motdContentPrevious = saveData.server.motdContent;
		}

		this.migrateSave(saveData);

		this.resPool.load(saveData);
		this.village.load(saveData);
		this.calendar.load(saveData);
		this.console.load(saveData);

		this.callMethods(this.managers, "load", saveData);

		this.telemetry.load(saveData);

		if (saveData.game) {
			var data = saveData.game;

			this.loadMetaFields(this, data, ["forceShowLimits", "colorScheme", "karmaKittens", "karmaZebras",
				"deadKittens", "useWorkers", "cheatMode", "isCMBREnabled"]);

			this.OptionsTab.scheme.value = this.colorScheme;
			this.ironWill = ("ironWill" in data) ? Boolean(data.ironWill) : true;

			var paragonPoints = num(data.paragonPoints);

			if (paragonPoints > this.resPool.get("paragon").value) {
				this.resPool.get("paragon").set("value", paragonPoints);
			}

			this.loadMetaFields(this.opts, data.opts, ["usePerSecondValues", "forceHighPrecision", "usePercentageResourceValues",
				"highlightUnavailable", "hideSell", "noConfirm", "IWSmelter", "disableCMBR", "disableTelemetry", "enableRedshift"]);
		}
	},

	addTab: function (tab) {
		if (tab && tab.renderTab && this.tabs.indexOf(tab) === -1) {
			this.tabs.push(tab);
			if (this._isRendered) {
				this._renderTab(tab);
			}
		}
	},

	_renderTab: function (tab) {
		tab.renderTab();
		dojo.place(tab.tabWrapper, dojo.byId("tabContainer"));
		dojo.place(tab.tabBlockNode, dojo.byId("tabBlocksContainer"));
		tab.renderTabBlock();
	},

	openTab: function (tab) {
		dojo.query(".activeTab", "tabContainer").removeClass("activeTab");
		dojo.query(".tabBlock", "tabBlocksContainer").addClass("hidden");

		if (this.tabs.indexOf(tab) === -1) {
			console.warn("Tab " + tab + " not found, defaulting to Options tab");
			tab = this.tabs[0];
		}
		if (tab) {
			if (tab.tabNode) {
				dojo.addClass(tab.tabNode, "activeTab");
				dojo.removeClass(tab.tabBlockNode, "hidden");
			}

			this.activeTab = tab;
		}
	},


	constructor: function (container) {
		this.container = container;
		this.game = this;

		this.update = dojo.hitch(this, this.update); //ugh

		this.opts = new classes.KGSaveEdit.GenericItem(this, {
			usePerSecondValues: true,
			forceHighPrecision: false,
			usePercentageResourceValues: false,
			highlightUnavailable: false,
			hideSell: false,
			noConfirm: false,
			IWSmelter: true,
			disableCMBR: false,
			disableTelemetry: true,
			enableRedshift: false
		});

		this.toolbar = new classes.KGSaveEdit.ui.Toolbar(this);

		this.effectsMgr = new classes.KGSaveEdit.EffectsManager(this);

		this.OptionsTab = new classes.KGSaveEdit.OptionsTab(this);
		this.calendar = new classes.KGSaveEdit.Calendar(this);

		this.console = new classes.KGSaveEdit.Console(this);
		this.telemetry = new classes.KGSaveEdit.Telemetry(this);
		this.server = new classes.KGSaveEdit.Server(this);

		this.resPool = new classes.KGSaveEdit.Resources(this);
		this.village = new classes.KGSaveEdit.VillageManager(this);

		this.managers = [];

        var managers = [
            {id: "workshop",     class: "WorkshopManager"},
			{id: "diplomacy",    class: "DiplomacyManager"},
            {id: "bld",          class: "BuildingsManager"},
            {id: "science",      class: "ScienceManager"},
            {id: "achievements", class: "AchievementsManager"},
            {id: "religion",     class: "ReligionManager"},
            {id: "space",        class: "SpaceManager"},
			{id: "time",         class: "TimeManager"},
            {id: "prestige",     class: "PrestigeManager"},
            {id: "challenges",   class: "ChallengesManager"},
            {id: "stats",        class: "StatsManager"},
			{id: "void",         class: "VoidManager"}
        ];

        for (var i = 0; i < managers.length; i++) {
            var manager = managers[i];
			if (!classes.KGSaveEdit[manager.class]) {
				throw "Unable to load tab manager '" + manager.class + "'";
			}

            this[manager.id] = new classes.KGSaveEdit[manager.class](this);

            this.managers.push(this[manager.id]);
        }

		this.tabs = [this.OptionsTab, this.bld, this.village, this.science, this.workshop,
			this.diplomacy, this.religion, this.space, this.time, this.achievements, this.stats];
		this.activeTab = this.OptionsTab;

		if (classes.KGSaveEdit.DevMode) {
			this.devMode = new classes.KGSaveEdit.DevMode(this);
			this.tabs.push(this.devMode);
		}

		this.render();

		//Store a fresh state, used for resetting state when importing
		this.blankSaveJSON = this.exportSave();
		if (this.devMode) {
			this.devMode.setCompareData(this.blankSaveJSON);
		}
	},

	render: function () {
		var span = dojo.byId("toolbarBlock");
		dojo.empty(span);
		this.toolbar.render(span);

		dojo.empty(dojo.byId("tabContainer"));
		dojo.empty(dojo.byId("tabBlocksContainer"));

		this.calendar.render();
		this.console.render();
		this.telemetry.render();

		this.resPool.render();

		for (var i = 0, len = this.tabs.length; i < len; i++) {
			this._renderTab(this.tabs[i]);
		}

		this.callMethods(this.managers, "render");

		this._isRendered = true;

		this.calculateAllEffects();
		this.update();
	},


	updateTimeDelay: 5000, //5 seconds
	updateTimer: null,


	update: function () {
		clearTimeout(this.updateTimer);

		this.brokenIronWill = this.resPool.get("kittens").value > 0 || this.game.getEffect("maxKittens") > 0;

		if (this.brokenIronWill) {
			if (this.ironWill) {
				this.ironWill = false;
			}
		} else if (!this.ironWill && this.ironWillNode.prevChecked) {
			this.ironWill = true;
		}
		this.ironWillNode.checked = this.ironWill;
		this.toggleDisabled(this.ironWillNode, this.brokenIronWill);

		// this.callMethods(this.managers, "invalidateCachedEffects");
		this.callMethods(this.tabs, "updateTab");

		this.calendar.update();
		this.resPool.updateMax();

		this.openTab(this.activeTab);

		this.callMethods(this.managers, "update");

		var energyProd = this.getEffect("energyProduction");
		var energyCons = this.getEffect("energyConsumption");

		//recalculate because some building.action()s are directly dependant on energy
		//the game can get away with not doing this because it ticks
		if (energyProd !== this.resPool.energyProd ||
		energyCons !== this.resPool.energyCons) {
			this.resPool.energyProd = energyProd;
			this.resPool.energyCons = energyCons;

			this.bld.invalidateCachedEffects();
			this.space.invalidateCachedEffects();
		}

		this.village.update();
		this.resPool.update();
		this.toolbar.update();

		if (this.rerun) {
			this.rerun = false;
			if (dojo.isFunction(this.tooltipUpdateFunc)) {
				this.tooltipUpdateFunc();
			} else {
				dojo.addClass("tooltipBlock", "hidden");
			}

			this.updateTimer = setTimeout(this.update, this.updateTimeDelay);
		} else {
			// run twice to make sure everything's up to date
			// since some things are dependent on other things being run and it's a complicated mess
			// the game masks this problem because it ticks and renders parts only some of the time
			this.rerun = true;
			this.update();
			return;
		}
	}
});

});
