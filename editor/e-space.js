/* global dojo, require, classes, num */

require([], function () {
"use strict";

dojo.declare("classes.KGSaveEdit.SpaceManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
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
			requires: {spaceMission: ["orbitalLaunch"]},
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
			requires: {spaceMission: ["moonMission"]},
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
			requires: {spaceMission: ["moonMission"]},
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
			requires: {spaceMission: ["duneMission"]},
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
			requires: {spaceMission: ["piscineMission"]},
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
			requires: {spaceMission: ["terminusMission"]},
			upgradable: false
		}, {
			name: "rorschachMission",
			label: "Rorschach",
			description: "Rorschach is the biggest comet near Helios.",
			prices: [
				{name: "starchart", val: 15000},
				{name: "titanium",  val: 80000},
				{name: "science",   val: 500000},
				{name: "kerosene",  val: 25000}
			],
			// unlocks: {spaceMission: ["centaurusSystemMission"]},
			requires: {spaceMission: ["kairoMission"]},
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
			// unlocks: {planet: ["yarn"], spaceMission: ["umbraMission"]},
			requires: {spaceMission: ["heliosMission"]},
			upgradable: false
		}, {
			name: "umbraMission",
			label: "Umbra Mission",
			description: "Umbra is a supermassive black hole in the hearth of the Helios system",
			prices: [
				{name: "starchart", val: 25000},
				{name: "science", 	val: 500000},
				{name: "kerosene", 	val: 25000},
				{name: "thorium",   val: 15000}
			],
			// unlocks: {planet: ["umbra"], spaceMission: ["charonMission"]},
			requires: {spaceMission: ["yarnMission"]},
			upgradable: false
		}, {
			name: "charonMission",
			label: "Charon Mission",
			description: "Charon is small, incredibly dense and distant dwarf planet on the far edge of the Helios system. It is so hostile and barren that it is sometimes referred as 'The Gates of Death'",
			prices: [
				{name: "starchart", val: 75000},
				{name: "science", 	val: 750000},
				{name: "kerosene", 	val: 35000},
				{name: "thorium",   val: 35000}
			],
			// unlocks: {planet: ["charon"]},
			requires: {spaceMission: ["umbraMission"]},
			upgradable: false
		}, {
			name: "centaurusSystemMission",
			label: "Centaurus System Mission",
			description: "Centaurus System is a warm faraway star system.",
			prices: [
				{name: "starchart", val: 100000},
				{name: "titanium",  val: 40000},
				{name: "science",   val: 800000},
				{name: "kerosene",  val: 50000},
				{name: "thorium",   val: 50000}
			],
			// unlocks: {planet: ["centaurusSystem"], spaceMission: ["furthestRingMission"]},
			requires: {spaceMission: ["rorschachMission"]},
			upgradable: false
		}, {
			name: "furthestRingMission",
			label: "Furthest Ring",
			description: "The end of the universe.",
			prices: [
				{name: "starchart", val: 500000},
				{name: "science",   val: 1250000},
				{name: "kerosene",  val: 75000},
				{name: "thorium",   val: 75000}
			],
			// unlocks: {planet: ["furthestRing"]}
			requires: {spaceMission: ["centaurusSystemMission"]},
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
			requires: {spaceMission: ["orbitalLaunch"]}
		}, {
			name: "moon",
			label: "Moon",
			routeDays: 30,
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
					action: function (self, game) {
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
						var effects = {
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

						if (game.workshop.get("aiBases").researched) {
							for (var key in effects) {
								if (key !== "energyConsumption") {
									effects[key] *= 1 + game.bld.get("aiCore").on * 0.1;
								}
							}
						}
						self.effects = effects;
					}
			}],
			requires: {spaceMission: ["moonMission"]}
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
				}, {
					name: "spiceRefinery",
					label: "Spice Refinery",
					description: "Refines the sand of the Dune into a highly psychoactive substance known as 'Spice'.",
					prices: [
						{name: "starchart", val: 500},
						{name: "alloy",     val: 500},
						{name: "science",   val: 75000},
						{name: "kerosene",  val: 125}
					],
					priceRatio: 1.15,
					effects: {
						"spicePerTickAutoprodSpace": 0
					},
					calculateEffects: function (self) {
						self.effects = {
							"spicePerTickAutoprodSpace": 0.025
						};
					}
				}],
				requires: {spaceMission: ["duneMission"]}
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
			requires: {spaceMission: ["piscineMission"]}
		}, {
			name: "helios",
			label: "Helios",
			routeDays: 1200,
			buildings: [{
					name: "sunlifter",
					label: "Sunlifter",
					description: "Generates antimatter once per year. Inactive if energy production is negative",
					prices: [
						{name: "science",  val: 500000},
						{name: "eludium",  val: 225},
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
					priceRatio: 1.125,
					togglable: true,
					effects: {
						"energyConsumption": 0,
						"antimatterMax": 0
					},
					calculateEffects: function (self, game) {
						var effects = {
							"antimatterMax":    100 * (1 + game.space.getBuilding("heatsink").val * 0.02),
							"energyConsumption": 50 * (1 + game.space.getBuilding("heatsink").val * 0.02)
						};

						if (game.challenges.currentChallenge === "energy") {
							effects["energyConsumption"] *= 2;
						}
						self.effects = effects;
					}
				}, {
					name: "heatsink",
					label: "Heatsink",
					description: "A heat dissipation system. Every Heatsink will increase the power consumption of Containment Chamber by 1% and antimatter storage capacity by 2%",
					prices: [
						{name: "science",  val: 125000},
						{name: "thorium",  val: 12500},
						{name: "relic",    val: 1},
						{name: "kerosene", val: 5000}
					],
					priceRatio: 1.12,
					upgrades: {spaceBuilding: ["containmentChamber"]}
				}, {
					name: "sunforge",
					label: "Sunforge",
					description: "Uses the heat of the sun to smelt materials into supercondensed plasma. Every level of sunforge improves the storage space of your base metals by 1%",
					prices: [
						{name: "science", val: 100000},
						{name: "relic",   val: 1},
						{name: "kerosene", val: 1250},
						{name: "antimatter", val: 250}
					],
					priceRatio: 1.12,
					effects: {
						"baseMetalMaxRatio": 0.01
					}
			}],
			requires: {spaceMission: ["heliosMission"]}
		}, {
			name: "terminus",
			label: "T-Minus",
			routeDays: 2500,
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
						"oilMax":         7500,
						"unobtainiumMax": 750
					};
				}
			}],
			requires: {spaceMission: ["terminusMission"]}
		}, {
			name: "kairo",
			label: "Kairo",
			routeDays: 5000,
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
				action: function (self, game) {
					var rPerDay = game.getEffect("beaconRelicsPerDay");
					var rrBoost = (1 + game.getEffect("relicRefineRatio") * game.religion.getZU("blackPyramid").val * 0.1);	//10% per BP * BN combo

					//lol
					var amMax = game.resPool.get("antimatter").maxValue;
					if (amMax < 5000) {
						rrBoost = rrBoost * (amMax / 5000);
						//todo: consider boosting relic stations is over 5000
					}

					var entBoost = 1 + game.space.getBuilding("entangler").effects["hashRateLevel"] * 0.25;	//25% per entangler hashrate

					self.effects = {
						"starchartPerTickBaseSpace": 0.025,
						"scienceMax":                25000 * (1 + game.getEffect("spaceScienceRatio")),
						"relicPerDay":               rPerDay * rrBoost * entBoost
					};
				}
			}],
			requires: {spaceMission: ["kairoMission"]}
		}, {
			name: "yarn",
			label: "Yarn",
			routeDays: 3800,
			buildings: [{
					name: "terraformingStation",
					label: "Terraforming Station",
					description: "Explode a charge of antimatter to melt yarn ice and throw oxygen into the atmosphere",
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
			requires: {spaceMission: ["yarnMission"]}
		}, {
			name: "umbra",
			label: "Umbra",
			routeDays: 7500,
			buildings: [{
				name: "hrHarvester",
				label: "HR Harvester",
				description: "Hawking Radiation Harvester. Operates on the energy of the black hole evaporation. Every HR Harvester generates a 1W of energy which slowly increases over time.",
				prices: [
					{name: "relic",      val: 25},
					{name: "antimatter", val: 1250}
				],
				priceRatio: 1.15,
				effects: {
					"energyProduction": 1
				},
				calculateEffects: function (self, game) {
					var yearBonus = game.calendar.darkFutureYears();
					if (yearBonus < 0) {
						yearBonus = 0;
					}

					self.effects["energyProduction"] =
						1 * (1 + game.getTriValue(yearBonus, 0.075) * 0.01) *
							(1 + game.getEffect("umbraBoostRatio"));
				}
			}],
			requires: {spaceMission: ["umbraMission"]}
		}, {
			name: "charon",
			label: "Charon",
			routeDays: 25000,
			buildings: [{
				name: "entangler",
				label: "Entanglement St.",
				description: "Entanglement Station generates a set of entangled particles aka qbits for your quantum computing system. This process requires an enormous amount of processing power, but let's you perform a cryptographic attack on elder encryption algorithms.",
				prices: [
					{name: "relic",      val: 1250},
					{name: "antimatter", val: 5250},
					{name: "eludium",    val: 5000}
				],
				priceRatio: 1.15,
				requires: {tech: ["quantumCryptography"]},
				effects: {
					"energyConsumption": 25,
					"gflopsConsumption": 0.1,
					"hashRateLevel": 0
				},
				action: function (self, game) {
					var gflopsPerTick = self.effects.gflopsConsumption * self.on;
					var gflops = game.resPool.get("gflops").value;
					if (gflops < gflopsPerTick && gflops > 0) {
						gflopsPerTick = gflops;
					} else if (gflops == 0) {
						return;
					}

					game.resPool.addResEvent("gflops", -gflopsPerTick);
					game.resPool.addResEvent("hashrates", gflopsPerTick);

					var hr = game.resPool.get("hashrates").value;
					var difficulty = 1000;
					var rate = 1.6;

					self.effects.hashrate = hr;
					self.effects.nextHashLevelAt = difficulty * Math.pow(rate, self.effects.hashRateLevel + 1);
					self.effects.hrProgress = hr / (difficulty * Math.pow(rate, self.effects.hashRateLevel + 1));
					if (hr > difficulty) {
						self.effects.hashRateLevel = Math.floor(Math.log(hr / difficulty) / Math.log(rate));
					} else {
						self.effects.hashRateLevel = 0;
					}
					self.effects.gflopsConsumption = 0.1;
				}
			}],
			requires: {spaceMission: ["charonMission"]}
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
				requires: {tech: ["terraformation"]},
				effects: {
					"energyProduction": 0
				},
				calculateEffects: function (self) {
					self.effects = {
						"energyProduction": 25
					};
				}
			}],
			requires: {spaceMission: ["centaurusSystemMission"]}
		}, {
			name: "furthestRing",
			label: "Furthest Ring",
			routeDays: 725000000,
			buildings: [
				//TBD
			],
			requires: {spaceMission: ["furthestRingMission"]}
	}],

	tabName: "Space",
	tabBlockClass: "shortInt",
	getVisible: function () {
		return this.game.science.get("rocketry").owned();
	},

	programs: null,
	planets: null,
	planetsByName: null,
	allPrograms: null,
	allProgramsByName: null,

	hideResearched: false,

	constructor: function () {
		this.programs = [];

		this.registerMetaItems(this.programData, classes.KGSaveEdit.ProgramMeta, "allPrograms", function (program) {
			this.programs.push(program);
		});

		this.registerMetaItems(this.planetData, classes.KGSaveEdit.GenericItem, "planets", function (planet) {
			planet.unlocked = false;
			planet.reached = false;
			planet.routeDaysMax = num(planet.routeDays);

			var bld = planet.buildings || [];
			planet.buildings = [];
			this.registerMetaItems(bld, classes.KGSaveEdit.ProgramMeta, "allPrograms", function (program) {
				program.planet = planet;
				planet.buildings.push(program);
			});

			if (planet.requires && planet.requires.spaceMission) {
				var mission = this.getProgram(planet.requires.spaceMission[0]);
				if (mission) {
					planet.missionMeta = mission;
					mission.planetMeta = planet;
				}
			}
		});
	},

	getProgram: function (name) {
		return this.allProgramsByName[name];
	},

	getBuilding: function (name) {
		return this.allProgramsByName[name];
	},

	getPlanet: function (name) {
		return this.planetsByName[name];
	},

	getEffect: function (name) {
		var totalEffect = this.getEffectCached(name);

		if (name === "spaceRatio" && this.game.resPool.energyCons > this.game.resPool.energyProd) {
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
		var div = dojo.create("div", {class: "bottom-margin"}, this.tabBlockNode);
		this.game._createCheckbox("Hide complete missions", div, this, "hideResearched");

		this.programsBlock = dojo.create("table", {
			id: "programsBlock",
			class: "bottom-margin"
		}, this.tabBlockNode);

		this.planetsBlock = dojo.create("table", {id: "planetsBlock"}, this.tabBlockNode);
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

			if (i > 0) {
				dojo.create("tr", {"colspan": 2, innerHTML: "&nbsp;"}, this.planetsBlock);
			}

			var tr = dojo.create("tr", {
				class: "planet",
				innerHTML: '<td class="nameNode">' + (planet.label || planet.name) + '</td><td></td>'
			}, this.planetsBlock);

			planet.nameRow = tr;
			planet.nameNode = tr.children[0];

			var span = dojo.create("span", {
				class: "planetRouteDaysSpan",
				innerHTML: "Flight time &nbsp;"
			}, tr.children[1]);

			var input = this.game._createInput({}, span, planet, "routeDays");
			input.parseFn = function (value) {
				return Math.min(value, this.metaObj.routeDaysMax);
			};

			dojo.place(document.createTextNode(" "), span);

			planet.routeDaysETANode = dojo.create("span", null, span);

			for (var j = 0, bldlen = planet.buildings.length; j < bldlen; j++) {
				program = planet.buildings[j];
				program.render();
				dojo.place(program.domNode, this.planetsBlock);
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
				dojo.toggleClass(planet.nameNode, "spoiler", !planet.unlocked);

				var eta = "";
				if (planet.unlocked && planet.routeDays > 0) {
					eta = "&nbsp; |&nbsp; ETA: " + this.game.toDisplayDays(Math.round(planet.routeDays / routeSpeed));
				}
				planet.routeDaysETANode.innerHTML = eta;
			}
		}
		this.game.callMethods(this.allPrograms, "update");
	},

	save: function (saveData) {
		var planets = this.game.filterMetadata(this.planets, ["name", "buildings", "reached", "unlocked", "routeDays"]);

		for (var i = 0; i < planets.length; i++) {
			var planet = planets[i];
			if (planet.buildings) {
				planet.buildings = this.game.mapMethods(planet.buildings, "save");
			}
		}

		saveData.space = {
			programs: this.game.mapMethods(this.programs, "save"),
			planets: planets,
			hideResearched: this.hideResearched
		};
	},

	load: function (saveData) {
		if (!saveData.space) {
			return;
		}

		this.loadMetadata(saveData, "space.programs", "getProgram", null, true);

		this.loadMetadata(saveData, "space.planets", "getPlanet", function (planet, savePlanet) {
			planet.reached = savePlanet.reached;
			// planet.unlocked = savePlanet.unlocked;
			var routeDays = savePlanet.routeDays;
			if (typeof routeDays === "undefined") {
				routeDays = planet.routeDaysMax;
			}
			planet.set("routeDays", num(routeDays));

			this.loadMetadata(saveData, "space.planets." + planet.name + ".buildings", "getBuilding", null, true);
		}, true);

		this.set("hideResearched", saveData.space.hideResearched);
	}
});


dojo.declare("classes.KGSaveEdit.ProgramMeta", classes.KGSaveEdit.MetaItem, {
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
		var paren = " (" + this.val + ")";
		if (this.upgradable) {
			if (this.togglable) {
				paren = " (" + this.getOn() + "/" + this.val + ")";
			}
		} else {
			if (this.getOn() > 0) {
				paren = " (complete)";
			} else {
				paren = " (current)";
			}
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
		if (!this.upgradable) {
			return this.val && (!this.planetMeta || this.planetMeta.reached) ? 1 : 0;
		} else if (!this.togglable) {
			return this.val;
		}
		return Math.min(this.on, this.val) || 0;
	},

	render: function () {
		this.domNode = dojo.create("tr", {
			class: "program",
			innerHTML: '<td class="nameNode">' + (this.label || this.name) + "</td><td></td>"
		});
		this.nameNode = this.domNode.children[0];

		this.onNodeSpan = dojo.create("span", {innerHTML: " / "}, this.domNode.children[1]);

		this.game._createInput({
			class: "integerInput ownedInput",
			title: "Number of active programs"
		}, this.onNodeSpan, this, "on", "first");

		this.game._createValInput({
			title: "Number of programs"
		}, this.domNode.children[1], this);

		if (!this.planet) {
			var input = this.game._createCheckbox("Unlocked", this.domNode.children[1], this, "unlocked");
			this.unlockedLabel = input.label;

			input = this.game._createCheckbox("Launched", this.domNode.children[1], this);
			this.launchedNode = input.cbox;
			input.cbox.handler = function () {
				var val = num(this.checked);
				this.metaObj.set("val", val);
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
			unlocked = this.planet.reached && req;
			spoiler = !unlocked;
		} else {
			dojo.toggleClass(this.valNode, "hidden", !this.upgradable);
			dojo.toggleClass(this.launchedLabel, "hidden", this.upgradable);

			dojo.toggleClass(this.domNode, "hidden",
				this.game.space.hideResearched && !this.upgradable && this.owned());
		}
		this.unlocked = unlocked;
		dojo.toggleClass(this.nameNode, "spoiler", spoiler);

		dojo.toggleClass(this.nameNode, "btnEnabled", this.togglable && this.getOn() > 0);
		dojo.toggleClass(this.onNodeSpan, "hidden", !this.upgradable || !this.togglable);

		this.updateEnabled();

		if (this.calculateEffects) {
			this.calculateEffects(this, this.game);
			this.game.calendar.cycleEffectsBasics(this.effects, this.name);
		}
		if (this.action && this.val > 0) {
			var amt = this.action(this, this.game);
			if (typeof amt !== "undefined") {
				this.lackResConvert = amt !== 1 && this.getOn() !== 0;
			}
			this.game.calendar.cycleEffectsBasics(this.effects, this.name);
		}
	},

	save: function () {
		var saveData = this.game.filterMetaObj(this, ["name", "val", "on", "unlocked"]);
		saveData.on = this.getOn();
		return saveData;
	},

	load: function (saveData) {
		this.set("val", num(saveData.val));
		this.set("on", num(saveData.on));
		this.set("unlocked", Boolean(saveData.unlocked));

		if (this.launchedNode) {
			this.game.setCheckbox(this.launchedNode, this.val > 0, null, true);
		}
	}
});

});
