/* global dojo, require, classes */

require([], function () {
"use strict";

dojo.declare("classes.KGSaveEdit.PrestigeManager", classes.KGSaveEdit.Manager, {
	perksData: [{
			name: "engeneering",
			label: "Engineering",
			description: "Reduce all price ratios by 1% (The price will grow up much slower). Unlocks more price upgrades.",
			prices: [
				{name: "paragon", val: 5}
			],
			unlocked: true,
			// unlocks: {"perks": ["megalomania", "goldenRatio", "codexVox"]},
			effects: {
				"priceRatio": -0.01
			}
		}, {
			name: "codexVox",
			label: "Codex Vox",
			description: "Improves manuscript craft ratio by 25%.",
			prices: [
				{name: "paragon", val: 25}
			],
			// unlocks: {"perks": ["codexLogos"]},
			requires: {perks: ["engeneering"]},
			effects: {
				"manuscriptCraftRatio":       0.25,
				"manuscriptGlobalCraftRatio": 0.05
			}
		}, {
			name: "codexLogos",
			label: "Codex Logos",
			description: "Improves compendium craft ratio by 25%.",
			prices: [
				{name: "paragon", val: 50}
			],
			// unlocks: {"perks": ["codexAgrum"]},
			requires: {perks: ["codexVox"]},
			effects: {
				"compediumCraftRatio":        0.25,
				"manuscriptGlobalCraftRatio": 0.05,
				"compediumGlobalCraftRatio":  0.05
			}
		}, {
			name: "codexAgrum",
			label: "Codex Agrum",
			description: "Improves blueprint craft ratio by 25%.",
			prices: [
				{name: "paragon", val: 75}
			],
			requires: {perks: ["codexLogos"]},
			effects: {
				"blueprintCraftRatio":        0.25,
				"manuscriptGlobalCraftRatio": 0.05,
				"compediumGlobalCraftRatio":  0.05,
				"blueprintGlobalCraftRatio":  0.05
			}
		}, {
			name: "megalomania",
			label: "Megalomania",
			description: "Unlocks additional megastructures.",
			prices: [
				{name: "paragon", val: 10}
			],
			// unlocks: {"perks": ["blackCodex"], "zigguratUpgrades": ["marker", "blackPyramid"]},
			requires: {perks: ["engeneering"]}
		}, {
			name: "blackCodex",
			label: "Black Codex",
			description: "Unlocks unicorn graveyards.",
			prices: [
				{name: "paragon", val: 25}
			],
			// unlocks: {"zigguratUpgrades": ["unicornGraveyard"]},
			requires: {perks: ["megalomania"]}
		}, {
			name: "goldenRatio",
			label: "Golden Ratio",
			description: "Reduce all price ratios by ~1.618%",
			prices: [
				{name: "paragon", val: 50}
			],
			// unlocks: {"perks": ["divineProportion"]},
			requires: {perks: ["engeneering"]},
			effects: {
				"priceRatio": -(1 + Math.sqrt(5)) / 200 //Calculates the Golden Ratio
			}
		}, {
			name: "divineProportion",
			label: "Divine Proportion",
			description: "Reduce all price ratios by 1.7%",
			prices: [
				{name: "paragon", val: 100}
			],
			// unlocks: {"perks": ["vitruvianFeline"]},
			requires: {perks: ["goldenRatio"]},
			effects: {
				"priceRatio": -0.017
			}
		}, {
			name: "vitruvianFeline",
			label: "Vitruvian Feline",
			description: "Reduce all price ratios by 2%",
			prices: [
				{name: "paragon", val: 250}
			],
			// unlocks: {"perks": ["renaissance"]},
			requires: {perks: ["divineProportion"]},
			effects: {
				"priceRatio": -0.02
			}
		}, {
			name: "renaissance",
			label: "Renaissance",
			description: "Reduce all price ratios by 2.25%",
			prices: [
				{name: "paragon", val: 750}
			],
			requires: {perks: ["vitruvianFeline"]},
			effects: {
				"priceRatio": -0.0225
			}
		}, {
			name: "diplomacy",
			label: "Diplomacy",
			description: "Races will be discovered earlier and with better standing. Unlocks more trade upgrades.",
			prices: [
				{name: "paragon", val: 5}
			],
			// unlocks: {"perks": ["zebraDiplomacy"]},
			unlocked: true
		}, {
			name: "zebraDiplomacy",
			label: "Zebra Diplomacy",
			description: "Some zebras hunters will stay in the village. (You need to unlock zebra hunters first to use this upgrade).",
			prices: [
				{name: "paragon", val: 35}
			],
			// unlocks: {"perks": ["zebraCovenant"]},
			requires: {perks: ["diplomacy"]}
		}, {
			name: "zebraCovenant",
			label: "Zebra Covenant",
			description: "More zebras will stay with you.",
			prices: [
				{name: "paragon", val: 75}
			],
			requires: {perks: ["zebraDiplomacy"]}
		}, {
			name: "chronomancy",
			label: "Chronomancy",
			description: "Meteor and star events will happen faster.",
			prices: [
				{name: "paragon", val: 25}
			],
			// unlocks: {"perks": ["astromancy", "anachronomancy", "unicornmancy"]},
			unlocked: true
		}, {
			name: "astromancy",
			label: "Astromancy",
			description: "Star events chance and observatory effectiveness are doubled",
			prices: [
				{name: "paragon", val: 50}
			],
			requires: {perks: ["chronomancy"]}
		}, {
			name: "unicornmancy",
			label: "Unicornmancy",
			description: "Unicorn rifts and ivory meteors are more frequent.",
			prices: [
				{name: "paragon", val: 125}
			],
			unlocked: true
		}, {
			name: "anachronomancy",
			label: "Anachronomancy",
			description: "Time crystals and chronophysics will be saved across resets.",
			prices: [
				{name: "paragon", val: 125}
			],
			requires: {perks: ["chronomancy"]}
		}, {
			name: "carnivals",
			label: "Carnivals",
			description: "Festivals can now stack",
			prices: [
				{name: "paragon", val: 25}
			],
			// unlocks: {"perks": ["numerology"]},
			unlocked: true
		}, {
			name: "willenfluff",
			label: "Venus of Willenfluff",
			description: "Kittens will arrive 75% faster.",
			prices: [
				{name: "paragon", val: 150}
			],
			// unlocks: {"perks": ["pawgan"]},
			requires: {perks: ["numerology"]},
			effects: {
				"kittenGrowthRatio": 0.75
			}
		}, {
			name: "pawgan",
			label: "Pawgan Rituals",
			description: "Kittens will arrive an additional 150% faster.",
			prices: [
				{name: "paragon", val: 400}
			],
			requires: {perks: ["willenfluff"]},
			effects: {
				"kittenGrowthRatio": 1.50
			}
		}, {
			name: "numerology",
			label: "Numerology",
			description: "Certain years will have special effects.",
			prices: [
				{name: "paragon", val: 50}
			],
			// unlocks: {"perks": ["numeromancy", "willenfluff", "voidOrder"]},
			requires: {perks: ["carnivals"]}
		}, {
			name: "numeromancy",
			label: "Numeromancy",
			description: "Certain years will have extra effects during Festivals.",
			prices: [
				{name: "paragon", val: 500}
			],
			// unlocks: {"perks": ["malkuth"]},
			requires: {perks: ["numerology"]}
		}, {
			name: "malkuth",
			label: "Malkuth",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 500}
			],
			// unlocks: {"perks": ["yesod"]},
			requires: {perks: ["numeromancy"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "yesod",
			label: "Yesod",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 750}
			],
			// unlocks: {"perks": ["hod"]},
			requires: {perks: ["malkuth"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "hod",
			label: "Hod",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 1250}
			],
			// unlocks: {"perks": ["netzach"]},
			requires: {perks: ["yesod"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "netzach",
			label: "Netzach",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 1750}
			],
			// unlocks: {"perks": ["tiferet"]},
			requires: {perks: ["hod"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "tiferet",
			label: "Tiferet",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 2500}
			],
			// unlocks: {"perks": ["gevurah"]},
			requires: {perks: ["netzach"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "gevurah",
			label: "Gevurah",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 5000}
			],
			// unlocks: {"perks": ["chesed"]},
			requires: {perks: ["tiferet"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "chesed",
			label: "Chesed",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 7500}
			],
			// unlocks: {"perks": ["binah"]},
			requires: {perks: ["gevurah"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "binah",
			label: "Binah",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 15000}
			],
			// unlocks: {"perks": ["chokhmah"]},
			requires: {perks: ["chesed"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "chokhmah",
			label: "Chokhmah",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 30000}
			],
			// unlocks: {"perks": ["keter"]},
			requires: {perks: ["binah"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "keter",
			label: "Keter",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 60000}
			],
			requires: {perks: ["chokhmah"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "voidOrder",
			label: "Order of Void",
			description: "Every priest will now give a minor bonus to faith accumulation",
			prices: [
				{name: "paragon", val: 75}
			],
			requires: {perks: ["numerology"]}
		}, {
			name: "adjustmentBureau",
			label: "Adjustment Bureau",
			description: "Unlocks additional game challenges.",
			prices: [
				{name: "paragon", val: 5}
			],
			// unlocks: {"perks": ["ascoh"]},
			unlocked: true
		}, {
			name: "ascoh",
			label: "ASCOH",
			description: "A Secret Council Of Hats",
			prices: [
				{name: "paragon", val: 5}
			],
			requires: {perks: ["adjustmentBureau"]}
	}],

	domNode: null,

	perks: null,
	perksByName: null,

	constructor: function () {
		this.registerMetaItems(this.perksData, classes.KGSaveEdit.UpgradeMeta, "perks");
		this.meta.push(this.perks);
	},

	getPerk: function (name) {
		return this.perksByName[name];
	},

	getSpentParagon: function () {
		var paragon = 0;
		for (var i = this.perks.length - 1; i >= 0; i--) {
			var perk = this.perks[i];
			if (perk.researched) {
				if (perk.prices) {
					for (var j = perk.prices.length - 1; j >= 0; j--) {
						var price = perk.prices[j];
						if (price && price.name === "paragon") {
							paragon += price.val || 0;
						}
					}
				} else {
					paragon += perk.paragon || 0;
				}
			}
		}
		return paragon;
	},

	getParagonRatio: function () {
		return 1.0 + this.getEffect("paragonRatio");
	},

	getBurnedParagonRatio: function () {
		return this.game.getTriValue(this.game.resPool.get("burnedParagon").value, 500);
	},

	getParagonProductionRatio: function () {
		var paragonRatio = this.getParagonRatio();

		var productionRatioParagon = (this.game.resPool.get("paragon").value * 0.010) * paragonRatio;
		productionRatioParagon = this.game.getHyperbolicEffect(productionRatioParagon, 2 * paragonRatio);

		var ratio = this.game.calendar.darkFutureYears() >= 0 ? 4 : 1;
		var productionRatioBurnedParagon = this.game.resPool.get("burnedParagon").value * 0.010 * paragonRatio;
		productionRatioBurnedParagon = this.game.getHyperbolicEffect(productionRatioBurnedParagon, ratio * paragonRatio);

		return productionRatioParagon + productionRatioBurnedParagon;
	},

	getParagonStorageRatio: function () {
		var paragonRatio = this.getParagonRatio();
		var storageRatio = (this.game.resPool.get("paragon").value / 1000) * paragonRatio; //every 100 paragon will give a 10% bonus to the storage capacity
		if (this.game.calendar.darkFutureYears() >= 0) {
			storageRatio += (this.game.resPool.get("burnedParagon").value / 500) * paragonRatio;
		} else {
			storageRatio += (this.game.resPool.get("burnedParagon").value / 2000) * paragonRatio;
		}
		return storageRatio;
	},

	render: function () {
		this.domNode = dojo.create("table", {
			id: "metaphysicsBlock",
			class: "bottom-margin",
			innerHTML: '<tr><th colspan="2">Metaphysics</th></tr>'
		}, this.game.science.tabBlockNode);
		this.domNodeHeader = this.domNode.children[0];

		for (var i = 0, len = this.perks.length; i < len; i++) {
			var perk = this.perks[i];
			perk.render();
			dojo.place(perk.domNode, this.domNode);
		}
	},

	update: function () {
		this.game.callMethods(this.perks, "update", this.game.science.hideResearched);
		dojo.toggleClass(this.domNodeHeader, "spoiler", !this.game.science.get("metaphysics").owned());
	},

	save: function (saveData) {
		saveData.prestige = {
			perks: this.game.filterMetadata(this.perks, ["name", "unlocked", "researched"])
		};
	},

	load: function (saveData) {
		this.loadMetadata(saveData, "prestige.perks", "getPerk", null, true);
	}
});

});
