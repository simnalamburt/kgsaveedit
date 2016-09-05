/*global dojo, require, classes*/

function num(value) {
	if (!isFinite(value)) {
		return 0;
	}
	return Number(value) || 0;
}

require(["dojo/on", "dojo/mouse"], function (on, mouse) {
"use strict";

/**
 * Super class. Contains a method to set any property and also update the associated form element, if any
**/
dojo.declare('classes.KGSaveEdit.core', null, {
	set: function (key, value) {
		if (this[key + 'Node'] && this[key + 'Node'].dataProp === key) {
			var args = [].slice.call(arguments, 2);
			args = [this[key + 'Node'], value].concat(args);
			value = this.game.setEle.apply(this.game, args);
		}
		this[key] = value;
		return value;
	}
});

dojo.declare('classes.KGSaveEdit.UI.Tab', classes.KGSaveEdit.core, {
	game: null,

	tabNode: null,
	tabBlockNode: null,
	tabWrapper: null,
	isVisible: true,

	tabName: 'Undefined',

	constructor: function (game) {
		this.game = game;
	},

	getVisible: function () {
		return true;
	},

	getTabName: function () {
		return this.tabName;
	},

	renderTab: function () {
		//wrap tab link for css
		this.tabWrapper = dojo.create('span', {
			'class': 'wrapper separated' + (this.isVisible ? '' : ' spoiler')
		});

		this.tabNode = dojo.create('a', {
			'class': 'tab',
			href: '#',
			innerHTML: this.getTabName(),
		}, this.tabWrapper);

		this.tabBlockNode = dojo.create('div', {
			'class': 'tabBlock hidden' + (this.tabBlockClass ? ' ' + this.tabBlockClass : '')
		});

		on(this.tabNode, 'click', dojo.hitch(this, function (event) {
			event.preventDefault();
			dojo.query('.activeTab', 'tabContainer').removeClass('activeTab');
			dojo.query('.tabBlock', 'tabBlocksContainer').addClass('hidden');
			dojo.addClass(this.tabNode, 'activeTab');
			dojo.removeClass(this.tabBlockNode, 'hidden');
			this.game.activeTab = this;
		}));

		if (this.game.activeTab === this) {
			dojo.addClass(this.tabNode, 'activeTab');
			dojo.removeClass(this.tabBlockNode, 'hidden');
		}
	},

	renderTabBlock: function () { },

	updateTab: function () {
		this.tabNode.innerHTML = this.getTabName();
		this.isVisible = this.getVisible();
		dojo.toggleClass(this.tabWrapper, 'spoiler', !this.isVisible);
	}
});

dojo.declare('classes.KGSaveEdit.Manager', classes.KGSaveEdit.core, {
	game: null,
	effectsCached: null,
	meta: null,

	constructor: function (game) {
		this.game = game;

		this.effectsCached = {};
		this.meta = [];
	},

	render: function () { },

	/* registerMeta: function (meta) {
		this.meta.push(meta);
	}, */

	getMeta: function (name, metadata) {
		for (var i = metadata.length - 1; i >= 0; i--) {
			var meta = metadata[i];

			if (meta.name == name){
				return meta;
			}
		}
		return null;
	},

	invalidateCachedEffects: function () {
		this.effectsCached = {};
		this.calculateEffectsBase();
	},

	calculateEffectsBase: function () { },

	getEffect: function (name) {
		return num(this.getEffectBase(name) + this.getEffectCached(name));
	},

	getEffectBase: function () {
		return 0;
	},

	getEffectCached: function (name) {
		var cached = this.effectsCached[name];
		if (!isNaN(cached)) {
			return cached;
		}

		var effect = 0;
		for (var i = this.meta.length - 1; i >= 0; i--) {
			var effectMeta = this.getMetaEffect(name, this.meta[i]);
			effect += effectMeta;
		}

		this.effectsCached[name] = effect;
		return effect;
	},

	getMetaEffect: function(name, metadata) {
		var totalEffect = 0;
		if (!metadata.length){
			return 0;
		}

		for (var i = metadata.length - 1; i >= 0; i--) {
			totalEffect += num(metadata[i].getEffect(name));
		}

		return totalEffect || 0;
	},

	loadMetaData: function (saveArr, getFn, loadFn) {
		if (!saveArr || !saveArr.length) {
			return;
		}

		if (!dojo.isFunction(loadFn)) {
			loadFn = null;
		}

		for (var i = saveArr.length - 1; i >= 0; i--) {
			var saveMeta = saveArr[i];
			var meta = this[getFn](saveMeta.name);
			if (meta) {
				if (loadFn) {
					loadFn.call(this, meta, saveMeta);
				} else if ('load' in meta) {
					meta.load(saveMeta);
				}
			}
		}
	}
});


dojo.declare('classes.KGSaveEdit.GenericItem', classes.KGSaveEdit.core, {
	game: null,

	name: 'Undefined',

	constructor: function (game, data) {
		this.game = game;
		dojo.mixin(this, data);
		this.metaData = data;
	}
});


dojo.declare('classes.KGSaveEdit.TooltipItem', classes.KGSaveEdit.core, {
	getTooltip: function () {
		return "Unimplemented";
	},

	getTooltipOffset: function (node) {
		var pos = dojo.position(node);
		return {
			left: pos.x,
			top: pos.y
		};
	},

	registerTooltip: function (node) {
		if (!node) {
			return;
		}

		var tooltip = dojo.byId('tooltipBlock');

		var updateTooltip = dojo.hitch(this, function () {
			tooltip.removeAttribute('style');
			tooltip.innerHTML = '';

			var viewPos = dojo.position(tooltip.parentNode);
			this.getTooltip(node);

			if (dojo.hasClass(tooltip, 'hidden')) {
				return;
			}

			var pos = this.getTooltipOffset(node);
			pos.top = Math.abs(pos.top - viewPos.y);

			//keep tooltip from moving outside viewing area
			var tooltipPos = dojo.position(tooltip);
			pos.top = Math.min(pos.top, viewPos.h - 25 - tooltipPos.h);

			pos.left = Math.min(pos.left, viewPos.w - 25 - tooltipPos.w);

			tooltip.style.top = pos.top + 'px';
			tooltip.style.left = pos.left + 'px';
		});

		on(node, mouse.enter, dojo.hitch(this, function () {
			this.game.tooltipUpdateFunc = updateTooltip;
			updateTooltip();
		}));

		on(node, mouse.leave, dojo.hitch(this, function () {
			tooltip.removeAttribute('style');
			tooltip.innerHTML = '';
			dojo.addClass(tooltip, 'hidden');
			this.game.tooltipUpdateFunc = null;
		}));
	}
});


dojo.declare('classes.KGSaveEdit.MetaItem', [classes.KGSaveEdit.GenericItem, classes.KGSaveEdit.TooltipItem], {
	render: function () { },

	owned: function () {
		return false;
	},

	getDescription: function () {
		return this.description;
	},

	getEffect: function () {
		return 0;
	},

	getPrices: function () {
		return this.prices ? dojo.clone(this.prices) : [];
	},

	update: function () { },

	updateEnabled: function () {
		var prices = this.getPrices() || [];
		var limited = false;
		var hasRes = true;

		for (var i = prices.length - 1; i >= 0; i--) {
			var price = prices[i];
			var res = this.game.resPool.get(price.name);
			var value = res.getValue();
			if (res.maxValue > 0 && value < price.val && res.maxValue < price.val) {
				limited = true;
				break;
			}
			if (hasRes && value < price.val) {
				hasRes = false;
			}
		}
		dojo.toggleClass(this.nameNode, 'limited', this.game.opts.highlightUnavailable && limited);
		dojo.toggleClass(this.nameNode, 'btnDisabled', limited || !hasRes);
	},

	registerHighlight: function (node) {
		on(node, mouse.enter, dojo.hitch(this, function () {
			dojo.query('.highlited').removeClass('highlited');

			var prices = this.getPrices(true);
			var resPool = this.game.resPool;
			if (prices) {
				for (var i = prices.length - 1; i >= 0; i--) {
					var res = resPool.get(prices[i].name);
					if (res) {
						dojo.addClass(res.domNode, 'highlited');
					}
				}
			}
		}));

		on(node, mouse.leave, function () {
			dojo.query('.highlited').removeClass('highlited');
		});
	},

	getTooltip: function () {
		var tooltip = dojo.byId('tooltipBlock');
		tooltip.className = 'button_tooltip';

		if (this.getName) {
			dojo.create('div', {
				'class': 'tooltipName',
				innerHTML: this.getName()
			}, tooltip);
		}

		var descBlock;
		if (this.description || this.getDescription) {
			descBlock = dojo.create('div', {
				'class': 'tooltipDesc',
				innerHTML: this.getDescription ? this.getDescription() : this.description
			}, tooltip);
		}

		var prices = this.getPrices ? this.getPrices() : this.prices;
		if (prices) {
			if (descBlock) {
				dojo.addClass(descBlock, 'tooltipDescBottom');
			}
			this.game.renderPrices(tooltip, prices);
		}

		if (!this.hideEffects && (this.effects || this.getEffects)) {
			this.game.renderEffects(tooltip, this.getEffects ? this.getEffects() : this.effects);
		}

		if (this.flavor) {
			dojo.create('div', {
				'class': 'tooltipFlavor',
				innerHTML: this.flavor
			}, tooltip);
		}
	},

	getTooltipOffset: function (node) {
		var pos = dojo.position(node);
		return {
			top: pos.y,
			left: pos.x + pos.w + 20
		};
	}
});


dojo.declare('classes.KGSaveEdit.OptionsTab', classes.KGSaveEdit.UI.Tab, {
	options: [{
			name: 'forceHighPrecision',
			desc: 'Use high precision for resource values'
		}, {
			name: 'usePerSecondValues',
			desc: 'Use per second values <i>(per tick otherwise)</i>',
			src: 'game.opts'
		}, {
			name: 'usePercentageResourceValues',
			desc: 'Use percentage resource production values',
			src: 'game.opts'
		}, {
			name: 'highlightUnavailable',
			desc: 'Highlight buildings limited by storage space',
			src: 'game.opts'
		}, {
			name: 'hideSell',
			desc: "Hide 'sell' buttons",
			src: 'game.opts'
		}, {
			name: 'noConfirm',
			desc: 'Do not confirm when clearing all jobs',
			src: 'game.opts'
		}, {
			name: 'IWSmelter',
			desc: 'Smelters turn off at 95% max Iron in Iron Will mode',
			src: 'game.opts',
			seperator: true
		}, {
			name: 'ironWill',
			desc: 'Iron Will'
		}, {
			name: 'cheatMode',
			desc: 'Cheat mode',
			seperator: true
	}],
	scheme: null,

	constructor: function () {
		this.tabName = 'Options &amp; Settings';
	},

	renderTabBlock: function () {
		var game = this.game;
		dojo.place(game.calendar.domNode, this.tabBlockNode);

		dojo.place(document.createTextNode('Color scheme: '), this.tabBlockNode);
		var scheme = dojo.create('select', {
			id: 'setColorScheme',
			innerHTML: '<option value="">Classic</option><option value="dark">Inverted</option><option value="grassy">Grassy</option><option value="sleek">Sleek (By Kida)</option>'
		}, this.tabBlockNode);
		scheme.game = game;
		this.scheme = scheme;
		scheme.defaultVal = this.game.colorScheme || '';

		on(scheme, 'change', function () {
			this.game.colorScheme = this.value;
			this.game.update();
		});

		dojo.place('<br><br>', scheme, 'after');

		var input = game._createCheckbox(
			'Use web worker (game works correctly in background tab, may cause performance issues)',
			this.tabBlockNode, game, 'useWorkers');
		dojo.place('<br>', input.label, 'after');

		for (var i = 0; i < this.options.length; i++) {
			var option = this.options[i];
			var ref = option.src === 'game.opts' ? game.opts : game;
			input = game._createCheckbox(option.desc, this.tabBlockNode, ref, option.name);
			var br = option.seperator ? '<br><br>' : '<br>';
			dojo.place(br, input.label, 'after');
		}

		// Dead Kittens & Karma
		var table = dojo.create('table', {'class': 'bottom-margin'}, this.tabBlockNode);

		var tr = dojo.create('tr', {
			innerHTML: '<td>DeadKittens</td><td></td>'
		}, table);
			// [{innerHTML: 'Dead kittens'}, null]);
		input = game._createInput({'class': 'integerInput'},
			tr.children[1], game, 'deadKittens');

		tr = dojo.create('tr', {
			innerHTML: '<td>karmaKittens</td><td>&nbsp; &harr; &nbsp;</td>'
		}, table);
		var td = tr.children[1];

		game._createInput({id: 'karmaKittensNode', 'class': 'integerInput'},
			td, game, 'karmaKittens', 'first');
		game.karmaKittensKarma = game._createInput({'class': 'abbrInput'}, td);
		dojo.place(document.createTextNode(' Karma'), td);

		game.karmaKittensNode.handler = function () {
			var value = this.game.getTriValue(this.parsedValue, 5);
			this.game.setInput(this.game.karmaKittensKarma, value, true);
			this.game.resPool.get('karma').setValue(value, true);
		};

		game.karmaKittensKarma.parseFn = function (value) {
			return this.game.getTriValue(Math.round(this.game.reverseTriValue(value, 5)), 5);
		};
		game.karmaKittensKarma.handler = function () {
			this.game.resPool.get('karma').setValue(this.parsedValue, true);
			this.game.setInput(this.game.karmaKittensNode, Math.round(this.game.reverseTriValue(this.parsedValue, 5)), true);
		};

		tr = dojo.create('tr', {innerHTML: '<td>karmaZebras</td><td><td>'}, table);
		game._createInput({'class': 'integerInput'}, tr.children[1], game, 'karmaZebras');

		dojo.place(game.console.domNode, this.tabBlockNode);
	}
});


dojo.declare('classes.KGSaveEdit.Calendar', classes.KGSaveEdit.core, {
	game: null,

	seasons: [
		{name: "spring", title: "Spring", modifiers: {"catnip": 1.5}},
		{name: "summer", title: "Summer", modifiers: {"catnip": 1.0}},
		{name: "autumn", title: "Autumn", modifiers: {"catnip": 1.0}},
		{name: "winter", title: "Winter", modifiers: {"catnip": 0.25}}
	],

	cycles: [{
			name: "charon",
			title: "Charon",
			glyph: "&#9049;",
			effects: {
				"moonOutpost-unobtainiumPerTick": 0.9
			},
			festivalEffects: {
				"catnip":   1.5,
				"wood":     1.5,
				"minerals": 1.5
			}
		}, {
			name: "umbra",
			title: "Umbra",
			glyph: "&#9062;",
			effects: {
				"planetCracker-uraniumPerTick": 0.9,
				"hydrofracturer-oilPerTick":    0.75
			},
			festivalEffects: {
				"coal":     1.5,
				"iron":     1.5,
				"titanium": 1.5,
				"gold":     1.5
			}
		}, {
			name: "yarn",
			title: "Yarn",
			glyph: "&#9063;",
			effects: {
				"researchVessel-starchartPerTickBase": 0.5
			},
			festivalEffects: {
				"culture": 2
			}
		}, {
			name: "helios",
			title: "Helios",
			glyph: "&#8978;",
			effects: {
				"sunlifter-energyProduction": 1.5
			},
			festivalEffects: {
				"faith":    2,
				"unicorns": 1.25
			}
		}, {
			name: "cath",
			title: "Cath",
			glyph: "&#9022;",
			effects: {
				"spaceElevator-prodTransferBonus":  2,
				"sattelite-starchartPerTickBase":   2,
				"sattelite-observatoryRatio":       2,
				"spaceStation-scienceRatio":        1.5,
				"spaceBeacon-starchartPerTickBase": 0.1
			},
			festivalEffects: {
				"manpower": 2
			}
		}, {
			name: "redmoon",
			title: "Redmoon",
			glyph: "&#9052;",
			effects: {
				"moonOutpost-unobtainiumPerTick": 1.2
			},
			festivalEffects: {
				"unobtainium": 2
			}
		}, {
			name: "dune",
			title: "Dune",
			glyph: "&#9067;",
			effects: {
				"planetCracker-uraniumPerTick": 1.1,
				"hydrofracturer-oilPerTick":    1.5
			},
			festivalEffects: {
				"uranium": 2
			}
		}, {
			name: "piscine",
			title: "Piscine",
			glyph: "&#9096;",
			effects: {
				"researchVessel-starchartPerTickBase": 1.5
			},
			festivalEffects: {
				"science": 2
			}
		}, {
			name: "terminus",
			title: "Terminus",
			glyph: "&#9053;",
			effects: {
				"sunlifter-energyProduction": 0.5
			},
			festivalEffects: {
				"oil": 2
			}
		}, {
			name: "kairo",
			title: "Kairo",
			glyph: "&#8483;",
			effects: {
				"spaceBeacon-starchartPerTickBase": 5,
				"spaceElevator-prodTransferBonus":  0.5,
				"sattelite-starchartPerTickBase":   0.75,
				"sattelite-observatoryRatio":       0.75,
				"spaceStation-scienceRatio":        0.75
			},
			festivalEffects: {
				"starchart": 5
			}
	}],

	yearsPerCycle: 5,
	daysPerSeason: 100,
	refYear: 0, //to be used to calculate millenium paragon

	season: 0,
	cycle: 0,
	cycleYear: 0,

	day: 0,
	year: 0,

	weather: null, //warm / cold

	festivalDays: 0,

	domNode: null,

	getCurSeason: function () {
		return this.seasons[this.season];
	},

	getWeatherMod: function () {
		var mod = 0;
		if (this.weather === "warm") {
			mod =  0.15;
		} else if (this.weather === "cold") {
			mod = -0.15;
		}
		return mod;
	},

	constructor: function (game) {
		this.game = game;
	},

	render: function () {
		var game = this.game;

		var i, len;
		var table = dojo.create('table', {
			id: 'calendarBlock',
			'class': 'bottom-margin',
			innerHTML: '<tr><th colspan="2">Calendar</th></tr>'
		});
		this.domNode = table;

		var tr = dojo.create('tr', {
			innerHTML: '<td>Year</td><td></td>'
		}, table);
		var td = tr.children[1];
		game._createInput({id: 'yearNode', 'class': 'integerInput'},
			td, this, 'year');

		dojo.place(document.createTextNode(' \u00A0'), td); //insert &nbsp; equivalent

		this.milleniumParagonSpan = dojo.create('a', {
			id: 'milleniumParagonSpan',
			href: '#', 'class': 'hidden',
			innerHTML: '(+0 paragon)'
		}, td);

		on(this.milleniumParagonSpan, 'click', dojo.hitch(this, function () {
			this.refYear = this.year;
			var paragon = this.game.resPool.get('paragon');
			paragon.set('value', paragon.value + Math.floor(Math.max(this.year - this.refYear, 0) / 1000));
			this.game.update();
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Cycle</td><td></td>'
		}, table);
		this.cycleNode = dojo.create('select', {id: 'cycleNode'}, tr.children[1]);
		this.cycleNode.defaultVal = 0;

		for (i = 0, len = this.cycles.length; i < len; i++) {
			var cycle = this.cycles[i];
			dojo.create('option', {
				value: i,
				innerHTML: cycle.glyph + ' ' + cycle.title
			}, this.cycleNode);
		}

		on(this.cycleNode, 'change', dojo.hitch(this, function () {
			this.cycle = this.cycleNode.selectedIndex;
			this.game.update();
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Cycle year</td><td></td>'
		}, table);
		game._createInput({id: 'cycleYearNode', 'class': 'integerInput shortInt'},
			tr.children[1], this, 'cycleYear');

		tr = dojo.create('tr', {
			innerHTML: '<td>Season</td><td></td>'
		}, table);
		this.seasonNode = dojo.create('select', {id: 'seasonNode'}, tr.children[1]);
		this.seasonNode.defaultVal = 0;

		for (i = 0, len = this.seasons.length; i < len; i++) {
			dojo.create('option', {
				value: i,
				innerHTML: this.seasons[i].title
			}, this.seasonNode);
		}

		on(this.seasonNode, 'change', dojo.hitch(this, function () {
			this.season = this.seasonNode.selectedIndex;
			this.game.update();
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Weather</td><td></td>'
		}, table);
		this.weatherSel = dojo.create('select', {
			id: 'weatherSel',
			innerHTML: '<option value="">---</option><option value="warm">Warm</option><option value="cold">Cold</option>'
		}, tr.children[1]);
		this.weatherSel.defaultVal = '';

		on(this.weatherSel, 'change', dojo.hitch(this, function () {
			this.weather = this.weatherSel.value || null;
			this.game.update();
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Day</td><td></td>'
		}, table);
		var input = game._createInput({id: 'dayNode'}, tr.children[1], this, 'day');
		input.minValue = -10;

		tr = dojo.create('tr', {
			innerHTML: '<td>Festival days</td><td></td>'
		}, table);
		game._createInput({id: 'festivalDaysNode', 'class': 'integerInput abbrInput'},
			tr.children[1], this, 'festivalDays');
	},

	cycleEffects: function (effects, building_name) {
		if (this.game.prestige.getPerk("numerology").owned()) {
			var list_effects_cycle = this.cycles[this.cycle].effects;

			for (var effect in effects) {
				var effect_cycle = building_name + "-" + effect;
				if (typeof list_effects_cycle[effect_cycle] !== "undefined") {
					effects[effect] *= list_effects_cycle[effect_cycle];
				}
			}
		}

		if (this.game.prestige.getPerk("numeromancy").owned() && this.game.calendar.festivalDays > 0) {
			var list_festivalEffects_cycle = this.cycles[this.cycle].festivalEffects;

			for (effect in effects) {
				effect_cycle = effect;
				if (typeof list_festivalEffects_cycle[effect_cycle] !== "undefined") {
					effects[effect] *= list_festivalEffects_cycle[effect_cycle];
				}
			}
		}

		return effects;
	},

	update: function () {
		var paragon = Math.floor(Math.max(this.year - this.refYear, 0) / 1000);
		this.milleniumParagonSpan.innerHTML = '(+' + paragon + ' paragon)';
		dojo.toggleClass(this.milleniumParagonSpan, 'hidden', !paragon);
	},

	save: function (saveData) {
		saveData.calendar = this.game.filterMetaObj(this, ['year', 'day', 'season',
			'weather', 'iceage', 'festivalDays', 'cycle', 'cycleYear']);
	},

	load: function (saveData) {
		if (!saveData.calendar) {
			return;
		}
		var data = saveData.calendar;

		this.game.loadMetaFields(this, data, ["year", "day", "weather", "festivalDays"]);
		this.game.setSelectByValue(this.seasonNode, data.season);
		this.season = this.seasonNode.selectedIndex;
		this.game.setSelectByValue(this.cycleNode, data.cycle);
		this.cycle = this.cycleNode.selectedIndex;
		this.set('cycleYear', data.cycleYear || 0);

		this.refYear = this.year;
	}
});


dojo.declare('classes.KGSaveEdit.Console', classes.KGSaveEdit.core, {
	game: null,
	domNode: null,

	filtersData: {
		"astronomicalEvent":  {title: "Astronomical Events", enabled: true, unlocked: false},
		"hunt":               {title: "Hunts",               enabled: true, unlocked: false},
		"craft":              {title: "Craft",               enabled: true, unlocked: false},
		"workshopAutomation": {title: "Workshop Automation", enabled: true, unlocked: false},
		"meteor":             {title: "Meteors",             enabled: true, unlocked: false},
		"ivoryMeteor":        {title: "Ivory Meteors",       enabled: true, unlocked: false},
		"unicornRift":        {title: "Unicorn Rifts",       enabled: true, unlocked: false},
		"alicornRift":        {title: "Alicorn Rifts",       enabled: true, unlocked: false}
	},

	filters: null,

	constructor: function (game) {
		this.game = game;

		this.filters = {};
		for (var tag in this.filtersData) {
			this.filters[tag] = new classes.KGSaveEdit.GenericItem(game, this.filtersData[tag]);
		}
	},

	render: function () {
		var game = this.game;

		this.domNode = dojo.create('table', {
			id: 'logFiltersBlock',
			'class': 'bottom-margin',
			innerHTML: '<tr><th colspan="2">Log filters</th></tr>'
		});
		for (var tag in this.filters) {
			var filter = this.filters[tag];

			var tr = dojo.create('tr', {
				'class': 'logFilter',
				innerHTML: '<td>' + filter.title + '</td><td></td>'
			}, this.domNode);
			game._createCheckbox('Unlocked', tr.children[1], filter, 'unlocked');
			game._createCheckbox('Enabled', tr.children[1], filter, 'enabled');
		}
	},

	save: function (saveData) {
		var saveFilters = {};
		for (var tag in this.filters) {
			saveFilters[tag] = this.game.filterMetaObj(this.filters[tag], ['title', 'enabled', 'unlocked']);
		}

		saveData.console = {
			filters: saveFilters
		};
	},

	load: function (saveData) {
		var saveFilters = saveData && saveData.console && saveData.console.filters ? saveData.console.filters : {};
		for (var tag in saveFilters) {
			var filter = this.filters[tag];
			if (filter) {
				var saveFilter = saveFilters[tag];
				filter.set('unlocked', Boolean(saveFilter.unlocked));
				filter.set('enabled', Boolean(saveFilter.enabled));
			}
		}
	}
});


dojo.declare('classes.KGSaveEdit.TimeManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	game: null,

	energy: 0,
	maxEnergy: 0, /*Time acceleration energy in ticks*/
	flux: 0, /* Amount of years skipped by CF time jumps */
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
	}],

	vsuData: [{
		name: "cryochambers",
		label: "Cryochambers",
		description: "What!",
		prices: [
			{name: "void",        val: 100},
			{name: "timeCrystal", val: 2},
			{name: "karma",       val: 1}
		],
		priceRatio: 1.25,
		unlocked: false,
		requires: {tech: ["voidSpace"]},
		effects: {
			"maxKittens": 1
		}
	}, {
		name: "usedCryochambers",
		label: "Used Cryochambers",
		description: "Those are unusable cryochambers...",
		prices: [],
		priceRatio: 1.25,
		unlocked: true,
		effects: {}
    }],

	tabName: 'Time',
	getVisible: function () {
		return this.game.science.get('calendar').owned() || this.getVSU('usedCryochambers').owned();
	},

	constructor: function (game) {
		this.game = game;
		this.maxEnergy = game.rate * 60 * 10; //10 minute max
		this.timestamp = Date.now();

		this.cfu = [];
		this.cfuByName = {};
		for (var i = 0; i < this.cfuData.length; i++) {
			var chrono = new classes.KGSaveEdit.CFUMeta(game, this.cfuData[i]);
			chrono.metaObj = this;
			this.cfu.push(chrono);
			this.cfuByName[chrono.name] = chrono;
		}

		this.vsu = [];
		this.vsuByName = {};
		for (i = 0; i < this.cfuData.length; i++) {
			var voidspace = new classes.KGSaveEdit.VSUMeta(game, this.vsuData[i]);
			voidspace.metaObj = this;
			this.vsu.push(voidspace);
			this.vsuByName[voidspace.name] = voidspace;
		}
	},

	get: function(name) {
		return this.getCFU(name);
	},

	getCFU: function(name) {
		return this.cfuByName[name];
	},

    getVSU: function(name) {
        return this.vsuByName[name];
    },

	renderTabBlock: function () {
		var game = this.game;

		// Timestamp Node
		var div = dojo.create('div', {
			id: 'timestampBlock',
			'class': 'bottom-margin',
			innerHTML: '<span class="nameNode">Last save time</span> '
		}, this.tabBlockNode);

		dojo.create('small', {
			title: 'Times are in milliseconds since January 1, 1970, 00:00:00 UTC.\nFor more information, click here.',
			innerHTML: '<a class="help" href="http://www.epochconverter.com/" target="_blank">[?]</a>'
		}, div);

		dojo.place(document.createTextNode(' '), div);

		game._createInput({
			id: 'timestampNode',
			'class': 'integerInput timeInput',
			title: 'Timestamp of last save'
		}, div, this, 'timestamp');

		dojo.place(document.createTextNode(' '), div);
		var btn = dojo.create('a', {
			href: '#',
			innerHTML: 'Set to current time'
		}, div);
		on(btn, 'click', dojo.hitch(this, function () {
			this.set('timestamp', Date.now());
		}));

		this.timeBlock = dojo.create('table', {
			id: 'timeBlock',
			'class': 'bottom-margin',
			innerHTML: '<tr><th colspan="3">Time</th></tr>'
		}, this.tabBlockNode);

		// Energy Node
		var str = "/" + this.maxEnergy;
        if (this.game.time.energy) {
            str +=  " (" + this.game.toDisplaySeconds(this.game.time.energy / this.game.rate) + ")";
        }

		var tr = dojo.create('tr', {
			innerHTML: '<td><span class="nameNode">Temporal Flux</span></td><td></td><td>' + str + '</td>'
		}, this.timeBlock);
		game._createInput({
			id: 'energyNode',
			'class': 'integerInput'
		}, tr.children[1], this, 'energy');

		this.energyMaxBlock = tr.children[2];

		// Flux Node
		tr = dojo.create('tr', {
			innerHTML: '<td><span class="nameNode">Years skipped</span></td><td></td><td></td>'
		}, this.timeBlock);

		game._createInput({
			id: 'fluxNode',
			'class': 'integerInput',
			title: 'Amount of years skipped by CF time jumps'
		}, tr.children[1], this, 'flux');

		this.chronoforgeBlock = dojo.create('table', {
			id: 'cfuBlock',
			'class': 'bottom-margin'
		}, this.tabBlockNode);

		this.chronoforgeHeader = dojo.create('tr', {
			innerHTML: '<th colspan="3">Chronoforge</th>'
		}, this.chronoforgeBlock);

		for (var i = 0; i < this.cfu.length; i++){
			var item = this.cfu[i];
			item.render();
			dojo.place(item.domNode, this.chronoforgeBlock);
		}

		this.voidspaceBlock = dojo.create('table', {
			id: 'cfuBlock',
			'class': 'bottom-margin'
		}, this.tabBlockNode);

		this.voidspaceHeader = dojo.create('tr', {
			innerHTML: '<th colspan="3">Void Space</th>'
		}, this.voidspaceBlock);

		for (i = 0; i < this.vsu.length; i++){
			item = this.vsu[i];
			item.render();
			dojo.place(item.domNode, this.voidspaceBlock);
		}
	},

    updateEnergyStats: function() {
        this.maxEnergy = Math.round(
            this.game.rate * 60 * 10 *
				(1 + this.getCFU("temporalBattery").val * 0.25)
        );
    },

	update: function () {
		this.updateEnergyStats();
		var str = "/" + this.maxEnergy;
        if (this.game.time.energy) {
            str +=  " (" + this.game.toDisplaySeconds(this.game.time.energy / this.game.rate) + ")";
        }
		this.energyMaxBlock.innerHTML = str;

		dojo.toggleClass(this.chronoforgeHeader, 'spoiler', !this.game.workshop.get('chronoforge').owned());
		dojo.toggleClass(this.voidspaceHeader, 'spoiler',
			!this.game.science.get('voidSpace').owned() && !this.getVSU('usedCryochambers').owned());
	},

	save: function (saveData) {
		saveData.time = {
			timestamp: this.timestamp,
			energy: this.energy,
			flux: this.flux,
			cfu: this.game.mapMethods(this.cfu, 'save'),
			vsu: this.game.mapMethods(this.vsu, 'save')
		};
	},

	load: function (saveData) {
		if (!saveData.time) {
			return;
		}

		var data = saveData.time;
		this.game.loadMetaFields(this, data, ["energy", "flux", "timestamp"]);

		this.loadMetaData(data.cfu, 'getCFU');
		this.loadMetaData(data.vsu, 'getVSU');
	}
});


dojo.declare('classes.KGSaveEdit.CFUMeta', classes.KGSaveEdit.MetaItem, {
	domNode: null, // Here is the HTML Node
	val: 0,
	unlocked: true, // Currently all are unlocked

	constructor: function () { },

	owned: function () {
		return this.val > 0;
	},

	getName: function () {
		var name = this.label || this.name;
		return name;
	},

	getPrice: function () { return this.prices; },
	getEffect: function (name) {
		var effects = this.effects || {};
		var effect = num(effects[name]);
		return effect * this.val;
	},

	render: function () {
		var tr = dojo.create('tr', {
			// 'class': 'building',
			innerHTML: '<td></td><td></td><td></td>'
		});
		this.domNode = tr;

		this.nameNode = dojo.create('span', {
			'class': 'nameNode',
			innerHTML: this.getName()
		}, tr.children[0]);

		this.game._createInput({
			'class': 'integerInput ownedInput',
			title: 'Number of Upgrades'
		}, tr.children[1], this, 'val');

		// this.game._createCheckbox('Unlocked', tr.children[2], this, 'unlocked');

		this.registerHighlight(this.domNode); // MetaItem
		this.registerTooltip(this.domNode); // ToolTip
	},

	updateUnlocked: function () { // if researched
		var unlocked = this.ignorePriceCheck;

		if (!this.ignorePriceCheck) {
			var prices = this.getPrices(true);
			var unlockRatio = 0.3;
			if (this.get('unlockRatio')) {
				unlockRatio = this.get('unlockRatio');
			}
			unlocked = this.game.resPool.hasRes(prices, unlockRatio);
		}
		var disable = unlocked;

		var req = this.game.checkRequirements(this, true);
		if (!req) {
			unlocked = false;
			disable = true;
		}

		this.unlocked = Boolean(unlocked || (this.unlockedNode.prevChecked && req));
		this.unlockedNode.checked = this.unlocked;
		this.game.toggleDisabled(this.unlockedNode, disable);
	},

	// Currently only name + val, unlocked always true
	/*  saveData.time.cfu[] --> {"name": "...", "val": 0}   */
	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "val"]);
		return saveData;
	},

	load: function (saveData) {
		this.set('val', num(saveData.val));
	}
});


dojo.declare('classes.KGSaveEdit.VSUMeta', classes.KGSaveEdit.CFUMeta, {
	//TODO: difference?
});


dojo.declare('classes.KGSaveEdit.DiplomacyManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	raceData: [
		{name: "lizards",    title: "Lizards"},
		{name: "sharks",     title: "Sharks"},
		{name: "griffins",   title: "Griffins"},
		{name: "nagas",      title: "Nagas",      hidden: true},
		{name: "zebras",     title: "Zebras",     hidden: true},
		{name: "spiders",    title: "Spiders",    hidden: true},
		{name: "dragons",    title: "Dragons",    hidden: true},
		{name: "leviathans", title: "Leviathans", hidden: true, energy: 0, duration: 0}
	],

	tabName: 'Trade',
	races: null,
	racesByName: null,

	constructor: function (game) {
		this.races = [];
		this.racesByName = {};

		for (var i = 0, len = this.raceData.length; i < len; i++) {
			var race = new classes.KGSaveEdit.GenericItem(game, this.raceData[i]);
			race.unlocked = Boolean(race.unlocked);
			race.collapsed = Boolean(race.collapsed);

			this.races.push(race);
			this.racesByName[race.name] = race;
		}
	},

	renderTabBlock: function () {
		this.diplomacyBlock = dojo.create('table', {id: 'diplomacyBlock'}, this.tabBlockNode);

		for (var i = 0, len = this.races.length; i < len; i++) {
			var race = this.races[i];

			race.domNode = dojo.create('tr', {
				'class': 'tradeRace',
				innerHTML: '<td>' + race.title + '</td><td></td><td></td>'
			}, this.diplomacyBlock);
			race.nameNode = race.domNode.children[0];

			this.game._createCheckbox('Unlocked', race.domNode.children[1], race, 'unlocked');
			this.game._createCheckbox('Collapsed', race.domNode.children[1], race, 'collapsed');

			if (typeof race.duration === 'number') {
				race.domNode.children[2].textContent = 'Days left ';
				this.game._createInput({'class': 'integerInput'}, race.domNode.children[2], race, 'duration');
				dojo.place(document.createTextNode(' Energy '), race.domNode.children[2]);
				this.game._createInput({'class': 'integerInput'}, race.domNode.children[2], race, 'energy');
			}
		}
	},

	get: function (name) {
		return this.racesByName[name];
	},

	hasUnlockedRaces: function () {
		for (var i = this.races.length - 1; i >= 0; i--) {
			if (this.races[i].unlocked) {
				return true;
			}
		}
		return false;
	},

	getVisible: function () {
		return this.hasUnlockedRaces();
	},

	update: function () {
		for (var i = this.races.length - 1; i >= 0; i--) {
			var race = this.races[i];
			dojo.toggleClass(race.nameNode, 'spoiler', !race.unlocked);
		}
	},

	save: function (saveData) {
		saveData.diplomacy = {
			races: this.game.filterMetadata(this.races, ["name", "unlocked", "energy", "duration", "collapsed"])
		};
	},

	load: function (saveData) {
		if (saveData.diplomacy) {
			this.loadMetaData(saveData.diplomacy.races, 'get', function (race, saveRace) {
				race.set('unlocked', Boolean(saveRace.unlocked));
				race.set('collapsed', Boolean(saveRace.collapsed));
				race.set('duration', saveRace.duration || null);
				race.set('energy', saveRace.energy || null);
			});
		}
	}
});


dojo.declare('classes.KGSaveEdit.ReligionManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
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
				"unicornsRatio": 0.05
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
			requires: {'zigguratUpgrades': ['unicornTomb']},
			effects: {
				"unicornsRatio": 0.1,
				"riftChance":    5
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
			requires: {'zigguratUpgrades': ['ivoryTower']},
			effects: {
				"unicornsRatio":     0.25,
				"ivoryMeteorChance": 5
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
			requires: {'zigguratUpgrades': ['ivoryCitadel']},
			effects: {
				"unicornsRatio":    0.5,
				"alicornChance":    5,
				"alicornPerTick":   0.00001,
				"ivoryMeteorRatio": 0.05
			}
		}, {
			name: "unicornUtopia",
			label: "Unicorn Utopia",
			description: "Improves your unicorns generation by 250%. Increase alicorn summon chance. Improves TC refine ratio by 10%",
			prices: [
				{name: "ivory", val: 1000000},
				{name: "tears", val: 5000}
			],
			priceRatio: 1.18,
			// unlocks: {"zigguratUpgrades": ["sunspire"]},
			requires: {'zigguratUpgrades': ['skyPalace']},
			effects: {
				"unicornsRatio":    2.5,
				"alicornChance":    15,
				"alicornPerTick":   0.00005,
				"ivoryMeteorRatio": 0.15,
				"tcRefineRatio" :   0.1
			}
		}, {
			name: "sunspire",
			label: "Sunspire",
			description: "Improves your unicorns generation by 500%. Increase alicorn summon chance by significant amount. Improves TC refine ratio by 25%",
			prices: [
				{name: "ivory", val: 1500000},
				{name: "tears", val: 25000}
			],
			priceRatio: 1.15,
			requires: {'zigguratUpgrades': ['unicornUtopia']},
			effects: {
				"unicornsRatio":    5,
				"alicornChance":    30,
				"alicornPerTick":   0.0001,
				"tcRefineRatio":    0.25,
				"ivoryMeteorRatio": 0.5
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
			effects: {}
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
			requires: {perks: ["megalomania"]}
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
			faith: 125000
	}],

	transcendenceUpgradesData: [{
			name: "blackObelisk",
			label: "Black Obelisk",
			description: "Improves your faith bonus.<br>Every Obelisk will improve your transcendance level bonus by 5%",
			prices: [
				{name : "relic", val: 100}
			],
			tier: 1,
			priceRatio: 1.15,
			effects: {},
			unlocked: true,
			flavor: "TBD" // flavor is TBD but the faith bonus improvement is already done
		},{
			name: "blackNexus",
			label: "Black Nexus",
			description: "Improves the rate you refine time crystals into relics.<br>Every Black Pyramid will improve your Relic Refine ratio by 100%. Every level of Black Nexus will increase this bonus by additional 100%",
			prices: [
				{name: "relic", val: 5000}
			],
			tier: 3,
			priceRatio: 1.15,
			effects: {
				"relicRefineRatio": 1.0
			},
			unlocked: true,
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
			unlocked: true,
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
				"tcResourceRatio": 0.10
			},
			unlocked: true,
			flavor: "A gateway... To what?"
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
			effects: { },
			unlocked: true,
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

	tabName: 'Religion',
	getVisible: function () {
		return this.game.resPool.get("faith").owned();
	},

	constructor: function (game) {
		this.zigguratUpgrades = [];
		this.zigguratUpgradesByName = {};
		this.religionUpgrades = [];
		this.religionUpgradesByName = {};
		this.transcendenceUpgrades = [];
		this.transcendenceUpgradesByName = {};

		for (var i = 0, len = this.zigguratUpgradesData.length; i < len; i++) {
			var zu = new classes.KGSaveEdit.ZigguratMeta(game, this.zigguratUpgradesData[i]);
			zu.metaObj = this;
			this.zigguratUpgrades.push(zu);
			this.zigguratUpgradesByName[zu.name] = zu;
		}

		for (i = 0, len = this.religionUpgradesData.length; i < len; i++) {
			var ru = new classes.KGSaveEdit.ReligionMeta(game, this.religionUpgradesData[i]);
			ru.metaObj = this;
			this.religionUpgrades.push(ru);
			this.religionUpgradesByName[ru.name] = ru;
		}

		for (i = 0, len = this.transcendenceUpgradesData.length; i < len; i++) {
			var tu = new classes.KGSaveEdit.TranscendenceMeta(game, this.transcendenceUpgradesData[i]);
			tu.metaObj = this;
			this.transcendenceUpgrades.push(tu);
			this.transcendenceUpgradesByName[tu.name] = tu;
		}

		this.meta.push(this.zigguratUpgrades);
		this.meta.push(this.religionUpgrades);
		this.meta.push(this.transcendenceUpgrades);
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

	getFaithBonus: function() {
		return this._getFaithBonus(this.faithRatio);
	},

	_getFaithBonus: function(ratio) {
		return this.game.getTriValue(ratio, 0.1) * 0.1;
	},

	getTranscendenceLevel: function() {
		var bonus = this._getFaithBonus(this.tcratio) * 100;
		return Math.round(Math.log(bonus));
	},

	getProductionBonus: function() {
		return this.game.getTriValue(this.faith, 1000);
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
		this.zigguratBlock = dojo.create('table', {
			id: 'zigguratBlock',
			'class': 'bottom-margin',
			innerHTML: '<tr><th colspan="2">Ziggurats</th></tr>'
		}, this.tabBlockNode);
		this.zigguratBlockHeader = this.zigguratBlock.children[0];

		var table = dojo.create('table', {'class': 'bottom-margin'}, this.tabBlockNode);

		var tr = dojo.create('tr', {
			innerHTML: '<td>Total faith</td><td></td><td id="solarBonusSpan"></td>'
		}, table);
		this.game._createInput({'class': 'abbrInput'}, tr.children[1], this, 'faith');
		this.solarBonusSpan = tr.children[2];

		tr = dojo.create('tr', {
			innerHTML: '<td>Apocrypha bonus</td><td></td><td id="apocryphaBonusSpan"></td>'
		}, table);
		this.game._createInput({'class': 'abbrInput'}, tr.children[1], this, 'faithRatio');
		this.apocryphaBonusSpan = tr.children[2];

		tr = dojo.create('tr', {
			innerHTML: '<td>Corruption timer</td><td></td><td></td>'
		}, table);
		this.game._createInput({'class': 'abbrInput'}, tr.children[1], this, 'corruption');

		tr = dojo.create('tr', {
			innerHTML: '<td>Transcendence Ratio</td><td></td><td></td>'
		}, table);
		this.game._createInput({'class': 'abbrInput'}, tr.children[1], this, 'tcratio');
		this.transcendenceLevelSpan = tr.children[2];

		this.religionBlock = dojo.create('table', {
			id: 'religionBlock',
			'class': 'bottom-margin',
			innerHTML: '<tr><th colspan="2">Order of the Sun</th></tr>'
		}, this.tabBlockNode);

		this.transcendenceBlock = dojo.create('table', {
			id: 'transcendenceBlock',
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
		this.game.callMethods(this.zigguratUpgrades, 'update');
		this.game.callMethods(this.religionUpgrades, 'update');
		this.game.callMethods(this.transcendenceUpgrades, 'update');

		var text = '';

		dojo.toggleClass(this.zigguratBlockHeader, 'spoiler', !this.game.bld.get('ziggurat').owned());
		dojo.toggleClass(this.transcendenceBlockHeader, 'spoiler', !this.game.science.get('cryptotheology').owned());

		if (this.getRU('solarRevolution').owned()) {
			var bonus = this.getProductionBonus();
			text = " (+" + this.game.getDisplayValueExt(bonus) + "% bonus)";
		}
		this.solarBonusSpan.textContent = text;

		var ratio = this.getFaithBonus();
		this.apocryphaBonusSpan.textContent = " [" + this.game.getDisplayValueExt(ratio * 100, true, false, 1) + "%]";

		text = '';
		var level = this.getTranscendenceLevel();
		if (level > 0) {
			text = '[' + level + ']';
		}
		this.transcendenceLevelSpan.textContent = text;
	},

	save: function (saveData) {
		saveData.religion = {
			faith: this.faith,
			corruption: this.corruption,
			faithRatio: this.faithRatio,
			tcratio: this.tcratio,
			zu: this.game.filterMetadata(this.zigguratUpgrades, ["name", "val", "unlocked"]),
			ru: this.game.mapMethods(this.religionUpgrades, 'save'),
			tu: this.game.filterMetadata(this.transcendenceUpgrades, ["name", "val"]),
		};
	},

	load: function (saveData) {
		if (!saveData.religion) {
			return;
		}

		this.set('faith', num(saveData.religion.faith));
		this.set('corruption', num(saveData.religion.corruption));
		this.set('faithRatio', num(saveData.religion.faithRatio));
		this.set('tcratio', num(saveData.religion.tcratio));

		this.loadMetaData(saveData.religion.zu, 'getZU');
		this.loadMetaData(saveData.religion.ru, 'getRU');
		this.loadMetaData(saveData.religion.tu, 'getTU');
	}
});


dojo.declare('classes.KGSaveEdit.ZigguratMeta', classes.KGSaveEdit.MetaItem, {
	val: 0,
	unlocked: false,

	hideEffects: true,

	getName: function () {
		return (this.label || this.name) + ' (' + this.val + ')';
	},

	owned: function () {
		return this.val > 0;
	},

	render: function () {
		this.domNode = dojo.create('tr', {
			'class': 'zigguratUpgrade',
			innerHTML: '<td>' + (this.label || this.name) + '</td><td></td>'
		});
		this.nameNode = this.domNode.children[0];
		this.game._createInput({'class': 'integerInput ownedInput'}, this.domNode.children[1], this, 'val');

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	getEffect: function (name) {
		return this.effects && this.owned() ? num(this.effects[name]) : 0;
	},

	update: function () {
		this.updateEnabled();
		this.unlocked = this.game.checkRequirements(this);
		dojo.toggleClass(this.nameNode, 'spoiler', !this.unlocked);
	},

	load: function (saveData) {
		this.set('val', num(saveData.val));
		this.set('unlocked', Boolean(saveData.unlocked));
	}
});


dojo.declare('classes.KGSaveEdit.ReligionMeta', classes.KGSaveEdit.MetaItem, {
	val: 0,
	upgradable: false,
	researched: false,

	hideEffects: true,

	owned: function () {
		if (this.upgradable && this.metaObj.getRU('transcendence').researched) {
			return this.val > 0;
		}
		return this.researched;
	},

	getName: function () {
		var name = (this.label || this.name) + ' (';
		if (this.isRU && (!this.upgradable || !this.metaObj.religion.getRU('transcendence').owned())) {
			name += 'complete';
		} else {
			name += this.val;
		}
		return name + ')';
	},

	getPrices: function () {
		var prices = dojo.clone(this.prices) || [];
		var priceRatio = this.priceRatio || 2.5;
		if (!this.upgradable || !this.metaObj.getRU('transcendence').owned()) {
			priceRatio = 1;
		}
		var hasWiseLeader = this.game.village.leader && this.game.village.leader.trait.name == "wise";

		for (var i = prices.length - 1; i >= 0; i--) {
			prices[i].val *= Math.pow(priceRatio, this.val);
			if (hasWiseLeader) {
				if (prices[i].name === "faith") {
					prices[i].val = prices[i].val / 0.9;
				} else if (prices[i].name === "gold") {
					prices[i].val = prices[i].val * 0.9;
				}
			}
		}
		return prices;
	},

	getEffect: function (name) {
		var effect = this.effects && this.owned() ? num(this.effects[name]) : 0;
		effect *= this.upgradable && this.game.religion.getRU('transcendence').owned() ?
			this.val : 1;
		return num(effect);
	},

	render: function () {
		this.domNode = dojo.create('tr', {
			'class': 'religionUpgrade',
			innerHTML: '<td>' + (this.label || this.name) + '</td><td></td>'
		});
		this.nameNode = this.domNode.children[0];

		var td = this.domNode.children[1];
		this.game._createInput({'class': 'integerInput ownedInput'}, td, this, 'val');
		this.valNode.handler = function () {
			this.game.setCheckbox(this.metaObj.researchedNode, this.parsedValue, true, true);
		};

		var input = this.game._createCheckbox('Bought', td, this, 'researched');
		this.researchedNode = input.cbox;
		dojo.addClass(input.cbox, 'ownedInput');
		input.cbox.handler = function () {
			var ru = this.metaObj;
			if (this.checked !== Boolean(ru.val)) {
				var value = this.checked ? Math.max(ru.valNode.prevValue, 1) : 0;
				ru.val = this.game.setInput(ru.valNode, num(value), true, true);
			}
		};

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	update: function () {
		this.updateEnabled();
		dojo.toggleClass(this.nameNode, 'spoiler', this.game.religion.faith < this.faith);

		var t = Boolean(this.upgradable && this.game.religion.getRU('transcendence').researched);
		dojo.toggleClass(this.researchedNode.parentNode, 'hidden', t);
		dojo.toggleClass(this.valNode, 'hidden', !t);
	},

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "val"]);
		saveData.researched = this.owned();
		return saveData;
	},

	load: function (saveData) {
		this.set('val', num(saveData.val));
		this.set('researched', Boolean(saveData.researched) || this.val > 0);
	}
});


dojo.declare('classes.KGSaveEdit.TranscendenceMeta', classes.KGSaveEdit.MetaItem, {
	val: 0,
	unlocked: false,

	hideEffects: true,

	getName: function () {
		return (this.label || this.name) + ' (' + this.val + ')';
	},

	owned: function () {
		return this.val > 0;
	},

	render: function () {
		this.domNode = dojo.create('tr', {
			'class': 'transcendenceUpgrade',
			innerHTML: '<td>' + (this.label || this.name) + '</td><td></td>'
		});
		this.nameNode = this.domNode.children[0];
		this.game._createInput({'class': 'integerInput ownedInput'}, this.domNode.children[1], this, 'val');

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
		dojo.toggleClass(this.nameNode, 'spoiler', !this.unlocked);
	},

	load: function (saveData) {
		this.set('val', num(saveData.val));
		this.set('unlocked', Boolean(saveData.unlocked));
	}
});


dojo.declare("classes.KGSaveEdit.ui.Toolbar", null, {
	icons: null,
	game: null,

	constructor: function(game) {
		this.game = game;
		this.icons = [];

		this.addIcon(new classes.KGSaveEdit.ui.toolbar.ToolbarHappiness(game));
		this.addIcon(new classes.KGSaveEdit.ui.toolbar.ToolbarEnergy(game));
	},

	addIcon: function(icon) {
		this.icons.push(icon);
	},

	render: function(container) {
		dojo.empty(container);
		this.game.callMethods(this.icons, 'render', container);
	},

	update: function() {
		this.game.callMethods(this.icons, 'update');
	}
});


dojo.declare("classes.KGSaveEdit.ui.ToolbarIcon", classes.KGSaveEdit.TooltipItem, {
	game: null,
	container: null,

	constructor: function (game) {
		this.game = game;
	},

	render: function (container) {
		this.container = dojo.create("span", {
			className: "toolbarIcon"
		}, container);

		this.registerTooltip(this.container);
		return this.container;
	},

	update: function () { },

	getTooltip: function () {
		return "Unimplemented";
	},

	getTooltipOffset: function (node) {
		var pos = dojo.position(node);
		return {
			top: 5,
			left: pos.x
		};
	}
});


dojo.declare("classes.KGSaveEdit.ui.toolbar.ToolbarHappiness", classes.KGSaveEdit.ui.ToolbarIcon, {
	update: function () {
		dojo.toggleClass(this.container, 'hidden', this.game.village.getKittens() <= 5);
		this.container.innerHTML = "(:3)&nbsp;" + Math.floor(this.game.village.happiness * 100) + "%";
		dojo.addClass(this.container, "coral");
	},

	getTooltip: function () {
		var tooltip = dojo.byId('tooltipBlock');
		tooltip.className = '';

		var base = this.game.bld.getEffect("happiness");
		//var population = this.game.village.getKittens() *  2;
		var html = "Base: 100%<br>" + "Buildings: +" + (Math.floor(base)) + "%<br>";

		//----------------------
		var resHappiness = 0;
		var resources = this.game.resPool.resources;
		for (var i = resources.length - 1; i >= 0; i--) {
			if (resources[i].type !== "common" && resources[i].value > 0) {
				resHappiness += 10;
			}
		}
		html += "Rare resources: +" + this.game.getDisplayValueExt(resHappiness, false, false, 0) + "%<br>";
		//---------------------
		var karma = this.game.resPool.get("karma");
		if (karma.value > 0) {
			html += "Karma: +" + this.game.getDisplayValueExt(karma.value, false, false, 0) + "%<br>";
		}

		var unhappiness = (this.game.village.getKittens() - 5) * 2;

		var unhappinessReduction = unhappiness * this.game.bld.getEffect("unhappinessRatio", true);
		html += "Population penalty: -" + this.game.getDisplayValueExt(unhappiness + unhappinessReduction, false, false, 0) + "%<br>";

		html += "* Penalty base: -" + this.game.getDisplayValueExt(unhappiness, false, false, 0) + "%<br>";
		html += "* Penalty mitigated: " + -this.game.getDisplayValueExt(unhappinessReduction, false, false, 0) + "%<br>";

		/*var amphitheatre = this.game.bld.getBuilding("amphitheatre");
		if (amphitheatre.unlocked){
			html += "*&nbsp;Amphitheaters:" + */

		var overpopulation = this.game.village.getKittens() - this.game.village.maxKittens;
		if (overpopulation > 0) {
			html += "Overpopulation: -" + overpopulation * 2 + "%<br>";
		}

		tooltip.innerHTML = html;
	}
});


dojo.declare("classes.KGSaveEdit.ui.toolbar.ToolbarEnergy", classes.KGSaveEdit.ui.ToolbarIcon, {
	update: function () {
		dojo.toggleClass(this.container, 'hidden', !this.game.science.get("electricity").researched);

		var resPool = this.game.resPool;
		var energy = resPool.energyProd - resPool.energyCons;
		this.container.innerHTML = "&#9889;&nbsp;" + this.game.getDisplayValueExt(energy) + "Wt";

		dojo.toggleClass(this.container, 'green', energy >= 0);
		dojo.toggleClass(this.container, 'red', energy < 0);
	},

	getTooltip: function () {
		var tooltip = dojo.byId('tooltipBlock');
		tooltip.className = '';

		var resPool = this.game.resPool;
		var energy = resPool.energyProd - resPool.energyCons;
		var delta = this.game.resPool.getEnergyDelta();
		var penalty = energy >= 0 ? "" : "<br><br>Production modifier: <span style='color:red;'>-" + Math.floor((1 - delta) * 100) + "%</span>";

		tooltip.innerHTML = "Production: <span style='color:green;'>" +
			this.game.getDisplayValueExt(resPool.energyProd, true, false) +
			"Wt</span>" + "<br>Consumption: <span style='color:#D00000;'>-" +
			this.game.getDisplayValueExt(resPool.energyCons) +
			"Wt</span>" + penalty;
	}
});


// TODO when game has callenges
dojo.declare("classes.KGSaveEdit.ChallengeManager", classes.KGSaveEdit.Manager, {
	game: null,

	challenges: null,

	constructor: function (game) {
		this.game = game;
		this.challenges = [];

		// for (var i = 0; i < this.challenges.length; i++) {

		// }
	},

	getChallenge: function(name) {
		return this.getMeta(name, this.challenges);
	},

	save: function (saveData) {
		saveData.challenges = {
			challenges: this.game.filterMetadata(this.challenges, ["name", "enabled"])
		};
	},

	load: function (saveData) {
		if (saveData.challenges) {
			this.loadMetaData(saveData.challenges.challenges, 'getChallenge', function () { /*["unlocked", "enabled"]*/ });
		}
	}
});


});
