/*global dojo, require, classes, num*/

require(["dojo/on"], function (on) {
"use strict";

dojo.declare('classes.KGSaveEdit.BuildingsManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	buildingsData: [{
			name: "field",
			label: "Catnip field",
			description: "Plant some catnip to grow in the village.\nFields have +50% production in Spring and -75% production in Winter",
			prices: [
				{name: "catnip", val: 10}
			],
			priceRatio: 1.12,
			effects: {
				"catnipPerTickBase": 0.125
			},
			flavor: "'Nip as far as the eye can see."
		}, {
			name: "pasture",
			stage: 0,
			stages: [{
				label: "Pasture",
				description: "Provides an alternative source of food, which reduces catnip consumption.",
				prices: [
					{name: "catnip", val: 100},
					{name: "wood",   val: 10}
				],
				priceRatio: 1.15,
				stageUnlocked: true,
				// stageRequires: {tech: ["animal"]},
				effects: {
					"catnipDemandRatio": -0.005
				},
				flavor: "Take a pint o' milk, Sir!"
			}, {
				label: "Solar Farm",
				description: "Provides an additional source of energy.",
				prices: [
					{name: "titanium", val: 250}
				],
				priceRatio: 1.15,
				stageUnlocked: false,
				stageRequires: {tech: ["ecology"]},
				effects: {
					"energyProduction": 2
				}
			}],
			requires: {tech: ["animal"]},
			calculateEffects: function (self, game) {
				var stageMeta = self.stages[self.stage];
				if (self.stage === 0) {
					//do nothing
				} else if (self.stage === 1) {
					var effects = {
						"energyProduction": 2
					};
					effects.energyProduction *= 1 + game.workshop.getEffect("solarFarmRatio");
					stageMeta.effects = effects;
				}
				self.effects = stageMeta.effects || {};
			}
		}, {
			name: "aqueduct",
			label: "Aqueduct",
			stage: 0,
			stages: [{
				label: "Aqueduct",
				description: "+3% to catnip production",
				prices: [
					{name: "minerals", val: 75}
				],
				priceRatio: 1.12,
				stageUnlocked: true,
				// stageRequires: {tech: ["engineering"]},
				effects: {
					"catnipRatio": 0.03
				},
				flavor: "No Swimming"
			}, {
				label: "Hydro Plant",
				description: "A modern source of power production",
				prices: [
					{name: "concrate", val: 100},
					{name: "titanium", val: 2500}
				],
				priceRatio: 1.15,
				stageUnlocked: false,
				stageRequires: {tech: ["robotics"]},
				effects: {
					"energyProduction": 5
				}
			}],
			requires: {tech: ["engineering"]},
			calculateEffects: function (self, game) {
				var stageMeta = self.stages[self.stage];
				if (self.stage === 0) {
					//do nothing
				} else if (self.stage === 1) {
					var effects = {
						"energyProduction": 5
					};
					effects.energyProduction *= 1 + game.workshop.getEffect("hydroPlantRatio");
					stageMeta.effects = effects;
				}
				self.effects = stageMeta.effects || {};
			}
		}, {
			name: "hut",
			label: "Hut",
			description: "Build a hut (each has a space for 2 kittens)",
			prices: [
				{name: "wood", val: 5}
			],
			priceRatio: 2.5,
			breakIronWill: true,
			// unlocks: {tabs: ["village"]},
			effects: {
				"maxKittens":  2,
				"manpowerMax": 75
			},
			flavor: "The Nation of Two"
		}, {
			name: "logHouse",
			label: "Log House",
			description: "Build a house (each has a space for 1 kitten)",
			prices: [
				{name: "wood",     val: 200},
				{name: "minerals", val: 250}
			],
			priceRatio: 1.15,
			requires: {tech: ["construction"]},
			breakIronWill: true,
			effects: {
				"maxKittens":  1,
				"manpowerMax": 50
			},
			flavor: "The Cabin in the Woods"
		}, {
			name: "mansion",
			label: "Mansion",
			description: "A spacy mansion (each has a space for 1 kitten)",
			prices: [
				{name: "slab",     val: 185},
				{name: "steel",    val: 75},
				{name: "titanium", val: 25}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["architecture"]},
			breakIronWill: true,
			effects: {
				"maxKittens":  1,
				"manpowerMax": 50
			},
			flavor: "The best shipping container available"
		}, {
			name: "library",
			label: "Library",
			description: "Build a library to store sacred catkind knowledge.\nEach upgrade level improves your science output by 8%",
			prices: [
				{name: "wood", val: 25}
			],
			priceRatio: 1.15,
			// unlocks: {tabs: ["science"], jobs: ["scholar"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"scienceRatio": 0.08,
					"scienceMax":   250,
					"cultureMax":   10
				};
				var libraryRatio = game.workshop.getEffect("libraryRatio");
				effects["scienceMax"] *= 1 + game.bld.get("observatory").val * libraryRatio;
				self.effects = effects;
			},
			flavor: "All in Catonese"
		}, {
			name: "academy",
			label: "Academy",
			description: "Improves your research ratio and the speed of your kitten skills growth.\nEach upgrade level improves your science output by 20%",
			prices: [
				{name: "wood",     val: 50},
				{name: "minerals", val: 70},
				{name: "science",  val: 100}
			],
			priceRatio: 1.15,
			requires: {tech: ["math"]},
			effects: {
				"scienceRatio": 0.2,
				"scienceMax":   500,
				"learnRatio":   0.05,
				"cultureMax":   25
			},
			flavor: "Curiosity is the basis of science. Our cats died nobly"
		}, {
			name: "observatory",
			label: "Observatory",
			description: "Increases the chance of astronomical events by 0.5%",
			prices: [
				{name: "scaffold", val: 50},
				{name: "slab",     val: 35},
				{name: "iron",     val: 750},
				{name: "science",  val: 1000}
			],
			priceRatio: 1.10,
			ignorePriceCheck: true,
			requires: {tech: ["astronomy"]},
			effects: {},
			upgrades: {buildings: ["library"]},
			calculateEffects: function (self, game) {
				var effects = {
					"scienceRatio":          0.25,
					"starEventChance":       20,
					"starAutoSuccessChance": 1,
					"scienceMax":            1000
				};

				if (game.workshop.get("astrolabe").owned()) {
					effects["scienceMax"] = 1500;
				}

				var ratio = 1 + game.space.getEffect("observatoryRatio");
				effects["scienceMax"] *= ratio;
				effects["scienceRatio"] *= ratio;

				self.effects = effects;
			},
			flavor: "Yearning to one day catch the red light fairy"
		}, {
			name: "biolab",
			label: "Bio Lab",
			description: "Improves effectiveness of catnip refinement by 10%",
			prices: [
				{name: "slab",    val: 100},
				{name: "alloy",   val: 25},
				{name: "science", val: 1500}
			],
			priceRatio: 1.10,
			ignorePriceCheck: true,
			requires: {tech: ["biology"]},
			enabled: true,
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"scienceRatio":      0.35,
					"refineRatio":       0.1,
					"scienceMax":        1500
				};
				self.togglable = false;
				self.tunable = false;

				if (game.workshop.get("biofuel").owned()) {
					self.togglable = true;
					self.tunable = true;

					effects["catnipPerTick"] = -1;
					effects["oilPerTick"] = 0.02 * (1 + game.workshop.getEffect("biofuelRatio"));
					effects["energyConsumption"] = 1;
				}

				self.effects = effects;
			},
			flavor: "New postdoc positions available.",
			exportOn: true
		}, {
			name: "barn",
			label: "Barn",
			description: "Provides a space to store your resources.",
			prices: [
				{name: "wood", val: 50}
			],
			priceRatio: 1.75,
			requires: {tech: ["agriculture"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"catnipMax":   5000,
					"woodMax":     200,
					"mineralsMax": 250,
					"ironMax":     50,
					"coalMax":     60,
					"goldMax":     10,
					"titaniumMax": 2
				};

				self.effects = game.resPool.addBarnWarehouseRatio(effects);
			},
			flavor: "Rats ain't a problem for us!"
		}, {
			name: "warehouse",
			label: "Warehouse",
			description: "Provides a space to store your resources",
			prices: [
				{name: "beam", val: 1.5},
				{name: "slab", val: 2}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["construction"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"catnipMax":   0, //for tooltip order
					"woodMax":     150,
					"mineralsMax": 200,
					"ironMax":     25,
					"coalMax":     30,
					"goldMax":     5,
					"titaniumMax": 10
				};

				if (game.workshop.get("silos").owned()) {
					effects["catnipMax"] = 750;
				}

				self.effects = game.resPool.addBarnWarehouseRatio(effects);
			},
			flavor: "All our stocks are scratched"
		}, {
			name: "harbor",
			label: "Harbour",
			description: "Provides a space to store your resources",
			prices: [
				{name: "scaffold", val: 5},
				{name: "slab",     val: 50},
				{name: "plate",    val: 75}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["navigation"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"catnipMax":   2500,
					"woodMax":     700,
					"mineralsMax": 950,
					"ironMax":     150,
					"coalMax":     100,
					"goldMax":     25,
					"titaniumMax": 50
				};

				effects["coalMax"] *= 1 + game.workshop.getEffect("harborCoalRatio");

				var cargoShips = game.workshop.get("cargoShips");
				if (cargoShips.owned()) {
					var shipVal = game.resPool.get("ship").value;

					//100% to 225% with slow falldown on the 75%
					var limit = 2.25 + game.workshop.getEffect("shipLimit") * game.bld.get("reactor").val;
					var ratio = 1 + game.bld.getHyperbolicEffect(cargoShips.effects["harborRatio"] * shipVal, limit);

					effects["catnipMax"] *=   ratio;
					effects["woodMax"] *=     ratio;
					effects["mineralsMax"] *= ratio;
					effects["ironMax"] *=     ratio;
					effects["coalMax"] *=     ratio;
					effects["goldMax"] *=     ratio;
					effects["titaniumMax"] *= ratio;
				}

				self.effects = game.resPool.addBarnWarehouseRatio(effects);
			},
			flavor: "Ahoy, landlubbers!"
		}, {
			name: "mine",
			label: "Mine",
			description: "Unlocks the miner job.\nEach upgrade level improves your mineral output by 20%",
			prices: [
				{name: "wood", val: 100}
			],
			priceRatio: 1.15,
			unlockRatio: 0.15,
			// unlocks: {jobs: ["miner"]},
			requires: {tech: ["mining"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"mineralsRatio": 0.2
				};

				if (game.workshop.get("deepMining").owned()) {
					//fun but ugly hack
					effects["coalPerTickBase"] = 0.003;
				}

				self.effects = effects;
			},
			flavor: "100 days without diggor mortis"
		}, {
			name: "quarry",
			label: "Quarry",
			description: "Quarries each improve your mining efficiency by 35% and produce a bit of coal",
			prices: [
				{name: "scaffold", val: 50},
				{name: "steel",    val: 150},
				{name: "slab",     val: 1000}
			],
			priceRatio: 1.15,
			requires: {tech: ["archeology"]},
			effects: {
				"mineralsRatio":   0.35,
				"coalPerTickBase": 0.015
			},
			flavor: "Its full of mice! Wait, wrong 'quarry'"
		}, {
			name: "smelter",
			label: "Smelter",
			description: "Smelts ore into metal",
			prices: [
				{name: "minerals", val: 200}
			],
			priceRatio: 1.15,
			requires: {tech: ["metal"]},
			enabled: false,
			togglable: true,
			tunable: true,
			effects: {
				"woodPerTick":     -0.05,
				"mineralsPerTick": -0.1,
				"ironPerTick":      0.02
			},
			action: function (self, game) {
				self.effects = {
					"woodPerTick":     -0.05,
					"mineralsPerTick": -0.1,
					"ironPerTick":      0.02
				};
				// TODO: How to integrate autoProdRatio with calculateEffects?

				if (self.getOn() < 1) {
					return;
				}

				//--------------------------- hack hack hack hack --------------------------------
				var autoProdRatio = game.bld.getAutoProductionRatio();
				//--------------------------------------------------------------------------------

				var smelterRatio = 1 + game.workshop.getEffect("smelterRatio");
				self.effects["ironPerTick"] = 0.02 * smelterRatio * autoProdRatio;

				if (game.workshop.get("goldOre").owned()) {
					self.effects["goldPerTick"] = 0.001 * autoProdRatio;
				}

				if (game.workshop.get("coalFurnace").owned()) {
					self.effects["coalPerTick"] = 0.005 * smelterRatio * autoProdRatio;
				}

				if (game.workshop.get("nuclearSmelters").owned()) {
					self.effects["titaniumPerTick"] = 0.0015 * autoProdRatio;
				}
			},
			flavor: "Hot!"
		}, {
			name: "calciner",
			label: "Calciner",
			description: "A highly effective source of metal.\nConsumes 1.5 minerals and 0.02 oil per tick. Produces iron and a small amount of titanium",
			prices: [
				{name: "steel",     val: 120},
				{name: "titanium",  val: 15},
				{name: "blueprint", val: 5},
				{name: "oil",       val: 500}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["chemistry"]},
			enabled: false,
			togglable: true,
			tunable: true,
			isAutomationEnabled: false,
			effects: {
				"mineralsPerTick":  -1.5,
				"ironPerTick":       0.15,
				"titaniumPerTick":   0.0005,
				"oilPerTick":       -0.024,
				"energyConsumption": 1
			},
			action: function (self, game) {
				// TODO: How to integrate autoProdRatio with calculateEffects?

				if (self.getOn() < 1) {
					return;
				}

				self.effects["coalPerTick"] = 0;
				self.effects["steelPerTick"] = 0;

				//--------------------------- hack hack hack hack --------------------------------
				var autoProdRatio = game.bld.getAutoProductionRatio();
				//--------------------------------------------------------------------------------

				var calcinerRatio = game.workshop.getEffect("calcinerRatio");
				self.effects["titaniumPerTick"] = 0.0005 * (1 + calcinerRatio * 3) * autoProdRatio;
				self.effects["ironPerTick"] = 0.15 * (1 + calcinerRatio) * autoProdRatio;

				var steelRatio = game.workshop.getEffect("calcinerSteelRatio");

				if (steelRatio) {
					// Second conversion of some of the iron that was just created, to steel
					var newiron = self.effects["ironPerTick"] * (1 - steelRatio);
					var difference = self.effects["ironPerTick"] - newiron;
					self.effects["ironPerTick"] = newiron;
					self.effects["coalPerTick"] = -difference;
					self.effects["steelPerTick"] = difference / 100;
				}
			}
		}, {
			name: "steamworks",
			label: "Steamworks",
			description: "When active, significantly reduces your coal production. Does nothing useful by default, but can do a lot of cool stuff once upgraded.",
			prices: [
				{name: "steel",     val: 65},
				{name: "gear",      val: 20},
				{name: "blueprint", val: 1}
			],
			priceRatio: 1.25,
			ignorePriceCheck: true,
			requires: {tech: ["machinery"]},
			enabled: false,
			togglable: true,
			effects: {},
			jammed: false,
			isAutomationEnabled: false,
			calculateEffects: function (self, game) {
				var effects = {
					"coalRatioGlobal":  -0.8, //to be revisited later
					"magnetoBoostRatio": 0.15,
					"energyProduction":  1
				};

				if (game.workshop.get("printingPress").owned()) {
					var amt = 0.0005; // 2 per year per SW

					if (game.workshop.get("offsetPress").owned()) {
						amt *= 4;
					}
					if (game.workshop.get("photolithography").owned()) {
						amt *= 4;
					}
					effects["manuscriptPerTick"] = amt;
				}

				var coalRatio = game.workshop.getEffect("coalRatioGlobal");
				effects["coalRatioGlobal"] += coalRatio;

				self.effects = effects;
			},
			flavor: "I just nap here and it looks like I'm working"
		}, {
			name: "magneto",
			label: "Magneto",
			description: "Improves your total resource production by 2%. Every steamworks will boost this effect by 15%. Consumes oil.",
			prices: [
				{name: "alloy",     val: 10},
				{name: "gear",      val: 5},
				{name: "blueprint", val: 1}
			],
			priceRatio: 1.25,
			ignorePriceCheck: true,
			requires: {tech: ["electricity"]},
			enabled: false,
			togglable: true,
			tunable: true,
			effects: {
				"oilPerTick":      -0.05,
				"magnetoRatio":     0.02,
				"energyProduction": 5
			}
		}, {
			name: "lumberMill",
			label: "Lumber Mill",
			description: "Improves wood production by 10%",
			prices: [
				{name: "wood",     val: 100},
				{name: "iron",     val: 50},
				{name: "minerals", val: 250}
			],
			priceRatio: 1.15,
			requires: {tech: ["construction"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"woodRatio": 0.1
				};

				var ratio = 1 + game.workshop.getEffect("lumberMillRatio");
				effects["woodRatio"] *= ratio;

				self.effects = effects;
			},
			flavor: "Best log analysing tool"
		}, {
			name: "oilWell",
			label: "Oil Well",
			description: "Produces a bit of oil, +1500 to maximum oil limit",
			prices: [
				{name: "steel",    val: 50},
				{name: "gear",     val: 25},
				{name: "scaffold", val: 25}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["chemistry"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"oilMax":         1500,
					"oilPerTickBase": 0.02
				};

				self.togglable = false;
				self.tunable = false;

				var ratio = 1 + game.workshop.getEffect("oilRatio");
				effects["oilPerTickBase"] *= ratio;

				if (game.workshop.get("pumpjack").owned()) {
					effects["energyConsumption"] = 1;
					self.togglable = true;
					self.tunable = true;
				}

				self.effects = effects;
			},
			flavor: "Rise early, work hard, strike oil.",
			exportOn: true,
			togglable: false,
			tunable: false,
		}, {
			name: "workshop",
			label: "Workshop",
			description: "Provides a vast variety of upgrades.\nImproves craft effectiveness by 6%",
			prices: [
				{name: "wood",     val: 100},
				{name: "minerals", val: 400}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			// unlocks: {tabs: ["workshop"]},
			effects: {},
			calculateEffects: function(self, game) {
				var effects = {
					"craftRatio" : 0.06 //6% for craft output
				};
				effects["keroseneCraftRatio"] = game.workshop.getEffect("factoryRefineRatio");
				self.effects = effects;
			},
			flavor: "Free toys for workers"
		}, {
			name: "factory",
			label: "Factory",
			description: "Improves craft effectiveness by 5%",
			prices: [
				{name: "titanium", val: 2000},
				{name: "plate",    val: 2500},
				{name: "concrate", val: 15}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["mechanization"]},
			togglable: true,
			tunable: true,
			effects: {
				"craftRatio":        0.05,
				"energyConsumption": 2
			}
		}, {
			name: "reactor",
			label: "Reactor",
			description: "Provides a 5% boost to production while active. Requires uranium to operate.",
			prices: [
				{name: "titanium",  val: 3500},
				{name: "plate",     val: 5000},
				{name: "concrate",  val: 50},
				{name: "blueprint", val: 25}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["nuclearFission"]},
			togglable: true,
			tunable: true,
			effects: {},
			upgrades: {buildings: ["harbor"]},
			calculateEffects: function (self, game) {
				var effects = {
					"uraniumPerTick":  -0.001,
					"productionRatio":  0.05,
					"uraniumMax":       250,
					"energyProduction": 10
				};

				effects["uraniumPerTick"] *= (1 - game.workshop.getEffect("uraniumRatio"));
				effects["energyProduction"] *= (1 + game.workshop.getEffect("reactorEnergyRatio"));

				self.effects = effects;
			}
		}, {
			name: "accelerator",
			label: "Accelerator",
			description: "Converts titanium to the uranium (sic)",
			prices: [
				{name: "titanium", val: 7500},
				{name: "concrate", val: 125},
				{name: "uranium",  val: 25}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["particlePhysics"]},
			togglable: true,
			tunable: true,
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"titaniumPerTick":  -0.015,
					"uraniumPerTick":    0.0025,
					"energyConsumption": 2
				};

				if (game.workshop.get("lhc").owned()) {
					effects["scienceMax"] = 2500;
				}

				//------------- limit upgrades ------------
				var capRatio = 1 + game.workshop.getEffect("acceleratorRatio");
				if (game.workshop.get("energyRifts").owned()) {
					effects["catnipMax"]   = 30000 * capRatio;
					effects["woodMax"]     = 20000 * capRatio;
					effects["mineralsMax"] = 25000 * capRatio;
					effects["ironMax"]     =  7500 * capRatio;
					effects["coalMax"]     =  2500 * capRatio;
					effects["goldMax"]     =   250 * capRatio;
					effects["titaniumMax"] =   750 * capRatio;
				}

				self.effects = effects;
			},
			action: function (self, game) {
				// TODO: How to integrate autoProdRatio with calculateEffects?

				var autoProdRatio = game.bld.getAutoProductionRatio(true);
				self.effects["uraniumPerTick"] = 0.0025 * autoProdRatio;
			},
			flavor: "Large Catron Collider"
		}, {
			name: "tradepost",
			label: "Tradepost",
			description: "The heart of your trading empire.\nImproves trade effectiveness by 1.5%, reduces rare resource consumption by 4%",
			prices: [
				{name: "wood",     val: 500},
				{name: "minerals", val: 200},
				{name: "gold",     val: 10}
			],
			priceRatio: 1.15,
			requires: {tech: ["currency"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"fursDemandRatio":  -0.04,
					"ivoryDemandRatio": -0.04,
					"spiceDemandRatio": -0.04,
					/*"silkDemandRatio":  -0.04,*/
					"tradeRatio":        0.015
				};

				var seri = game.workshop.get("caravanserai");
				if (seri.owned()) {
					effects["standingRatio"] = seri.effects["standingRatio"];
				}

				self.effects = effects;
			},
			flavor: "I hope they have yarn"
		}, {
			name: "mint",
			label: "Mint",
			description: "Produces luxurious resources proportional to your max catpower. Consumes catpower and a bit of gold.",
			prices: [
				{name: "minerals", val: 5000},
				{name: "plate",    val: 200},
				{name: "gold",     val: 500}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["architecture"]},
			enabled: false,
			togglable: true,
			tunable: true,
			effects: {},
			calculateEffects: function (self, game) {
				self.effects = {
					"mintEffect":       0.007,
					"manpowerPerTick": -0.75,
					"goldPerTick":     -0.005, //~5 smelters
					"goldMax":          100 * (1 + game.workshop.getEffect("warehouseRatio"))
				};
			},
			action: function (self, game) {
				// TODO: How to integrate max manpower with calculateEffects?

				if (self.getOn() < 1) {
					return;
				}

				var manpower = game.resPool.get("manpower");
				var mpratio = (manpower.maxValue * self.effects["mintEffect"]) / 100;

				self.effects["fursPerTick"]  = mpratio * 1.25; //2
				self.effects["ivoryPerTick"] = mpratio * 0.3;  //1.5
			}
		}, {
			name: "amphitheatre",
			ignorePriceCheck: true,
			stage: 0,
			stages: [{
				label: "Amphitheatre",
				description: "Reduces negative effects of overpopulation by 5%. Produces culture.",
				prices: [
					{name: "wood",      val: 200},
					{name: "minerals",  val: 1200},
					{name: "parchment", val: 3}
				],
				priceRatio: 1.15,
				stageUnlocked: true,
				// stageRequires: {tech: ["writing"]},
				effects: {
					"unhappinessRatio":  -0.048,
					"culturePerTickBase": 0.005,
					"cultureMax":         50
				},
				flavor: "Daily 'All Dogs Go to Heaven' showings"
			}, {
				label: "Broadcast Tower",
				description: "Generates culture and happiness. More effective with high energy production.",
				prices: [
					{name: "iron",     val: 1250},
					{name: "titanium", val: 75}
				],
				priceRatio: 1.18,
				stageUnlocked: false,
				stageRequires: {tech: ["electronics"]},
				effects: {
					"culturePerTickBase": 1,
					"unhappinessRatio":  -0.75,
					"cultureMax":         300
				}
			}],
			requires: {tech: ["writing"]},
			action: function (self, game) {
				//very ugly and crappy stuff
				var btower = self.stages[1];

				btower.effects["cultureMax"] = 300;
				btower.effects["culturePerTickBase"] = 1;

				var energyRatio = (game.resPool.energyProd / game.resPool.energyCons);
				if (energyRatio > 1) {
					if (energyRatio > 1.75) {
						energyRatio = 1.75;
					}
					btower.effects["cultureMax"] = Math.floor(300 * energyRatio);
					btower.effects["culturePerTickBase"] = Math.floor(1 * energyRatio);
				}

				var broadcastTowerRatio = game.workshop.getEffect("broadcastTowerRatio");
				var totalRatio = game.space.getProgram("sattelite").val * broadcastTowerRatio;

				btower.effects["cultureMax"] *= (1 + totalRatio);
				btower.effects["culturePerTickBase"] *= (1 + totalRatio);

				self.effects = self.stages[self.stage].effects || {};
			}
		}, {
			name: "chapel",
			label: "Chapel",
			description: "Produces a bit of culture and faith per tick. May be improved with religious upgrades",
			prices: [
				{name: "minerals",  val: 2000},
				{name: "culture",   val: 250},
				{name: "parchment", val: 250}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["acoustics"]},
			effects: {
				"culturePerTickBase": 0.05,
				"faithPerTickBase":   0.005,
				"cultureMax":         200
			}
		}, {
			name: "temple",
			label: "Temple",
			description: "Temple of light. Produces culture. May be improved with Theology.",
			prices: [
				{name: "slab",       val: 25},
				{name: "plate",      val: 15},
				{name: "gold",       val: 50},
				{name: "manuscript", val: 10}
			],
			priceRatio: 1.15,
			ignorePriceCheck: true,
			requires: {tech: ["philosophy"]},
			effects: {},
			calculateEffects: function (self, game) {
				var effects = {
					"culturePerTickBase": 0.1,
					"faithMax":           100
				};

				var theology = game.science.get("theology");
				if (theology.owned()) {
					effects["faithPerTickBase"] = 0.0015;
				}

				var stainedGlass = game.religion.getRU("stainedGlass");
				if (stainedGlass.owned()) {
					effects["culturePerTickBase"] += 0.05 * stainedGlass.val;
				}

				var scholastics = game.religion.getRU("scholasticism");
				if (scholastics.owned()) {
					effects["scienceMax"] = 400 + 100 * scholastics.val;
				}

				var sunAltar = game.religion.getRU("sunAltar");
				if (sunAltar.owned()) {
					effects["faithMax"] += 50 * sunAltar.val;
					effects["happiness"] = 0.4 + 0.1 * sunAltar.val;
				}

				var goldenSpire = game.religion.getRU("goldenSpire");
				if (goldenSpire.owned()) {
					effects["faithMax"] *= (1 + (0.4 + 0.1 * goldenSpire.val));
				}

				var basilica = game.religion.getRU("basilica");
				if (basilica.owned()) {
					effects["cultureMax"] = 75 + 50 * basilica.val;
					effects["culturePerTickBase"] += 0.2 + 0.05 * (basilica.val - 1);
				}

				var templars = game.religion.getRU("templars");
				if (templars.owned()) {
					effects["manpowerMax"] = 50 + 25 * templars.val;
				}

				self.effects = effects;
			},
			flavor: "All praise Ceiling Cat!"
		}, {
			name: "unicornPasture",
			label: "Unic. Pasture",
			description: "Allows the taming of unicorns.\nReduces catnip consumption by 0.15%",
			prices: [
				{name: "unicorns", val: 2}
			],
			priceRatio: 1.75,
			requires: {tech: ["animal"]},
			effects: {
				"catnipDemandRatio":  -0.0015,
				"unicornsPerTickBase": 0.001
			},
			flavor: "We glue horns on horses"
		}, {
			name: "ziggurat",
			label: "Ziggurat",
			description: "The dark legacy of the lost race.\n May have special usage once Theology is researched.",
			prices: [
				{name: "megalith",  val: 75},
				{name: "scaffold",  val: 50},
				{name: "blueprint", val: 1}
			],
			priceRatio: 1.25,
			unlockRatio: 0.01,
			requires: {tech: ["construction"]}
		}, {
			name: "chronosphere",
			label: "Chronosphere",
			description: "Relocates small amount of resources through the time. Can be upgraded further. Every chronosphere increases the chance of Temporal Paradox.",
			prices: [
				{name: "unobtainium", val: 2500},
				{name: "timeCrystal", val: 1},
				{name: "blueprint",   val: 100},
				{name: "science",     val: 250000}
			],
			priceRatio: 1.25,
			ignorePriceCheck: true,
			requires: {tech: ["chronophysics"]},
			effects: {
				"resStasisRatio":    0.015,
				"energyConsumption": 20
			}
	}],

	buildingGroupsData: {
		all: {
			name: 'all',
			title: 'All',
			buildings: [],
			alwaysVisible: true
		},
		allEnabled: {
			name: 'allEnabled',
			title: 'Enabled',
			filterFn: function (bld) {
				return bld.unlocked && !dojo.hasClass(bld.nameNode, 'btnDisabled');
			},
			alwaysVisible: true
		},
		togglable: {
			name: 'togglable',
			title: 'Togglable',
			filterFn: function (bld) {
				return bld.togglable;
			},
			alwaysVisible: true
		},
		iw: {
			name: 'iw',
			title: 'Iron Will',
			buildings: []
		},
		food: {
			name: 'food',
			title: 'Food',
			buildings: ["field", "pasture", "aqueduct"]
			/* filterFn: function () {
				var bld = ["field"];
				if (KEdt.bld.get("pasture").stage === 0) {
					bld.push("pasture");
				}
				if (KEdt.bld.get("aqueduct").stage === 0) {
					bld.push("aqueduct");
				}
				return bld;
			} */
		},
		population: {
			name: 'population',
			title: 'Population',
			buildings: ["hut", "logHouse", "mansion"]
		},
		science: {
			name: 'science',
			title: 'Science',
			buildings: ["library", "academy", "observatory", "biolab"]
		},
		storage: {
			name: 'storage',
			title: 'Storage',
			buildings: ["barn", "warehouse", "harbor"]
		},
		resource: {
			name: 'resource',
			title: 'Resource',
			buildings: ["mine", "quarry", "lumberMill", "oilWell", "accelerator"]
		},
		industry: {
			name: 'industry',
			title: 'Industry',
			buildings: ["steamworks", "magneto", "smelter", "calciner", "factory", "reactor"]
			/* filterFn: function () {
				if (KEdt.bld.get("pasture").stage > 0) {
					bld.push("pasture");
				}
				if (KEdt.bld.get("aqueduct").stage > 0) {
					bld.push("aqueduct");
				}
				return bld;
			} */
		},
		culture: {
			name: 'culture',
			title: 'Culture',
			buildings: ["amphitheatre", "chapel", "temple"]
		},
		other: {
			name: 'other',
			title: 'Other',
			buildings: ["workshop", "tradepost", "mint", "unicornPasture"]
		},
		megastructures: {
			name: 'megastructures',
			title: 'Mega Structures',
			buildings: ["ziggurat", "chronosphere"]
		}
	},

	activeGroup: null,

	groupBuildings: false,
	twoRows: false,

	effectsBase: {
		"manpowerMax":    100,
		"catnipMax":      5000,
		"woodMax":        200,
		"mineralsMax":    250,
		"faithMax":       100,
		"cultureMax":     100,
		"uraniumMax":     250,
		"unobtainiumMax": 150
	},

	buildings: null,
	buildingsByName: null,
	buildingGroups: null,

	tabName: 'Bonfire',
	tabBlockClass: 'shortInt',

	constructor: function (game) {
		this.buildings = [];
		this.buildingsNames = [];
		this.buildingsByName = {};
		this.buildingGroups = {};

		for (var name in this.buildingGroupsData) {
			var group = dojo.clone(this.buildingGroupsData[name]);
			group.game = game;
			group.alwaysVisible = Boolean(group.alwaysVisible);
			this.buildingGroups[name] = group;
		}
		this.activeGroup = this.buildingGroups.all;

		for (var i = 0; i < this.buildingsData.length; i++) {
			var bld = new classes.KGSaveEdit.BuildingMeta(game, this.buildingsData[i]);
			bld.metaObj = this;
			this.buildings.push(bld);
			this.buildingsNames.push(bld.name);
			this.buildingsByName[bld.name] = bld;

			if (bld.breakIronWill) {
				game.breaksIronWillList.push(bld);
			} else {
				this.buildingGroups.iw.buildings.push(bld.name);
			}

			this.buildingGroups.all.buildings.push(bld.name);
		}
		this.meta.push(this.buildings);
	},

	renderTabBlock: function () {
		this.buildingGroupsBlock = dojo.create('div', {
			id: 'buildingGroupsBlock',
			'class': 'bottom-margin'
		}, this.tabBlockNode);

		this.buildingsBlock = dojo.create('table', {id: 'buildingsBlock'}, this.tabBlockNode);
	},

	render: function () {
		var onclick = function () {
			dojo.query('.activeGroup', 'buildingGroupsBlock').removeClass('activeGroup');
			dojo.addClass(this.domNode, 'activeGroup');
			this.game.bld.activeGroup = this;
			this.game.update();
		};

		for (var name in this.buildingGroups) {
			var group = this.buildingGroups[name];

			//wrap tab link for css
			group.nodeWrapper = dojo.create('span', {'class': 'separated'}, this.buildingGroupsBlock);

			group.domNode = dojo.create('a', {
				'class': 'buildGroup',
				href: '#',
				innerHTML: group.title || group.name,
			}, group.nodeWrapper);

			on(group.domNode, 'click', dojo.hitch(group, onclick));

			if (this.activeGroup === group) {
				dojo.addClass(group.domNode, 'activeGroup');
			}
		}

		for (var i = 0, len = this.buildings.length; i < len; i++) {
			var bld = this.buildings[i];
			bld.render();
			dojo.place(bld.domNode, this.buildingsBlock);
		}
	},

	update: function () {
		this.calculateEffectsBase();
		this.game.callMethods(this.buildings, 'updateUnlocked');

		var group;
		for (var name in this.buildingGroups) {
			group = this.buildingGroups[name];
			group.hasVisibleBuildings = group.alwaysVisible;

			var i, bld;
			if (group.name === 'iw') {
				group.hasVisibleBuildings = this.game.ironWill && this.get('library').owned();
			} else if (group.filterFn) {
				group.buildings = [];
				for (i = this.buildings.length - 1; i >= 0; i--) {
					bld = this.buildings[i];
					if (group.filterFn(bld)) {
						group.buildings.push(bld.name);
						group.hasVisibleBuildings = true;
					}
				}
			} else if (!group.alwaysVisible) {
				for (i = group.buildings.length - 1; i >= 0; i--) {
					bld = this.get(group.buildings[i]);
					if (bld.unlocked) {
						group.hasVisibleBuildings = true;
						break;
					}
				}
			}

			dojo.toggleClass(group.nodeWrapper, 'hidden', !group.hasVisibleBuildings);
		}

		if (!this.activeGroup || !this.activeGroup.hasVisibleBuildings) {
			group = this.buildingGroups.all;
			dojo.query('.activeGroup', 'buildingGroupsBlock').removeClass('activeGroup');
			dojo.addClass(group.domNode, 'activeGroup');
			this.game.bld.activeGroup = group;
		}

		this.game.callMethods(this.buildings, 'update');
	},

	calculateEffectsBase: function () {
		var effects = {
			"manpowerMax":    100,
			"catnipMax":      5000,
			"woodMax":        200,
			"mineralsMax":    250,
			"faithMax":       100,
			"cultureMax":     100,
			"uraniumMax":     250,
			"unobtainiumMax": 150
		};

		if (this.game.ironWill){
			if (this.game.workshop.get("huntingArmor").owned()){
				effects["manpowerMax"] = 1000;
			} else if (this.game.workshop.get("bolas").owned()){
				effects["manpowerMax"] = 400;
			} else if (this.game.workshop.get("compositeBow").owned()){
				effects["manpowerMax"] = 200;
			}
		}

		this.effectsBase = this.game.resPool.addBarnWarehouseRatio(effects);
	},

	getEffect: function(name, isHyperbolic) {
		var totalEffect = num(this.getEffectBase(name) + this.getEffectCached(name));

		// Previously, catnip demand (or other buildings that both effected the same resource)
		// could have theoretically had more than 100% reduction because they diminished separately,
		// this takes the total effect and diminishes it as a whole.
		if (isHyperbolic && totalEffect < 0) {
			totalEffect = this.getHyperbolicEffect(totalEffect, 1.0);
		}

		//probably not the best place to handle this mechanics
		//----------- move to separate part? -----------
		if ((name === "productionRatio" || name === "magnetoRatio") &&
		this.game.resPool.energyCons > this.game.resPool.energyProd) {
			var delta = this.game.resPool.getEnergyDelta();
			totalEffect *= delta;
		}

		return num(totalEffect);
	},

	getEffectBase: function (name) {
		return num(this.effectsBase[name]);
	},

	get: function (name) {
		return this.getBuilding(name);
	},

	getBuilding: function (name) {
		return this.buildingsByName[name];
	},

	getAutoProductionRatio: function (disableReactors, paragonRatio) {
		var autoProdRatio = 1;
		paragonRatio = paragonRatio || 0.25;

		// faith
		if (this.game.religion.getRU("solarRevolution").owned()) {
			autoProdRatio *= 1 + (this.game.religion.getProductionBonus() / 100);
		}
		// SW
		var steamworks = this.get("steamworks");
		var steamworksOn = steamworks.getOn();
		var swRatio = steamworksOn > 0 ? (1 + steamworks.effects["magnetoBoostRatio"] * steamworksOn) : 1;
		autoProdRatio *= 1 + this.getEffect("magnetoRatio") * swRatio;

		// paragon (25%)
		autoProdRatio *= (1 + this.game.prestige.getParagonProductionRatio() * paragonRatio);

		// reactors
		if (!disableReactors) {
			autoProdRatio *= (1 + this.getEffect("productionRatio"));
		}

		return autoProdRatio;
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

	getPriceRatio: function(bldName) {
		var bld = this.getBuilding(bldName);
		var ratio = bld.get('priceRatio');

		var ratioBase = ratio - 1;

		var ratioDiff = this.game.workshop.getEffect(bldName + "PriceRatio") || 0;
		ratioDiff += this.game.prestige.getEffect("priceRatio") || 0;

		ratioDiff = this.getHyperbolicEffect(ratioDiff, ratioBase);

		return ratio + ratioDiff;
	},

	getPrices: function(bldName, base) {
		return this.getBuilding(bldName).getPrices(base);
	},

	save: function (saveData) {
		saveData.buildings = this.game.mapMethods(this.buildings, 'save');

		if (!saveData.bldData) {
			saveData.bldData = {};
		}
		saveData.bldData.groupBuildings = this.groupBuildings;
		saveData.bldData.twoRows = this.twoRows;
	},

	load: function (saveData) {
		this.loadMetaData(saveData.buildings, 'get');

		this.groupBuildings = saveData.bldData.groupBuildings;
		this.twoRows = saveData.bldData.twoRows;
	}
});


dojo.declare('classes.KGSaveEdit.BuildingMeta', classes.KGSaveEdit.MetaItem, {
	domNode: null,

	val: 0,
	on: 0,
	togglable: false,
	tunable: false,

	constructor: function () { },

	render: function () {
		var self = this;

		this.domNode = dojo.create('tr', {
			'class': 'building',
			innerHTML: '<td></td><td class="rightAlign"></td><td></td><td></td>'
		});

		var td = this.domNode.children[0];
		this.nameNode = dojo.create('span', {
			'class': 'nameNode',
			innerHTML: this.get('label') || this.get('name')
		}, td);

		if (this.stages) {
			this.stageUpNode = dojo.create('input', {
				type: 'button',
				value: '^',
				'class': 'stageBtn hidden',
				title: 'Upgrade building'
			}, td);
			on(this.stageUpNode, 'click', function () {
				if (self.stage < self.stages.length - 1 && self.stages[self.stage + 1].stageUnlocked) {
					self.stage++;
					self.game.upgradeItems({buildings: [self.name]});
				}
				self.game.update();
			});

			this.stageDownNode = dojo.create('input', {
				type: 'button',
				value: 'V',
				'class': 'stageBtn hidden',
				title: 'Downgrade building'
			}, td);
			on(this.stageDownNode, 'click', function () {
				if (self.stage > 0) {
					self.stage--;
					self.game.upgradeItems({buildings: [self.name]});
				}
				self.game.update();
			});
		}

		this.onNodeSpan = dojo.create('span', {innerHTML: ' / '}, this.domNode.children[1]);

		this.game._createInput({
			'class': 'integerInput ownedInput',
			title: 'Number of active buildings'
		}, this.onNodeSpan, this, 'on', 'first');

		this.game._createInput({
			'class': 'integerInput ownedInput',
			title: 'Number of buildings'
		}, this.domNode.children[1], this, 'val');

		this.toggleNode = dojo.create('input', {
			type: 'button',
			value: 'On',
			title: 'Toggle building'
		}, this.domNode.children[2]);
		on(this.toggleNode, 'click', function () {
			self.enabled = !self.enabled;
			self.game.update();
		});

		this.game._createCheckbox('Unlocked', this.domNode.children[3], this, 'unlocked');

		if ('isAutomationEnabled' in this) {
			this.game._createCheckbox('Automation on', this.domNode.children[3], this, 'isAutomationEnabled');
		}

		if ('jammed' in this) {
			this.game._createCheckbox('Jammed', this.domNode.children[3], this, 'jammed');
		}

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	//special consideration for staged buildings
	get: function (key) {
		if (this.stages && key in this.stages[this.stage]) {
			return this.stages[this.stage][key];
		}
		return this[key];
	},

	//special consideration for staged buildings
	set: function (key, value) {
		if (this[key + 'Node'] && this[key + 'Node'].dataProp === key) {
			var args = [].slice.call(arguments, 2);
			args = [this[key + 'Node'], value].concat(args);
			value = this.game.setEle.apply(this.game, args);
		}

		if (this.stages && key in this.stages[this.stage]) {
			this.stages[this.stage][key] = value;
		} else {
			this[key] = value;
		}
		return value;
	},

	owned: function () {
		return this.val > 0;
	},

	getName: function () {
		return (this.get('label') || this.get('name')) + ' (' + this.val + ')';
	},

	getDescription: function () {
		var desc = this.get('description');
		if (this.jammed) {
			return desc + "<br>" + "***Maintenance***";
		}
		return desc;
	},

	getPrices: function (simple) {
		var ratio = this.game.bld.getPriceRatio(this.name);
		var prices = dojo.clone(this.get('prices')) || {};

		if (!simple) {
			for (var i = 0, len = prices.length; i < len; i++) {
				prices[i].val *= Math.pow(ratio, this.val);
			}
		}
		return prices;
	},

	getEffect: function (name) {
		var effects = this.effects || {};
		var effect = num(effects[name]);

		if (this.togglable && name.slice(-3) !== 'Max' &&
		!(this.name === 'biolab' && name.slice(-5) === 'Ratio')) {
			effect *= this.getOn();
		} else {
			effect *= this.val;
		}

		return effect;
	},

	getOn: function () {
		if (!this.togglable) {
			return 0;
		}
		if (!this.tunable) {
			return this.enabled ? this.val : 0;
		}
		return Math.min(this.on, this.val) || 0;
	},

	update: function () {
		dojo.toggleClass(this.nameNode, 'btnEnabled',
			Boolean(this.togglable && (this.enabled || this.getOn() > 0)));

		dojo.toggleClass(this.onNodeSpan, 'hidden', !this.togglable || !this.tunable);
		dojo.toggleClass(this.toggleNode, 'hidden', !this.togglable || this.tunable);
		this.toggleNode.value = this.enabled ? 'Off' : 'On';

		if (this.stages) {
			var len = this.stages.length - 1;
			//no safety like overkill
			this.stage = Math.min(Math.max(this.stage, 0), len) || 0;

			for (var i = len; i >= 1; i--) {
				var stage = this.stages[i];
				stage.stageUnlocked = this.game.checkRequirements(stage, false, true);
			}

			dojo.toggleClass(this.stageDownNode, 'hidden', !this.stage);
			dojo.toggleClass(this.stageUpNode, 'hidden',
				this.stage === len || !this.stages[this.stage + 1].stageUnlocked);
		}

		this.nameNode.textContent = this.get('label') || this.get('name');
		this.updateEnabled();

		var activeGroup = this.game.bld.activeGroup;
		dojo.toggleClass(this.domNode, 'hidden',
			activeGroup.buildings.indexOf(this.name) < 0);

		if (this.action) {
			this.action(this, this.game);
		}
	},

	updateUnlocked: function () {
		var unlocked = this.ignorePriceCheck;

		if (!this.ignorePriceCheck) {
			var prices = this.getPrices(true);
			var unlockRatio = this.get('unlockRatio') || 0.3;
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

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "unlocked", "enabled", "val", "on", "stage", "jammed", "isAutomationEnabled"]);
		saveData.on = this.togglable || this.exportOn ? this.getOn() : undefined;

		return saveData;
	},

	load: function (saveBld) {
		this.set('val', num(saveBld.val));
		this.set('unlocked', saveBld.unlocked);
		this.set('on', num(saveBld.on));
		this.enabled = saveBld.enabled;

		if (this.isAutomationEnabledNode) {
			this.set("isAutomationEnabled", saveBld.isAutomationEnabled);
		}
		if (this.jammedNode) {
			this.set('jammed', saveBld.jammed);
		}
		if (this.stages) {
			this.set('stage', num(saveBld.stage));
		}
	}
});

dojo.declare('classes.KGSaveEdit.SpaceManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	programData: [{
			name: "orbitalLaunch",
			title: "Orbital Launch",
			description: "Launch a rocket to a space.",
			prices: [
				{name: "starchart", val: 250},
				{name: "manpower",  val: 5000},
				{name: "science",   val: 100000},
				{name: "oil",       val: 15000}
			],
			// unlocks: {planet: "cath", programs: ["moonMission"]}
			unlocked: true
		}, {
			name: "moonMission",
			title: "Moon Mission",
			description: "Launch a rocket to Redmoon, a Cath planet satellite",
			prices: [
				{name: "starchart", val: 500},
				{name: "titanium",  val: 5000},
				{name: "science",   val: 125000},
				{name: "oil",       val: 45000}
			],
			// unlocks: {planet: "moon", programs: ["duneMission", "piscineMission"]}
			requires: {program: ["orbitalLaunch"]},
			upgradable: false
		}, {
			name: "duneMission",
			title: "Dune Mission",
			description: "Dune is a large and lifeless planet covered by sand and volcanic rock.",
			prices: [
				{name: "starchart", val: 1000},
				{name: "titanium",  val: 7000},
				{name: "science",   val: 175000},
				{name: "kerosene",  val: 75}
			],
			// unlocks: {planet: "dune", programs: ["heliosMission"]},
			requires: {program: ["moonMission"]},
			upgradable: false
		}, {
			name: "piscineMission",
			title: "Piscine Mission",
			description: "Piscine is a gigantic aquatic planet composed of an acid body and a methane atmosphere",
			prices: [
				{name: "starchart", val: 1500},
				{name: "titanium",  val: 9000},
				{name: "science",   val: 200000},
				{name: "kerosene",  val: 250}
			],
			// unlocks: {planet: "piscine", programs: ["terminusMission"]},
			requires: {program: ["moonMission"]},
			upgradable: false
		}, {
			name: "heliosMission",
			title: "Helios Mission",
			description: "Helios is a G2V spectral type star in the center of the Cath solar system.",
			prices: [
				{name: "starchart", val: 3000},
				{name: "titanium",  val: 15000},
				{name: "science",   val: 250000},
				{name: "kerosene",  val: 1250}
			],
			// unlocks: {planet: "helios", programs: ["yarnMission"]},
			requires: {program: ["duneMission"]},
			upgradable: false
		}, {
			name: "terminusMission",
			title: "T-minus Mission",
			description: "Terminus is a supermassive ice giant at the far end of a Helios solar system.",
			prices: [
				{name: "starchart", val: 2500},
				{name: "titanium",  val: 12000},
				{name: "science",   val: 225000},
				{name: "kerosene",  val: 750}
			],
			// unlocks: {planet: "terminus", programs: ["kairoMission"]},
			requires: {program: ["piscineMission"]},
			upgradable: false
		}, {
			name: "kairoMission",
			title: "Kairo Mission",
			description: "Kairo is a dwarf planet in the far end of the Cath solar system.",
			prices: [
				{name: "starchart", val: 5000},
				{name: "titanium",  val: 20000},
				{name: "science",   val: 300000},
				{name: "kerosene",  val: 7500}
			],
			// unlocks: {planet: "kairo", programs: ["rorschachMission"]},
			requires: {program: ["terminusMission"]},
			upgradable: false
		}, {
			name: "rorschachMission",
			title: "???",
			description: "???",
			prices: [
				{name: "starchart", val: 15000},
				{name: "titanium",  val: 80000},
				{name: "science",   val: 500000},
				{name: "kerosene",  val: 25000}
			],
			requires: {program: ["kairoMission"]},
			upgradable: false
		}, {
			name: "yarnMission",
			title: "Yarn Mission",
			description: "Yarn is a class M planet with high moderate climate, seas and oxygen atmosphere.",
			prices: [
				{name: "starchart", val: 7500},
				{name: "titanium",  val: 35000},
				{name: "science",   val: 350000},
				{name: "kerosene",  val: 12000}
			],
			// unlocks: {planet: "yarn"},
			requires: {program: ["heliosMission"]},
			upgradable: false
	}],

	planetData: [{
			name: "cath",
			title: "Cath",
			buildings: [{
				name: "spaceElevator",
				title: "Space Elevator",
				description: "Every S. Elevator reduces oil requirements for space missions by 5%",
				prices: [
					{name: "titanium",    val: 6000},
					{name: "science",     val: 75000},
					{name: "unobtainium", val: 50}
				],
				priceRatio: 1.15,
				requires: {tech: ["orbitalEngineering", "nanotechnology"]},
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function (game, self) {
					self.effects = {
						"oilReductionRatio": 0.05,
						"spaceRatio":        0.1,
						"prodTransferBonus": 0.1
					};
				}
			}, {
				name: "sattelite",
				title: "Satellite",
				description: "Deploy a satellite. Satellites improve your observatory effectiveness by 5% and produce starcharts",
				prices: [
					{name: "starchart", val: 325},
					{name: "titanium",  val: 2500},
					{name: "science",   val: 100000},
					{name: "oil",       val: 15000}
				],
				priceRatio: 1.08,
				requires: {tech: ["sattelites"]},
				upgradable: true,
				togglable: true,
				tunable: true,
				effects: {
					"observatoryRatio":     0.05,
					"starchartPerTickBase": 0.001,
					"energyConsumption":    1
				},
				upgrades: {buildings: ["observatory"]},
				calculateEffects: function (game, self) {
					self.effects = {
						"observatoryRatio": 0.05,
						"starchartPerTickBase": 0.001 * game.space.getAutoProductionRatio(),
						"energyConsumption": 1,
						"energyProduction": 0
					};

					self.togglable = true;
					self.tunable = true;

					if (game.workshop.get("solarSatellites").owned()) {
						self.effects["energyConsumption"] = 0;
						self.effects["energyProduction"] = 1;
						self.togglable = false;
						self.tunable = false;
					}
				},
				exportOn: true
			}, {
				name: "spaceStation",
				title: "Space Station",
				description: "Deploy a space station. Each station generates science and provide a space for 2 astronauts",
				prices: [
					{name: "starchart", val: 425},
					{name: "alloy",     val: 750},
					{name: "science",   val: 150000},
					{name: "oil",       val: 35000}
				],
				priceRatio: 1.12,
				requires: {tech: ["orbitalEngineering"]},
				upgradable: true,
				togglable: true,
				tunable: true,
				breakIronWill: true,
				effects: {},
				calculateEffects: function (game, self) {
					self.effects = {
						"scienceRatio":      0.5,
						"maxKittens":        2,
						"energyConsumption": 10
					};
				}
			}],
			requires: {program: ["orbitalLaunch"]}
		}, {
			name: "moon",
			title: "Moon",
			buildings: [{
				name: "moonOutpost",
				title: "Lunar Outpost",
				description: "Deploy a nuclear powered mining outpost on Redmoon",
				prices: [
					{name: "starchart", val: 650},
					{name: "uranium",   val: 500},
					{name: "alloy",     val: 750},
					{name: "concrate",  val: 150},
					{name: "science",   val: 100000},
					{name: "oil",       val: 55000}
				],
				priceRatio: 1.12,
				unlocked: true,
				upgradable: true,
				togglable: true,
				tunable: true,
				effects: {},
				calculateEffects: function(game, self) {
					self.effects = {
						"uraniumPerTick":    -0.35,
						"unobtainiumPerTick": 0.007 *
							game.space.getAutoProductionRatio() *
							(1 + game.workshop.getEffect("lunarOutpostRatio")),
						"energyConsumption":  5
					};
				},
			}, {
				name: "moonBase",
				title: "Moon base",
				description: "Establish a base on a surface of Redmoon",
				prices: [
					{name: "starchart",   val: 700},
					{name: "titanium",    val: 9500},
					{name: "concrate",    val: 250},
					{name: "science",     val: 100000},
					{name: "unobtainium", val: 50},
					{name: "oil",         val: 70000}
				],
				priceRatio: 1.12,
				unlocked: true,
				upgradable: true,
				togglable: true,
				tunable: true,
				effects: {},
				calculateEffects: function (game, self) {
					self.effects = {
						"catnipMax":         45000,
						"woodMax":           25000,
						"mineralsMax":       30000,
						"ironMax":           9000,
						"coalMax":           3500,
						"titaniumMax":       1250,
						"oilMax":            3500,
						"unobtainiumMax":    150,
						"energyConsumption": game.workshop.get("amBases").owned() ? 5: 10
					};
				}
			}],
			requires: {program: ["moonMission"]}
		}, {
			name: "dune",
			title: "Dune",
			buildings: [{
				name: "planetCracker",
				title: "Planet Cracker",
				description: "USS Mining Vessel Hissmeowra that can crack an entire planet",
				prices: [
					{name: "starchart", val: 2500},
					{name: "alloy",     val: 1750},
					{name: "science",   val: 125000},
					{name: "kerosene",  val: 50}
				],
				priceRatio: 1.18,
				unlocked: true,
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function (game, self) {
					self.effects = {
						"uraniumPerTick": 0.3 *
							(1 + game.workshop.getEffect("crackerRatio")) *
							(1 + game.space.getEffect("spaceRatio")),
						"uraniumMax":     1750
					};
				},
				exportOn: true
			}, {
				name: "hydrofracturer",
				title: "Hydraulic Fracturer",
				description: "Produces a high-pressure stream of oil. Every Space Elevator will boost this production by 0.1% of the global production multiplier.",
				prices: [
					{name: "starchart", val: 750},
					{name: "alloy",     val: 1025},
					{name: "science",   val: 150000},
					{name: "kerosene",  val: 100}
				],
				priceRatio: 1.18,
				unlocked: true,
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function(game, self) {
					self.effects = {
						"oilPerTick": 0.5
							* game.space.getAutoProductionRatio(true /* use transfer bonus*/)
					};
				},
				exportOn: true
			}],
			requires: {program: ["duneMission"]}
		}, {
			name: "piscine",
			title: "Piscine",
			buildings: [{
				name: "researchVessel",
				title: "Research Vessel",
				description: "Mobile research space vessel.",
				prices: [
					{name: "starchart", val: 500},
					{name: "alloy",     val: 2500},
					{name: "titanium",  val: 12500},
					{name: "kerosene",  val: 250}
				],
				priceRatio: 1.15,
				unlocked: true,
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function(game, self) {
					self.effects = {
						"starchartPerTickBase": 0.01 * game.space.getAutoProductionRatio(),
						"scienceMax":           10000 * (1 + game.workshop.getEffect("spaceScienceRatio"))
					};
				},
				exportOn: true
			}, {
				name: "orbitalArray",
				title: "Orbital Array",
				description: "Provide a 2% production bonus to all space structures",
				prices: [
					{name: "eludium",  val: 100},
					{name: "science",  val: 250000},
					{name: "kerosene", val: 500}
				],
				priceRatio: 1.15,
				unlocked: true,
				upgradable: true,
				togglable: true,
				tunable: true,
				effects: {},
				calculateEffects: function(game, self) {
					self.effects = {
						"spaceRatio":        0.02,
						"energyConsumption": 20
					};
				}
			}],
			requires: {program: ["piscineMission"]}
		}, {
			name: "helios",
			title: "Helios",
			buildings: [{
				name: "sunlifter",
				title: "Sunlifter",
				description: "Generates antimatter once per year.",
				prices: [
					{name: "science",  val: 500000},
					{name: "eludium",  val: 250},
					{name: "kerosene", val: 2500}
				],
				priceRatio: 1.15,
				unlocked: true,
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function(game, self) {
					self.effects = {
						"antimatterProduction": 1,
						"energyProduction":     30
					};
				},
				exportOn: true
			}],
			requires: {program: ["heliosMission"]}
		}, {
			name: "terminus",
			title: "T-Minus",
			buildings: [{
				name: "cryostation",
				title: "Cryostation",
				description: "A vast storage facility complex",
				prices: [
					{name: "eludium",  val: 25},
					{name: "concrate", val: 1500},
					{name: "science",  val: 200000},
					{name: "kerosene", val: 500}
				],
				priceRatio: 1.12,
				unlocked: true,
				upgradable: true,
				effects: {},
				calculateEffects: function(game, self) {
					self.effects = {
						"woodMax":        200000,
						"mineralsMax":    200000,
						"ironMax":        50000,
						"coalMax":        25000,
						"uraniumMax":     5000,
						"titaniumMax":    7500,
						"oilMax":         25000,
						"unobtainiumMax": 750
					};
				},
			}],
			requires: {program: ["terminusMission"]}
		}, {
			name: "kairo",
			title: "Kairo",
			buildings: [{
				name: "spaceBeacon",
				title: "Space Beacon",
				description: "An AM-powered space station used for research and interstellar navigation.",
				prices: [
					{name: "starchart",  val: 25000},
					{name: "antimatter", val: 50},
					{name: "alloy",      val: 2500},
					{name: "kerosene",   val: 7500}
				],
				priceRatio: 1.15,
				unlocked: true,
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function(game, self){
					self.effects = {
						"starchartPerTickBase": 0.025 * game.space.getAutoProductionRatio(),
						"scienceMax":           25000 * (1 + game.workshop.getEffect("spaceScienceRatio")),
						"relicPerDay":          game.workshop.getEffect("beaconRelicsPerTick")
					};
				}
			}],
			requires: {program: ["kairoMission"]}
		}, {
			name: "yarn",
			title: "Yarn",
			buildings: [{
				name: "terraformingStation",
				title: "Terraforming Station",
				description: "Explode a charge of antimatter to melt yarn ice and throw an oxygen into the atmosphere",
				prices: [
					{name: "antimatter", val: 25},
					{name: "uranium",    val: 5000},
					{name: "kerosene",   val: 5000}
				],
				priceRatio: 1.25,
				requires: {tech: ["terraformation"]},
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function (game, self) {
					self.effects = {
						"maxKittens": 1
						//"catnipPerTickBase": -100
					};
				}
			}, {
				name: "hydroponics",
				title: "Hydroponics",
				description: "State of the art automated hydroponic system. Increase catnip limit by 10%. Increase catnip production by 2.5%",
				prices: [
					{name: "kerosene", val: 500}
				],
				priceRatio: 1.15,
				requires: {tech: ["hydroponics"]},
				upgradable: true,
				togglable: false,
				tunable: false,
				effects: {},
				calculateEffects: function (game, self) {
					self.effects = {
						"catnipMaxRatio": 0.1,
						"catnipRatio":    0.025
					};
				},
				val: 0
			}],
			requires: {program: ["yarnMission"]}
	}],

	tabName: 'Space',
	tabBlockClass: 'shortInt',
	getVisible: function () {
		return this.game.science.get('rocketry').owned();
	},

	programs: null,
	planets: null,
	planetsByName: null,
	allPrograms: null,
	allProgramsByName: null,

	hideResearched: false,

	constructor: function (game) {
		this.programs = [];
		this.planets = [];
		this.planetsByName = {};
		this.allPrograms = [];
		this.allProgramsByName = [];

		var program;
		for (var i = 0, len = this.programData.length; i < len; i++) {
			program = new classes.KGSaveEdit.ProgramMeta(game, this.programData[i]);
			program.metaObj = this;
			if (program.breakIronWill) {
				game.breaksIronWillList.push(program);
			}

			this.programs.push(program);
			this.allPrograms.push(program);
			this.allProgramsByName[program.name] = program;
		}

		for (i = 0, len = this.planetData.length; i < len; i++) {
			var planet = dojo.clone(this.planetData[i]);
			planet.game = game;
			planet.metaObj = this;

			this.planets.push(planet);
			this.planetsByName[planet.name] = planet;

			var bld = planet.buildings || [];
			planet.buildings = [];
			for (var j = 0, bldlen = bld.length; j < bldlen; j++) {
				program = new classes.KGSaveEdit.ProgramMeta(game, bld[j]);
				program.metaObj = this;
				program.planet = planet;

				planet.buildings.push(program);
				this.allPrograms.push(program);
				this.allProgramsByName[program.name] = program;
			}
		}
	},

	getProgram: function (name) {
		return this.allProgramsByName[name];
	},

	getPlanet: function (name) {
		return this.planetsByName[name];
	},

	getEffect: function (name) {
		var totalEffect = this.getEffectCached(name);

		if (name === "spaceRatio" &&
		this.game.resPool.energyCons > this.game.resPool.energyProd) {
			var delta = this.game.resPool.getEnergyDelta();
			totalEffect *= delta;
		}

		return num(totalEffect);
	},

	getEffectCached: function (name) {
		var cached = this.effectsCached[name];
		if (!isNaN(cached)) {
			return cached;
		}

		var effect = 0;
		for (var i = this.allPrograms.length - 1; i >= 0; i--) {
			var effectMeta = this.allPrograms[i].getEffect(name);
			effect += effectMeta;
		}

		this.effectsCached[name] = effect;
		return effect;
	},

	renderTabBlock: function () {
		var div = dojo.create('div', {'class': 'bottom-margin'}, this.tabBlockNode);
		this.game._createCheckbox('Hide complete missions', div, this, 'hideResearched');

		this.programsBlock = dojo.create('table', {id: 'programsBlock'}, this.tabBlockNode);
	},

	render: function () {
		var program;
		for (var i = 0, len = this.programs.length; i < len; i++) {
			program = this.programs[i];
			program.render();
			dojo.place(program.domNode, this.programsBlock);
		}

		for (i = 0, len = this.planets.length; i < len; i++) {
			var planet = this.planets[i];
			if (!planet.buildings.length) {
				continue;
			}
			dojo.create('tr', {'colspan': 3, innerHTML: '&nbsp;'}, this.programsBlock);
			dojo.create('tr', {
				'colspan': 3,
				innerHTML: planet.title || planet.name
			}, this.programsBlock);

			for (var j = 0, bldlen = planet.buildings.length; j < bldlen; j++) {
				program = planet.buildings[j];
				program.render();
				dojo.place(program.domNode, this.programsBlock);
			}
		}
	},

	getAutoProductionRatio: function(useTransferBonus) {
		var ratio = 1 + this.getEffect("spaceRatio");
		if (useTransferBonus) {
			ratio *= 1 + ((this.game.bld.getAutoProductionRatio(false, 0.05) - 1) * (this.getEffect("prodTransferBonus") / 100));
		}

		if (this.game.workshop.get("spaceManufacturing").owned()) {
			var factory = this.game.bld.get("factory");
			ratio *= 1 + factory.on * factory.effects["craftRatio"] * 0.75;
		}
		return ratio;
	},

	update: function () {
		this.game.callMethods(this.allPrograms, 'update');
	},

	save: function (saveData) {
		var planets = this.game.filterMetadata(this.planets, ["name", "buildings"]);

		for (var i = 0; i < planets.length; i++) {
			var planet = planets[i];
			if (planet.buildings) {
				planet.buildings = this.game.mapMethods(planet.buildings, 'save');
			}
		}

		saveData.space = {
			programs: this.game.mapMethods(this.programs, 'save'),
			planets: planets,
			hideResearched: this.hideResearched
		};
	},

	load: function (saveData) {
		if (!saveData.space) {
			return;
		}

		this.loadMetaData(saveData.space.programs, 'getProgram');

		this.loadMetaData(saveData.space.planets, 'getPlanet', function (planet, savePlanet) {
			this.loadMetaData(savePlanet.buildings, 'getProgram');
		});

		this.set('hideResearched', saveData.space.hideResearched);
	}
});


dojo.declare('classes.KGSaveEdit.ProgramMeta', classes.KGSaveEdit.MetaItem, {
	val: 0,
	on: 0,
	unlocked: false,
	researched: false,
	upgradable: false,

	constructor: function () { },

	owned: function () {
		return this.researched || this.val > 0;
	},

	getName: function () {
		var name = this.title || this.name;
		if (this.upgradable) {
			return name +' (' + this.val + ')';
		} else if (this.researched) {
			return name + ' (Complete)';
		}
		return name;
	},

	getPrice: function (basic) {
		var prices = dojo.clone(this.prices) || [];
		if (basic) {
			return this.prices;
		}

		var ratio = this.priceRatio || 1.15;

		var len = prices.length, i;
		if (this.upgradable) {
			for (i = 0; i < len; i++) {
				if (prices[i].name === "oil") {
					prices[i].val *= Math.pow(1.05, this.val);
				} else {
					prices[i].val *= Math.pow(ratio, this.val);
				}
			}
		}

		for (i = 0; i < len; i++) {
			if (prices[i].name === "oil") {
				var reductionRatio =
					this.game.bld.getHyperbolicEffect(this.game.space.getEffect("oilReductionRatio"), 0.75);
				prices[i].val *= 1 - reductionRatio;
				break;
			}
		}

		return prices;
	},

	getEffect: function (name) {
		var effects = this.effects || {};
		var effect = num(effects[name]);

		if (!this.upgradable) {
			return this.researched ? effect : 0;
		}
		if (this.togglable) {
			return effect * this.getOn();
		}
		return effect * this.val;
	},

	getOn: function () {
		if (!this.upgradable || !this.togglable) {
			return 0;
		}
		if (!this.tunable) {
			return this.enabled ? this.val : 0;
		}
		return Math.min(this.on, this.val) || 0;
	},

	render: function () {
		this.domNode = dojo.create('tr', {
			'class': 'program',
			innerHTML: '<td class="nameNode">' + (this.title || this.name) + '</td>' +
				'<td class="rightAlign"></td><td></td>'
		});
		this.nameNode = this.domNode.children[0];

		this.onNodeSpan = dojo.create('span', {innerHTML: ' / '}, this.domNode.children[1]);

		this.game._createInput({
			'class': 'integerInput ownedInput',
			title: 'Number of active programs'
		}, this.onNodeSpan, this, 'on', 'first');

		this.game._createInput({
			'class': 'integerInput ownedInput',
			title: 'Number of programs'
		}, this.domNode.children[1], this, 'val');

		if (!this.planet) {
			var input = this.game._createCheckbox('Unlocked', this.domNode.children[2], this, 'unlocked');
			this.unlockedLabel = input.label;
			input = this.game._createCheckbox('Launched', this.domNode.children[2], this, 'researched');
			this.researchedLabel = input.label;
		}

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	update: function () {
		if (!this.planet) {
			var unlocked = this.game.checkRequirements(this);
			if (!unlocked && this.unlockedNode.prevChecked) {
				unlocked = true;
			}
			this.unlocked = unlocked;
			this.unlockedNode.checked = unlocked;

			dojo.toggleClass(this.valNode, 'hidden', !this.upgradable);
			dojo.toggleClass(this.researchedLabel, 'hidden', this.upgradable);

			dojo.toggleClass(this.domNode, 'hidden',
				this.game.space.hideResearched && !this.upgradable && this.owned());
		}

		dojo.toggleClass(this.nameNode, 'btnEnabled',
			Boolean(this.togglable && (this.enabled || this.getOn() > 0)));
		dojo.toggleClass(this.onNodeSpan, 'hidden', !this.upgradable || !this.togglable || !this.tunable);

		this.updateEnabled();

		if (this.calculateEffects) {
			this.calculateEffects(this.game, this);
			this.game.calendar.cycleEffects(this.effects, this.name);
		}
	},

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "val", "on"]);
		saveData.on = this.togglable || this.exportOn ? this.getOn() : undefined;

		if (!this.planet) {
			if (!this.upgradable) {
				saveData.val = undefined;
			}

			saveData.unlocked = Boolean(this.unlocked);
			saveData.researched = Boolean(this.researched || this.val > 0);
		}

		return saveData;
	},

	load: function (saveData) {
		var val = num(saveData.val);
		this.set('val', val);
		this.set('on', num(saveData.on));
		if (!this.planet) {
			this.set('researched', Boolean(saveData.researched || val));
			this.set('unlocked', Boolean(saveData.unlocked));
		}
	}
});

});
