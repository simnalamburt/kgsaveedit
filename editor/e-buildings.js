/*global dojo, require, classes, num*/

require(["dojo/on"], function (on) {
"use strict";

dojo.declare("classes.KGSaveEdit.BuildingsManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
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
					} else if (game.calendar.season === 1) {
						effects.energyProduction /= 0.75;
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
			description: "Improves effectiveness of catnip refinement by 10%. More effective if powered.",
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
				var on = self.getOn();
				if (game.workshop.get("biofuel").owned()) {

					self.effects["catnipPerTickCon"] = -1;
					self.effects["oilPerTickProd"] = 0.02 * (1 + game.getEffect("biofuelRatio"));

					var amt = game.resPool.getAmtDependsOnStock(
						[{res: "catnip", amt: -self.effects["catnipPerTickCon"]}],
						on
					);
					self.effects["catnipPerTickCon"] *= amt;
					self.effects["oilPerTickProd"] *= amt;

					return amt;
				}

				if (self.val) {
					self.effects["scienceRatio"] = 0.35 * (1 + on / self.val);
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
			effects: {
				"mineralsPerTickCon":     -1.5,
				"oilPerTickCon":          -0.024,
				"ironPerTickAutoprod":     0.15,
				"titaniumPerTickAutoprod": 0.0005,
				"energyConsumption":       0,
				"ironPerTickCon":          0,
				"coalPerTickCon":          0,
				"steelPerTickProd":        0
			},
			isAutomationEnabled: true,
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

				self.effects["ironPerTickCon"] = 0;
				self.effects["coalPerTickCon"] = 0;
				self.effects["steelPerTickProd"] = 0;

				var steelRatio = game.getEffect("calcinerSteelRatio");

				self.showAutomation = false;
				if (steelRatio) {
					// if (typeof self.isAutomationEnabled === "undefined") {
					// 	self.isAutomationEnabled = true;
					// }
					self.showAutomation = true;

					if (self.isAutomationEnabled) {
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
					}
				}

				this.showAutomation = steelRatio > 0;

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
			showAutomation: true,
			calculateEffects: function (self, game) {
				self.effects["coalRatioGlobal"] = -0.8 + game.getEffect("coalRatioGlobalReduction");

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
				self.effects["manuscriptPerTickProd"] = amt;
			}, //no factory automation stuff
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
				if (game.workshop.get("neuralNetworks").owned()) {
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
			isAutomationEnabled: true,
			calculateEffects: function (self, game) {
				self.effects["uraniumPerTick"] = -0.001 * (1 - game.getEffect("uraniumRatio"));
			},
			action: function (self, game) {
				self.effects["thoriumPerTick"] = game.getEffect("reactorThoriumPerTick");
				self.effects["energyProduction"] = 10 * (1 + game.getEffect("reactorEnergyRatio"));

				self.showAutomation = false;
				if (game.workshop.get("thoriumReactors").owned()) {
					// if (typeof self.isAutomationEnabled === "undefined") {
					// 	self.isAutomationEnabled = true;
					// }
					self.showAutomation = true;
					if (game.resPool.get("thorium").value === 0 || !self.isAutomationEnabled) {
						self.effects["thoriumPerTick"] = 0;
						self.effects["energyProduction"] -= 2.5;
					}
				} else {
					// self.isAutomationEnabled = undefined;
				}
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

				self.effects["fursPerTickProd"]  = mpratio * 1.25; //2
				self.effects["ivoryPerTickProd"] = mpratio * 0.3;  //1.5

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
				if (game.challenges.currentChallenge !== "atheism") {
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

				if (game.challenges.currentChallenge !== "atheism") {
					effects["faithMax"] = 100;

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
			description: "Relocates small amount of resources through time. Can be upgraded further. Every chronosphere increases the chance of Temporal Paradox.",
			prices: [
				{name: "unobtainium", val: 2500},
				{name: "timeCrystal", val: 1},
				{name: "blueprint",   val: 100},
				{name: "science",     val: 250000}
			],
			priceRatio: 1.25,
			requires: {tech: ["chronophysics"]},
			effects: {
				"resStasisRatio":         0.015, //1.5% of resources will be preserved
				"energyConsumption":      20,
				"temporalFluxProduction": 0
			},
			upgrades: {voidSpace: ["cryochambers"]},
			isAutomationEnabled: true,
			showAutomation: true,
			calculateEffects: function (self, game) {
				self.effects["energyConsumption"] = 20;
				if (game.challenges.currentChallenge === "energy") {
					self.effects["energyConsumption"] *= 2;
				}
				self.effects["temporalFluxProduction"] = game.getEffect("temporalFluxProductionChronosphere");
			}
	}],

	buildingGroupsData: {
		all: {
			name: "all",
			title: "All",
			buildings: [],
			alwaysVisible: true
		},
		allEnabled: {
			name: "allEnabled",
			title: "Enabled",
			filterFn: function (bld) {
				return bld.unlocked && !dojo.hasClass(bld.nameNode, "btnDisabled");
			},
			alwaysVisible: true
		},
		togglable: {
			name: "togglable",
			title: "Togglable",
			filterFn: function (bld) {
				return bld.togglable;
			},
			alwaysVisible: true
		},
		iw: {
			name: "iw",
			title: "Iron Will",
			buildings: []
		},
		food: {
			name: "food",
			title: "Food",
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
			name: "population",
			title: "Population",
			buildings: ["hut", "logHouse", "mansion"]
		},
		science: {
			name: "science",
			title: "Science",
			buildings: ["library", "academy", "observatory", "biolab"]
		},
		storage: {
			name: "storage",
			title: "Storage",
			buildings: ["barn", "warehouse", "harbor"]
		},
		resource: {
			name: "resource",
			title: "Resource",
			buildings: ["mine", "quarry", "lumberMill", "oilWell", "accelerator"]
		},
		industry: {
			name: "industry",
			title: "Industry",
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
			name: "culture",
			title: "Culture",
			buildings: ["amphitheatre", "chapel", "temple"]
		},
		other: {
			name: "other",
			title: "Other",
			buildings: ["workshop", "tradepost", "mint", "unicornPasture"]
		},
		megastructures: {
			name: "megastructures",
			title: "Mega Structures",
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

	tabName: "Bonfire",
	tabBlockClass: "shortInt",

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

		this.registerMetaItems(this.buildingsData, classes.KGSaveEdit.BuildingMeta, "buildings", function (bld) {
			this.buildingsNames.push(bld.name);
			this.buildingGroups.all.buildings.push(bld.name);

			var effects = bld.get("effects") || {};

			if (!("maxKittens" in effects)) {
				this.buildingGroups.iw.buildings.push(bld.name);
			}
		});
		this.meta.push(this.buildings);
	},

	renderTabBlock: function () {
		this.buildingGroupsBlock = dojo.create("div", {
			id: "buildingGroupsBlock",
			class: "bottom-margin"
		}, this.tabBlockNode);

		this.buildingsBlock = dojo.create("table", {id: "buildingsBlock"}, this.tabBlockNode);
	},

	render: function () {
		var onclick = function () {
			dojo.query(".activeGroup", "buildingGroupsBlock").removeClass("activeGroup");
			dojo.addClass(this.domNode, "activeGroup");
			this.game.bld.activeGroup = this;
			this.game.update();
		};

		for (var name in this.buildingGroups) {
			var group = this.buildingGroups[name];

			//wrap tab link for css
			group.nodeWrapper = dojo.create("span", {class: "separated"}, this.buildingGroupsBlock);

			group.domNode = dojo.create("a", {
				class: "buildGroup",
				href: "#",
				innerHTML: group.title || group.name,
			}, group.nodeWrapper);

			on(group.domNode, "click", dojo.hitch(group, onclick));

			if (this.activeGroup === group) {
				dojo.addClass(group.domNode, "activeGroup");
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
		this.game.callMethods(this.buildings, "updateUnlocked");

		var group;
		for (var name in this.buildingGroups) {
			group = this.buildingGroups[name];
			group.hasVisibleBuildings = group.alwaysVisible;

			var i, bld;
			if (group.name === "iw") {
				group.hasVisibleBuildings = this.game.ironWill && this.get("library").owned();
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

			dojo.toggleClass(group.nodeWrapper, "hidden", !group.hasVisibleBuildings);
		}

		if (!this.activeGroup || !this.activeGroup.hasVisibleBuildings) {
			group = this.buildingGroups.all;
			dojo.query(".activeGroup", "buildingGroupsBlock").removeClass("activeGroup");
			dojo.addClass(group.domNode, "activeGroup");
			this.game.bld.activeGroup = group;
		}

		this.game.callMethods(this.buildings, "update");
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

	getAutoProductionRatio: function () {
		var autoProdRatio = 1;

		// faith
		autoProdRatio *= 1 + (this.game.religion.getProductionBonus() / 100);
		// SW
		var steamworks = this.get("steamworks");
		var steamworksOn = steamworks.getOn();
		var swRatio = steamworksOn > 0 ? 1 + steamworks.effects["magnetoBoostRatio"] * steamworksOn : 1;
		autoProdRatio *= 1 + this.getEffect("magnetoRatio") * swRatio;

		// paragon (25%)
		autoProdRatio *= 1 + this.game.prestige.getParagonProductionRatio() * 0.25;

		// reactors
		autoProdRatio *= 1 + this.getEffect("productionRatio");

		return autoProdRatio;
	},

	getPriceRatio: function (bldName) {
		var bld = this.getBuilding(bldName);
		var ratio = bld.get("priceRatio");

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
		saveData.buildings = this.game.mapMethods(this.buildings, "save");

		if (!saveData.bldData) {
			saveData.bldData = {};
		}
		saveData.bldData.groupBuildings = this.groupBuildings;
		saveData.bldData.twoRows = this.twoRows;
	},

	load: function (saveData) {
		this.loadMetaData(saveData.buildings, "get");

		this.groupBuildings = saveData.bldData.groupBuildings;
		this.twoRows = saveData.bldData.twoRows;
	}
});


dojo.declare("classes.KGSaveEdit.BuildingMeta", classes.KGSaveEdit.MetaItem, {
	domNode: null,

	val: 0,
	on: 0,
	unlockable: false,
	togglable: false,
	togglableOnOff: false,

	showAutomation: false,

	constructor: function () { },

	render: function () {
		var self = this;

		this.domNode = dojo.create("tr", {
			class: "building",
			innerHTML: '<td></td><td class="rightAlign"></td><td></td><td></td>'
		});

		var td = this.domNode.children[0];
		this.nameNode = dojo.create("span", {
			class: "nameNode",
			innerHTML: this.get("label") || this.get("name")
		}, td);

		if (this.stages) {
			this.stageUpNode = dojo.create("input", {
				type: "button",
				value: "^",
				class: "stageBtn hidden",
				title: "Upgrade building"
			}, td);
			on(this.stageUpNode, "click", function () {
				if (self.stage < self.stages.length - 1 && self.stages[self.stage + 1].stageUnlocked) {
					self.stage++;
					self.game.upgradeItems({buildings: [self.name]});
				}
				self.game.update();
			});

			this.stageDownNode = dojo.create("input", {
				type: "button",
				value: "V",
				class: "stageBtn hidden",
				title: "Downgrade building"
			}, td);
			on(this.stageDownNode, "click", function () {
				if (self.stage > 0) {
					self.stage--;
					self.game.upgradeItems({buildings: [self.name]});
				}
				self.game.update();
			});
		}

		this.onNodeSpan = dojo.create("span", {innerHTML: " / "}, this.domNode.children[1]);

		this.game._createInput({
			class: "integerInput ownedInput",
			title: "Number of active buildings"
		}, this.onNodeSpan, this, "on", "first");

		this.game._createValInput({
			title: "Number of buildings"
		}, this.domNode.children[1], this);

		this.toggleNode = dojo.create("input", {
			type: "button",
			value: "On",
			title: "Toggle building"
		}, this.domNode.children[2]);
		on(this.toggleNode, "click", function () {
			self.set("on", self.on > 0 ? 0 : self.val);
			self.game.update();
		});

		var input = this.game._createCheckbox("Unlocked", this.domNode.children[3], this, "unlocked");
		dojo.toggleClass(input.label, "hidden", !this.get("unlockRatio"));

		if (this.hasOwnProperty("isAutomationEnabled")) {
			input = this.game._createCheckbox("Automation on", this.domNode.children[3], this, "isAutomationEnabled");
			this.isAutomationEnabledLabel = input.label;
		}

		if ("jammed" in this) {
			this.game._createCheckbox("Jammed", this.domNode.children[3], this, "jammed");
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
		if (this[key + "Node"] && this[key + "Node"].dataProp === key) {
			var args = [].slice.call(arguments, 2);
			args = [this[key + "Node"], value].concat(args);
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
		var name = this.get("label") || this.get("name");
		var paren = "";
		if (this.val > 0) {
			paren = " (" + this.val + ")";
			if (this.togglable && !this.togglableOnOff) {
				paren = " (" + this.getOn() + "/" + this.val + ")";
			}
		}
		return name + paren;
	},

	getDescription: function () {
		var desc = this.get("description");
		if (this.jammed) {
			return desc + "<br>" + "***Maintenance***";
		}
		return desc;
	},

	getPrices: function (simple) {
		var ratio = this.game.bld.getPriceRatio(this.name);
		var prices = dojo.clone(this.get("prices")) || {};

		if (!simple) {
			for (var i = 0, len = prices.length; i < len; i++) {
				prices[i].val *= Math.pow(ratio, this.val);
			}
		}
		return prices;
	},

	getEffect: function (effectName) {
		var effects = this.get("effects") || {};
		var effect;

		if (effectName === "coalRatioGlobal") {
			effect = effects[effectName];
		// Max effects and Ratio effects depends on constructed buildings
		} else if (
			effectName.indexOf("Max", effectName.length - 3) > -1 ||
			(this.name === "biolab" && effectName.indexOf("Ratio", effectName.length - 5) !== -1)
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
			this.set("on", this.val);
		}
		var on = this.getOn();

		dojo.toggleClass(this.nameNode, "btnEnabled", this.togglable && on > 0);

		dojo.toggleClass(this.onNodeSpan, "hidden", !this.togglable || this.togglableOnOff);
		dojo.toggleClass(this.toggleNode, "hidden", !this.togglableOnOff);
		this.toggleNode.value = on > 0 ? "Off" : "On";

		if (this.stages) {
			var len = this.stages.length - 1;
			//no safety like overkill
			this.stage = Math.min(Math.max(this.stage, 0), len) || 0;

			for (var i = len; i >= 1; i--) {
				var stage = this.stages[i];
				stage.stageUnlocked = this.game.checkRequirements(stage, false, true);
			}

			dojo.toggleClass(this.stageDownNode, "hidden", !this.stage);
			dojo.toggleClass(this.stageUpNode, "hidden",
				this.stage === len || !this.stages[this.stage + 1].stageUnlocked);
		}

		this.nameNode.textContent = this.get("label") || this.get("name");
		this.updateEnabled();

		var activeGroup = this.game.bld.activeGroup;
		dojo.toggleClass(this.domNode, "hidden", activeGroup.buildings.indexOf(this.name) < 0);

		if (this.action && on > 0) {
			var amt = this.action(this, this.game);
			if (amt !== undefined) {
				this.lackResConvert = amt !== 1;
			}
		}

		if (this.isAutomationEnabledLabel) {
			dojo.toggleClass(this.isAutomationEnabledLabel, "hidden", !this.showAutomation);
		}
		dojo.toggleClass(this.nameNode, "btnLackResConvert", Boolean(this.lackResConvert));
	},

	updateUnlocked: function () {
		this.unlockable = this.game.checkRequirements(this, true);

		var unlocked = this.unlockable;
		var unlockRatio = this.get("unlockRatio");

		var prices = this.getPrices(true);
		if (this.unlockable && prices.length && unlockRatio) {
			unlocked = this.game.resPool.hasRes(prices, unlockRatio);
		}
		var disable = !this.unlockable || unlocked;

		this.set("unlocked", unlocked || this.unlockedNode.prevChecked, true);

		dojo.toggleClass(this.nameNode, "spoiler", !this.unlocked);
		this.game.toggleDisabled(this.unlockedNode, disable);
	},

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "unlocked", "val", "on", "stage", "jammed", "isAutomationEnabled"]);
		saveData.on = this.getOn();

		if (this.hasOwnProperty("isAutomationEnabled") && !this.showAutomation) {
			saveData.isAutomationEnabled = null;
		}

		return saveData;
	},

	load: function (saveBld) {
		this.set("val", num(saveBld.val));
		this.set("unlocked", saveBld.unlocked);
		this.set("on", num(saveBld.on));

		if (this.isAutomationEnabledNode) {
			this.set("isAutomationEnabled", Boolean(saveBld.isAutomationEnabled));
		}
		if (this.jammedNode) {
			this.set("jammed", saveBld.jammed);
		}
		if (this.stages) {
			this.set("stage", num(saveBld.stage));
		}
	}
});


});
