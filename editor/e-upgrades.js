/* global dojo, require, classes, num */

require([], function () {
"use strict";

dojo.declare("classes.KGSaveEdit.UpgradeMeta", classes.KGSaveEdit.MetaItem, {
	name: "Undefined",
	unlocked: false,
	researched: false,

	domNode: null,

	constructor: function () { },

	getName: function () {
		var name = this.label || this.name;
		if (this.researched) {
			return name + " (Complete)";
		}
		return name;
	},

	getEffect: function (name) {
		if (!this.effects || !this.owned()) {
			return 0;
		}
		return this.effects[name];
	},

	render: function () {
		this.domNode = dojo.create("tr", {
			class: "upgradeMeta",
			innerHTML: "<td>" + (this.label || this.name) + "</td><td></td>"
		});
		this.nameNode = this.domNode.children[0];

		this.game._createCheckbox("Unlocked", this.domNode.children[1], this, "unlocked");
		this.game._createCheckbox("Researched", this.domNode.children[1], this, "researched");
		dojo.addClass(this.researchedNode, "ownedInput");

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	owned: function () {
		return this.researched;
	},

	update: function (hideResearched) {
		// dojo.toggleClass(this.domNode, "metaOwned", this.researched);

		var hideme = hideResearched && this.researched;
		if (!hideme && this.hidden) {
			hideme = !this.unlocked && !this.researched;
		}
		dojo.toggleClass(this.domNode, "hidden", Boolean(hideme));

		var req = this.game.checkRequirements(this);
		if (req) {
			if (!this.unlocked) {
				this.unlockedNode.checked = true;
				this.unlocked = true;
			}
		} else {
			if (this.unlocked !== this.unlockedNode.prevChecked) {
				this.unlockedNode.checked = this.unlockedNode.prevChecked;
				this.unlocked = this.unlockedNode.checked;
			}
		}

		dojo.toggleClass(this.nameNode, "spoiler", !this.unlocked);
		this.game.toggleDisabled(this.unlockedNode, req);
		this.updateEnabled();
	},

	load: function (saveData) {
		this.set("unlocked", Boolean(saveData.unlocked), false, true);
		this.set("researched", Boolean(saveData.researched));
	}
});


dojo.declare("classes.KGSaveEdit.WorkshopManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	upgradeData: [{
			name: "mineralHoes",
			label: "Mineral Hoes",
			description: "Your farmers are 50% more effective",
			prices: [
				{name: "science",  val: 100},
				{name: "minerals", val: 275}
			],
			unlocked: true,
			// unlocks: {upgrades: ["ironHoes"]},
			effects: {
				"catnipJobRatio": 0.5
			}
		}, {
			name: "ironHoes",
			label: "Iron Hoes",
			description: "Your farmers are 30% more effective",
			prices: [
				{name: "science", val: 200},
				{name: "iron",    val: 25}
			],
			unlocked: true,
			effects: {
				"catnipJobRatio": 0.3
			}
		}, {
			name: "mineralAxes",
			label: "Mineral Axe",
			description: "Woodcutters are 70% more effective",
			prices: [
				{name: "science",  val: 100},
				{name: "minerals", val: 500}
			],
			unlocked: true,
			// unlocks: {upgrades: ["ironAxes"]},
			effects: {
				"woodJobRatio": 0.7
			}
		}, {
			name: "ironAxes",
			label: "Iron Axe",
			description: "Woodcutters are 50% more effective",
			prices: [
				{name: "science", val: 200},
				{name: "iron",    val: 50}
			],
			unlocked: true,
			effects: {
				"woodJobRatio": 0.5
			}
		}, {
			name: "steelAxe",
			label: "Steel Axe",
			description: "Very sharp and durable axes. Woodcutters are 50% more effective",
			prices: [
				{name: "science", val: 20000},
				{name: "steel",   val: 75}
			],
			requires: {tech: ["steel"]},
			effects: {
				"woodJobRatio": 0.5
			}
		}, {
			name: "reinforcedSaw",
			label: "Reinforced Saw",
			description: "Improve Lumber Mill efficiency by 20%",
			prices: [
				{name: "science", val: 2500},
				{name: "iron",    val: 1000}
			],
			requires: {tech: ["construction"]},
			effects: {
				"lumberMillRatio": 0.2
			},
			upgrades: {buildings: ["lumberMill"]}
		}, {
			name: "steelSaw",
			label: "Steel Saw",
			description: "Improve Lumber Mill efficiency by 20%",
			prices: [
				{name: "science", val: 52000},
				{name: "steel",   val: 750}
			],
			// unlocks: {upgrades: ["titaniumSaw"]},
			requires: {tech: ["physics"]},
			effects: {
				"lumberMillRatio": 0.2
			},
			upgrades: {buildings: ["lumberMill"]}
		}, {
			name: "titaniumSaw",
			label: "Titanium Saw",
			description: "Improve Lumber Mill efficiency by 15%",
			prices: [
				{name: "science",  val: 70000},
				{name: "titanium", val: 500}
			],
			// unlocks: {upgrades: ["alloySaw"]},
			requires: {upgrades: ["steelSaw"]},
			effects: {
				"lumberMillRatio": 0.15
			},
			upgrades: {buildings: ["lumberMill"]}
		}, {
			name: "alloySaw",
			label: "Alloy Saw",
			description: "Improve Lumber Mill efficiency by 15%",
			prices: [
				{name: "science", val: 85000},
				{name: "alloy",   val: 75}
			],
			requires: {upgrades: ["titaniumSaw"]},
			effects: {
				"lumberMillRatio": 0.15
			},
			upgrades: {buildings: ["lumberMill"]}
		}, {
			name: "titaniumAxe",
			label: "Titanium Axe",
			description: "Indestructible axes. Woodcutters are 50% more effective.",
			prices: [
				{name: "science",  val: 38000},
				{name: "titanium", val: 10}
			],
			requires: {tech: ["navigation"]},
			effects: {
				"woodJobRatio": 0.5
			}
		}, {
			name: "alloyAxe",
			label: "Alloy Axe",
			description: "The more you use them, the sharper they are! Woodcutters are 50% more effective.",
			prices: [
				{name: "science", val: 70000},
				{name: "alloy",   val: 25}
			],
			requires: {tech: ["chemistry"]},
			effects: {
				"woodJobRatio": 0.5
			}
		}, {
			name: "unobtainiumAxe",
			label: "Unobtainium Axe",
			description: "Those axes are literally unobtainable! Woodcutters are 50% more effective.",
			prices: [
				{name: "science",     val: 125000},
				{name: "unobtainium", val: 75}
			],
			// requires: {program: ["moonMission"]},
			effects: {
				"woodJobRatio": 0.5
			},
			hidden: true
		}, {
			name: "unobtainiumSaw",
			label: "Unobtainium Saw",
			description: "Improve Lumber Mill efficiency by 25%",
			prices: [
				{name: "science",     val: 145000},
				{name: "unobtainium", val: 125}
			],
			// requires: {program: ["moonMission"]},
			effects: {
				"lumberMillRatio": 0.25
			},
			upgrades: {buildings: ["lumberMill"]},
			hidden: true
		}, {
			name: "stoneBarns",
			label: "Expanded Barns",
			description: "Barns store 75% more wood and iron",
			prices: [
				{name: "science",  val: 500},
				{name: "wood",     val: 1000},
				{name: "minerals", val: 750},
				{name: "iron",     val: 50}
			],
			unlocked: true,
			effects: {
				"barnRatio": 0.75
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor"]}
		}, {
			name: "reinforcedBarns",
			label: "Reinforced Barns",
			description: "Barns store 80% more wood and iron",
			prices: [
				{name: "science", val: 800},
				{name: "beam",    val: 25},
				{name: "slab",    val: 10},
				{name: "iron",    val: 100}
			],
			unlocked: true,
			// unlocks: {upgrades: ["titaniumBarns"]},
			effects: {
				"barnRatio": 0.8
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor"]}
		}, {
			name: "reinforcedWarehouses",
			label: "Reinforced Warehouses",
			description: "Warehouses store 25% more resources",
			prices: [
				{name: "science",  val: 15000},
				{name: "plate",    val: 50},
				{name: "steel",    val: 50},
				{name: "scaffold", val: 25}
			],
			// unlocks: {upgrades: ["ironwood"]},
			requires: {tech: ["steel"]},
			effects: {
				"warehouseRatio": 0.25
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor", "mint"]}
		}, {
			name: "titaniumBarns",
			label: "Titanium Barns",
			description: "Barns store twice as many resources",
			prices: [
				{name: "science",  val: 60000},
				{name: "titanium", val: 25},
				{name: "steel",    val: 200},
				{name: "scaffold", val: 250}
			],
			requires: {upgrades: ["reinforcedBarns"]},
			effects: {
				"barnRatio": 1
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor"]}
		}, {
			name: "alloyBarns",
			label: "Alloy Barns",
			description: "Barns store twice as many resources",
			prices: [
				{name: "science", val: 75000},
				{name: "alloy",   val: 20},
				{name: "plate",   val: 750}
			],
			requires: {tech: ["chemistry"]},
			effects: {
				"barnRatio": 1
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor"]}
		}, {
			name: "concreteBarns",
			label: "Concrete Barns",
			description: "Barns store 75% more resources",
			prices: [
				{name: "science",  val: 100000},
				{name: "concrate", val: 45},
				{name: "titanium", val: 2000}
			],
			requires: {upgrades: ["strenghtenBuild"]},
			effects: {
				"barnRatio": 0.75
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor"]}
		}, {
			name: "titaniumWarehouses",
			label: "Titanium Warehouses",
			description: "Warehouses store 50% more resources",
			prices: [
				{name: "science",  val: 70000},
				{name: "titanium", val: 50},
				{name: "steel",    val: 500},
				{name: "scaffold", val: 500}
			],
			requires: {upgrades: ["silos"]},
			effects: {
				"warehouseRatio": 0.5
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor", "mint"]}
		}, {
			name: "alloyWarehouses",
			label: "Alloy Warehouses",
			description: "Warehouses store 45% more resources",
			prices: [
				{name: "science",  val: 90000},
				{name: "titanium", val: 750},
				{name: "alloy",    val: 50}
			],
			requires: {tech: ["chemistry"]},
			effects: {
				"warehouseRatio": 0.45
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor", "mint"]}
		}, {
			name: "concreteWarehouses",
			label: "Concrete Warehouses",
			description: "Warehouses store 35% more resources",
			prices: [
				{name: "science",  val: 100000},
				{name: "titanium", val: 1250},
				{name: "concrate", val: 35}
			],
			requires: {upgrades: ["strenghtenBuild"]},
			effects: {
				"warehouseRatio": 0.35
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor", "mint"]}
		}, {
			name: "storageBunkers",
			label: "Storage Bunkers",
			description: "Storage facilities store 20% more resources",
			prices: [
				{name: "science",     val: 25000},
				{name: "unobtainium", val: 500},
				{name: "concrate",    val: 1250}
			],
			requires: {tech: ["exogeology"]},
			effects: {
				"warehouseRatio": 0.20
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor", "mint"]}
		}, {
			name: "energyRifts",
			label: "Energy Rifts",
			description: "Accelerators will now create rifts to a pocket dimension",
			prices: [
				{name: "science",  val: 200000},
				{name: "titanium", val: 7500},
				{name: "uranium",  val: 250}
			],
			requires: {tech: ["dimensionalPhysics"]},
			upgrades: {buildings: ["accelerator"]}
		}, {
			name: "stasisChambers",
			label: "Stasis Chambers",
			description: "Energy Rifts are twice as effective",
			prices: [
				{name: "science",     val: 235000},
				{name: "alloy",       val: 200},
				{name: "uranium",     val: 2000},
				{name: "timeCrystal", val: 1}
			],
			// unlocks: {upgrades: ["voidEnergy"]},
			requires: {tech: ["chronophysics"]},
			effects: {
				"acceleratorRatio": 0.95
			},
			upgrades: {buildings: ["accelerator"]}
		}, {
			name: "voidEnergy",
			label: "Void Energy",
			description: "Energy Rifts are even more effective",
			prices: [
				{name: "science",     val: 275000},
				{name: "alloy",       val: 250},
				{name: "uranium",     val: 2500},
				{name: "timeCrystal", val: 2}
			],
			// unlocks: {upgrades: ["darkEnergy"]},
			requires: {upgrades: ["stasisChambers"]},
			effects: {
				"acceleratorRatio": 0.75
			},
			upgrades: {buildings: ["accelerator"]}
		}, {
			name: "darkEnergy",
			label: "Dark Energy",
			description: "Energy Rifts are 2.5 times as effective",
			prices: [
				{name: "science",     val: 350000},
				{name: "eludium",     val: 75},
				{name: "timeCrystal", val: 3}
			],
			requires: {upgrades: ["voidEnergy"]},
			effects: {
				"acceleratorRatio": 2.5
			},
			upgrades: {buildings: ["accelerator"]}
		}, {
			name: "chronoforge",
			label: "Chronoforge",
			description: "An alien technology related to time manipulation.",
			prices: [
				{name: "science",     val: 500000},
				{name: "relic",       val: 5},
				{name: "timeCrystal", val: 10}
			],
			requires: {tech: ["tachyonTheory"]}
		}, {
			name: "tachyonAccelerators",
			label: "Tachyon Accelerators",
			description: "Energy Rifts are 5 times as effective",
			prices: [
				{name: "science",     val: 500000},
				{name: "eludium",     val: 125},
				{name: "timeCrystal", val: 10}
			],
			requires: {tech: ["tachyonTheory"]},
			effects: {
				"acceleratorRatio": 5
			},
			upgrades: {buildings: ["accelerator"]}
		}, {
			name: "fluxCondensator",
			label: "Flux Condensator",
			description: "Chronosphere will now affect craftable resources.",
			prices: [
				{name: "alloy",       val: 250},
				{name: "unobtainium", val: 5000},
				{name: "timeCrystal", val: 5}
			],
			requires: {tech: ["chronophysics"]}
		}, {
			name: "lhc",
			label: "LHC",
			description: "Every accelerator will provide a bonus to maximum science",
			prices: [
				{name: "science",     val: 250000},
				{name: "unobtainium", val: 100},
				{name: "alloy",       val: 150}
			],
			requires: {tech: ["dimensionalPhysics"]},
			upgrades: {buildings: ["accelerator"]}
		}, {
			name: "photovoltaic",
			label: "Photovoltaic Cells",
			description: "Solar Farms are 50% more effective",
			prices: [
				{name: "science",  val: 75000},
				{name: "titanium", val: 5000}
			],
			requires: {tech: ["nanotechnology"]},
			effects: {
				"solarFarmRatio": 0.5
			},
			upgrades: {buildings: ["pasture"]}
		}, {
			name: "solarSatellites",
			label: "Solar Satellites",
			description: "Satellites will now generate energy instead of consuming it",
			prices: [
				{name: "science", val: 225000},
				{name: "alloy",   val: 750}
			],
			requires: {tech: ["orbitalEngineering"]}
		}, {
			name: "cargoShips",
			label: "Expanded Cargo",
			description: "Every ship will give a 1% bonus to Harbor capacity",
			prices: [
				{name: "science",   val: 55000},
				{name: "blueprint", val: 15}
			],
			requires: {tech: ["navigation"]},
			effects: {
				"harborRatio": 0.01
			},
			upgrades: {buildings: ["harbor"]},
			flavor: "It's like a tuna can, but bigger"
		}, {
			name: "barges",
			label: "Barges",
			description: "Harbors store more coal",
			prices: [
				{name: "science",   val: 100000},
				{name: "titanium",  val: 1500},
				{name: "blueprint", val: 30}
			],
			requires: {tech: ["industrialization"]},
			effects: {
				"harborCoalRatio": 0.5
			},
			upgrades: {buildings: ["harbor"]}
		}, {
			name: "reactorVessel",
			label: "Reactor Vessel",
			description: "Every reactor improves ship potential by 5%",
			prices: [
				{name: "science",  val: 135000},
				{name: "titanium", val: 5000},
				{name: "uranium",  val: 125}
			],
			requires: {tech: ["nuclearFission"]},
			effects: {
				"shipLimit": 0.05
			},
			upgrades: {buildings: ["harbor"]}
		}, {
			name: "ironwood",
			label: "Ironwood Huts",
			description: "Hut price ratio reduced by 50%",
			prices: [
				{name: "science", val: 30000},
				{name: "wood",    val: 15000},
				{name: "iron",    val: 3000}
			],
			// unlocks: {upgrades: ["silos"]},
			requires: {upgrades: ["reinforcedWarehouses"]},
			effects: {
				"hutPriceRatio": -0.5
			}
		}, {
			name: "concreteHuts",
			label: "Concrete Huts",
			description: "Hut price ratio reduced by 30%",
			prices: [
				{name: "science",  val: 125000},
				{name: "concrate", val: 45},
				{name: "titanium", val: 3000}
			],
			requires: {upgrades: ["strenghtenBuild"]},
			effects: {
				"hutPriceRatio": -0.3
			}
		}, {
			name: "unobtainiumHuts",
			label: "Unobtainium Huts",
			description: "Hut price ratio reduced by 25%",
			prices: [
				{name: "science",     val: 200000},
				{name: "unobtainium", val: 350},
				{name: "titanium",    val: 15000}
			],
			requires: {tech: ["exogeology"]},
			effects: {
				"hutPriceRatio": -0.25
			}
		}, {
			name: "eludiumHuts",
			label: "Eludium Huts",
			description: "Hut price ratio reduced by 10%",
			prices: [
				{name: "science", val: 275000},
				{name: "eludium", val: 125}
			],
			requires: {tech: ["advExogeology"]},
			effects: {
				"hutPriceRatio": -0.1
			}
		}, {
			name: "silos",
			label: "Silos",
			description: "Warehouses can now store catnip",
			prices: [
				{name: "science",   val: 50000},
				{name: "steel",     val: 125},
				{name: "blueprint", val: 5}
			],
			// unlocks: {upgrades: ["titaniumWarehouses"]},
			requires: {upgrades: ["ironwood"]},
			upgrades: {buildings: ["barn", "warehouse", "harbor"]},
			flavor: "With carpeting and climbing holds of course"
		}, {
			name: "refrigeration",
			label: "Refrigeration",
			description: "Expands catnip limit by 75%",
			prices: [
				{name: "science",   val: 125000},
				{name: "titanium",  val: 2500},
				{name: "blueprint", val: 15}
			],
			requires: {tech: ["electronics"]},
			effects: {
				"catnipMaxRatio": 0.75
			}
		}, {
			name: "compositeBow",
			label: "Composite Bow",
			description: "An improved version of a bow which provides a permanent +50% boost to the catpower production",
			prices: [
				{name: "science", val: 500},
				{name: "iron",    val: 100},
				{name: "wood",    val: 200}
			],
			requires: {tech: ["construction"]},
			effects: {
				"manpowerJobRatio": 0.5
			}
		}, {
			name: "crossbow",
			label: "Crossbow",
			description: "An improved version of a bow which provides a permanent +25% boost to the catpower production",
			prices: [
				{name: "science", val: 12000},
				{name: "iron",    val: 1500}
			],
			requires: {tech: ["machinery"]},
			effects: {
				"manpowerJobRatio": 0.25
			}
		}, {
			name: "railgun",
			label: "Railgun",
			description: "Deadly electromagnetic weapon. +25% boost to the catpower production",
			prices: [
				{name: "science",   val: 150000},
				{name: "titanium",  val: 5000},
				{name: "blueprint", val: 25}
			],
			requires: {tech: ["particlePhysics"]},
			effects: {
				"manpowerJobRatio": 0.25
			}
		}, {
			name: "bolas",
			label: "Bolas",
			description: "Throwing weapon made of heavy stone weights. Your hunters are twice as effective",
			prices: [
				{name: "science",  val: 1000},
				{name: "minerals", val: 250},
				{name: "wood",     val: 50}
			],
			requires: {tech: ["mining"]},
			effects: {
				"hunterRatio": 1
			},
			flavor: "Weaponized yarn"
		}, {
			name: "huntingArmor",
			label: "Hunting Armour",
			description: "Hunters are 4 times as effective",
			prices: [
				{name: "science", val: 2000},
				{name: "iron",    val: 750}
			],
			requires: {tech: ["metal"]},
			effects: {
				"hunterRatio": 2
			},
			flavor: "At least they are wearing something..."
		}, {
			name: "steelArmor",
			label: "Steel Armour",
			description: "Hunters are a bit more effective",
			prices: [
				{name: "science", val: 10000},
				{name: "steel",   val: 50}
			],
			requires: {tech: ["steel"]},
			effects: {
				"hunterRatio": 0.5
			}
		}, {
			name: "alloyArmor",
			label: "Alloy Armour",
			description: "Hunters are a bit more effective",
			prices: [
				{name: "science", val: 50000},
				{name: "alloy",   val: 25}
			],
			requires: {tech: ["chemistry"]},
			effects: {
				"hunterRatio": 0.5
			}
		}, {
			name: "nanosuits",
			label: "Nanosuits",
			description: "Maximum catpower!",
			prices: [
				{name: "science", val: 185000},
				{name: "alloy",   val: 250}
			],
			requires: {tech: ["nanotechnology"]},
			effects: {
				"hunterRatio": 0.5
			}
		}, {
			name: "caravanserai",
			label: "Caravanserai",
			description: "Your tradeposts have a very minor effect on race standing",
			prices: [
				{name: "science", val: 25000},
				{name: "ivory",   val: 10000},
				{name: "gold",    val: 250}
			],
			requires: {tech: ["navigation"]},
			effects: {
				"standingRatio": 0.35
			},
			upgrades: {buildings: ["tradepost"]},
			flavor: "Now hiring: cuter kittens"
		}, {
			name: "advancedRefinement",
			label: "Catnip Enrichment",
			description: "Catnip refines twice as well",
			prices: [
				{name: "science", val: 500},
				{name: "catnip",  val: 5000}
			],
			requires: {tech: ["construction"]},
			handler: function (self) {
				var price = self.owned() ? 50 : 100;
				self.game.workshop.getCraft("wood").prices = [{name: "catnip", val: price}];
			},
			flavor: "It's all fun and games 'til someone gets pounced"
		}, {
			name: "goldOre",
			label: "Gold Ore",
			description: "Small percentage of ore will be smelted into gold",
			prices: [
				{name: "minerals", val: 800},
				{name: "iron",     val: 100},
				{name: "science",  val: 1000}
			],
			requires: {tech: ["currency"]},
			upgrades: {buildings: ["smelter"]},
			flavor: "Shiny!"
		}, {
			name: "geodesy",
			label: "Geodesy",
			description: "Geologists are more effective and can find gold.",
			prices: [
				{name: "titanium",  val: 250},
				{name: "starchart", val: 500},
				{name: "science",   val: 90000}
			],
			requires: {tech: ["archeology"]},
			upgrades: {jobs: ["geologist"]},
			flavor: "Gold sniffing cats"
		}, {
			name: "register",
			label: "Register",
			description: "Leader manage jobs depending on experience.",
			prices: [
				{name: "gold",     val: 10},
				{name: "science",  val: 500}
			],
			requires: {tech: ["writing"]},
		}, {
			name: "strenghtenBuild",
			label: "Concrete Pillars",
			description: "Repair barn and warehouse cracks with concrete.",
			prices: [
				{name: "science",  val: 100000},
				{name: "concrate", val: 50}
			],
			// unlocks: {upgrades: ["concreteWarehouses", "concreteBarns", "concreteHuts"]},
			requires: {tech: ["mechanization"]},
			effects: {
				"barnRatio":      0.05,
				"warehouseRatio": 0.05
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor", "mint"]}
		}, {
			name: "miningDrill",
			label: "Mining Drill",
			description: "Geologists are more effective",
			prices: [
				{name: "titanium", val: 1750},
				{name: "steel",    val: 750},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["metalurgy"]},
			upgrades: {jobs: ["geologist"]}
		}, {
			name: "unobtainiumDrill",
			label: "Unobtainium Drill",
			description: "Geologists are even more effective",
			prices: [
				{name: "unobtainium", val: 250},
				{name: "alloy",       val: 1250},
				{name: "science",     val: 250000}
			],
			requires: {tech: ["exogeology"]},
			upgrades: {jobs: ["geologist"]}
		}, {
			name: "coalFurnace",
			label: "Coal Furnace",
			description: "Smelters produce coal while burning wood",
			prices: [
				{name: "minerals", val: 5000},
				{name: "iron",     val: 2000},
				{name: "beam",     val: 35},
				{name: "science",  val: 5000}
			],
			requires: {tech: ["steel"]},
			flavor: "So warm... so sleepy..."
		}, {
			name: "deepMining",
			label: "Deep Mining",
			description: "Mines will also produce coal",
			prices: [
				{name: "iron",    val: 1200},
				{name: "beam",    val: 50},
				{name: "science", val: 5000}
			],
			requires: {tech: ["steel"]},
			upgrades: {buildings: ["mine"]},
			flavor: "Yummy Canaries!"
		}, {
			name: "pyrolysis",
			label: "Pyrolysis",
			description: "Coal output is boosted by 20%",
			prices: [
				{name: "compedium", val: 5},
				{name: "science",   val: 35000}
			],
			requires: {tech: ["physics"]},
			effects: {
				"coalSuperRatio": 0.2
			}
		}, {
			name: "electrolyticSmelting",
			label: "Electrolytic Smelting",
			description: "Smelters are twice as effective",
			prices: [
				{name: "titanium", val: 2000},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["metalurgy"]},
			effects: {
				"smelterRatio": 0.95
			}
		}, {
			name: "oxidation",
			label: "Oxidation",
			description: "Calciners are twice as effective at producing iron and 4 times at producing titanium",
			prices: [
				{name: "steel",   val: 5000},
				{name: "science", val: 100000}
			],
			requires: {tech: ["metalurgy"]},
			effects: {
				"calcinerRatio": 0.95
			}
		}, {
			name: "steelPlants",
			label: "Steel Plants",
			description: "10% of the calciners' iron output will be converted to steel",
			prices: [
				{name: "titanium", val: 3500},
				{name: "gear",     val: 750},
				{name: "science",  val: 140000}
			],
			// unlocks: {upgrades: ["automatedPlants"]},
			requires: {tech: ["robotics"]},
			effects: {
				"calcinerSteelRatio": 0.1
			}
		}, {
			name: "automatedPlants",
			label: "Automated Plants",
			description: "Steel Plants are boosted by 25% of your craft ratio",
			prices: [
				{name: "alloy",   val: 750},
				{name: "science", val: 200000}
			],
			// unlocks: {upgrades: ["nuclearPlants"]},
			requires: {upgrades: ["steelPlants"]},
			effects: {
				"calcinerSteelCraftRatio": 0.25
			}
		}, {
			name: "nuclearPlants",
			label: "Nuclear Plants",
			description: "Steel Plants are additionally boosted by 2% per Reactor",
			prices: [
				{name: "uranium", val: 10000},
				{name: "science", val: 250000}
			],
			requires: {upgrades: ["automatedPlants"]},
			effects: {
				"calcinerSteelReactorBonus": 0.02
			}
		}, {
			name: "rotaryKiln",
			label: "Rotary Kiln",
			description: "Calciners are 75% more effective at producing iron and 3 times at producing titanium",
			prices: [
				{name: "titanium", val: 5000},
				{name: "gear",     val: 500},
				{name: "science",  val: 145000}
			],
			requires: {tech: ["robotics"]},
			effects: {
				"calcinerRatio": 0.75
			}
		}, {
			name: "fluidizedReactors",
			label: "Fluidized Reactors",
			description: "Calciners are twice as effective",
			prices: [
				{name: "alloy",   val: 200},
				{name: "science", val: 175000}
			],
			requires: {tech: ["robotics"]},
			effects: {
				"calcinerRatio": 1
			}
		}, {
			name: "nuclearSmelters",
			label: "Nuclear Smelters",
			description: "Smelters can now produce titanium",
			prices: [
				{name: "uranium", val: 250},
				{name: "science", val: 165000}
			],
			requires: {tech: ["nuclearFission"]}
		}, {
			name: "printingPress",
			label: "Printing Press",
			description: "Steamworks automatically print manuscripts",
			prices: [
				{name: "gear",    val: 45},
				{name: "science", val: 7500}
			],
			requires: {tech: ["machinery"]},
			upgrades: {buildings: ["steamworks"]}
		}, {
			name: "offsetPress",
			label: "Offset Press",
			description: "Printing press is 4 times as effective",
			prices: [
				{name: "gear",    val: 250},
				{name: "oil",     val: 15000},
				{name: "science", val: 100000}
			],
			requires: {tech: ["combustion"]},
			upgrades: {buildings: ["steamworks"]}
		}, {
			name: "photolithography",
			label: "Photolithography",
			description: "Printing press is 4 times as effective",
			prices: [
				{name: "alloy",   val: 1250},
				{name: "oil",     val: 50000},
				{name: "uranium", val: 250},
				{name: "science", val: 250000}
			],
			requires: {tech: ["sattelites"]},
			upgrades: {buildings: ["steamworks"]}
		}, {
			name: "factoryAutomation",
			label: "Workshop Automation",
			description: "Once per year Steamworks will convert small quantities of craftable resources to materials when they are at the limit",
			prices: [
				{name: "gear",    val: 25},
				{name: "science", val: 10000}
			],
			requires: {tech: ["machinery"]},
			flavor: "Includes autofeeders"
		}, {
			name: "advancedAutomation",
			label: "Advanced Automation",
			description: "Reduce Steamworks' maintainance cycle by 50%",
			prices: [
				{name: "gear",      val: 75},
				{name: "blueprint", val: 25},
				{name: "science",   val: 100000}
			],
			requires: {tech: ["industrialization"]}
		}, {
			name: "pneumaticPress",
			label: "Pneumatic Press",
			description: "Workshop automation will also convert iron to plates",
			prices: [
				{name: "gear",      val: 30},
				{name: "blueprint", val: 5},
				{name: "science",   val: 20000}
			],
			requires: {tech: ["physics"]}
		}, {
			name: "combustionEngine",
			label: "High Pressure Engine",
			description: "Reduces coal consumption of Steamworks by 20%",
			prices: [
				{name: "gear",      val: 25},
				{name: "blueprint", val: 5},
				{name: "science",   val: 20000}
			],
			requires: {tech: ["steel"]},
			effects: {
				"coalRatioGlobalReduction": 0.2
			},
			upgrades: {buildings: ["steamworks"]},
			flavor: "A better mousetrap"
		}, {
			name: "fuelInjectors",
			label: "Fuel Injectors",
			description: "Reduces coal consumption of Steamworks by 20%",
			prices: [
				{name: "gear",    val: 250},
				{name: "oil",     val: 20000},
				{name: "science", val: 100000}
			],
			requires: {tech: ["combustion"]},
			upgrades: {buildings: ["steamworks"]},
			effects: {
				"coalRatioGlobalReduction": 0.2
			}
		}, {
			name: "factoryLogistics",
			label: "Factory Logistics",
			description: "Factories are providing bigger bonus to craft effectiveness",
			prices: [
				{name: "gear",     val: 250},
				{name: "titanium", val: 2000},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["electronics"]},
			upgrades: {buildings: ["factory"]}
		}, {
			name: "factoryOptimization",
			label: "Factory Optimization",
			description: "Improves Engineer's effectiveness",
			prices: [
				{name: "gear",     val: 125},
				{name: "titanium", val: 1250},
				{name: "science",  val: 75000}
			],
			effects: {
				"t1CraftRatio": 10,
				"t2CraftRatio": 2
			}
		}, {
			name: "factoryRobotics",
			label: "Factory Robotics",
			description: "Improves Engineer's effectiveness",
			prices: [
				{name: "gear",     val: 250},
				{name: "titanium", val: 2500},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["robotics"]},
			effects: {
				"t1CraftRatio": 10,
				"t2CraftRatio": 5,
				"t3CraftRatio": 2
			}
		}, {
			name: "spaceEngineers",
			label: "Space Engineers",
			description: "Improves Engineer's effectiveness",
			prices: [
				{name: "alloy",   val: 500},
				{name: "science", val: 225000}
			],
			requires: {tech: ["orbitalEngineering"]},
			effects: {
				"t1CraftRatio": 2,
				"t2CraftRatio": 2,
				"t3CraftRatio": 2,
				"t4CraftRatio": 2
			}
		}, {
			name: "aiEngineers",
			label: "AI Engineers",
			description: "A holy union of feline mind and a machine",
			prices: [
				{name: "science",     val: 35000},
				{name: "eludium",     val: 50},
				{name: "antimatter",  val: 500}
			],
			requires: {tech: ["ai"]},
			effects: {
				"t1CraftRatio": 10,
				"t2CraftRatio": 5,
				"t3CraftRatio": 5,
				"t4CraftRatio": 2,
				"t5CraftRatio": 2
			}
		}, {
			name: "chronoEngineers",
			label: "Chronoengineers",
			description: "Improves Engineer's effectiveness",
			prices: [
				{name: "science",     val: 500000},
				{name: "eludium",     val: 100},
				{name: "timeCrystal", val: 5}
			],
			requires: {tech: ["tachyonTheory"]},
			effects: {
				"t1CraftRatio": 2,
				"t2CraftRatio": 2,
				"t3CraftRatio": 2,
				"t4CraftRatio": 2,
				"t5CraftRatio": 2
			}
		}, {
			name: "spaceManufacturing",
			label: "Space Manufacturing",
			description: "Factories are providing bonus to Space Elevators and Orbital Arrays",
			prices: [
				{name: "titanium", val: 125000},
				{name: "science",  val: 250000}
			],
			requires: {tech: ["superconductors"]},
			upgrades: {buildings: ["factory"]}
		}, {
			name: "celestialMechanics",
			label: "Celestial Mechanics",
			description: "Celestial events and meteors will generate additional science",
			prices: [
				{name: "science", val: 250}
			],
			requires: {tech: ["math"]}
		}, {
			name: "astrolabe",
			label: "Astrolabe",
			description: "Improves Observatory effectiveness by 50%",
			prices: [
				{name: "titanium",  val: 5},
				{name: "starchart", val: 75},
				{name: "science",   val: 25000}
			],
			requires: {tech: ["navigation"]},
			upgrades: {buildings: ["observatory"]}
		}, {
			name: "titaniumMirrors",
			label: "Titanium Reflectors",
			description: "Improved telescope reflectors.\nEvery observatory will give 2% to Library effectiveness",
			prices: [
				{name: "titanium",  val: 15},
				{name: "starchart", val: 20},
				{name: "science",   val: 20000}
			],
			requires: {tech: ["navigation"]},
			effects: {
				"libraryRatio": 0.02
			},
			upgrades: {buildings: ["observatory"]},
			flavor: "Did that light spot just move?"
		}, {
			name: "unobtainiumReflectors",
			label: "Unobtainium Reflectors",
			description: "Improved telescope reflectors.\nEvery observatory will give additional 2% to Library effectiveness",
			prices: [
				{name: "unobtainium", val: 75},
				{name: "starchart",   val: 750},
				{name: "science",     val: 250000}
			],
			requires: {tech: ["exogeology"]},
			effects: {
				"libraryRatio": 0.02
			},
			upgrades: {buildings: ["observatory"]}
		}, {
			name: "eludiumReflectors",
			label: "Eludium Reflectors",
			description: "Improved telescope reflectors.\nEvery observatory will give additional 2% to Library effectiveness",
			prices: [
				{name: "eludium", val: 15},
				{name: "science", val: 250000}
			],
			requires: {tech: ["advExogeology"]},
			effects: {
				"libraryRatio": 0.02
			},
			upgrades: {buildings: ["observatory"]}
		}, {
			name: "hydroPlantTurbines",
			label: "Hydro Plant Turbines",
			description: "Unobtainium-based turbines. Hydro plants are 15% more effective.",
			prices: [
				{name: "unobtainium", val: 125},
				{name: "science",     val: 250000}
			],
			requires: {tech: ["exogeology"]},
			effects: {
				"hydroPlantRatio": 0.15
			},
			upgrades: {buildings: ["aqueduct"]}
		}, {
			name: "amBases",
			label: "Antimatter Bases",
			description: "Reduce energy consumption for Lunar Bases by 50%",
			prices: [
				{name: "eludium", val: 15},
				{name: "antimatter", val: 250}
			],
			// unlcoks: {upgrades: ["aiBases"]},
			requires: {tech: ["antimatter"]}
		}, {
			name: "aiBases",
			label: "AI Bases",
			description: "AI-powered logistics. Every level of AI Core will increase the effectiveness of moon bases by 25%",
			prices: [
				{name: "eludium", val: 15},
				{name: "antimatter", val: 250}
			],
			requires: {upgrades: ["amBases"]},
		}, {
			name: "amFission",
			label: "Antimatter Fission",
			description: "Engineers are 25% more effective at production of eludium",
			prices: [
				{name: "antimatter", val: 175},
				{name: "thorium",    val: 7500},
				{name: "science",    val: 525000}
			],
			requires: {tech: ["antimatter"]},
			effects: {
				"eludiumAutomationBonus": 0.25
			}
		}, {
			name: "amReactors",
			label: "Antimatter Reactors",
			description: "Your Research Vessels and Space Beacons are twice as effective",
			prices: [
				{name: "eludium",    val: 35},
				{name: "antimatter", val: 750}
			],
			// unlocks: {upgrades: ["amReactorsMK2"]},
			requires: {tech: ["antimatter"]},
			effects: {
				"spaceScienceRatio": 0.95
			},
			upgrades: {spaceBuilding: ["researchVessel", "spaceBeacon"]}
		}, {
			name: "amReactorsMK2",
			label: "Advanced AM Reactors",
			description: "Your Research Vessels and Space Beacons are 1.5x more effective",
			prices: [
				{name: "eludium",    val: 70},
				{name: "antimatter", val: 2500}
			],
			// unlocks: {upgrades: ["voidReactors"]},
			requires: {upgrades: ["amReactors"]},
			effects: {
				"spaceScienceRatio": 1.5
			},
			upgrades: {spaceBuilding: ["researchVessel", "spaceBeacon"]}
		}, {
			name: "voidReactors",
			label: "Void Reactors",
			description: "Your Research Vessels are 4 times as effective",
			prices: [
				{name: "void",       val: 250},
				{name: "antimatter", val: 2500}
			],
			requires: {upgrades: ["amReactorsMK2"]},
			effects: {
				"spaceScienceRatio": 4
			},
			upgrades: {spaceBuilding: ["researchVessel", "spaceBeacon"]}
		}, {
			name: "relicStation",
			label: "Relic Station",
			description: "Upgrade Space Beacons with Relic research stations. Every Relic Station will reverse engineer relics yelding 0.01 relic per day",
			prices: [
				{name: "eludium",    val: 100},
				{name: "antimatter", val: 5000}
			],
			requires: {tech: ["cryptotheology"]},
			effects: {
				"beaconRelicsPerDay": 0.01
			}
		}, {
			name: "amDrive",
			label: "Antimatter Drive",
			description: "Antimatter-powered rocket engine",
			prices: [
				{name: "antimatter", val: 125},
				{name: "science",    val: 450000}
			],
			requires: {tech: ["antimatter"]},
			effects: {
				"routeSpeed": 25
			}
		}, {
			name: "pumpjack",
			label: "Pumpjack",
			description: "Improves effectiveness of Oil Wells by 45%. Every Oil Well will consume 1Wt/t.",
			prices: [
				{name: "titanium", val: 250},
				{name: "gear",     val: 125},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["mechanization"]},
			effects: {
				"oilWellRatio": 0.45
			},
			upgrades: {buildings: ["oilWell"]}
		}, {
			name: "biofuel",
			label: "Biofuel processing",
			description: "Biolabs will convert catnip into oil",
			prices: [
				{name: "titanium", val: 1250},
				{name: "science",  val: 150000}
			],
			requires: {tech: ["biochemistry"]},
			upgrades: {buildings: ["biolab"]}
		}, {
			name: "unicornSelection",
			label: "Unicorn Selection",
			description: "Improves Unicorn Pasture effectiveness by 25%",
			prices: [
				{name: "titanium", val: 1500},
				{name: "science",  val: 175000}
			],
			requires: {tech: ["genetics"]},
			effects: {
				"unicornsGlobalRatio": 0.25
			}
		}, {
			name: "gmo",
			label: "GM Catnip",
			description: "Genetically modified catnip that will improve biolab oil yield by 60%",
			prices: [
				{name: "titanium", val: 1500},
				{name: "catnip",   val: 1000000},
				{name: "science",  val: 175000}
			],
			requires: {tech: ["genetics"]},
			effects: {
				"biofuelRatio": 0.6
			},
			upgrades: {buildings: ["biolab"]}
		}, {
			name: "cadSystems",
			label: "CAD System",
			description: "All scientific buildings will improve effectiveness of blueprint crafting",
			prices: [
				{name: "titanium", val: 750},
				{name: "science",  val: 125000}
			],
			requires: {tech: ["electronics"]},
			effects: {
				"cadBlueprintCraftRatio": 0.01
			}
		}, {
			name: "seti",
			label: "SETI",
			description: "A large array of electronic telescopes. Makes astronomical events automatic and silent",
			prices: [
				{name: "titanium", val: 250},
				{name: "science",  val: 125000}
			],
			requires: {tech: ["electronics"]}
		}, {
			name: "logistics",
			label: "Logistics",
			description: "Kitten skills are 15% more effective",
			prices: [
				{name: "gear",     val: 100},
				{name: "scaffold", val: 1000},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["industrialization"]},
			effects: {
				"skillMultiplier": 0.15
			}
		}, {
			name: "augumentation",
			label: "Augmentations",
			description: "Kitten skills are 25% more effective",
			prices: [
				{name: "titanium", val: 5000},
				{name: "uranium",  val: 50},
				{name: "science",  val: 150000}
			],
			requires: {tech: ["nanotechnology"]},
			effects: {
				"skillMultiplier": 1
			}
		}, {
			name: "internet",
			label: "Telecommunication",
			description: "Kittens learn skills with each other",
			prices: [
				{name: "titanium", val: 5000},
				{name: "uranium",  val: 50},
				{name: "science",  val: 150000}
			]
		}, {
			name: "neuralNetworks",
			label: "Neural Networks",
			description: "Engineers effectiveness doubles at the cost of double energy consumption of factories",
			prices: [
				{name: "titanium", val: 7500},
				{name: "science",  val: 200000}
			],
			// unlocks: {upgrades: ["ai"]},
			requires: {tech: ["ai"]},
			upgrades: {buildings: ["factory"]}
		}, {
			name: "assistance",
			label: "Robotic Assistance",
			description: "Building robots, workers do less effort and need less catnip",
			prices: [
				{name: "steel",   val: 10000},
				{name: "gear",    val: 250},
				{name: "science", val: 100000}
			],
			requires: {tech: ["robotics"]},
			effects: {
				"catnipDemandWorkerRatioGlobal": -0.25
			}
		}, {
			name: "enrichedUranium",
			label: "Enriched Uranium",
			description: "Reduce uranium consumption of reactors by 25%",
			prices: [
				{name: "titanium", val: 7500},
				{name: "uranium",  val: 150},
				{name: "science",  val: 175000}
			],
			requires: {tech: ["particlePhysics"]},
			effects: {
				"uraniumRatio": 0.25
			},
			upgrades: {buildings: ["reactor"]}
		}, {
			name: "coldFusion",
			label: "Cold Fusion",
			description: "Increase Reactors energy output by 25%",
			prices: [
				{name: "eludium", val: 25},
				{name: "science", val: 200000}
			],
			requires: {tech: ["superconductors"]},
			effects: {
				"reactorEnergyRatio": 0.25
			},
			upgrades: {buildings: ["reactor"]}
		}, {
			name: "thoriumReactors",
			label: "Thorium Reactors",
			description: "Increase Reactors energy output by 25% by the addition of thorium",
			prices: [
				{name: "thorium",  val: 10000},
				{name: "science",  val: 400000}
			],
			// unlocks: {upgrades: ["enrichedThorium"]},
			requires: {tech: ["thorium"]},
			effects: {
				"reactorEnergyRatio":     0.25,
				"reactorThoriumPerTick": -0.05
			},
			upgrades: {buildings: ["reactor"]}
		}, {
			name: "enrichedThorium",
			label: "Enriched Thorium",
			description: "Reactors will now consume 25% less thorium",
			prices: [
				{name: "thorium", val: 12500},
				{name: "science", val: 500000}
			],
			requires: {upgrades: ["thoriumReactors"]},
			effects: {
				"reactorThoriumPerTick": 0.0125
			},
			upgrades: {buildings: ["reactor"]}
		}, {
			name: "hubbleTelescope",
			label: "Hubble Space Telescope",
			description: "Improves starchart production by 30%",
			prices: [
				{name: "alloy",   val: 1250},
				{name: "oil",     val: 50000},
				{name: "science", val: 250000}
			],
			// unlocks: {upgrades: ["satnav"]},
			requires: {tech: ["orbitalEngineering"]},
			effects: {
				"starchartGlobalRatio": 0.3
			}
		}, {
			name: "satnav",
			label: "Satellite Navigation",
			description: "Every satellite reduce starchart requirement of ships by 1.25%",
			prices: [
				{name: "alloy",   val: 750},
				{name: "science", val: 200000}
			],
			requires: {upgrades: ["hubbleTelescope"]},
			effects: {
				"satnavRatio": 0.0125
			}
		}, {
			name: "satelliteRadio",
			label: "Satellite Radio",
			description: "Every satellite will boost the effect of Broadcast Towers by 0.5%",
			prices: [
				{name: "alloy",   val: 5000},
				{name: "science", val: 225000}
			],
			requires: {tech: ["orbitalEngineering"]},
			effects: {
				"broadcastTowerRatio": 0.005
			}
		}, {
			name: "astrophysicists",
			label: "Astrophysicists",
			description: "Each scholar will now generate starcharts.",
			prices: [
				{name: "unobtainium", val: 350},
				{name: "science",     val: 250000}
			],
			requires: {tech: ["orbitalEngineering"]},
			upgrades: {jobs: ["scholar"]}
		}, {
			name: "mWReactor",
			label: "Microwarp Reactors",
			description: "A new eludium-based reactor for Lunar Outposts. Unobtainium production is 75% more effective.",
			prices: [
				{name: "eludium", val: 50},
				{name: "science", val: 150000}
			],
			effects: {
				"lunarOutpostRatio": 0.75
			},
			requires: {tech: ["advExogeology"]}
		}, {
			name: "eludiumCracker",
			label: "Planet Busters",
			description: "Hissmeowra's output is twice as effective.",
			prices: [
				{name: "eludium", val: 250},
				{name: "science", val: 275000}
			],
			requires: {tech: ["advExogeology"]},
			effects: {
				"crackerRatio": 1
			},
			upgrades: {program: ["planetCracker"]}
		}, {
			name: "thoriumEngine",
			label: "Thorium Drive",
			description: "A new rocket engine to go faster in space.",
			prices: [
				{name: "ship",     val: 10000},
				{name: "gear",     val: 40000},
				{name: "alloy",    val: 2000},
				{name: "thorium",  val: 100000},
				{name: "science",  val: 400000}
			],
			requires: {tech: ["thorium"]},
			effects: {
				"routeSpeed": 50
			}
		}, {
			name: "oilRefinery",
			label: "Oil Refinery",
			description: "Improves effectiveness of oil wells by 35%",
			prices: [
				{name: "titanium", val: 1250},
				{name: "gear",     val: 500},
				{name: "science",  val: 125000}
			],
			requires: {tech: ["combustion"]},
			effects: {
				"oilWellRatio": 0.35
			},
			upgrades: {buildings: ["oilWell"]}
		}, {
			name: "oilDistillation",
			label: "Oil Distillation",
			description: "Oil output is improved by 75%.",
			prices: [
				{name: "titanium", val: 5000},
				{name: "science",  val: 175000}
			],
			requires: {tech: ["rocketry"]},
			effects: {
				"oilWellRatio": 0.75
			},
			upgrades: {buildings: ["oilWell"]}
		}, {
			name: "factoryProcessing",
			label: "Factory Processing",
			description: "Every factory will increase oil refinement effectiveness by 5%.",
			prices: [
				{name: "titanium", val: 7500},
				{name: "concrate", val: 125},
				{name: "science",  val: 195000}
			],
			requires: {tech: ["oilProcessing"]},
			effects: {
				"factoryRefineRatio": 0.05
			},
			upgrades: {buildings: ["workshop"]}
		}, {
			name: "voidAspiration",
			label: "Void Aspiration",
			description: "Unlocks Void Hoover and Void Rifts.",
			prices: [
				{name: "timeCrystal", val: 15},
				{name: "antimatter",  val: 2000}
			],
			// unlocks: {voidSpace: ["voidHoover", "voidRift"]},
			requires: {tech: ["voidSpace"]}
		}, {
			name: "distorsion",
			label: "Distortion",
			description: "Improve Chronocontrol effectiveness.",
			prices: [
				{name: "timeCrystal", val: 25},
				{name: "antimatter",  val: 2000},
				{name: "void",        val: 1000},
				{name: "science",     val: 300000}
			],
			requires: {tech: ["paradoxalKnowledge"]},
			effects: {
				"temporalParadoxDayBonus": 2
			},
			upgrades: {voidSpace: ["chronocontrol"]}
		}, {
			name: "turnSmoothly",
			label: "Chronosurge",
			description: "Chronospheres will now generate temporal flux.",
			prices: [
				{name: "unobtainium",  val: 100000},
				{name: "timeCrystal",  val: 25},
				{name: "void",         val: 750},
				{name: "temporalFlux", val: 6500}
			],
			requires: {voidSpace: ["chronocontrol"]},
			effects: {
				"temporalFluxProductionChronosphere": 1
			},
			upgrades: {
				buildings: ["chronosphere"]
			}
	}],

	craftData: [{
			name: "wood",
			label: "Refine Catnip",
			description: "A sturdy block of catnip wood. Difficult to process, but great building material.",
			prices: [
				{name: "catnip", val: 100}
			],
			unlocked: true,
			ignoreBonuses: true,
			progressHandicap: 1,
			tier: 1
		}, {
			name: "beam",
			label: "Wooden Beam",
			description: "Simple support structure made of a wood. Required for advanced construction.",
			prices: [
				{name: "wood", val: 175}
			],
			unlocked: true,
			progressHandicap: 1,
			tier: 1
		}, {
			name: "slab",
			label: "Stone Slab",
			description: "A small slab composed of minerals. Required for advanced construction.",
			prices: [
				{name: "minerals", val: 250}
			],
			unlocked: true,
			progressHandicap: 1,
			tier: 1
		}, {
			name: "plate",
			label: "Metal Plate",
			description: "A metal plate. Required for advanced construction.",
			prices: [
				{name: "iron", val: 125}
			],
			unlocked: true,
			progressHandicap: 4,
			tier: 1
		}, {
			name: "steel",
			label: "Steel",
			description: "A durable metal made by smelting iron and coal. Required for construction of gears and complex machinery.",
			prices: [
				{name: "iron", val: 100},
				{name: "coal", val: 100}
			],
			unlocked: false,
			requires: {tech: ["steel"]},
			progressHandicap: 4,
			tier: 2
		}, {
			name: "concrate",
			label: "Concrete",
			description: "A block of reinforced concrete.",
			prices: [
				{name: "slab",  val: 2500},
				{name: "steel", val: 25}
			],
			unlocked: false,
			requires: {tech: ["mechanization"]},
			progressHandicap: 9,
			tier: 4
		}, {
			name: "gear",
			label: "Gear",
			description: "An integral part of automated structures.",
			prices: [
				{name: "steel", val: 15}
			],
			unlocked: true,
			progressHandicap: 5,
			tier: 3
		}, {
			name: "alloy",
			label: "Alloy",
			description: "A durable alloy of steel, iron and titanium. Required for advanced buildings and upgrades.",
			prices: [
				{name: "steel",    val: 75},
				{name: "titanium", val: 10}
			],
			unlocked: false,
			requires: {tech: ["chemistry"]},
			progressHandicap: 7,
			tier: 4
		}, {
			name: "eludium",
			label: "Eludium",
			description: "Extremely rare and expensive alloy of unobtanium and titanium.",
			prices: [
				{name: "alloy",       val: 2500},
				{name: "unobtainium", val: 1000}
			],
			unlocked: false,
			requires: {tech: ["advExogeology"]},
			progressHandicap: 100,
			tier: 5
		}, {
			name: "scaffold",
			label: "Scaffold",
			description: "A large structure made of wood beams required for construction of very complex buildings and objects",
			prices: [
				{name: "beam", val: 50}
			],
			unlocked: true,
			progressHandicap: 2,
			tier: 2
		}, {
			name: "ship",
			label: "Trade Ship",
			description: "Ships can be used to discover new civilisations. May improve chances of getting certain rare resources",
			prices: [
				{name: "scaffold",  val: 100},
				{name: "plate",     val: 150},
				{name: "starchart", val: 25}
			],
			unlocked: false,
			requires: {tech: ["navigation"]},
			upgrades: {buildings: ["harbor"]},
			progressHandicap: 20,
			tier: 3
		}, {
			name: "tanker",
			label: "Tanker",
			description: "Increase maximum oil capacity by 500",
			prices: [
				{name: "ship",      val: 200},
				{name: "alloy",     val: 1250},
				{name: "blueprint", val: 5}
			],
			unlocked: false,
			requires: {tech: ["robotics"]},
			upgrades: {buildings: ["harbor"]},
			progressHandicap: 20,
			tier: 5
		}, {
			name: "kerosene",
			label: "Kerosene",
			description: "A rocket fuel processed from oil",
			prices: [
				{name: "oil", val: 7500}
			],
			unlocked: false,
			requires: {tech: ["oilProcessing"]},
			progressHandicap: 5,
			tier: 2
		}, {
			name: "parchment",
			label: "Parchment",
			description: "A material for writing on made from animal skin, required for cultural buildings.",
			prices: [
				{name: "furs", val: 175}
			],
			unlocked: false,
			requires: {tech: ["writing"]},
			progressHandicap: 1,
			tier: 1
		}, {
			name: "manuscript",
			label: "Manuscript",
			description: "Written document required for technological advancement.Every manuscript will give a minor bonus to a maximum culture (this effect has a diminishing return)",
			prices: [
				{name: "parchment", val: 25},
				{name: "culture",   val: 400}
			],
			unlocked: true,
			progressHandicap: 2,
			tier: 2
		}, {
			name: "compedium",
			label: "Compendium",
			description: "A sum of all modern knowledge of the catkind. Every compendium will give +10 to max science",
			prices: [
				{name: "manuscript", val: 50},
				{name: "science",    val: 10000}
			],
			unlocked: false,
			requires: {tech: ["philosophy"]},
			progressHandicap: 5,
			tier: 3
		}, {
			name: "blueprint",
			label: "Blueprint",
			description: "Strange piece of paper with blue lines.",
			prices: [
				{name: "compedium", val: 25},
				{name: "science",   val: 25000}
			],
			unlocked: false,
			requires: {tech: ["physics"]},
			progressHandicap: 10,
			tier: 3
		}, {
			name: "thorium",
			label: "Thorium",
			description: "A highly radioactive and unstable fuel",
			prices: [
				{name: "uranium", val: 250}
			],
			unlocked: false,
			requires: {tech: ["thorium"]},
			progressHandicap: 5,
			tier: 3
		}, {
			name: "megalith",
			label: "Megalith",
			description: "A massive block that can be used to construct enormous structures",
			prices: [
				{name: "slab",  val: 50},
				{name: "beam",  val: 25},
				{name: "plate", val: 5}
			],
			unlocked: true,
			progressHandicap: 5,
			tier: 3
	}],

	effectsBase: {
		"scienceMax": 0,
		"oilMax":     0,
		"cultureMax": 0
	},

	tabName: "Workshop",
	getVisible: function () {
		return this.game.bld.get("workshop").owned();
	},

	upgrades: null,
	upgradesByName: null,
	crafts: null,
	craftsByName: null,

	hideResearched: false,

	constructor: function () {
		this.registerMetaItems(this.upgradeData, classes.KGSaveEdit.UpgradeMeta, "upgrades");
		this.registerMetaItems(this.craftData, classes.KGSaveEdit.CraftMeta, "crafts");
		this.meta.push(this.upgrades);
	},

	renderTabBlock: function () {
		this.craftEffectivenessNode = dojo.create("div", null, this.tabBlockNode);

		var div = dojo.create("div", {class: "bottom-margin"}, this.tabBlockNode);
		this.game._createCheckbox("Hide researched upgrades", div, this, "hideResearched");

		this.upgradesBlock = dojo.create("table", {
			id: "upgradesBlock",
			class: "bottom-margin",
			innerHTML: '<tr><th colspan="2">Upgrades</th></tr>'
		}, this.tabBlockNode);

		this.freeEngineersBlock = dojo.create("div", {
			id: "workshopFreeEngineersBlock",
			innerHTML: "Free engineers: <span>0 / 0</span>"
		}, this.tabBlockNode);
		this.freeEngineersNode = this.freeEngineersBlock.children[0];

		this.craftsBlock = dojo.create("table", {
			id: "workshopCraftsBlock"
		}, this.tabBlockNode);
	},

	render: function () {
		for (var i = 0, len = this.upgrades.length; i < len; i++) {
			var upgrade = this.upgrades[i];
			upgrade.render();
			dojo.place(upgrade.domNode, this.upgradesBlock);
		}

		for (i = 0, len = this.crafts.length; i < len; i++) {
			var craft = this.crafts[i];
			craft.render();
			dojo.place(craft.domNode, this.craftsBlock);
		}
	},

	get: function (upgradeName) {
		return this.upgradesByName[upgradeName];
	},

	getCraft: function (craftName) {
		return this.craftsByName[craftName];
	},

	getCraftPrice: function (craft) {
		if (craft.name !== "ship") {
			return craft.prices;
		}

		//special ship hack
		var prices = dojo.clone(craft.prices);
		for (var i = prices.length - 1; i >= 0; i--) {
			if (prices[i].name === "starchart") {
				prices[i].val = prices[i].val *
					(1 - this.game.getHyperbolicEffect(this.getEffect("satnavRatio") * this.game.space.getProgram("sattelite").val, 0.75));
				break;
			}
		}
		return prices;
	},

	countWorkers: function () {
		var count = 0;
		for (var i = this.crafts.length - 1; i >= 0; i--) {
			count += this.crafts[i].value;
		}
		return count;
	},

	update: function () {
		this.craftEffectivenessNode.innerHTML = "Craft effectiveness: +" +
			(this.game.getCraftRatio() * 100).toFixed() + "%";

		var count = this.countWorkers();

		var engineers = this.game.village.getJob("engineer").value;
		this.freeEngineers = engineers - count;

		if (count !== engineers || isNaN(this.freeEngineers) || this.freeEngineers < 0) { //safe switch
			count = this.game.village.countCraftJobs();
			this.freeEngineers = engineers - count;
		}

		this.freeEngineersNode.innerHTML = this.freeEngineers + " / " + engineers;

		dojo.toggleClass(this.freeEngineersBlock, "spoiler", !this.game.science.get("mechanization").owned());

		this.effectsBase["scienceMax"] = Math.floor(this.game.resPool.get("compedium").value * 10);
		this.effectsBase["oilMax"] = Math.floor(this.game.resPool.get("tanker").value * 500);
		var cultureBonusRaw = Math.floor(this.game.resPool.get("manuscript").value);
		this.effectsBase["cultureMax"] = this.game.getTriValue(cultureBonusRaw, 0.01);

		this.game.callMethods(this.upgrades, "update", this.hideResearched);
		this.game.callMethods(this.crafts, "update");
	},

	getEffectBase: function (name) {
		return num(this.effectsBase[name]);
	},

	getEffectEngineer: function (resName, afterCraft) {
		var craft = this.getCraft(resName);
		if (!craft) {
			return 0;
		}

		var resMapProduction = this.game.village.getResProduction();
		var kittenResProduction = resMapProduction["ES" + resName] ? resMapProduction["ES" + resName] : 0;

		if (this.game.workshop.get("neuralNetworks").owned()) {
			kittenResProduction *= 2;
		}

		var tierCraftRatio = this.game.getEffect("t" + craft.tier + "CraftRatio") || 0;
		if (tierCraftRatio == 0) {
			tierCraftRatio = 1;
		}

		// (One * bonus / handicap) crafts per engineer per 10 minutes
		var effectPerTick = (1 / (600 * this.game.rate)) * (kittenResProduction * tierCraftRatio) / craft.progressHandicap;

		return afterCraft ? effectPerTick * this.game.getResCraftRatio({name: resName}) : effectPerTick;
	},

	save: function (saveData) {
		var upgrades = this.game.filterMetadata(this.upgrades, ["name", "unlocked", "researched"]);
		var crafts = this.game.filterMetadata(this.crafts, ["name", "unlocked", "value", "progress"]);

		saveData.workshop = {
			upgrades:       upgrades,
			crafts:         crafts,
			hideResearched: Boolean(this.hideResearched)
		};
	},

	load: function (saveData) {
		if (!saveData.workshop) {
			return;
		}

		this.set("hideResearched", saveData.workshop.hideResearched);

		this.loadMetadata(saveData, "workshop.upgrades", "get", null, true);

		this.loadMetadata(saveData, "workshop.crafts", "getCraft", null, true);
	}
});


dojo.declare("classes.KGSaveEdit.CraftMeta", classes.KGSaveEdit.MetaItem, {
	unlocked: false,
	value: 0,
	progress: 0,

	hideEffects: true,

	getName: function () {
		var name = this.label;
		if (this.game.science.get("mechanization").owned() && this.value > 0) {
			var progressDisplayed = this.game.toDisplayPercentage(this.progress, 0, true);
			if (progressDisplayed > 99) {
				progressDisplayed = 99;
			}
			// var progressDisplayed = this.game.toDisplayPercentage(Math.min(this.progress, 1), 0, true);
			name += " (" + this.value + ") [" + progressDisplayed + "%]";
		}
		return name;
	},

	getDescription: function () {
		var desc = this.description;

		if (this.game.science.get("mechanization").owned()) {
			desc += "<br><br>Engineer's optimal rank: " + this.tier;

			var tierBonus = this.game.getEffect("t" + this.tier + "CraftRatio") || 1;
			if (tierBonus != 1) {
				desc += "<br>Engineers expertise: " + this.game.getDisplayValueExt(((tierBonus - 1) * 100).toFixed(), true) + "%";
			}

			if (this.progressHandicap != 1) {
				var difficulty = this.game.getDisplayValueExt(((-(1 - (1 / this.progressHandicap))) * 100).toFixed(2), true);
				desc += "<br>Craft difficulty: " + difficulty + "%";
			}

			if (this.value != 0) {
				var countdown = (1 / (this.game.workshop.getEffectEngineer(this.name, false) * 5)).toFixed(0);
				desc += "<br>=> One craft every: " + countdown + "sec";
			}
			desc += "<br><br>" + "Class: " + this.tier;
		}
		return desc;
	},

	render: function () {
		this.domNode = dojo.create("tr", {
			class: "craft",
			innerHTML: "<td>" + (this.label || this.name) + "</td><td></td><td></td><td> &nbsp;Progress </td>"
		});
		this.nameNode = this.domNode.children[0];

		var input = this.game._createInput({
			class: "integerInput",
			title: "Crafting Engineers"
		}, this.domNode.children[1], this, "value");

		input.parseFn = function (value) {
			return Math.min(value, this.metaObj.value + this.game.village.getFreeEngineer());
		};

		this.game._createLinkList(this, this.domNode.children[2], [
			{html: "[+]", value: 1},
			{html: "[+5]", value: 5},
			{html: "[+25]", value: 25}
		], function (value) {
			this.game.village.assignCraftJobs(this, value);
		});

		this.game._createLinkList(this, this.domNode.children[2], [
			{html: "[-]", value: 1},
			{html: "[-5]", value: 5},
			{html: "[-25]", value: 25}
		], function (value) {
			this.game.village.unassignCraftJobs(this, value);
		});

		this.game._createCheckbox("Unlocked", this.domNode.children[3], this, "unlocked", "first");

		this.game._createInput(null, this.domNode.children[3], this, "progress");

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	update: function () {
		var req = this.game.checkRequirements(this);
		this.set("unlocked", req || this.unlockedNode.prevChecked, true);
		this.game.toggleDisabled(this.unlockedNode, req);

		//check and cache if you can't craft even once due to storage limits
		this.isLimited = this.game.resPool.isStorageLimited(this.getPrices());

		this.updateEnabled();
	},

	getPrices: function (simple) {
		return dojo.clone(simple ? this.prices : this.game.workshop.getCraftPrice(this));
	},

	load: function (saveCraft) {
		this.set("unlocked", Boolean(saveCraft.unlocked));
		this.set("value", num(saveCraft.value));
		this.set("progress", num(saveCraft.progress));
	}
});

});
