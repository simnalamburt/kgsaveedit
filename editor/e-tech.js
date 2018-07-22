/* global dojo, require, classes */

require([], function () {
"use strict";

dojo.declare("classes.KGSaveEdit.ScienceManager", [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	techData: [{
			name: "calendar",
			label: "Calendar",
			description: "Develops the ability to predict when the seasons will change. This ability is essential for advanced agriculture.",
			effectDesc: "Calendar provides a way of more precise time tracking",
			prices: [
				{name: "science", val: 30}
			],
			unlocked: true,
			// unlocks: {tech: ["agriculture"]},
			flavor: "What day is it again?"
		}, {
			name: "agriculture",
			label: "Agriculture",
			description: "The basis of all civilised life, Agriculture allows the working of land for food. Agriculture can significantly improve your food production.",
			effectDesc: "Unlocks Farmers and Barns",
			prices: [
				{name: "science", val: 100}
			],
			// unlocks: {tech: ["mining", "archery"], jobs: ["farmer"]},
			requires: {tech: ["calendar"]},
			flavor: "Best thing since sliced bread!"
		}, {
			name: "archery",
			label: "Archery",
			description: "Ranged weaponry known as a 'Bow'.",
			effectDesc: "Unlocks Hunters",
			prices: [
				{name: "science", val: 300}
			],
			// unlocks: {tech: ["animal"], jobs: ["hunter"]},
			requires: {tech: ["agriculture"]}
		}, {
			name: "mining",
			label: "Mining",
			description: "Mining develops the ability to extract mineral resources from the bowels of Cath.",
			effectDesc: "You can build Mines",
			prices: [
				{name: "science", val: 500}
			],
			// unlocks: {tech: ["metal"], upgrades: ["bolas"]},
			requires: {tech: ["agriculture"]},
			flavor: "Pickaxes are easier to hold with opposable thumbs"
		}, {
			name: "metal",
			label: "Metal Working",
			description: "The first metal-working technology that provides your civilisation with sturdy, durable tools.",
			effectDesc: "You can construct Smelters that convert ore into metal",
			prices: [
				{name: "science", val: 900}
			],
			// unlocks: {upgrades: ["huntingArmor"]},
			requires: {tech: ["mining"]}
		}, {
			name: "animal",
			label: "Animal Husbandry",
			description: "Domestication allows access to various animal resources via the pasture. Improves your food production.",
			effectDesc: "Unlocks Pastures",
			prices: [
				{name: "science", val: 500}
			],
			// unlocks: {tech: ["civil", "math", "construction"]},
			requires: {tech: ["archery"]}
		}, {
			name: "brewery",
			label: "Catnip Processing",
			description: "Catnip Processing is a non-mandatory technology which improves the process of converting catnip to catnip wood.",
			effectDesc: "Unlocks Catnip Enrichment.",
			prices: [
				{name: "science", val: 1200}
			],
			hidden: true // not used anymore
		}, {
			name: "civil",
			label: "Civil Service",
			description: "The creation of the first true state organ provides many benefits related to better management of your population.",
			effectDesc: "Unlocks detailed information about your population",
			prices: [
				{name: "science", val: 1500}
			],
			// unlocks: {tech: ["currency"]},
			requires: {tech: ["animal"]},
			flavor: "Specialists in Herding Cats"
		}, {
			name: "math",
			label: "Mathematics",
			description: "Mathematics is the most basic building block upon which all physical science is based. Improves scientific development.",
			effectDesc: "Allows construction of Academies, very efficient research buildings",
			prices: [
				{name: "science", val: 1000}
			],
			// unlocks: {upgrades: ["celestialMechanics"], tabs: ["stats"]},
			requires: {tech: ["animal"]},
			flavor: "Purr equals Meow times Paw to the square"
		}, {
			name: "construction",
			label: "Construction",
			description: "Construction represents the advancement of the study of masonry, primarily by adding iron and other metals to the builder's toolbox. Benefits hunting and base infrastructure.",
			effectDesc: "Allows your workers to construct the Lumber mill. Unlocks Composite Bows",
			prices: [
				{name: "science", val: 1300}
			],
			// unlocks: {tech: ["engineering"], upgrades: ["compositeBow", "advancedRefinement", "reinforcedSaw"]},
			requires: {tech: ["animal"]},
			flavor: "Making pillow forts smart!"
		}, {
			name: "engineering",
			label: "Engineering",
			description: "Engineering is the science (or art perhaps) of designing complex materials, structures, devices, and systems.",
			effectDesc: "Unlocks aqueducts",
			prices: [
				{name: "science", val: 1500}
			],
			// unlocks: {tech: ["writing"]},
			requires: {tech: ["construction"]}
		}, {
			name: "currency",
			label: "Currency",
			description: "Currency represents a certain amount of wealth. Can significantly boost your development in indirect ways.",
			effectDesc: "Unlocks gold and trade",
			prices: [
				{name: "science", val: 2200}
			],
			// unlocks: {upgrades: ["goldOre"]},
			requires: {tech: ["civil"]}
		}, {
			name: "writing",
			label: "Writing",
			description: "Writing is the art of recording information on material. Writing can influence general happiness and cultural progress of your civilization.",
			effectDesc: "Unlocks Amphitheatres",
			prices: [
				{name: "science", val: 3600}
			],
			// unlocks: {tech: ["philosophy", "machinery", "steel"], upgrades: ["register"], crafts: ["parchment"]},
			requires: {tech: ["engineering"]},
			flavor: "Writing uses less ink than pawprints"
		}, {
			name: "philosophy",
			label: "Philosophy",
			description: "Philosophy is the first abstract science developed by catkind. Philosophy is a basis of spiritual and cultural progress.",
			effectDesc: "Unlocks Temples",
			prices: [
				{name: "science", val: 9500}
			],
			// unlocks: {tech: ["theology"], crafts: ["compedium"]},
			requires: {tech: ["writing"]},
			flavor: "I purr, therefore I am"
		}, {
			name: "machinery",
			label: "Machinery",
			description: "Previous advances in metal working and science give birth to the concept of a machine, a device with multiple moving parts.\n" +
				"Machinery introduces a concept of automation which reduces routine operations",
			effectDesc: "Unlocks Steamworks, Crossbows, Printing press and Factory automation.",
			prices: [
				{name: "science", val: 15000}
			],
			// unlocks: {upgrades: ["printingPress", "factoryAutomation", "crossbow"]}
			requires: {tech: ["writing"]}
		}, {
			name: "steel",
			label: "Steel",
			description: "Development of the new Steel alloy advances further metal working. Benefits most of the aspects of development.",
			effectDesc: "Unlocks Coal and Steel production",
			prices: [
				{name: "science", val: 12000}
			],
			// unlocks: {upgrades: ["deepMining", "coalFurnace", "combustionEngine", "reinforcedWarehouses", "steelAxe", "steelArmor"], crafts: ["steel"]},
			requires: {tech: ["writing"]}
		}, {
			name: "theology",
			label: "Theology",
			description: "Theology is the study of religion. Religion is a key concept affecting cultural, scientific and industrial development.",
			effectDesc: "Unlocks religion",
			prices: [
				{name: "science",    val: 20000},
				{name: "manuscript", val: 35}
			],
			// unlocks: {tech: ["astronomy", "cryptotheology"], jobs: ["priest"]},
			requires: {tech: ["philosophy"]},
			upgrades: {buildings: ["temple"]},
			flavor: "What is that flaming ball in the sky anyway?"
		}, {
			name: "astronomy",
			label: "Astronomy",
			description: "Astronomy is the study of objects in space. Improves scientific development.",
			effectDesc: "Unlocks Observatory and Star charts",
			prices: [
				{name: "science",    val: 28000},
				{name: "manuscript", val: 65}
			],
			// unlocks: {tech: ["navigation"]},
			requires: {tech: ["theology"]}
		}, {
			name: "navigation",
			label: "Navigation",
			description: "Navigation allows serious advancements in sailing and shipbuilding technology. It should benefit economical development and can lead to discovery of new civilizations.<br>(Hint: You don't need to have all of this culture at once)",
			effectDesc: "Unlocks the construction of Trade Ships and overseas trade.",
			prices: [
				{name: "science",    val: 35000},
				{name: "manuscript", val: 100}
			],
			// unlocks: {tech: ["physics", "archeology", "architecture"], crafts: ["ship"], upgrades: ["caravanserai", "cargoShips", "astrolabe", "titaniumMirrors", "titaniumAxe"]},
			requires: {tech: ["astronomy"]}
		}, {
			name: "architecture",
			label: "Architecture",
			description: "Architecture allows construction of some new sophisticated structures.",
			effectDesc: "Unlocks Mints and Mansions.",
			prices: [
				{name: "science",   val: 42000},
				{name: "compedium", val: 10}
			],
			// unlocks: {tech: ["acoustics"]},
			requires: {tech: ["navigation"]},
			flavor: "Bigger, better cat towers!"
		}, {
			name: "physics",
			label: "Physics",
			description: "Physics is a study of laws of nature. Mostly improves your machinery effectiveness.",
			effectDesc: "Unlocks some useful upgrades.",
			prices: [
				{name: "science",   val: 50000},
				{name: "compedium", val: 35}
			],
			// unlocks: {tech: ["chemistry", "electricity", "metaphysics"], crafts: ["blueprint"], upgrades: ["pneumaticPress", "pyrolysis", "steelSaw"]},
			requires: {tech: ["navigation"]}
		}, {
			name: "metaphysics",
			label: "Metaphysics",
			description: "Metaphysics is a traditional branch of philosophy concerned with explaining the fundamental nature of being and the world that encompasses it.\nAbsolutely useless.",
			effectDesc: "Does nothing.",
			prices: [
				{name: "science",     val: 55000},
				{name: "unobtainium", val: 5}
			],
			requires: {tech: ["physics"]}
		}, {
			name: "chemistry",
			label: "Chemistry",
			description: "The discovery of Chemistry allows the deeper study and understanding of natural elements and their interaction. As a result new resources may be unlocked.",
			effectDesc: "Unlocks Oil and Oil Wells.",
			prices: [
				{name: "science",   val: 60000},
				{name: "compedium", val: 50}
			],
			// unlocks: {buildings: ["calciner", "oilWell"], upgrades: ["alloyAxe", "alloyArmor", "alloyWarehouses", "alloyBarns"], crafts: ["alloy"]},
			requires: {tech: ["physics"]}
		}, {
			name: "acoustics",
			label: "Acoustics",
			description: "Acoustics is the study of sound. Though not obviously useful, in a long run it may benefit civilizations thriving for cultural and religious development.",
			effectDesc: "Unlocks Chapels",
			prices: [
				{name: "science",   val: 60000},
				{name: "compedium", val: 60}
			],
			// unlocks: {buildings: ["chapel"], tech: ["drama"]},
			requires: {tech: ["architecture"]}
		}, {
			name: "drama",
			label: "Drama and Poetry",
			description: "Drama and poetry are both forms of artistic expression.\nImproves cultural progress.",
			effectDesc: "Unlocks Festivals and Cultural artifacts",
			prices: [
				{name: "science",   val: 90000},
				{name: "parchment", val: 5000}
			],
			requires: {tech: ["acoustics"]}
		}, {
			name: "archeology",
			label: "Geology",
			description: "Geology is the science comprising of the study of Cath, the rocks of which it is composed, and the processes by which they change. Can potentially benefit your mining industry.",
			effectDesc: "Unlocks Quarries and Geologists",
			prices: [
				{name: "science",   val: 65000},
				{name: "compedium", val: 65}
			],
			// unlocks: {tech: ["biology"], jobs: ["geologist"], upgrades:["geodesy"]},
			requires: {tech: ["navigation"]},
			flavor: "Different fossils of giant lizards were discovered. Apparently they all died in a sudden but inevitable betrayal."
		}, {
			name: "electricity",
			label: "Electricity",
			description: "Electricity unlocks a new way to automate production, benefiting the catkind in all different areas.",
			effectDesc: "Unlocks Magnetos",
			prices: [
				{name: "science",   val: 75000},
				{name: "compedium", val: 85}
			],
			// unlocks: {tech: ["industrialization"]},
			requires: {tech: ["physics"]},
			flavor: "Who knew running around on the carpet could generate such power?"
		}, {
			name: "biology",
			label: "Biology",
			description: "Biology deals with living organisms, their characteristics and their use in our society. Improves science and chemistry industry.",
			effectDesc: "Unlocks Bio Labs",
			prices: [
				{name: "science",   val: 85000},
				{name: "compedium", val: 100}
			],
			// unlocks: {tech: ["biochemistry"]},
			requires: {tech: ["archeology"]}
		}, {
			name: "biochemistry",
			label: "Biochemistry",
			description: "Improves your chemistry and biology-related technologies.",
			effectDesc: "Unlocks biofuel processing",
			prices: [
				{name: "science",   val: 145000},
				{name: "compedium", val: 500}
			],
			// unlocks: {tech: ["genetics"], upgrades: ["biofuel"]},
			requires: {tech: ["biology"]}
		}, {
			name: "genetics",
			label: "Genetics",
			description: "Technology that further improves upon biology and chemistry. Affects your food industry.",
			effectDesc: "Unlocks genetic engineering(?)",
			prices: [
				{name: "science",   val: 190000},
				{name: "compedium", val: 1500}
			],
			// unlocks: {upgrades: ["unicornSelection", "gmo"]},
			requires: {tech: ["biochemistry"]}
		}, {
			name: "industrialization",
			label: "Industrialization",
			description: "Industrialization represents the concept of mass-producing materials, from food products to machine parts.",
			effectDesc: "Unlocks Advanced Automation and Barges",
			prices: [
				{name: "science",   val: 100000},
				{name: "blueprint", val: 25}
			],
			// unlocks: {tech: ["mechanization", "metalurgy", "combustion"], upgrades: ["barges", "advancedAutomation", "logistics"]},
			requires: {tech: ["electricity"]}
		}, {
			name: "mechanization",
			label: "Mechanization",
			description: "Mechanization provides a lot of ways to automate redundant tasks; hence improving craft, oil pumps and construction technologies.",
			effectDesc: "Unlocks Factories, Pumpjacks and Concrete",
			prices: [
				{name: "science",   val: 115000},
				{name: "blueprint", val: 45}
			],
			// unlocks: {tech: ["electronics"], crafts: ["concrate"], upgrades: ["pumpjack", "strenghtenBuild"], jobs: ["engineer"]},
			requires: {tech: ["industrialization"]}
		}, {
			name: "metalurgy",
			label: "Metallurgy",
			description: "Metallurgy improves the process of metal production, benefiting Smelters and Calciners",
			effectDesc: "Unlocks Electrolytic Smelting and Oxidation",
			prices: [
				{name: "science",   val: 125000},
				{name: "blueprint", val: 60}
			],
			// unlocks: {upgrades: ["electrolyticSmelting", "oxidation", "miningDrill"]},
			requires: {tech: ["industrialization"]}
		}, {
			name: "combustion",
			label: "Combustion",
			description: "Combustion provides a number of ways to improve old coal-based automation technologies, such as Steamworks.",
			effectDesc: "Unlocks Offset Printing, Oil Refinery and Fuel Injection",
			prices: [
				{name: "science",   val: 115000},
				{name: "blueprint", val: 45}
			],
			// unlocks: {upgrades: ["offsetPress", "fuelInjectors", "oilRefinery"], tech: ["ecology"]},
			requires: {tech: ["industrialization"]}
		}, {
			name: "ecology",
			label: "Ecology",
			description: "Ecology is a technology primary focused on the search for new cheap and safe energy sources.",
			effectDesc: "Unlocks Solar Plants",
			prices: [
				{name: "science",   val: 125000},
				{name: "blueprint", val: 55}
			],
			// unlocks: {stages: [{bld:"pasture", stage:1}]},
			requires: {tech: ["combustion"]}
		}, {
			name: "electronics",
			label: "Electronics",
			description: "Electronics unlocks some high level upgrades mainly related to science",
			effectDesc: "Unlocks Broadcast Towers, CAD Systems, Refrigeration and SETI",
			prices: [
				{name: "science",   val: 135000},
				{name: "blueprint", val: 70}
			],
			// unlocks: {
			// 	tech: ["nuclearFission", "rocketry", "robotics"],
			// 	upgrades: ["cadSystems", "refrigeration", "seti", "factoryLogistics", "factoryOptimization", "internet"],]
			// 	stages: [{bld: "amphitheatre", stage: 1}]
			// },
			requires: {tech: ["mechanization"]}
		}, {
			name: "robotics",
			label: "Robotics",
			description: "Robotics improves automated structures like Calciners",
			effectDesc: "Unlocks Steel Plants, Hydro Plants, Tankers and Rotary Kilns",
			prices: [
				{name: "science",   val: 140000},
				{name: "blueprint", val: 80}
			],
			// unlocks: {
			// 	tech: ["ai"],
			// 	upgrades: ["steelPlants", "rotaryKiln", "assistance", "factoryRobotics"],
			// 	crafts: ["tanker"],
			// 	stages: [{bld: "aqueduct", stage: 1}]
			// },
			requires: {tech: ["electronics"]}
		}, {
			name: "ai",
			label: "Artificial Intelligence",
			description: "Artificial Intelligence is an attempt to create machine capable of reasoning and performing cognitive tasks.",
			effectDesc: "Unlocks Neural Networks and AI Core",
			prices: [
				{name: "science",   val: 250000},
				{name: "blueprint", val: 150}
			],
			// unlocks: {upgrades: ["neuralNetworks", "aiEngineers"], buildings: ["aiCore"], tech: ["quantumCryptography"]},
			requires: {tech: ["robotics"]}
		}, {
			name: "quantumCryptography",
			label: "Quantum Cryptography",
			description: "TBD",
			effectDesc: "TBD",
			prices: [
				{name: "science", val: 1250000},
				{name: "relic",   val: 1024}
			],
			// unlocks: {tech: ["blackchain"]},
			requires: {tech: ["ai"]}
		}, {
			name: "blackchain",
			label: "Blackchain",
			description: "All cool cats are mining this, so I think it is some kind of mineral",
			effectDesc: "Unlocks cryptomining and blackcoin exchange",
			prices: [
				{name: "science", val: 5000000},
				{name: "relic",   val: 5000}
			],
			// unlocks: {},
			requires: {tech: ["quantumCryptography"]}
		}, {
			name: "nuclearFission",
			label: "Nuclear Fission",
			description: "Nuclear Fission unlocks Nuclear Reactors and nuclear-related upgrades",
			effectDesc: "Unlocks Nuclear Reactors and Nuclear Vessel",
			prices: [
				{name: "science",   val: 150000},
				{name: "blueprint", val: 100}
			],
			// unlocks: {tech: ["nanotechnology", "particlePhysics"], upgrades: ["reactorVessel", "nuclearSmelters"]},
			requires: {tech: ["electronics"]}
		}, {
			name: "rocketry",
			label: "Rocketry",
			description: "Required for space exploration",
			effectDesc: "Unlocks construction of spaceships",
			prices: [
				{name: "science",   val: 175000},
				{name: "blueprint", val: 125}
			],
			// unlocks: {tech: ["sattelites", "oilProcessing"], tabs: ["space"], upgrades: ["oilDistillation"]},
			requires: {tech: ["electronics"]}
		}, {
			name: "oilProcessing",
			label: "Oil Processing",
			description: "Unlocks advanced options of oil processing",
			effectDesc: "Unlocks kerosene and factory processing",
			prices: [
				{name: "science",   val: 215000},
				{name: "blueprint", val: 150}
			],
			// unlocks: {crafts: ["kerosene"], upgrades: ["factoryProcessing"]},
			requires: {tech: ["rocketry"]}
		}, {
			name: "sattelites",
			label: "Satellites",
			description: "Satellites are machines that permanently orbit the planet outside its atmosphere",
			effectDesc: "Unlocks deployment of satellites",
			prices: [
				{name: "science",   val: 190000},
				{name: "blueprint", val: 125}
			],
			// unlocks: {tech: ["orbitalEngineering" ], upgrades: ["photolithography"]},
			requires: {tech: ["rocketry"]},
			flavor: "Spreading cat videos at the speed of light"
		}, {
			name: "orbitalEngineering",
			label: "Orbital Engineering",
			description: "Orbital Engineering allows kitten civilization to develop advanced space projects.",
			effectDesc: "Unlocks Space Stations and the Hubble Telescope",
			prices: [
				{name: "science",   val: 250000},
				{name: "blueprint", val: 250}
			],
			// unlocks: {
			// 	tech: ["exogeology", "thorium"],
			// 	upgrades: ["hubbleTelescope", "satelliteRadio", "astrophysicists", "solarSatellites", "spaceEngineers"]
			// },
			requires: {tech: ["sattelites"]}
		}, {
			name: "thorium",
			label: "Thorium",
			description: "Thorium is an extremely radioactive and energy efficient isotope that can be used in various space era upgrades.",
			effectDesc: "Unlocks Thorium Reactors",
			prices: [
				{name: "science",   val: 375000},
				{name: "blueprint", val: 375}
			],
			// unlocks: {crafts: ["thorium"], upgrades: ["thoriumReactors", "thoriumEngine"]},
			requires: {tech: ["orbitalEngineering"]}
		}, {
			name: "exogeology",
			label: "Exogeology",
			description: "Exogeology or Planetary Geology studies extraterrestrial metals and minerals.",
			effectDesc: "Unlocks various Unobtainium upgrades",
			prices: [
				{name: "science",   val: 275000},
				{name: "blueprint", val: 250}
			],
			// unlocks: {tech: ["advExogeology"], upgrades: ["unobtainiumReflectors", "unobtainiumHuts", "unobtainiumDrill", "hydroPlantTurbines", "storageBunkers"]},
			requires: {tech: ["orbitalEngineering"]}
		}, {
			name: "advExogeology",
			label: "Advanced Exogeology",
			description: "Advanced Exogeology studies new methods of unobtainium processing",
			effectDesc: "Unlocks Eludium and Eludium upgrades",
			prices: [
				{name: "science",   val: 325000},
				{name: "blueprint", val: 350}
			],
			// unlocks: {upgrades: ["eludiumCracker", "eludiumReflectors", "eludiumHuts", "mWReactor" /*, "eludiumDrill"*/], crafts: ["eludium"]},
			requires: {tech: ["exogeology"]}
		}, {
			name: "nanotechnology",
			label: "Nanotechnology",
			description: "Nanotechnology is manipulation of matter on an atomic, molecular, and sub-molecular scale. Can potentially improve your energy and resource production.",
			effectDesc: "Unlocks Nanosuits, Augmentations and PVC",
			prices: [
				{name: "science",   val: 200000},
				{name: "blueprint", val: 150}
			],
			// unlocks: {tech: ["superconductors"], upgrades: ["augumentation", "nanosuits", "photovoltaic", "fluidizedReactors"]},
			requires: {tech: ["nuclearFission"]}
		}, {
			name: "superconductors",
			label: "Superconductors",
			description: "Superconductors are exotic materials that help to optimize energy efficiency of different technologies",
			effectDesc: "Unlocks Cold Fusion and Space Manufacturing",
			prices: [
				{name: "science",   val: 225000},
				{name: "blueprint", val: 175}
			],
			// unlocks: {upgrades: ["coldFusion", "spaceManufacturing"], tech: ["antimatter"]},
			requires: {tech: ["nanotechnology"]}
		}, {
			name: "antimatter",
			label: "Antimatter",
			description: "Antimatter provides some advanced sources of energy and generally benefits scientific advancement",
			effectDesc: "Unlocks Antimatter Reactors, AM-Drive, AM-Fission and Antimatter Bases",
			prices: [
				{name: "science", val: 500000},
				{name: "relic",   val: 1}
			],
			// unlocks: {upgrades: ["amReactors", "amBases", "amDrive", "amFission"], tech: ["terraformation"]},
			requires: {tech: ["superconductors"]}
		}, {
			name: "terraformation",
			label: "Terraformation",
			description: "Terraformation technology focuses on use of the antimatter to change the climate of the Cath System exoplanets",
			effectDesc: "Unlocks Terraforming Stations",
			prices: [
				{name: "science", val: 750000},
				{name: "relic",   val: 5}
			],
			// unlocks: {tech: ["hydroponics"], space: [{planet:"yarn", bld: "terraformingStation"}]},
			requires: {tech: ["antimatter"]}
		}, {
			name: "hydroponics",
			label: "Hydroponics",
			description: "A pinnacle of space engineering, hydroponic provides new sources of food supply for our distant colonies.",
			effectDesc: "Unlocks Yarn Hydroponics",
			prices: [
				{name: "science", val: 1000000},
				{name: "relic",   val: 25}
			],
			// unlocks: {space: [{planet:"yarn", bld: "hydroponics"}]},
			requires: {tech: ["terraformation"]}
		}, {
			name: "particlePhysics",
			label: "Particle Physics",
			description: "Particle physics takes us one step deeper into the understanding of the nature of matter and energy than its ancestor, Nuclear Physics",
			effectDesc: "Unlocks Particle Accelerators, Railguns and Enriched Uranium",
			prices: [
				{name: "science",   val: 185000},
				{name: "blueprint", val: 135}
			],
			// unlocks: {tech: ["chronophysics", "dimensionalPhysics"], upgrades: ["enrichedUranium", "railgun"]},
			requires: {tech: ["nuclearFission"]}
		}, {
			name: "dimensionalPhysics",
			label: "Dimensional Physics",
			description: "Dimensional Physics explores the concepts of space and time",
			effectDesc: "Unlocks Energy Rifts and LHC",
			prices: [
				{name: "science", val: 235000}
			],
			// unlocks: {upgrades: ["energyRifts", "lhc"]},
			requires: {tech: ["particlePhysics"]}
		}, {
			name: "chronophysics",
			label: "Chronophysics",
			description: "Chronophysics studies the nature of time and possibilities of temporal manipulations",
			effectDesc: "Unlocks Chronospheres, Flux Reactors and Stasis Chambers",
			prices: [
				{name: "science",     val: 250000},
				{name: "timeCrystal", val: 5}
			],
			// unlocks: {tech: ["tachyonTheory"], upgrades: ["stasisChambers", "fluxCondensator"]},
			requires: {tech: ["particlePhysics"]}
		}, {
			name: "tachyonTheory",
			label: "Tachyon Theory",
			description: "Tachyonic particles are hypothetical particles that always move faster than light.",
			effectDesc: "Unlocks Tachyon Accelerators and Chronoforge",
			prices: [
				{name: "science",     val: 750000},
				{name: "timeCrystal", val: 25},
				{name: "relic",       val: 1}
			],
			// unlocks: {tech: ["voidSpace"], upgrades: ["tachyonAccelerators", "chronoforge", "chronoEngineers"]},
			requires: {tech: ["chronophysics"]}
		}, {
			name: "cryptotheology",
			label: "Cryptotheology",
			description: "Cryptotheology applies the most arcane and unorthodox methods of theology in order to answer the fundamental questions of the universe and reality.",
			effectDesc: "Unlocks Relic Station and Cryptotheology tree",
			prices: [
				{name: "science", val: 650000},
				{name: "relic",   val: 5}
			],
			// unlocks: {upgrades: ["relicStation"]},
			requires: {tech: ["theology"]}
		}, {
			name: "voidSpace",
			label: "Void Space",
			description: "Under the void",
			effectDesc: "Unlocks Cryochambers",
			prices: [
				{name: "science",     val: 800000},
				{name: "timeCrystal", val: 30},
				{name: "void",        val: 100}
			],
			// unlocks: {tech: ["paradoxalKnowledge"], upgrades: ["voidAspiration"], voidSpace: ["cryochambers"], challenges: ["atheism"]},
			requires: {tech: ["tachyonTheory"]}
		}, {
			name: "paradoxalKnowledge",
			label: "Paradox Theory",
			description: "TBD",
			effectDesc: "Unlocks Chronocontrol and Resource Retrieval",
			prices: [
				{name: "science",     val: 1000000},
				{name: "timeCrystal", val: 40},
				{name: "void",        val: 250}
			],
			// unlocks: {chronoforge: ["ressourceRetrieval"], voidSpace: ["chronocontrol", "voidResonator"], upgrades: ["distorsion"]},
			requires: {tech: ["voidSpace"]}
	}],

	tabName: "Science",
	getVisible: function () {
		return this.game.bld.get("library").owned();
	},

	techs: null,
	techsByName: null,

	hideResearched: false,

	constructor: function () {
		this.registerMetaItems(this.techData, classes.KGSaveEdit.ScienceMeta, "techs");
		this.meta.push(this.techs);
	},

	renderTabBlock: function () {
		var div = dojo.create("div", {class: "bottom-margin"}, this.tabBlockNode);
		this.game._createCheckbox("Hide researched techs", div, this, "hideResearched");

		this.techsBlock = dojo.create("table", {
			id: "techsBlock",
			class: "bottom-margin",
			innerHTML: '<tr><th colspan="2">Techs</th></tr>'
		}, this.tabBlockNode);
	},

	render: function () {
		for (var i = 0, len = this.techs.length; i < len; i++) {
			var tech = this.techs[i];
			tech.render();
			dojo.place(tech.domNode, this.techsBlock);
		}
	},

	update: function () {
		this.game.callMethods(this.techs, "update", this.hideResearched);
	},

	get: function (name) {
		return this.techsByName[name];
	},

	save: function (saveData) {
		saveData.science = {
			techs: this.game.filterMetadata(this.techs, ["name", "unlocked", "researched"]),
			hideResearched: this.hideResearched
		};
	},

	load: function (saveData) {
		if (saveData.science) {
			this.game.setCheckbox(this.hideResearchedNode, saveData.science.hideResearched);
			this.loadMetadata(saveData, "science.techs", "get", null, true);
		}
	}
});


dojo.declare("classes.KGSaveEdit.ScienceMeta", classes.KGSaveEdit.UpgradeMeta, {
	constructor: function () { },

	getDescription: function () {
		if (this.researched) {
			return this.description + "<br>Effect: " + this.effectDesc;
		}
		return this.description;
	},

	getPrices: function () {
		var prices = this.prices ? dojo.clone(this.prices) : [];
		return this.game.village.getEffectLeader("scientist", prices);
	}
});

});
