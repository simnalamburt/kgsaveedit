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
			unlockable: true,
			unlockRatio: 0.3,
			effects: {
				"catnipPerTickBase": 0.125
			},
			flavor: "'Nip as far as the eye can see."
		}, {
			name: "pasture",
			unlockRatio: 0.3,
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
				description: "Provides an additional source of energy depending on the seasons.",
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
					effects.energyProduction *= 1 + game.getEffect("solarFarmRatio");
					if (game.calendar.season === 3) {
						effects.energyProduction *= 0.75;
					}
					stageMeta.effects = effects;
				}
			}
		}, {
			name: "aqueduct",
			label: "Aqueduct",
			unlockRatio: 0.3,
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
			action: function (self, game) {
				var stageMeta = self.stages[self.stage];
				if (self.stage === 0) {
					//do nothing
				} else if (self.stage === 1) {
					var effects = {
						"energyProduction": 5
					};
					effects.energyProduction *= 1 + game.getEffect("hydroPlantRatio");
					stageMeta.effects = effects;
				}
			}
		}, {
			name: "hut",
			label: "Hut",
			description: "Build a hut (each has a space for 2 kittens)",
			prices: [
				{name: "wood", val: 5}
			],
			priceRatio: 2.5,
			unlockRatio: 0.3,
			unlockable: true,
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
			unlockRatio: 0.3,
			requires: {tech: ["construction"]},
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
			requires: {tech: ["architecture"]},
			effects: {
				"maxKittens":  1,
				"manpowerMax": 50
			},
			flavor: "The best shipping container available"
		}, {
			name: "library",
			label: "Library",
			description: "Build a library to store sacred catkind knowledge.\nEach upgrade level improves your science output by 10%",
			prices: [
				{name: "wood", val: 25}
			],
			priceRatio: 1.15,
			unlockable: true,
			unlockRatio: 0.3,
			// unlocks: {tabs: ["science"], jobs: ["scholar"]},
			effects: {
				"scienceRatio": 0,
				"scienceMax":   0,
				"cultureMax":   0
			},
			calculateEffects: function (self, game) {
				var effects = {
					"scienceRatio": 0.1,
					"scienceMax":   250,
					"cultureMax":   10
				};
				var libraryRatio = game.getEffect("libraryRatio");
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
			unlockRatio: 0.3,
			requires: {tech: ["math"]},
			effects: {
				"scienceRatio": 0.2,
				"learnRatio":   0.05,
				"cultureMax":   25,
				"scienceMax":   500
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
			requires: {tech: ["astronomy"]},
			effects: {
				"scienceRatio":          0,
				"starEventChance":       0,
				"starAutoSuccessChance": 0,
				"scienceMax":            0
			},
			upgrades: {buildings: ["library"]},
			action: function (self, game) {
				var effects = {
					"scienceRatio":          0.25,
					"starEventChance":       0.002,
					"starAutoSuccessChance": 0.01,
					"scienceMax":            1000
				};

				if (game.workshop.get("astrolabe").owned()) {
					effects["scienceMax"] = 1500;
				}

				var ratio = 1 + game.getEffect("observatoryRatio");
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
			requires: {tech: ["biology"]},
			effects: {
				"scienceRatio": 0.35,
				"refineRatio": 0.1,
				"catnipPerTickCon": 0,
				"oilPerTickProd": 0,
				"scienceMax": 1500,
				"energyConsumption": 0
			},
			calculateEffects: function (self, game) {
				self.togglable = false;
				var energyCons = 0;

				if (game.workshop.get("biofuel").owned()) {
					self.togglable = true;
					energyCons = 1;

					if (game.challenges.currentChallenge === "energy") {
						energyCons *= 2;
					}
				}

				self.effects["energyConsumption"] = energyCons;
			},
			action: function (self, game) {
				if (game.workshop.get("biofuel").owned()) {

					self.effects["catnipPerTickCon"] = -1;
					self.effects["oilPerTickProd"] = 0.02 * (1 + game.getEffect("biofuelRatio"));

					var amt = game.resPool.getAmtDependsOnStock(
						[{res: "catnip", amt: -self.effects["catnipPerTickCon"]}],
						self.on
					);
					self.effects["catnipPerTickCon"] *= amt;
					self.effects["oilPerTickProd"] *= amt;

					return amt;
				}
			},
			flavor: "New postdoc positions available."
		}, {
			name: "barn",
			label: "Barn",
			description: "Provides a space to store your resources.",
			prices: [
				{name: "wood", val: 50}
			],
			priceRatio: 1.75,
			unlockRatio: 0.3,
			requires: {tech: ["agriculture"]},
			effects: {
				"catnipMax":   0,
				"woodMax":     0,
				"mineralsMax": 0,
				"ironMax":     0,
				"coalMax":     0,
				"goldMax":     0,
				"titaniumMax": 0
			},
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
			requires: {tech: ["construction"]},
			effects: {
				"catnipMax":   0,
				"woodMax":     0,
				"mineralsMax": 0,
				"ironMax":     0,
				"coalMax":     0,
				"goldMax":     0,
				"titaniumMax": 0
			},
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
			requires: {tech: ["navigation"]},
			effects: {
				"catnipMax":   0,
				"woodMax":     0,
				"mineralsMax": 0,
				"ironMax":     0,
				"coalMax":     0,
				"goldMax":     0,
				"titaniumMax": 0
			},
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

				effects["coalMax"] *= 1 + game.getEffect("harborCoalRatio");

				var cargoShips = game.workshop.get("cargoShips");
				if (cargoShips.owned()) {
					var shipVal = game.resPool.get("ship").value;

					//100% to 225% with slow falldown on the 75%
					var limit = 2.25 + game.getEffect("shipLimit") * game.bld.get("reactor").val;
					var ratio = 1 + game.getHyperbolicEffect(cargoShips.effects["harborRatio"] * shipVal, limit);

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
			effects: {
				"mineralsRatio":   0,
				"coalPerTickBase": 0
			},
			calculateEffects: function (self, game) {
				var effects = {
					"mineralsRatio":   0.2,
					"coalPerTickBase": 0
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
			unlockRatio: 0.3,
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
			unlockRatio: 0.3,
			requires: {tech: ["metal"]},
			togglable: true,
			effects: {
				"woodPerTickCon":         -0.05,
				"mineralsPerTickCon":     -0.1,
				"ironPerTickAutoprod":     0.02,
				"coalPerTickAutoprod":     0,
				"goldPerTickAutoprod":     0,
				"titaniumPerTickAutoprod": 0
			},
			action: function (self, game) {
				var on = this.getOn();
				if (on < 1) {
					return;
				}

				self.effects = {
					"woodPerTickCon":          0,
					"mineralsPerTickCon":      0,
					"ironPerTickAutoprod":     0.02,
					"coalPerTickAutoprod":     0,
					"goldPerTickAutoprod":     0,
					"titaniumPerTickAutoprod": 0
				};


				var smelterRatio = 1 + game.getEffect("smelterRatio");
				self.effects["ironPerTickAutoprod"] = 0.02 * smelterRatio;

				if (game.workshop.get("goldOre").owned()) {
					self.effects["goldPerTickAutoprod"] = 0.001;
				}

				if (game.workshop.get("coalFurnace").owned()) {
					self.effects["coalPerTickAutoprod"] = 0.005 * smelterRatio;
				}

				if (game.workshop.get("nuclearSmelters").owned()) {
					self.effects["titaniumPerTickAutoprod"] = 0.0015;
				}

				self.effects["woodPerTickCon"] = -0.05;
				self.effects["mineralsPerTickCon"] = -0.1;

				var amt = game.resPool.getAmtDependsOnStock(
					[{res: "wood",    amt: -self.effects["woodPerTickCon"]},
					{res: "minerals", amt: -self.effects["mineralsPerTickCon"]}],
					on
				);
				self.effects["woodPerTickCon"] *= amt;
				self.effects["mineralsPerTickCon"] *= amt;
				self.effects["ironPerTickAutoprod"] *= amt;
				self.effects["goldPerTickAutoprod"] *= amt;
				self.effects["coalPerTickAutoprod"] *= amt;
				self.effects["titaniumPerTickAutoprod"] *= amt;

				return amt;
			},
			flavor: "Watch your whiskers!"
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
			requires: {tech: ["chemistry"]},
			togglable: true,
			isAutomationEnabled: true,
			effects: {
				"mineralsPerTickCon":      0,
				"oilPerTickCon":           0,
				"ironPerTickAutoprod":     0.15,
				"titaniumPerTickAutoprod": 0.0005,
				"energyConsumption":       0,
				"ironPerTickCon":          0,
				"coalPerTickCon":          0,
				"steelPerTickProd":        0
			},
			calculateEffects: function (self, game) {
				self.effects["energyConsumption"] = 1;
				if (game.challenges.currentChallenge === "energy") {
					self.effects["energyConsumption"] *= 2;
				}
			},
			action: function (self, game) {
				var on = self.getOn();
				if (on < 1) {
					return;
				}

				self.effects["oilPerTickCon"] = -0.024; //base + 0.01
				self.effects["mineralsPerTickCon"] = -1.5;
				var calcinerRatio = game.getEffect("calcinerRatio");
				self.effects["titaniumPerTickAutoprod"] = 0.0005 * (1 + calcinerRatio * 3);
				self.effects["ironPerTickAutoprod"] = 0.15 * (1 + calcinerRatio);

				var amt = game.resPool.getAmtDependsOnStock(
					[{res: "oil",     amt: -self.effects["oilPerTickCon"]},
					{res: "minerals", amt: -self.effects["mineralsPerTickCon"]}],
					on
				);
				self.effects["oilPerTickCon"] *= amt;
				self.effects["mineralsPerTickCon"] *= amt;
				self.effects["ironPerTickAutoprod"] *= amt;
				self.effects["titaniumPerTickAutoprod"] *= amt;

				var amtFinal = amt;

				var steelRatio = game.getEffect("calcinerSteelRatio");

				if (steelRatio && self.isAutomationEnabled) {
					// Second conversion of some of the iron that was just created, to steel
					var difference = self.effects["ironPerTickAutoprod"] * steelRatio * game.bld.getAutoProductionRatio(); //HACK
					// Cycle Effect
					var effectsTemp = {};
					effectsTemp["iron"] = difference;
					game.calendar.cycleEffectsFestival(effectsTemp);
					difference = effectsTemp["iron"];

					self.effects["ironPerTickCon"] = -difference;
					self.effects["coalPerTickCon"] = -difference;
					self.effects["steelPerTickProd"] = difference / 100;

					amt = game.resPool.getAmtDependsOnStock(
						[{res: "iron", amt: -self.effects["ironPerTickCon"]},
						{res: "coal",  amt: -self.effects["coalPerTickCon"]}],
						on
					);
					self.effects["ironPerTickCon"] *= amt;
					self.effects["coalPerTickCon"] *= amt;
					self.effects["steelPerTickProd"] *= (amt *
						(1 + game.getCraftRatio() * game.getEffect("calcinerSteelCraftRatio") +
							game.bld.get("reactor").getOn() * game.getEffect("calcinerSteelReactorBonus")));

					amtFinal = (amtFinal + amt) / 2;
				} else {
					self.effects["ironPerTickCon"] = 0;
					self.effects["coalPerTickCon"] = 0;
					self.effects["steelPerTickProd"] = 0;
				}

				return amtFinal;
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
			requires: {tech: ["machinery"]},
			togglable: true,
			togglableOnOff: true,
			effects: {
				"magnetoBoostRatio":     0.15,
				"coalRatioGlobal":      -0.8,
				"energyProduction":      1,
				"manuscriptPerTickProd": 0
			},
			jammed: false,
			isAutomationEnabled: true,
			calculateEffects: function (self, game) {
				self.effects["coalRatioGlobal"] = -0.8 + game.getEffect("coalRatioGlobalReduction");
			},
			action: function (self, game) {
				var amt = 0;

				if (game.workshop.get("printingPress").owned()) {
					amt = 0.0005; // 2 per year per SW

					if (game.workshop.get("offsetPress").owned()) {
						amt *= 4;
					}
					if (game.workshop.get("photolithography").owned()) {
						amt *= 4;
					}
				}
				self.effects["manuscriptPerTickProd"] = amt * self.getOn();

				//no factory automation stuff
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
			requires: {tech: ["electricity"]},
			togglable: true,
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
			unlockRatio: 0.3,
			requires: {tech: ["construction"]},
			effects: {
				"woodRatio": 0
			},
			calculateEffects: function (self, game) {
				self.effects["woodRatio"] = 0.1 + game.getEffect("lumberMillRatio") * 0.1;
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
			requires: {tech: ["chemistry"]},
			effects: {
				"oilPerTickBase":    0,
				"oilMax":            0,
				"energyConsumption": 0
			},
			calculateEffects: function (self, game) {
				var effects = {
					"oilPerTickBase":    0.02,
					"oilMax":            1500,
					"energyConsumption": 0
				};

				self.togglable = false;

				var ratio = 1 + game.getEffect("oilWellRatio");
				effects["oilPerTickBase"] *= ratio;

				if (game.workshop.get("pumpjack").owned()) {
					effects["energyConsumption"] = 1;
					if (game.challenges.currentChallenge === "energy") {
						effects["energyConsumption"] *= 2;
					}
					self.togglable = true;
				}

				self.effects = effects;
			},
			flavor: "Rise early, work hard, strike oil."
		}, {
			name: "workshop",
			label: "Workshop",
			description: "Provides a vast variety of upgrades.\nImproves craft effectiveness by 6%",
			prices: [
				{name: "wood",     val: 100},
				{name: "minerals", val: 400}
			],
			priceRatio: 1.15,
			unlockable: true,
			unlockRatio: 0.0025,
			// unlocks: {tabs: ["workshop"]},
			effects: {
				"craftRatio": 0.06 //6% for craft output
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
			requires: {tech: ["mechanization"]},
			togglable: true,
			effects: {
				"craftRatio":        0,
				"energyConsumption": 0
			},
			calculateEffects: function (self, game) {
				var effects = {
					"craftRatio": 0.05,
					"energyConsumption": 2
				};

				if (game.workshop.get("factoryLogistics").owned()) {
					effects["craftRatio"] = 0.06;
				}

				if (game.challenges.currentChallenge === "energy") {
					effects["energyConsumption"] *= 2;
				}
				self.effects = effects;
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
			requires: {tech: ["nuclearFission"]},
			togglable: true,
			effects: {
				"uraniumPerTick":   0,
				"thoriumPerTick":   0,
				"productionRatio":  0.05,
				"uraniumMax":       250,
				"energyProduction": 0
			},
			upgrades: {buildings: ["harbor"]},
			calculateEffects: function (self, game) {
				self.effects["uraniumPerTick"] = -0.001 * (1 - game.getEffect("uraniumRatio"));
			},
			action: function (self, game) {
				self.effects["thoriumPerTick"] = game.getEffect("reactorThoriumPerTick");
				self.effects["energyProduction"] = 10 * (1 + game.getEffect("reactorEnergyRatio"));

				if (game.workshop.get("thoriumReactors").owned()) {
					if (typeof(self.isAutomationEnabled) === "undefined") {
						self.isAutomationEnabled = true;
					}
					if (game.resPool.get("thorium").value === 0 || self.isAutomationEnabled === false) {
						self.effects["thoriumPerTick"] = 0;
						self.effects["energyProduction"] -= 2.5;
					}
				} else {
					self.isAutomationEnabled = undefined;
				}
			},
			isAutomationEnabled: undefined //yep
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
			requires: {tech: ["particlePhysics"]},
			togglable: true,
			effects: {
				"titaniumPerTickCon":     0,
				"uraniumPerTickAutoprod": 0,
				"scienceMax":             0,
				"catnipMax":              0,
				"woodMax":                0,
				"mineralsMax":            0,
				"ironMax":                0,
				"coalMax":                0,
				"goldMax":                0,
				"titaniumMax":            0,
				"energyConsumption":      0
			},
			calculateEffects: function (self, game) {
				self.effects["energyConsumption"] = 2;
				if (game.challenges.currentChallenge === "energy") {
					self.effects["energyConsumption"] *= 2;
				}

				self.effects["scienceMax"] = 0;
				if (game.workshop.get("lhc").owned()) {
					self.effects["scienceMax"] = 2500;
				}

				//------------- limit upgrades ------------
				var capRatio = 0;
				if (game.workshop.get("energyRifts").owned()) {
					capRatio = (1 + game.getEffect("acceleratorRatio"));
				}

				self.effects["catnipMax"]   = 30000 * capRatio;
				self.effects["woodMax"]     = 20000 * capRatio;
				self.effects["mineralsMax"] = 25000 * capRatio;
				self.effects["ironMax"]     =  7500 * capRatio;
				self.effects["coalMax"]     =  2500 * capRatio;
				self.effects["goldMax"]     =   250 * capRatio;
				self.effects["titaniumMax"] =   750 * capRatio;
			},
			action: function (self, game) {
				self.effects["titaniumPerTickCon"] =    -0.015;
				self.effects["uraniumPerTickAutoprod"] = 0.0025;

				var amt = game.resPool.getAmtDependsOnStock(
					[{res: "titanium", amt: -self.effects["titaniumPerTickCon"]}],
					self.getOn()
				);
				self.effects["titaniumPerTickCon"] *= amt;
				self.effects["uraniumPerTickAutoprod"] *= amt;

				return amt;
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
			unlockRatio: 0.3,
			requires: {tech: ["currency"]},
			effects: {
				"fursDemandRatio":  -0.04,
				"ivoryDemandRatio": -0.04,
				"spiceDemandRatio": -0.04,
				"tradeRatio":        0.015,
				"standingRatio":     0
			},
			calculateEffects: function (self, game) {
				var effects = {
					"fursDemandRatio":  -0.04,
					"ivoryDemandRatio": -0.04,
					"spiceDemandRatio": -0.04,
					"tradeRatio":        0.015,
					"standingRatio":     0
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
			requires: {tech: ["architecture"]},
			togglable: true,
			effects: {
				"manpowerPerTickCon": 0,
				"goldPerTickCon":     0,
				"fursPerTickProd":    0,
				"ivoryPerTickProd":   0,
				"goldMax":            0
			},
			calculateEffects: function (self, game) {
				self.effects = {
					"manpowerPerTickCon": 0,
					"goldPerTickCon":     0,
					"fursPerTickProd":    0,
					"ivoryPerTickProd":   0,
					"goldMax":            100 * (1 + game.getEffect("warehouseRatio"))
				};
			},
			action: function (self, game) {
				var on = self.getOn();
				if (on < 1) {
					return;
				}
				self.effects["manpowerPerTickCon"] = -0.75;
				self.effects["goldPerTickCon"] =     -0.005; //~5 smelters

				var manpower = game.resPool.get("manpower");
				var mpratio = (manpower.maxValue * 0.007) / 100;

				self.effects["fursPerTickProd"]  = mpratio * 1.25;	//2
				self.effects["ivoryPerTickProd"] = mpratio * 0.3;	//1.5

				var amt = game.resPool.getAmtDependsOnStock(
					[{res: "manpower", amt: -self.effects["manpowerPerTickCon"]},
					{res: "gold",      amt: -self.effects["goldPerTickCon"]}],
					on
				);
				self.effects["manpowerPerTickCon"] *= amt;
				self.effects["goldPerTickCon"] *= amt;
				self.effects["fursPerTickProd"] *= amt;
				self.effects["ivoryPerTickProd"] *= amt;

				return amt;
			}
		}, {
			name: "amphitheatre",
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

				btower.effects["cultureMax"] =         300;
				btower.effects["culturePerTickBase"] = 1;

				var energyRatio = (game.resPool.energyProd / game.resPool.energyCons);
				if (energyRatio > 1) {
					if (energyRatio > 1.75) {
						energyRatio = 1.75;
					}
					btower.effects["cultureMax"] = Math.floor((300 * energyRatio) * 1000) / 1000;
					btower.effects["culturePerTickBase"] = Math.floor((1 * energyRatio) * 1000) / 1000;
				}

				var broadcastTowerRatio = game.getEffect("broadcastTowerRatio");
				var totalRatio = game.space.getProgram("sattelite").getOn() * broadcastTowerRatio;

				btower.effects["cultureMax"] *= (1 + totalRatio);
				btower.effects["culturePerTickBase"] *= (1 + totalRatio);
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
			requires: {tech: ["acoustics"]},
			effects: {
				"culturePerTickBase": 0,
				"faithPerTickBase":   0,
				"cultureMax":         0
			},
			calculateEffects: function (self, game) {
				var effects = {
					"culturePerTickBase": 0.05,
					"faithPerTickBase":   0,
					"cultureMax":         200
				};
				if (game.challenges.currentChallenge !== 'atheism') {
					effects["faithPerTickBase"] = 0.005;
				}
				self.effects = effects;
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
			requires: {tech: ["philosophy"]},
			effects: {
				"culturePerTickBase": 0,
				"faithPerTickBase":   0,
				"happiness":          0,
				"manpowerMax":        0,
				"scienceMax":         0,
				"cultureMax":         0,
				"faithMax":           0
			},
			calculateEffects: function (self, game) {
				var effects = {
					"culturePerTickBase": 0.1,
					"faithPerTickBase":   0,
					"happiness":          0,
					"manpowerMax":        0,
					"scienceMax":         0,
					"cultureMax":         0,
					"faithMax":           0
				};

				if (game.challenges.currentChallenge !== 'atheism') {
					effects['faithMax'] = 100;

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
			unlockRatio: 0.3,
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
			requires: {tech: ["construction"]},
			effects: {
				"cultureMaxRatio": 0.08
			},
			calculateEffects: function (self, game) {
				self.effects = {
					cultureMaxRatio: 0.08 + game.getEffect("cultureMaxRatioBonus")
				};
			}
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
			requires: {tech: ["chronophysics"]},
			effects: {
				"resStasisRatio":     0,
				"energyConsumption": 0
			},
			upgrades: {voidSpace: ["cryochambers"]},
			calculateEffects: function (self, game) {
				var effects = {
					"resStasisRatio":    0.015, //1.5% of resources will be preserved
					"energyConsumption": 20
				};
				if (game.challenges.currentChallenge === "energy") {
					effects["energyConsumption"] *= 2;
				}
				self.effects = effects;
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
		"unobtainiumMax": 150,
		"antimatterMax":  1000
	},

	buildings: null,
	buildingsByName: null,
	buildingGroups: null,

	tabName: 'Bonfire',
	tabBlockClass: 'shortInt',

	constructor: function (game) {
		this.buildingsNames = [];
		this.buildingGroups = {};

		for (var name in this.buildingGroupsData) {
			var group = dojo.clone(this.buildingGroupsData[name]);
			group.game = game;
			group.alwaysVisible = Boolean(group.alwaysVisible);
			this.buildingGroups[name] = group;
		}
		this.activeGroup = this.buildingGroups.all;

		this.registerMetaItems(this.buildingsData, classes.KGSaveEdit.BuildingMeta, 'buildings', function (bld) {
			this.buildingsNames.push(bld.name);
			this.buildingGroups.all.buildings.push(bld.name);

			var effects = bld.get('effects') || {};

			if (!('maxKittens' in effects)) {
				this.buildingGroups.iw.buildings.push(bld.name);
			}
		});
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
			"unobtainiumMax": 150,
			"antimatterMax":  100
		};

		if (this.game.ironWill) {
			if (this.game.workshop.get("huntingArmor").owned()) {
				effects["manpowerMax"] = 1000;
			} else if (this.game.workshop.get("bolas").owned()) {
				effects["manpowerMax"] = 400;
			} else if (this.game.workshop.get("compositeBow").owned()) {
				effects["manpowerMax"] = 200;
			}
		}

		this.effectsBase = this.game.resPool.addBarnWarehouseRatio(effects);
	},

	getEffect: function (name) {
		var totalEffect = num(this.getEffectBase(name) + this.getEffectCached(name));

		// Previously, catnip demand (or other buildings that both effected the same resource)
		// could have theoretically had more than 100% reduction because they diminished separately,
		// this takes the total effect and diminishes it as a whole.
		if (this.game.isHyperbolic(name) && totalEffect < 0) {
			totalEffect = this.game.getHyperbolicEffect(totalEffect, 1.0);
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

	getPriceRatio: function (bldName) {
		var bld = this.getBuilding(bldName);
		var ratio = bld.get('priceRatio');

		var ratioBase = ratio - 1;

		var ratioDiff = this.game.getEffect(bldName + "PriceRatio") || 0;
		ratioDiff += this.game.getEffect("priceRatio") || 0;

		ratioDiff = this.game.getHyperbolicEffect(ratioDiff, ratioBase);

		return ratio + ratioDiff;
	},

	getPrices: function (bldName, base) {
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
	unlockable: false,
	togglable: false,
	togglableOnOff: false,

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

		this.game._createValInput({
			title: 'Number of buildings'
		}, this.domNode.children[1], this);

		this.toggleNode = dojo.create('input', {
			type: 'button',
			value: 'On',
			title: 'Toggle building'
		}, this.domNode.children[2]);
		on(this.toggleNode, 'click', function () {
			self.set('on', self.on > 0 ? 0 : self.val);
			self.game.update();
		});

		this.game._createCheckbox('Unlocked', this.domNode.children[3], this, 'unlocked');

		if ('isAutomationEnabled' in this) {
			var input = this.game._createCheckbox('Automation on', this.domNode.children[3], this, 'isAutomationEnabled');
			this.isAutomationEnabledLabel = input.label;
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
		var name = this.get('label') || this.get('name');
		var paren = '';
		if (this.val > 0) {
			paren = ' (' + this.val + ')';
			if (this.togglable && !this.togglableOnOff) {
				paren = ' (' + this.getOn() + '/' + this.val + ')';
			}
		}
		return name + paren;
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

	getEffect: function (effectName) {
		var effects = this.get('effects') || {};
		var effect;

		if (name === "coalRatioGlobal") {
			effect = effects[effectName];
		// Max effects and Ratio effects depends on constructed buildings
		} else if (
			effectName.indexOf("Max", effectName.length - 3) != -1 ||
			effectName.indexOf("Ratio", effectName.length - 5) != -1
		) {
			effect = effects[effectName] * this.val;
		} else {
			effect = effects[effectName] * this.getOn();
		}

		return num(effect);
	},

	getOn: function () {
		if (!this.togglable) {
			return this.val;
		} else if (this.togglableOnOff) {
			return this.on > 0 ? this.val : 0;
		}
		return Math.min(this.on, this.val) || 0;
	},

	update: function () {
		if (!this.togglable) {
			this.set('on', this.val);
		}
		var on = this.getOn();

		dojo.toggleClass(this.nameNode, 'btnEnabled', this.togglable && on > 0);

		dojo.toggleClass(this.onNodeSpan, 'hidden', !this.togglable || this.togglableOnOff);
		dojo.toggleClass(this.toggleNode, 'hidden', !this.togglableOnOff);
		this.toggleNode.value = on > 0 ? 'Off' : 'On';

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

		if (this.isAutomationEnabledLabel) {
			dojo.toggleClass(this.isAutomationEnabledLabel, 'hidden', this.isAutomationEnabled === undefined);
		}

		var activeGroup = this.game.bld.activeGroup;
		dojo.toggleClass(this.domNode, 'hidden', activeGroup.buildings.indexOf(this.name) < 0);

		if (this.action && on > 0) {
			var amt = this.action(this, this.game);
			if (amt !== undefined) {
				this.lackResConvert = amt !== 1;
			}
		}
		dojo.toggleClass(this.nameNode, 'btnLackResConvert', Boolean(this.lackResConvert));
	},

	updateUnlocked: function () {
		this.unlockable = this.game.checkRequirements(this, true);

		var unlocked = this.unlockable;
		var unlockRatio = this.get('unlockRatio');

		var prices = this.getPrices(true);
		if (this.unlockable && prices.length && unlockRatio) {
			unlocked = this.game.resPool.hasRes(prices, unlockRatio);
		}
		var disable = unlocked;

		this.set('unlocked', unlocked || this.unlockedNode.prevChecked, true);
		if (this.unlockable && !this.unlocked) {
			this.unlockedNode.indeterminate = true;
		}

		dojo.toggleClass(this.nameNode, 'spoiler', !this.unlocked);
		this.game.toggleDisabled(this.unlockedNode, disable);
	},

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "unlockable", "unlocked", "val", "on", "stage", "jammed", "isAutomationEnabled"]);
		saveData.on = this.getOn();

		return saveData;
	},

	load: function (saveBld) {
		this.set('val', num(saveBld.val));
		this.set('unlocked', saveBld.unlocked);
		this.set('on', num(saveBld.on));

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
			label: "Orbital Launch",
			description: "Launch a rocket to a space.",
			prices: [
				{name: "starchart", val: 250},
				{name: "manpower",  val: 5000},
				{name: "science",   val: 100000},
				{name: "oil",       val: 15000}
			],
			// unlocks: {planet: ["cath"], spaceMission: ["moonMission"]}
			unlocked: true,
			upgradable: false
		}, {
			name: "moonMission",
			label: "Moon Mission",
			description: "Launch a rocket to Redmoon, a Cath planet satellite",
			prices: [
				{name: "starchart", val: 500},
				{name: "titanium",  val: 5000},
				{name: "science",   val: 125000},
				{name: "oil",       val: 45000}
			],
			// unlocks: {planet: ["moon"], spaceMission: ["duneMission", "piscineMission"]}
			requires: {program: ["orbitalLaunch"]},
			upgradable: false
		}, {
			name: "duneMission",
			label: "Dune Mission",
			description: "Dune is a large and lifeless planet covered by sand and volcanic rock.",
			prices: [
				{name: "starchart", val: 1000},
				{name: "titanium",  val: 7000},
				{name: "science",   val: 175000},
				{name: "kerosene",  val: 75}
			],
			// unlocks: {planet: ["dune"], spaceMission: ["heliosMission"]},
			requires: {program: ["moonMission"]},
			upgradable: false
		}, {
			name: "piscineMission",
			label: "Piscine Mission",
			description: "Piscine is a gigantic aquatic planet composed of an acid body and a methane atmosphere",
			prices: [
				{name: "starchart", val: 1500},
				{name: "titanium",  val: 9000},
				{name: "science",   val: 200000},
				{name: "kerosene",  val: 250}
			],
			// unlocks: {planet: ["piscine"], spaceMission: ["terminusMission"]},
			requires: {program: ["moonMission"]},
			upgradable: false
		}, {
			name: "heliosMission",
			label: "Helios Mission",
			description: "Helios is a G2V spectral type star in the center of the Cath solar system.",
			prices: [
				{name: "starchart", val: 3000},
				{name: "titanium",  val: 15000},
				{name: "science",   val: 250000},
				{name: "kerosene",  val: 1250}
			],
			// unlocks: {planet: ["helios"], spaceMission: ["yarnMission"]},
			requires: {program: ["duneMission"]},
			upgradable: false
		}, {
			name: "terminusMission",
			label: "T-minus Mission",
			description: "Terminus is a supermassive ice giant at the far end of a Helios solar system.",
			prices: [
				{name: "starchart", val: 2500},
				{name: "titanium",  val: 12000},
				{name: "science",   val: 225000},
				{name: "kerosene",  val: 750}
			],
			// unlocks: {planet: ["terminus"], spaceMission: ["kairoMission"]},
			requires: {program: ["piscineMission"]},
			upgradable: false
		}, {
			name: "kairoMission",
			label: "Kairo Mission",
			description: "Kairo is a dwarf planet in the far end of the Cath solar system.",
			prices: [
				{name: "starchart", val: 5000},
				{name: "titanium",  val: 20000},
				{name: "science",   val: 300000},
				{name: "kerosene",  val: 7500}
			],
			// unlocks: {planet: ["kairo"], spaceMission: ["rorschachMission"]},
			requires: {program: ["terminusMission"]},
			upgradable: false
		}, {
			name: "rorschachMission",
			label: "???",
			description: "???",
			prices: [
				{name: "starchart", val: 15000},
				{name: "titanium",  val: 80000},
				{name: "science",   val: 500000},
				{name: "kerosene",  val: 25000}
			],
			// unlocks: {spaceMission: ["centaurusSystemMission"]},
			requires: {program: ["kairoMission"]},
			upgradable: false
		}, {
			name: "yarnMission",
			label: "Yarn Mission",
			description: "Yarn is a class M planet with high moderate climate, seas and oxygen atmosphere.",
			prices: [
				{name: "starchart", val: 7500},
				{name: "titanium",  val: 35000},
				{name: "science",   val: 350000},
				{name: "kerosene",  val: 12000}
			],
			// unlocks: {planet: ["yarn"]},
			requires: {program: ["heliosMission"]},
			upgradable: false
		}, {
			name: "centaurusSystemMission",
			label: "Centaurus System Mission",
			description: "Centaurus System is a warm faraway star system.",
			prices: [
				{name: "starchart", val: 100000},
				{name: "titanium", 	val: 40000},
				{name: "science", 	val: 400000},
				{name: "kerosene", 	val: 30000},
				{name: "thorium",   val: 50000}
			],
			// unlocks: {planet: ["centaurusSystem"]},
			requires: {program: ["rorschachMission"]},
			upgradable: false
	}],

	planetData: [{
			name: "cath",
			label: "Cath",
			routeDays: 0,
			buildings: [{
					name: "spaceElevator",
					label: "Space Elevator",
					description: "Every S. Elevator reduces oil requirements for space missions by 5%",
					prices: [
						{name: "titanium",    val: 6000},
						{name: "science",     val: 75000},
						{name: "unobtainium", val: 50}
					],
					priceRatio: 1.15,
					requires: {tech: ["orbitalEngineering", "nanotechnology"]},
					effects: {
						"oilReductionRatio": 0,
						"spaceRatio":        0,
						"prodTransferBonus": 0
					},
					calculateEffects: function (self) {
						self.effects = {
							"oilReductionRatio": 0.05,
							"spaceRatio":        0.01,
							"prodTransferBonus": 0.001
						};
					}
				}, {
					name: "sattelite",
					label: "Satellite",
					description: "Deploy a satellite. Satellites improve your observatory effectiveness by 5% and produce starcharts",
					prices: [
						{name: "starchart", val: 325},
						{name: "titanium",  val: 2500},
						{name: "science",   val: 100000},
						{name: "oil",       val: 15000}
					],
					priceRatio: 1.08,
					requires: {tech: ["sattelites"]},
					togglable: true,
					effects: {
						"observatoryRatio":          0,
						"starchartPerTickBaseSpace": 0,
						"energyConsumption":         0,
						"energyProduction":          0
					},
					upgrades: {buildings: ["observatory"]},
					calculateEffects: function (self, game) {
						self.effects = {
							"observatoryRatio":          0.05,
							"starchartPerTickBaseSpace": 0.001,
							"energyConsumption":         0,
							"energyProduction":          0
						};

						self.togglable = true;


						if (game.workshop.get("solarSatellites").owned()) {
							self.effects["energyProduction"] = 1;
							self.togglable = false;
						} else {
							self.effects["energyConsumption"] = 1;
							if (game.challenges.currentChallenge === "energy") {
								self.effects["energyConsumption"] *= 2;
							}
						}
					}
				}, {
					name: "spaceStation",
					label: "Space Station",
					description: "Deploy a space station. Each station generates science and provide a space for 2 astronauts",
					prices: [
						{name: "starchart", val: 425},
						{name: "alloy",     val: 750},
						{name: "science",   val: 150000},
						{name: "oil",       val: 35000}
					],
					priceRatio: 1.12,
					requires: {tech: ["orbitalEngineering"]},
					togglable: true,
					effects: {
						"maxKittens":        0,
						"scienceRatio":      0,
						"energyConsumption": 0
					},
					calculateEffects: function (self, game) {
						self.effects = {
							"scienceRatio":      0.5,
							"maxKittens":        2,
							"energyConsumption": 10
						};
						if (game.challenges.currentChallenge === "energy") {
							self.effects["energyConsumption"] *= 2;
						}
					}
			}],
			requires: {program: ["orbitalLaunch"]}
		}, {
			name: "moon",
			label: "Moon",
			routeDays: 3,
			buildings: [{
					name: "moonOutpost",
					label: "Lunar Outpost",
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
					togglable: true,
					effects: {
						"energyConsumption":       0,
						"uraniumPerTickCon":       0,
						"unobtainiumPerTickSpace": 0
					},
					calculateEffects: function (self, game) {
						self.effects = {
							"uraniumPerTickCon":      -0.35,
							"unobtainiumPerTickSpace": 0.007 * (1 + game.getEffect("lunarOutpostRatio")),
							"energyConsumption":       5
						};
						if (game.challenges.currentChallenge === "energy") {
							self.effects["energyConsumption"] *= 2;
						}
					},
					lackResConvert: false,
					action: function (game, self) {
						self.effects["uraniumPerTickCon"] = -0.35;
						self.effects["unobtainiumPerTickSpace"] = 0.007 * (1 + game.getEffect("lunarOutpostRatio"));
						var amt = game.resPool.getAmtDependsOnStock(
							[{res: "uranium", amt: -self.effects["uraniumPerTickCon"]}],
							self.getOn()
						);
						self.effects["uraniumPerTickCon"] *= amt;
						self.effects["unobtainiumPerTickSpace"] *= amt;

						return amt;
					}
				}, {
					name: "moonBase",
					label: "Moon base",
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
					togglable: true,
					effects: {
						"catnipMax":         0,
						"woodMax":           0,
						"mineralsMax":       0,
						"ironMax":           0,
						"coalMax":           0,
						"titaniumMax":       0,
						"oilMax":            0,
						"unobtainiumMax":    0,
						"energyConsumption": 0
					},
					calculateEffects: function (self, game) {
						self.effects = {
							"catnipMax":         45000,
							"woodMax":           25000,
							"mineralsMax":       30000,
							"ironMax":           9000,
							"coalMax":           3500,
							"titaniumMax":       1250,
							"oilMax":            3500,
							"unobtainiumMax":    150,
							"energyConsumption": game.workshop.get("amBases").owned() ? 5 : 10
						};
						if (game.challenges.currentChallenge === "energy") {
							self.effects["energyConsumption"] *= 2;
						}
					}
			}],
			requires: {program: ["moonMission"]}
		}, {
			name: "dune",
			label: "Dune",
			routeDays: 356,
			buildings: [{
					name: "planetCracker",
					label: "Planet Cracker",
					description: "USS Mining Vessel Hissmeowra that can crack an entire planet",
					prices: [
						{name: "starchart", val: 2500},
						{name: "alloy",     val: 1750},
						{name: "science",   val: 125000},
						{name: "kerosene",  val: 50}
					],
					priceRatio: 1.18,
					effects: {
						"uraniumPerTickSpace": 0,
						"uraniumMax":          0
					},
					calculateEffects: function (self, game) {
						self.effects = {
							"uraniumPerTickSpace": 0.3 * (1 + game.getEffect("crackerRatio")),
							"uraniumMax": 1750
						};
					}
				}, {
					name: "hydrofracturer",
					label: "Hydraulic Fracturer",
					description: "Produces a high-pressure stream of oil. Every Space Elevator will boost this production by 0.1% of the global production multiplier.",
					prices: [
						{name: "starchart", val: 750},
						{name: "alloy",     val: 1025},
						{name: "science",   val: 150000},
						{name: "kerosene",  val: 100}
					],
					priceRatio: 1.18,
					effects: {
						"oilPerTickAutoprodSpace": 0
					},
					calculateEffects: function (self) {
						self.effects = {
							"oilPerTickAutoprodSpace": 0.5
						};
					}
				}],
				requires: {program: ["duneMission"]}
			}, {
				name: "piscine",
				label: "Piscine",
				routeDays: 256,
				buildings: [{
					name: "researchVessel",
					label: "Research Vessel",
					description: "Mobile research space vessel.",
					prices: [
						{name: "starchart", val: 500},
						{name: "alloy",     val: 2500},
						{name: "titanium",  val: 12500},
						{name: "kerosene",  val: 250}
					],
					priceRatio: 1.15,
					effects: {
						"starchartPerTickBaseSpace": 0,
						"scienceMax":                0
					},
					calculateEffects: function (self, game) {
						self.effects = {
							"starchartPerTickBaseSpace": 0.01,
							"scienceMax":                10000 * (1 + game.getEffect("spaceScienceRatio"))
						};
					}
				}, {
					name: "orbitalArray",
					label: "Orbital Array",
					description: "Provide a 2% production bonus to all space structures",
					prices: [
						{name: "eludium",  val: 100},
						{name: "science",  val: 250000},
						{name: "kerosene", val: 500}
					],
					priceRatio: 1.15,
					togglable: true,
					effects: {
						"spaceRatio": 0,
						"energyConsumption": 0
					},
					calculateEffects: function (self, game) {
						self.effects = {
							"spaceRatio":        0.02,
							"energyConsumption": 20
						};
						if (game.challenges.currentChallenge === "energy") {
							self.effects["energyConsumption"] *= 2;
						}
					}
			}],
			requires: {program: ["piscineMission"]}
		}, {
			name: "helios",
			label: "Helios",
			routeDays: 227,
			buildings: [{
					name: "sunlifter",
					label: "Sunlifter",
					description: "Generates antimatter once per year. Inactive if energy production is negative",
					prices: [
						{name: "science",  val: 500000},
						{name: "eludium",  val: 250},
						{name: "kerosene", val: 2500}
					],
					priceRatio: 1.15,
					effects: {
						"antimatterProduction": 0,
						"energyProduction":     0
					},
					calculateEffects: function (self) {
						self.effects = {
							"antimatterProduction": 1,
							"energyProduction":     30
						};
					}
				}, {
					name: "containmentChamber",
					label: "Cont. Chamber",
					description: "Increases antimatter storage space by 100.",
					prices: [
						{name: "science",  val: 500000},
						{name: "kerosene", val: 2500}
					],
					priceRatio: 1.15,
					togglable: true,
					effects: {
						"energyConsumption": 0,
						"antimatterMax": 0
					},
					calculateEffects: function (self, game) {
						self.effects = {
							"antimatterMax": 100,
							"energyConsumption": 50
						};
						if (game.challenges.currentChallenge === "energy") {
							self.effects["energyConsumption"] *= 2;
						}
					}
			}],
			requires: {program: ["heliosMission"]}
		}, {
			name: "terminus",
			label: "T-Minus",
			routeDays: 457,
			buildings: [{
				name: "cryostation",
				label: "Cryostation",
				description: "A vast storage facility complex",
				prices: [
					{name: "eludium",  val: 25},
					{name: "concrate", val: 1500},
					{name: "science",  val: 200000},
					{name: "kerosene", val: 500}
				],
				priceRatio: 1.12,
				effects: {
					"woodMax":        0,
					"mineralsMax":    0,
					"ironMax":        0,
					"coalMax":        0,
					"uraniumMax":     0,
					"titaniumMax":    0,
					"oilMax":         0,
					"unobtainiumMax": 0
				},
				calculateEffects: function (self) {
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
				}
			}],
			requires: {program: ["terminusMission"]}
		}, {
			name: "kairo",
			label: "Kairo",
			routeDays: 492,
			buildings: [{
				name: "spaceBeacon",
				label: "Space Beacon",
				description: "An AM-powered space station used for research and interstellar navigation.",
				prices: [
					{name: "starchart",  val: 25000},
					{name: "antimatter", val: 50},
					{name: "alloy",      val: 2500},
					{name: "kerosene",   val: 7500}
				],
				priceRatio: 1.15,
				effects: {
					"starchartPerTickBaseSpace": 0,
					"scienceMax":                0,
					"relicPerDay":               0
				},
				calculateEffects: function (self, game) {
					self.effects = {
						"starchartPerTickBaseSpace": 0.025,
						"scienceMax":                25000 * (1 + game.getEffect("spaceScienceRatio")),
						"relicPerDay":               game.getEffect("beaconRelicsPerDay")
					};
				}
			}],
			requires: {program: ["kairoMission"]}
		}, {
			name: "yarn",
			label: "Yarn",
			routeDays: 603,
			buildings: [{
					name: "terraformingStation",
					label: "Terraforming Station",
					description: "Explode a charge of antimatter to melt yarn ice and throw an oxygen into the atmosphere",
					prices: [
						{name: "antimatter", val: 25},
						{name: "uranium",    val: 5000},
						{name: "kerosene",   val: 5000}
					],
					priceRatio: 1.25,
					requires: {tech: ["terraformation"]},
					effects: {
						"maxKittens": 0
					},
					calculateEffects: function (self) {
						self.effects = {
							"maxKittens": 1
						};
					}
				}, {
					name: "hydroponics",
					label: "Hydroponics",
					description: "State of the art automated hydroponic system. Increase catnip limit by 10%. Increase catnip production by 2.5%",
					prices: [
						{name: "kerosene", val: 500}
					],
					priceRatio: 1.15,
					requires: {tech: ["hydroponics"]},
					effects: {
						"catnipMaxRatio": 0,
						"catnipRatio":    0
					},
					calculateEffects: function (self) {
						self.effects = {
							"catnipMaxRatio": 0.1,
							"catnipRatio":    0.025
						};
					},
					val: 0
			}],
			requires: {program: ["yarnMission"]}
		}, {
			name: "centaurusSystem",
			label: "Centaurus System",
			routeDays: 120000,
			buildings: [{
				name: "tectonic",
				label: "Tectonic",
				description: "Rip open the planet near the star Centaurus to collect magma energy.",
				prices: [
					{name: "science",    val: 600000},
					{name: "antimatter", val: 500},
					{name: "thorium",    val: 75000}
				],
				priceRatio: 1.25,
				effects: {
					"energyProduction": 0
				},
				calculateEffects: function (self) {
					self.effects = {
						"energyProduction": 25
					};
				}
			}],
			requires: {program: ["centaurusSystemMission"]}
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

	constructor: function () {
		this.programs = [];

		this.registerMetaItems(this.programData, classes.KGSaveEdit.ProgramMeta, 'allPrograms', function (program) {
			this.programs.push(program);
		});

		this.registerMetaItems(this.planetData, classes.KGSaveEdit.GenericItem, 'planets', function (planet) {
			planet.unlocked = false;
			planet.reached = false;
			planet.routeDaysMax = num(planet.routeDays);

			var bld = planet.buildings || [];
			planet.buildings = [];
			this.registerMetaItems(bld, classes.KGSaveEdit.ProgramMeta, 'allPrograms', function (program) {
				program.planet = planet;
				planet.buildings.push(program);
			});
		});
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

			var tr = dojo.create('tr', {
				'class': 'planet',
				innerHTML: '<td colspan="3"></td>'
			}, this.programsBlock);

			planet.nameRow = tr;
			planet.nameNode = dojo.create('span', {
				'class': 'nameNode',
				innerHTML: planet.label || planet.name
			}, tr.children[0]);

			var span = dojo.create('span', {
				'class': 'planetRouteDaysSpan',
				innerHTML: 'Flight time &nbsp;'
			}, tr.children[0]);

			var input = this.game._createInput({}, span, planet, 'routeDays');
			input.parseFn = function (value) {
				return Math.min(value, this.metaObj.routeDaysMax);
			};

			dojo.place(document.createTextNode(' '), span);

			planet.routeDaysETANode = dojo.create('span', null, span);

			for (var j = 0, bldlen = planet.buildings.length; j < bldlen; j++) {
				program = planet.buildings[j];
				program.render();
				dojo.place(program.domNode, this.programsBlock);
			}
		}
	},

	getAutoProductionRatio: function (useTransferBonus) {
		var ratio = 1 + this.getEffect("spaceRatio");
		if (useTransferBonus) {
			ratio *= 1 + ((this.game.bld.getAutoProductionRatio(false, 0.05) - 1) * (this.getEffect("prodTransferBonus") / 100));
		}

		if (this.game.workshop.get("spaceManufacturing").owned()) {
			var factory = this.game.bld.get("factory");
			ratio *= 1 + factory.getOn() * factory.effects["craftRatio"] * 0.75;
		}
		return ratio;
	},

	update: function () {
		var routeSpeed = this.game.getEffect("routeSpeed") || 1;

		for (var i = this.planets.length - 1; i >= 0; i--) {
			var planet = this.planets[i];

			planet.unlocked = this.game.checkRequirements(planet, false);
			planet.reached = !planet.routeDays && planet.unlocked;
			if (planet.nameNode) {
				dojo.toggleClass(planet.nameNode, 'spoiler', !planet.unlocked);

				var eta = "";
				if (planet.unlocked && planet.routeDays > 0) {
					eta = "&nbsp; |&nbsp; ETA: " + this.game.toDisplayDays(Math.round(planet.routeDays / routeSpeed));
				}
				planet.routeDaysETANode.innerHTML = eta;
			}
		}
		this.game.callMethods(this.allPrograms, 'update');
	},

	save: function (saveData) {
		var planets = this.game.filterMetadata(this.planets, ["name", "buildings", "reached", "unlocked", "routeDays"]);

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
			planet.reached = savePlanet.reached;
			// planet.unlocked = savePlanet.unlocked;
			planet.set('routeDays', num(savePlanet.routeDays));

			this.loadMetaData(savePlanet.buildings, 'getProgram');
		});

		this.set('hideResearched', saveData.space.hideResearched);
	}
});


dojo.declare('classes.KGSaveEdit.ProgramMeta', classes.KGSaveEdit.MetaItem, {
	val: 0,
	on: 0,
	unlocked: false,
	upgradable: true,
	togglable: false,

	constructor: function () { },

	owned: function () {
		return this.val > 0;
	},

	getName: function () {
		var name = this.label || this.name;
		if (!this.owned()) {
			return name;
		}
		var paren = ' (' + this.val + ')';
		if (this.upgradable) {
			if (this.togglable) {
				paren = ' (' + this.getOn() + '/' + this.val + ')';
			}
		} else {
			paren = ' (Complete)';
		}
		return name + paren;
	},

	getPrices: function (basic) {
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

		//separate for raisins
		for (i = 0; i < len; i++) {
			if (prices[i].name === "oil") {
				var reductionRatio = this.game.getHyperbolicEffect(this.game.getEffect("oilReductionRatio"), 0.75);
				prices[i].val *= 1 - reductionRatio;
				break;
			}
		}

		return prices;
	},

	getEffect: function (name) {
		var effects = this.effects || {};
		var effect = num(effects[name]);

		if (this.togglable) {
			return effect * this.getOn();
		}
		return effect * this.val;
	},

	getOn: function () {
		if (!this.upgradable || !this.togglable) {
			return this.val;
		}
		return Math.min(this.on, this.val) || 0;
	},

	render: function () {
		this.domNode = dojo.create('tr', {
			'class': 'program',
			innerHTML: '<td class="nameNode">' + (this.label || this.name) + '</td>' +
				'<td class="rightAlign"></td><td></td>'
		});
		this.nameNode = this.domNode.children[0];

		this.onNodeSpan = dojo.create('span', {innerHTML: ' / '}, this.domNode.children[1]);

		this.game._createInput({
			'class': 'integerInput ownedInput',
			title: 'Number of active programs'
		}, this.onNodeSpan, this, 'on', 'first');

		this.game._createValInput({
			title: 'Number of programs'
		}, this.domNode.children[1], this);

		if (!this.planet) {
			var input = this.game._createCheckbox('Unlocked', this.domNode.children[2], this, 'unlocked');
			this.unlockedLabel = input.label;

			input = this.game._createCheckbox('Launched', this.domNode.children[2], this);
			input.cbox.handler = function () {
				var val = num(this.checked);
				this.metaObj.set('val', val);
				this.metaObj.set('on', val);
			};
			this.launchedLabel = input.label;
		}

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	update: function () {
		var req = this.game.checkRequirements(this, true);
		var unlocked = req;

		if (this.unlockedNode) {
			if (!unlocked && this.unlockedNode.prevChecked) {
				unlocked = true;
			}
			this.unlockedNode.checked = unlocked;
			this.game.toggleDisabled(this.unlockedNode, req);
		}
		var spoiler = !unlocked;

		if (this.planet) {
			unlocked = this.planet.reached;
			spoiler = !unlocked || !req;
		} else {
			dojo.toggleClass(this.valNode, 'hidden', !this.upgradable);
			dojo.toggleClass(this.launchedLabel, 'hidden', this.upgradable);

			dojo.toggleClass(this.domNode, 'hidden',
				this.game.space.hideResearched && !this.upgradable && this.owned());
		}
		this.unlocked = unlocked;
		dojo.toggleClass(this.nameNode, 'spoiler', spoiler);

		dojo.toggleClass(this.nameNode, 'btnEnabled',
			Boolean(this.togglable && this.getOn() > 0));
		dojo.toggleClass(this.onNodeSpan, 'hidden', !this.upgradable || !this.togglable);

		this.updateEnabled();

		if (this.calculateEffects) {
			this.calculateEffects(this, this.game);
			this.game.calendar.cycleEffectsBasics(this.effects, this.name);
		}
		if (this.action && this.val > 0) {
			this.action(this.game, this);
			this.game.calendar.cycleEffectsBasics(this.effects, this.name);
		}
	},

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "val", "on", "unlocked"]);
		saveData.on = this.getOn();
		return saveData;
	},

	load: function (saveData) {
		this.set('val', num(saveData.val));
		this.set('on', num(saveData.on));
		this.set('unlocked', Boolean(saveData.unlocked));
	}
});

});
