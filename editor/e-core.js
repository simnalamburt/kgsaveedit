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
dojo.declare("classes.KGSaveEdit.core", null, {
	set: function (key, value) {
		if (this[key + "Node"] && this[key + "Node"].dataProp === key) {
			var args = [].slice.call(arguments, 2);
			args = [this[key + "Node"], value].concat(args);
			value = this.game.setEle.apply(this.game, args);
		}
		this[key] = value;
		return value;
	}
});

dojo.declare("classes.KGSaveEdit.UI.Tab", classes.KGSaveEdit.core, {
	game: null,

	tabNode: null,
	tabBlockNode: null,
	tabWrapper: null,
	isVisible: true,

	tabName: "Undefined",

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
		this.tabWrapper = dojo.create("span", {
			class: "wrapper separated" + (this.isVisible ? "" : " spoiler")
		});

		this.tabNode = dojo.create("a", {
			class: "tab",
			href: "#",
			innerHTML: this.getTabName(),
		}, this.tabWrapper);

		this.tabBlockNode = dojo.create("div", {
			class: "tabBlock hidden" + (this.tabBlockClass ? " " + this.tabBlockClass : "")
		});

		on(this.tabNode, "click", dojo.hitch(this, function (event) {
			event.preventDefault();
			dojo.query(".activeTab", "tabContainer").removeClass("activeTab");
			dojo.query(".tabBlock", "tabBlocksContainer").addClass("hidden");
			dojo.addClass(this.tabNode, "activeTab");
			dojo.removeClass(this.tabBlockNode, "hidden");
			this.game.activeTab = this;
		}));

		if (this.game.activeTab === this) {
			dojo.addClass(this.tabNode, "activeTab");
			dojo.removeClass(this.tabBlockNode, "hidden");
		}
	},

	renderTabBlock: function () { },

	updateTab: function () {
		this.tabNode.innerHTML = this.getTabName();
		this.isVisible = this.getVisible();
		dojo.toggleClass(this.tabWrapper, "spoiler", !this.isVisible);
	}
});

dojo.declare("classes.KGSaveEdit.Manager", classes.KGSaveEdit.core, {
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

	/**
	 * Loops through dataArray, and creates new ClassObjs out of its data
	 * Creates array/itemByName objects for storing the new items if necessary
	 * If a function is passed as fn, calls it with this set to the manager
	 */
	registerMetaItems: function (dataArray, ClassObj, key, fn) {
		var arr = this[key] || [];
		var byName = this[key + "ByName"] || {};
		this[key] = arr;
		this[key + "ByName"] = byName;

		for (var i = 0; i < dataArray.length; i++) {
			var item = new ClassObj(this.game, dataArray[i]);
			item.metaObj = this;
			arr.push(item);
			byName[item.name] = item;

			if (fn) {
				fn.call(this, item);
			}
		}
	},

	getMeta: function (name, metadata) {
		for (var i = metadata.length - 1; i >= 0; i--) {
			var meta = metadata[i];

			if (meta.name === name) {
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
		return num(this.getEffectBase(name)) + num(this.getEffectCached(name));
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

	getMetaEffect: function (name, metadata) {
		var totalEffect = 0;
		if (!metadata.length) {
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
				} else if ("load" in meta) {
					meta.load(saveMeta);
				}
			}
		}
	}
});


dojo.declare("classes.KGSaveEdit.GenericItem", classes.KGSaveEdit.core, {
	game: null,

	name: "Undefined",

	constructor: function (game, data) {
		this.game = game;
		dojo.mixin(this, data);
		this.metaData = data;
	}
});


dojo.declare("classes.KGSaveEdit.TooltipItem", classes.KGSaveEdit.core, {
	getTooltip: function () {
		return "Unimplemented";
	},

	getTooltipOffset: function (node) {
		var pos = dojo.position(node);
		return {
			left: pos.x + pos.w + 20,
			top: pos.y
		};
	},

	registerTooltip: function (node) {
		if (!node) {
			return;
		}

		var tooltip = dojo.byId("tooltipBlock");

		var updateTooltip = dojo.hitch(this, function () {
			tooltip.removeAttribute("style");
			tooltip.innerHTML = "";

			var viewPos = dojo.position(tooltip.parentNode);
			this.getTooltip(node);

			if (dojo.hasClass(tooltip, "hidden")) {
				return;
			}

			var pos = this.getTooltipOffset(node);
			pos.top = Math.abs(pos.top - viewPos.y);

			//keep tooltip from moving outside viewing area
			var tooltipPos = dojo.position(tooltip);
			pos.top = Math.min(pos.top, viewPos.h - 25 - tooltipPos.h);

			pos.left = Math.min(pos.left, viewPos.w - 25 - tooltipPos.w);

			tooltip.style.top = pos.top + "px";
			tooltip.style.left = pos.left + "px";
		});

		on(node, mouse.enter, dojo.hitch(this, function () {
			this.game.tooltipUpdateFunc = updateTooltip;
			updateTooltip();
		}));

		on(node, mouse.leave, dojo.hitch(this, function () {
			tooltip.removeAttribute("style");
			tooltip.innerHTML = "";
			dojo.addClass(tooltip, "hidden");
			this.game.tooltipUpdateFunc = null;
		}));
	}
});


dojo.declare("classes.KGSaveEdit.MetaItem", [classes.KGSaveEdit.GenericItem, classes.KGSaveEdit.TooltipItem], {
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
		dojo.toggleClass(this.nameNode, "limited", this.game.opts.highlightUnavailable && limited);
		dojo.toggleClass(this.nameNode, "btnDisabled", limited || !hasRes);
	},

	registerHighlight: function (node) {
		on(node, mouse.enter, dojo.hitch(this, function () {
			dojo.query(".highlited").removeClass("highlited");

			var prices = this.getPrices(true);
			var resPool = this.game.resPool;
			if (prices) {
				for (var i = prices.length - 1; i >= 0; i--) {
					var res = resPool.get(prices[i].name);
					if (res) {
						dojo.addClass(res.domNode, "highlited");
					}
				}
			}
		}));

		on(node, mouse.leave, function () {
			dojo.query(".highlited").removeClass("highlited");
		});
	},

	getTooltip: function () {
		var tooltip = dojo.byId("tooltipBlock");
		tooltip.className = "button_tooltip";

		if (this.getName) {
			dojo.create("div", {
				class: "tooltipName",
				innerHTML: this.getName()
			}, tooltip);
		}

		var descBlock;
		if (this.description || this.getDescription) {
			descBlock = dojo.create("div", {
				class: "tooltipDesc",
				innerHTML: this.getDescription ? this.getDescription() : this.description
			}, tooltip);
		}

		var prices = this.getPrices ? this.getPrices() : this.prices;
		if (prices) {
			if (descBlock) {
				dojo.addClass(descBlock, "tooltipDescBottom");
			}
			this.game.renderPrices(tooltip, prices);
		}

		if (!this.hideEffects && (this.effects || this.getEffects)) {
			this.game.renderEffects(tooltip, this.getEffects ? this.getEffects() : this.effects);
		}

		if (this.flavor) {
			dojo.create("div", {
				class: "tooltipFlavor",
				innerHTML: this.flavor
			}, tooltip);
		}
	}
});


});
