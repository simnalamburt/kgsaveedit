/*global dojo, require, classes, num*/

require([], function () {
"use strict";

dojo.declare('classes.KGSaveEdit.UpgradeMeta', classes.KGSaveEdit.MetaItem, {
	name: 'Undefined',
	unlocked: false,
	researched: false,

	domNode: null,

	constructor: function () { },

	getEffect: function (name) {
		if (!this.researched || !this.effects) {
			return 0;
		}
		return this.effects[name];
	},

	render: function () {
		this.domNode = dojo.create('tr', {
			'class': 'upgradeMeta',
			innerHTML: '<td>' + (this.title || this.label || this.name) + '</td><td></td>'
		});
		this.nameNode = this.domNode.children[0];

		this.game._createCheckbox('Unlocked', this.domNode.children[1], this, 'unlocked');
		this.game._createCheckbox('Researched', this.domNode.children[1], this, 'researched');
		dojo.addClass(this.researchedNode, 'ownedInput');

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	owned: function () {
		return this.researched;
	},

	update: function (hideResearched) {
		// dojo.toggleClass(this.domNode, 'metaOwned', this.researched);

		var hideme = hideResearched && this.researched;
		if (!hideme && this.hidden) {
			hideme = !this.unlocked && !this.researched;
		}
		dojo.toggleClass(this.domNode, 'hidden', Boolean(hideme));

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

		dojo.toggleClass(this.nameNode, 'spoiler', !this.unlocked);
		this.game.toggleDisabled(this.unlockedNode, req);
		this.updateEnabled();
	},

	load: function (saveData) {
		this.set('unlocked', Boolean(saveData.unlocked), false, true);
		this.set('researched', Boolean(saveData.researched));
	}
});


dojo.declare('classes.KGSaveEdit.ScienceManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	techData: [{
			name: "calendar",
			title: "Calendar",
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
			title: "Agriculture",
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
			title: "Archery",
			description: "Ranged weaponry known as a 'Bow'.",
			effectDesc: "Unlocks Hunters",
			prices: [
				{name: "science", val: 300}
			],
			// unlocks: {tech: ["animal"], jobs: ["hunter"]},
			requires: {tech: ["agriculture"]}
		}, {
			name: "mining",
			title: "Mining",
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
			title: "Metal Working",
			description: "The first metal-working technology that provides your civilisation with sturdy, durable tools.",
			effectDesc: "You can construct Smelters that convert ore into metal",
			prices: [
				{name: "science", val: 900}
			],
			// unlocks: {upgrades: ["huntingArmor"]},
			requires: {tech: ["mining"]}
		}, {
			name: "animal",
			title: "Animal Husbandry",
			description: "Domestication allows access to various animal resources via the pasture. Improves your food production.",
			effectDesc: "Unlocks Pastures",
			prices: [
				{name: "science", val: 500}
			],
			// unlocks: {tech: ["civil", "math", "construction"]},
			requires: {tech: ["archery"]}
		}, {
			name: "brewery",
			title: "Catnip Processing",
			description: "Catnip Processing is a non-mandatory technology which improves the process of converting catnip to catnip wood.",
			effectDesc: "Unlocks Catnip Enrichment.",
			prices: [
				{name: "science", val: 1200}
			],
			hidden: true // not used anymore
		}, {
			name: "civil",
			title: "Civil Service",
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
			title: "Mathematics",
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
			title: "Construction",
			description: "Construction represents the advancement of the study of masonry, primarily by adding iron and other metals to the builder's toolbox. Benefits hunting and base infrastructure.",
			effectDesc: "Allows your workers to construct the Lumber mill. Unlocks Composite Bows",
			prices: [
				{name: "science", val: 1300}
			],
			// unlocks: {tech: ["engineering"], upgrades: ["compositeBow", "advancedRefinement"]},
			requires: {tech: ["animal"]},
			flavor: "Making pillow forts smart!"
		}, {
			name: "engineering",
			title: "Engineering",
			description: "Engineering is the science (or art perhaps) of designing complex materials, structures, devices, and systems.",
			effectDesc: "Unlocks aqueducts",
			prices: [
				{name: "science", val: 1500}
			],
			// unlocks: {tech: ["writing"]},
			requires: {tech: ["construction"]}
		}, {
			name: "currency",
			title: "Currency",
			description: "Currency represents a certain amount of wealth. Can significantly boost your development in indirect ways.",
			effectDesc: "Unlocks gold and trade",
			prices: [
				{name: "science", val: 2200}
			],
			// unlocks: {upgrades: ["goldOre"]},
			requires: {tech: ["civil"]}
		}, {
			name: "writing",
			title: "Writing",
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
			title: "Philosophy",
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
			title: "Machinery",
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
			title: "Steel",
			description: "Development of the new Steel alloy advances further metal working. Benefits most of the aspects of development.",
			effectDesc: "Unlocks Coal and Steel production",
			prices: [
				{name: "science", val: 12000}
			],
			// unlocks: {upgrades: ["deepMining", "coalFurnace", "combustionEngine", "reinforcedWarehouses", "steelAxe", "steelArmor"], crafts: ["steel"]},
			requires: {tech: ["writing"]}
		}, {
			name: "theology",
			title: "Theology",
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
			title: "Astronomy",
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
			title: "Navigation",
			description: "Navigation allows serious advancements in sailing and shipbuilding technology. It should benefit economical development and can lead to discovery of new civilizations.",
			effectDesc: "Unlocks the construction of Trade Ships and overseas trade.",
			prices: [
				{name: "science",    val: 35000},
				{name: "manuscript", val: 100}
			],
			// unlocks: {tech: ["physics", "archeology", "architecture"], crafts: ["ship"], upgrades: ["caravanserai", "cargoShips", "astrolabe", "titaniumMirrors", "titaniumAxe"]},
			requires: {tech: ["astronomy"]}
		}, {
			name: "architecture",
			title: "Architecture",
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
			title: "Physics",
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
			title: "Metaphysics",
			description: "Metaphysics is a traditional branch of philosophy concerned with explaining the fundamental nature of being and the world that encompasses it.\nAbsolutely useless.",
			effectDesc: "Does nothing.",
			prices: [
				{name: "science",     val: 55000},
				{name: "unobtainium", val: 5}
			],
			requires: {tech: ["physics"]}
		}, {
			name: "chemistry",
			title: "Chemistry",
			description: "The discovery of Chemistry allows the deeper study and understanding of natural elements and their interaction. As a result new resources may be unlocked.",
			effectDesc: "Unlocks Oil and Oil Wells.",
			prices: [
				{name: "science",   val: 60000},
				{name: "compedium", val: 50}
			],
			// unlocks: {upgrades: ["alloyAxe", "alloyArmor", "alloyWarehouses", "alloyBarns"], crafts: ["alloy"]},
			requires: {tech: ["physics"]}
		}, {
			name: "acoustics",
			title: "Acoustics",
			description: "Acoustics is the study of sound. Though not obviously useful, in a long run it may benefit civilizations thriving for cultural and religious development.",
			effectDesc: "Unlocks Chapels",
			prices: [
				{name: "science",   val: 60000},
				{name: "compedium", val: 60}
			],
			// unlocks: {tech: ["drama"]},
			requires: {tech: ["architecture"]}
		}, {
			name: "drama",
			title: "Drama and Poetry",
			description: "Drama and poetry are both forms of artistic expression.\nImproves cultural progress.",
			effectDesc: "Unlocks Festivals and Cultural artifacts (TBD)",
			prices: [
				{name: "science",   val: 90000},
				{name: "parchment", val: 5000}
			],
			requires: {tech: ["acoustics"]}
		}, {
			name: "archeology",
			title: "Geology",
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
			title: "Electricity",
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
			title: "Biology",
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
			title: "Biochemistry",
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
			title: "Genetics",
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
			title: "Industrialization",
			description: "Industrialization represents the concept of mass-producing materials, from food products to machine parts.",
			effectDesc: "Unlocks Advanced Automation and Barges",
			prices: [
				{name: "science",   val: 100000},
				{name: "blueprint", val: 25}
			],
			// unlocks: {tech: ["mechanization", "metalurgy", "combustion"], upgrades: ["barges", "advancedAutomation"]},
			requires: {tech: ["electricity"]}
		}, {
			name: "mechanization",
			title: "Mechanization",
			description: "Mechanization provides a lot of ways to automate redundant tasks; hence improving craft, oil pumps and construction technologies.",
			effectDesc: "Unlocks Factories, Pumpjacks and Concrete",
			prices: [
				{name: "science",   val: 115000},
				{name: "blueprint", val: 45}
			],
			// unlocks: {tech: ["electronics"], crafts: ["concrate"], upgrades: ["pumpjack", "concreteWarehouses", "concreteBarns", "concreteHuts"]},
			requires: {tech: ["industrialization"]}
		}, {
			name: "metalurgy",
			title: "Metallurgy",
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
			title: "Combustion",
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
			title: "Ecology",
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
			title: "Electronics",
			description: "Electronics unlocks some high level upgrades mainly related to science",
			effectDesc: "Unlocks Broadcast Towers, CAD Systems, Refrigeration and SETI",
			prices: [
				{name: "science",   val: 135000},
				{name: "blueprint", val: 70}
			],
			// unlocks: {tech: ["nuclearFission", "rocketry", "robotics"], upgrades: ["cadSystems", "refrigeration", "seti", "factoryLogistics"], stages: [{bld:"amphitheatre", stage:1}]},
			requires: {tech: ["mechanization"]}
		}, {
			name: "robotics",
			title: "Robotics",
			description: "Robotics improves automated structures like Calciners",
			effectDesc: "Unlocks Steel Plants, Hydro Plants, Tankers and Rotary Kilns",
			prices: [
				{name: "science",   val: 140000},
				{name: "blueprint", val: 80}
			],
			// unlocks: {upgrades: ["steelPlants", "rotaryKiln"], crafts: ["tanker"], stages: [{bld:"aqueduct", stage:1}]},
			requires: {tech: ["electronics"]}
		}, {
			name: "nuclearFission",
			title: "Nuclear Fission",
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
			title: "Rocketry",
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
			title: "Oil Processing",
			description: "Unlocks advanced options of oil processing",
			effectDesc: "Unlocks kerosene and factory processing(TBD)",
			prices: [
				{name: "science",   val: 215000},
				{name: "blueprint", val: 150}
			],
			// unlocks: {crafts: ["kerosene"], upgrades: ["factoryProcessing"]},
			requires: {tech: ["rocketry"]}
		}, {
			name: "sattelites",
			title: "Satellites",
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
			title: "Orbital Engineering",
			description: "Orbital Engineering allows kitten civilization to develop advanced space projects.",
			effectDesc: "Unlocks Space Stations and the Hubble Telescope",
			prices: [
				{name: "science",   val: 250000},
				{name: "blueprint", val: 250}
			],
			// unlocks: {tech: ["exogeology"], upgrades: ["hubbleTelescope", "satelliteRadio", "astrophysicists", "solarSatellites"]},
			requires: {tech: ["sattelites"]}
		}, {
			name: "exogeology",
			title: "Exogeology",
			description: "Exogeology or Planetary Geology studies extraterestial metals and minerals.",
			effectDesc: "Unlocks various Unobtainium upgrades",
			prices: [
				{name: "science",   val: 275000},
				{name: "blueprint", val: 250}
			],
			// unlocks: {tech: ["advExogeology"], upgrades: ["unobtainiumReflectors", "unobtainiumHuts", "unobtainiumDrill", "hydroPlantTurbines", "storageBunkers"]},
			requires: {tech: ["orbitalEngineering"]}
		}, {
			name: "advExogeology",
			title: "Advanced Exogeology",
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
			title: "Nanotechnology",
			description: "TBD",
			effectDesc: "Unlocks Nanosuits, Augmentations and PVC",
			prices: [
				{name: "science",   val: 200000},
				{name: "blueprint", val: 150}
			],
			// unlocks: {tech: ["superconductors"], upgrades: ["augumentation", "nanosuits", "photovoltaic", "fluidizedReactors"]},
			requires: {tech: ["nuclearFission"]}
		}, {
			name: "superconductors",
			title: "Superconductors",
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
			title: "Antimatter",
			description: "Antimatter provides some advanced sources of energy and generally benefits scientific advancement",
			effectDesc: "Unlocks Antimatte Reactors and Antimatter Bases",
			prices: [
				{name: "science", val: 500000},
				{name: "relic",   val: 1}
			],
			// unlocks: {upgrades: ["amReactors", "amBases"], tech: ["terraformation"]},
			requires: {tech: ["superconductors"]}
		}, {
			name: "terraformation",
			title: "Terraformation",
			description: "Terraformation technology focuses on use of the antimatter to change the climate of the Cath System exoplanets",
			effectDesc: "Unlocks Terraforming Stations",
			prices: [
				{name : "science", val: 750000},
				{name : "relic",   val: 5}
			],
			// unlocks: {tech: ["hydroponics"], space: [{planet:"yarn", bld: "terraformingStation"}]},
			requires: {tech: ["antimatter"]}
		}, {
			name: "hydroponics",
			title: "Hydroponics",
			description: "A pinnacle of space engineering, hydroponic provides new sources of food supply for our distant colonies.",
			effectDesc: "Unlocks Yarn Hydroponics",
			prices: [
				{name : "science", val: 1000000},
				{name : "relic",   val: 25}
			],
			// unlocks: {space: [{planet:"yarn", bld: "hydroponics"}]},
			requires: {tech: ["terraformation"]}
		}, {
			name: "particlePhysics",
			title: "Particle Physics",
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
			title: "Dimensional Physics",
			description: "Dimensional Physics explores the concepts of space and time",
			effectDesc: "Unlocks Energy Rifts and LHC",
			prices: [
				{name: "science", val: 235000}
			],
			// unlocks: {upgrades: ["energyRifts", "lhc"]},
			requires: {tech: ["particlePhysics"]}
		}, {
			name: "chronophysics",
			title: "Chronophysics",
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
			title: "Tachyon Theory",
			description: "Tachyonic particles are hypothetical particles that always move faster than light.",
			effectDesc: "Unlocks Tachyon Accelerators and Chronoforge",
			prices: [
				{name: "science",     val: 750000},
				{name: "timeCrystal", val: 25},
				{name: "relic",       val: 1}
			],
			// unlocks: {upgrades: ["tachyonAccelerators", "chronoforge"]},
			requires: {tech: ["chronophysics"]}
		}, {
			name: "cryptotheology",
			title: "Cryptotheology",
			description: "Cryptotheology applies the most arcane and unorthodox methods of the theology in order to answer the fundamental questions of universe and reality.",
			effectDesc: "Unlocks Relic Station and Cryptotheology tree",
			prices: [
				{name: "science", val: 650000},
				{name: "relic",   val: 5}
			],
			// unlocks: {upgrades: ["relicStation"]},
			requires: {tech: ["theology"]}
	}],

	tabName: 'Science',
	getVisible: function () {
		return this.game.bld.get('library').owned();
	},

	techs: null,
	techsByName: null,

	hideResearched: false,

	constructor: function (game) {
		this.techs = [];
		this.techsByName = {};

		for (var i = 0; i < this.techData.length; i++) {
			var tech = new classes.KGSaveEdit.ScienceMeta(game, this.techData[i]);
			tech.metaObj = this;
			this.techs.push(tech);
			this.techsByName[tech.name] = tech;
		}
		this.meta.push(this.techs);
	},

	renderTabBlock: function () {
		var div = dojo.create('div', {'class': 'bottom-margin'}, this.tabBlockNode);
		this.game._createCheckbox('Hide researched techs', div, this, 'hideResearched');

		this.techsBlock = dojo.create('table', {
			id: 'techsBlock',
			'class': 'bottom-margin'
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
		this.game.callMethods(this.techs, 'update', this.hideResearched);
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
			this.loadMetaData(saveData.science.techs, 'get');
		}
	}
});


dojo.declare('classes.KGSaveEdit.ScienceMeta', classes.KGSaveEdit.UpgradeMeta, {
	constructor: function () { },

	getName: function () {
		var name = this.title || this.name;
		if (this.researched) {
			return name + ' (completed)';
		}
		return name;
	},

	getDescription: function () {
		if (this.researched) {
			return this.description + '<br>Effect: ' + this.effectDesc;
		}
		return this.description;
	},

	getPrices: function () {
		var prices = this.prices ? dojo.clone(this.prices) : [];

		if (this.game.village.leader && this.game.village.leader.trait.name === "scientist") {
			for (var i = prices.length - 1; i >= 0; i--) {
				if (prices[i].name === "science") {
					prices[i].val *= 0.99;
				}
			}
		}
		return prices;
	}
});


dojo.declare('classes.KGSaveEdit.PrestigeManager', classes.KGSaveEdit.Manager, {
	perksData: [{
			name: "engeneering",
			title: "Engineering",
			description: "Reduce all price ratios by 1%. Unlocks more price upgrades.",
			prices: [
				{name: "paragon", val: 5}
			],
			unlocked: true,
			effects: {
				"priceRatio": -0.01
			}
		}, {
			name: "megalomania",
			title: "Megalomania",
			description: "Unlocks additional megastructures.",
			prices: [
				{name: "paragon", val: 25}
			],
			requires: {perk: ["engeneering"]}
		}, {
			name: "goldenRatio",
			title: "Golden Ratio",
			description: "Reduce all price ratios by ~1.618%",
			prices: [
				{name: "paragon", val: 50}
			],
			requires: {perk: ["engeneering"]},
			effects: {
				"priceRatio": -(1 + Math.sqrt(5)) / 200 //Calculates the Golden Ratio
			}
		}, {
			name: "divineProportion",
			title: "Divine Proportion",
			description: "Reduce all price ratios by 1.7%",
			prices: [
				{name: "paragon", val: 100}
			],
			requires: {perk: ["goldenRatio"]},
			effects: {
				"priceRatio": -0.017
			}
		}, {
			name: "vitruvianFeline",
			title: "Vitruvian Feline",
			description: "Reduce all price ratios by 2%",
			prices: [
				{name: "paragon", val: 250}
			],
			requires: {perk: ["divineProportion"]},
			effects: {
				"priceRatio": -0.02
			}
		}, {
			name: "renaissance",
			title: "Renaissance",
			description: "Reduce all price ratios by 2.25%",
			prices: [
				{name: "paragon", val: 750}
			],
			requires: {perk: ["vitruvianFeline"]},
			effects: {
				"priceRatio": -0.0225
			}
		}, {
			name: "diplomacy",
			title: "Diplomacy",
			description: "Races will be discovered earlier and with better standing. Unlocks more trade upgrades.",
			prices: [
				{name: "paragon", val: 5}
			],
			unlocked: true
		}, {
			name: "zebraDiplomacy",
			title: "Zebra Diplomacy",
			description: "Some zebras hunters will stay in the village.",
			prices: [
				{name: "paragon", val: 50}
			],
			requires: {perk: ["diplomacy"]}
		}, {
			name: "chronomancy",
			title: "Chronomancy",
			description: "Meteor and star events will happen faster.",
			prices: [
				{name: "paragon", val: 25}
			],
			unlocked: true
		}, {
			name: "unicornmancy",
			title: "Unicornmancy",
			description: "Unicorn rifts and ivory meteors are more frequent.",
			prices: [
				{name: "paragon", val: 125}
			],
			unlocked: true
		}, {
			name: "anachronomancy",
			title: "Anachronomancy",
			description: "Time crystals and chronophysics will be saved across resets.",
			prices: [
				{name: "paragon", val: 125}
			],
			requires: {perk: ["chronomancy"]}
		}, {
			name: "carnivals",
			title: "Carnivals",
			description: "Festivals can now stack",
			prices: [
				{name: "paragon", val: 25}
			],
			unlocked: true
		}, {
			name: "willenfluff",
			title: "Venus of Willenfluff",
			description: "Kittens will arrive 75% faster.",
			prices: [
				{name: "paragon", val: 150}
			],
			requires: {perk: ["numerology"]},
			effects: {
				"kittenGrowthRatio": 0.75
			}
		}, {
			name: "numerology",
			title: "Numerology",
			description: "Certain years will have special effects.",
			prices: [
				{name: "paragon", val: 50}
			],
			requires: {perk: ["carnivals"]}
		}, {
			name: "numeromancy",
			title: "Numeromancy",
			description: "Certain years will have extra effects during Festivals.",
			prices: [
				{name: "paragon", val: 500}
			],
			requires: {perk: ["numerology"]}
		}, {
			name: "malkuth",
			title: "Malkuth",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 500}
			],
			requires: {perk: ["numeromancy"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "yesod",
			title: "Yesod",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 750}
			],
			requires: {perk: ["malkuth"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "hod",
			title: "Hod",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 1250}
			],
			requires: {perk: ["yesod"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "netzach",
			title: "Netzach",
			description: "Improves paragon effect and scaling by 5%",
			prices: [
				{name: "paragon", val: 1750}
			],
			requires: {perk: ["hod"]},
			effects: {
				"paragonRatio": 0.05
			}
		}, {
			name: "voidOrder",
			title: "Order of Void",
			description: "Every priest will now give a minor bonus to faith accumulation",
			prices: [
				{name: "paragon", val: 75}
			],
			requires: {perk: ["numerology"]}
	}],

	domNode: null,

	perks: null,
	perksByName: null,

	constructor: function (game) {
		this.perks = [];
		this.perksByName = {};

		for (var i = 0, len = this.perksData.length; i < len; i++) {
			var perk = new classes.KGSaveEdit.UpgradeMeta(game, this.perksData[i]);
			perk.metaObj = this;
			this.perks.push(perk);
			this.perksByName[perk.name] = perk;
		}

		this.meta.push(this.perks);
	},

	getPerk: function (name) {
		return this.perksByName[name];
	},

	getSpentParagon: function() {
		var paragon = 0;
		for (var i = this.perks.length - 1; i >= 0; i--) {
			var perk = this.perks[i];
			if (perk.researched) {
				if (perk.prices) {
					for (var j = perk.prices.length - 1; j >= 0; j--) {
						var price = perk.prices[j];
						if (price && price.name === 'paragon') {
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

	getParagonRatio: function() {
		return 1.0 + this.getEffect("paragonRatio");
	},

	getParagonProductionRatio: function() {
		var paragonRatio = this.game.resPool.get("paragon").value * 0.01 * this.getParagonRatio();
		return this.game.bld.getHyperbolicEffect(paragonRatio, 2 * this.getParagonRatio());
	},

	getParagonStorageRatio: function() {
		return (this.game.resPool.get("paragon").value / 1000) * this.getParagonRatio(); //every 100 paragon will give a 10% bonus to the storage capacity
	},

	render: function () {
		this.domNode = dojo.create('table', {
			id: 'metaphysicsBlock',
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
		this.game.callMethods(this.perks, 'update', this.game.science.hideResearched);
		dojo.toggleClass(this.domNodeHeader, 'spoiler', !this.game.science.get('metaphysics').owned());
	},

	save: function (saveData) {
		saveData.prestige = {
			perks: this.game.filterMetadata(this.perks, ["name", "unlocked", "researched"])
		};
	},

	load: function (saveData) {
		this.loadMetaData(saveData.prestige.perks, 'getPerk');
	}
});


dojo.declare('classes.KGSaveEdit.WorkshopManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	upgradeData: [{
			name: "mineralHoes",
			title: "Mineral Hoes",
			description: "Your farmers are 50% more effective",
			prices: [
				{name: "science",  val: 100},
				{name: "minerals", val: 275}
			],
			unlocked: true,
			// unlocks: {upgrades: ["ironHoes"]},'
			effects: {
				"catnipRatio": 0.5
			}
		}, {
			name: "ironHoes",
			title: "Iron Hoes",
			description: "Your farmers are 30% more effective",
			prices: [
				{name: "science", val: 200},
				{name: "iron",    val: 25}
			],
			unlocked: true,
			effects: {
				"catnipRatio": 0.3
			}
		}, {
			name: "mineralAxes",
			title: "Mineral Axe",
			description: "Woodcutters are 70% more effective",
			prices: [
				{name: "science",  val: 100},
				{name: "minerals", val: 500}
			],
			unlocked: true,
			// unlocks: {upgrades: ["ironAxes"]},
			effects: {
				"woodRatio": 0.7
			}
		}, {
			name: "ironAxes",
			title: "Iron Axe",
			description: "Woodcutters are 50% more effective",
			prices: [
				{name: "science", val: 200},
				{name: "iron",    val: 50}
			],
			unlocked: true,
			effects: {
				"woodRatio": 0.5
			}
		}, {
			name: "steelAxe",
			title: "Steel Axe",
			description: "Very sharp and durable axes. Woodcutters are 50% more effective",
			prices: [
				{name: "science", val: 20000},
				{name: "steel",   val: 75}
			],
			requires: {tech: ["steel"]},
			effects: {
				"woodRatio": 0.5
			}
		}, {
			name: "steelSaw",
			title: "Steel Saw",
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
			title: "Titanium Saw",
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
			title: "Alloy Saw",
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
			title: "Titanium Axe",
			description: "Indestructible axes. Woodcutters are 50% more effective.",
			prices: [
				{name: "science",  val: 38000},
				{name: "titanium", val: 10}
			],
			requires: {tech: ["navigation"]},
			effects: {
				"woodRatio": 0.5
			}
		}, {
			name: "alloyAxe",
			title: "Alloy Axe",
			description: "The more you use them, the sharper they are! Woodcutters are 50% more effective.",
			prices: [
				{name: "science", val: 70000},
				{name: "alloy",   val: 25}
			],
			requires: {tech: ["chemistry"]},
			effects: {
				"woodRatio": 0.5
			}
		}, {
			name: "unobtainiumAxe",
			title: "Unobtainium Axe",
			description: "Those axes are literally unobtainable! Woodcutters are 50% more effective.",
			prices: [
				{name: "science",     val: 125000},
				{name: "unobtainium", val: 75}
			],
			// requires: {program: ["moonMission"]},
			effects: {
				"woodRatio": 0.5
			},
			hidden: true
		}, {
			name: "unobtainiumSaw",
			title: "Unobtainium Saw",
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
			title: "Expanded Barns",
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
			title: "Reinforced Barns",
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
			title: "Reinforced Warehouses",
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
			title: "Titanium Barns",
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
			title: "Alloy Barns",
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
			title: "Concrete Barns",
			description: "Barns store 75% more resources",
			prices: [
				{name: "science",  val: 100000},
				{name: "concrate", val: 45},
				{name: "titanium", val: 2000}
			],
			requires: {tech: ["mechanization"]},
			effects: {
				"barnRatio": 0.75
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor"]}
		}, {
			name: "titaniumWarehouses",
			title: "Titanium Warehouses",
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
			title: "Alloy Warehouses",
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
			title: "Concrete Warehouses",
			description: "Warehouses store 35% more resources",
			prices: [
				{name: "science",  val: 100000},
				{name: "titanium", val: 1250},
				{name: "concrate", val: 35}
			],
			requires: {tech: ["mechanization"]},
			effects: {
				"warehouseRatio": 0.35
			},
			upgrades: {buildings: ["barn", "warehouse", "harbor", "mint"]}
		}, {
			name: "storageBunkers",
			title: "Storage Bunkers",
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
			title: "Energy Rifts",
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
			title: "Stasis Chambers",
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
			title: "Void Energy",
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
			title: "Dark Energy",
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
			title: "Chronoforge",
			description: "An alien technology related to time manipulation.",
			prices: [
				{name: "science",     val: 500000},
				{name: "relic",       val: 5},
				{name: "timeCrystal", val: 10}
			],
			requires: {tech: ["tachyonTheory"]}
		}, {
			name: "tachyonAccelerators",
			title: "Tachyon Accelerators",
			description: "Energy Rifts are 5 times as effective",
			prices: [
				{name: "science",     val: 500000},
				{name: "eludium",     val: 125},
				{name: "timeCrystal", val: 10}
			],
			requires: {tech: ["tachyonTheory"]},
			effects: {
				"acceleratorRatio": 2.5
			},
			upgrades: {buildings: ["accelerator"]}
		}, {
			name: "fluxCondensator",
			title: "Flux Condensator",
			description: "Chronosphere will now affect craftable resources.",
			prices: [
				{name: "alloy",       val: 250},
				{name: "unobtainium", val: 5000},
				{name: "timeCrystal", val: 5}
			],
			requires: {tech: ["chronophysics"]}
		}, {
			name: "lhc",
			title: "LHC",
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
			title: "Photovoltaic Cells",
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
			title: "Solar Satellites",
			description: "Satellites will now generate energy instead of consuming it",
			prices: [
				{name: "science", val: 225000},
				{name: "alloy",   val: 750}
			],
			requires: {tech: ["orbitalEngineering"]}
		}, {
			name: "cargoShips",
			title: "Cargo Ships",
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
			title: "Barges",
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
			title: "Reactor Vessel",
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
			title: "Ironwood Huts",
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
			title: "Concrete Huts",
			description: "Hut price ratio reduced by 30%",
			prices: [
				{name: "science",  val: 125000},
				{name: "concrate", val: 45},
				{name: "titanium", val: 3000}
			],
			requires: {tech: ["mechanization"]},
			effects: {
				"hutPriceRatio": -0.3
			}
		}, {
			name: "unobtainiumHuts",
			title: "Unobtainium Huts",
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
			title: "Eludium Huts",
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
			title: "Silos",
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
			title: "Refrigeration",
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
			title: "Composite Bow",
			description: "An improved version of a bow which provides a permanent +50% boost to the catpower production",
			prices: [
				{name: "science", val: 500},
				{name: "iron",    val: 100},
				{name: "wood",    val: 200}
			],
			requires: {tech: ["construction"]},
			effects: {
				"manpowerRatio": 0.5
			}
		}, {
			name: "crossbow",
			title: "Crossbow",
			description: "An improved version of a bow which provides a permanent +25% boost to the catpower production",
			prices: [
				{name: "science", val: 12000},
				{name: "iron",    val: 1500}
			],
			requires: {tech: ["machinery"]},
			effects: {
				"manpowerRatio": 0.25
			}
		}, {
			name: "railgun",
			title: "Railgun",
			description: "Deadly electromagnetic weapon. +25% boost to the catpower production",
			prices: [
				{name: "science",   val: 150000},
				{name: "titanium",  val: 5000},
				{name: "blueprint", val: 25}
			],
			requires: {tech: ["particlePhysics"]},
			effects: {
				"manpowerRatio": 0.25
			}
		}, {
			name: "bolas",
			title: "Bolas",
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
			title: "Hunting Armour",
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
			title: "Steel Armour",
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
			title: "Alloy Armour",
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
			title: "Nanosuits",
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
			title: "Caravanserai",
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
			title: "Catnip Enrichment",
			description: "Catnip refines twice as well",
			prices: [
				{name: "science", val: 500},
				{name: "catnip",  val: 5000}
			],
			requires: {tech: ["construction"]},
			handler: function (self) {
				var price = self.researched ? 50 : 100;
				self.game.workshop.getCraft("wood").prices = [{name: "catnip", val: price}];
			},
			flavor: "It's all fun and games 'til someone gets pounced"
		}, {
			name: "goldOre",
			title: "Gold Ore",
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
			title: "Geodesy",
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
			title: "Register",
			description: "Leader manage jobs depending on experience.",
			prices:[
				{name: "gold",     val: 10},
				{name: "science",  val: 500}
			],
			requires: {tech: ["writing"]},
		}, {
			name: "miningDrill",
			title: "Mining Drill",
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
			title: "Unobtainium Drill",
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
			title: "Coal Furnace",
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
			title: "Deep Mining",
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
			title: "Pyrolysis",
			description: "Coal output is boosted by 20%",
			prices: [
				{name: "compedium", val: 5},
				{name: "science",   val: 35000}
			],
			requires: {tech: ["physics"]},
			effects: {
				"coalRatio": 0.2
			}
		}, {
			name: "electrolyticSmelting",
			title: "Electrolytic Smelting",
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
			title: "Oxidation",
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
			title: "Steel Plants",
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
			title: "Automated Plants",
			description: "Steel Plants are boosted by 25% of your craft ratio",
			prices: [
				{name: "alloy",   val: 750},
				{name: "science", val: 200000}
			],
			requires: {upgrades: ["steelPlants"]},
			effects: {
				"calcinerSteelCraftRatio": 0.25
			}
		}, {
			name: "rotaryKiln",
			title: "Rotary Kiln",
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
			title: "Fluidized Reactors",
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
			title: "Nuclear Smelters",
			description: "Smelters can now produce titanium",
			prices: [
				{name: "uranium", val: 250},
				{name: "science", val: 165000}
			],
			requires: {tech: ["nuclearFission"]}
		}, {
			name: "printingPress",
			title: "Printing Press",
			description: "Steamworks automatically print manuscripts",
			prices: [
				{name: "gear",    val: 45},
				{name: "science", val: 7500}
			],
			requires: {tech: ["machinery"]},
			upgrades: {buildings: ["steamworks"]}
		}, {
			name: "offsetPress",
			title: "Offset Press",
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
			title: "Photolithography",
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
			title: "Workshop Automation",
			description: "Once per year Steamworks will convert small quantities of craftable resources to materials when they are at the limit",
			prices: [
				{name: "gear",    val: 25},
				{name: "science", val: 10000}
			],
			requires: {tech: ["machinery"]},
			flavor: "Includes autofeeders"
		}, {
			name: "advancedAutomation",
			title: "Advanced Automation",
			description: "Reduce Steamworks' maintainance cycle by 50%",
			prices: [
				{name: "gear",      val: 75},
				{name: "blueprint", val: 25},
				{name: "science",   val: 100000}
			],
			requires: {tech: ["industrialization"]}
		}, {
			name: "pneumaticPress",
			title: "Pneumatic Press",
			description: "Workshop automation will also convert iron to plates",
			prices: [
				{name: "gear",      val: 30},
				{name: "blueprint", val: 5},
				{name: "science",   val: 20000}
			],
			requires: {tech: ["physics"]}
		}, {
			name: "combustionEngine",
			title: "High Pressure Engine",
			description: "Reduces coal consumption of Steamworks by 20%",
			prices: [
				{name: "gear",      val: 25},
				{name: "blueprint", val: 5},
				{name: "science",   val: 20000}
			],
			requires: {tech: ["steel"]},
			effects: {
				"coalRatioGlobal": 0.2
			},
			upgrades: {buildings: ["steamworks"]},
			flavor: "A better mousetrap"
		}, {
			name: "fuelInjectors",
			title: "Fuel Injectors",
			description: "Reduces coal consumption of Steamworks by 20%",
			prices: [
				{name: "gear",    val: 250},
				{name: "oil",     val: 20000},
				{name: "science", val: 100000}
			],
			requires: {tech: ["combustion"]},
			upgrades: {buildings: ["steamworks"]},
			effects: {
				"coalRatioGlobal": 0.2
			}
		}, {
			name: "factoryLogistics",
			title: "Factory Logistics",
			description: "Factories are providing bigger bonus to craft effectiveness",
			prices: [
				{name: "gear",     val: 250},
				{name: "titanium", val: 2000},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["electronics"]},
			upgrades: {buildings: ["factory"]},
			effects: {}
		}, {
			name: "spaceManufacturing",
			title: "Space Manufacturing",
			description: "Factories are providing bonus to Space Elevators and Orbital Arrays",
			prices: [
				{name: "titanium", val: 125000},
				{name: "science",  val: 250000}
			],
			requires: {tech: ["superconductors"]},
			upgrades: {buildings: ["factory"]}
		}, {
			name: "celestialMechanics",
			title: "Celestial Mechanics",
			description: "Celestial events and meteors will generate additional science",
			prices: [
				{name: "science", val: 250}
			],
			requires: {tech: ["math"]}
		}, {
			name: "astrolabe",
			title: "Astrolabe",
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
			title: "Titanium Reflectors",
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
			title: "Unobtainium Reflectors",
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
			title: "Eludium Reflectors",
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
			title: "Hydro Plant Turbines",
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
			title: "Antimatter Bases",
			description: "Reduce energy consumption for Lunar Bases by 50%",
			prices: [
				{name: "eludium", val: 15},
				{name: "antimatter", val: 250}
			],
			requires: {tech: ["antimatter"]},
		}, {
			name: "amReactors",
			title: "Antimatter Reactors",
			description: "Your Research Vessels and Space Beacons are twice as effective",
			prices: [
				{name: "eludium",    val: 35},
				{name: "antimatter", val: 750}
			],
			// unlocks: {upgrades: ["amReactorsMK2"]},
			requires: {tech: ["antimatter"]},
			effects: {
				"spaceScienceRatio": 0.95
			}
		}, {
			name: "amReactorsMK2",
			title: "Advanced AM Reactors",
			description: "Your Research Vessels and Space Beacons are 75% more effective",
			prices: [
				{name: "eludium",    val: 70},
				{name: "antimatter", val: 2500}
			],
			requires: {upgrades: ["amReactors"]},
			effects: {
				"spaceScienceRatio": 0.75
			}
		}, {
			name: "relicStation",
			title: "Relic Station",
			description: "Upgrade Space Beacons with Relic research stations. Every Relic Station will reverse engineer relics yelding 0.01 relic per day",
			prices: [
				{name: "eludium",    val: 100},
				{name: "antimatter", val: 5000}
			],
			requires: {tech: ["cryptotheology"]},
			effects: {
				"beaconRelicsPerTick": 0.01
			}
		}, {
			name: "pumpjack",
			title: "Pumpjack",
			description: "Improves effectiveness of oil wells by 45%",
			prices: [
				{name: "titanium", val: 250},
				{name: "gear",     val: 125},
				{name: "science",  val: 100000}
			],
			requires: {tech: ["mechanization"]},
			effects: {
				"oilRatio": 0.45
			},
			upgrades: {buildings: ["oilWell"]}
		}, {
			name: "biofuel",
			title: "Biofuel processing",
			description: "Biolabs will convert catnip into oil",
			prices: [
				{name: "titanium", val: 1250},
				{name: "science",  val: 150000}
			],
			requires: {tech: ["biochemistry"]},
			upgrades: {buildings: ["biolab"]}
		}, {
			name: "unicornSelection",
			title: "Unicorn Selection",
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
			title: "GM Catnip",
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
			title: "CAD System",
			description: "All scientific buildings will improve effectiveness of blueprint crafting",
			prices: [
				{name: "titanium", val: 750},
				{name: "science",  val: 125000}
			],
			requires: {tech: ["electronics"]},
			effects: {
				"blueprintCraftRatio": 0.01
			}
		}, {
			name: "seti",
			title: "SETI",
			description: "A large array of electronic telescopes. Makes astronomical events automatic and silent",
			prices: [
				{name: "titanium", val: 250},
				{name: "science",  val: 125000}
			],
			requires: {tech: ["electronics"]}
		}, {
			name: "augumentation",
			title: "Augmentations",
			description: "Kitten skills are 25% more effective",
			prices: [
				{name: "titanium", val: 5000},
				{name: "uranium",  val: 50},
				{name: "science",  val: 150000}
			],
			requires: {tech: ["nanotechnology"]},
			effects: {
				"skillMultiplier": 0.25
			}
		}, {
			name: "enrichedUranium",
			title: "Enriched Uranium",
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
			title: "Cold Fusion",
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
			name: "oilRefinery",
			title: "Oil Refinery",
			description: "Improves effectiveness of oil wells by 35%",
			prices: [
				{name: "titanium", val: 1250},
				{name: "gear",     val: 500},
				{name: "science",  val: 125000}
			],
			requires: {tech: ["combustion"]},
			effects: {
				"oilRatio": 0.35
			},
			upgrades: {buildings: ["oilWell"]}
		}, {
			name: "hubbleTelescope",
			title: "Hubble Space Telescope",
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
			title: "Satellite Navigation",
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
			title: "Satellite Radio",
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
			title: "Astrophysicists",
			description: "Each scholar will now generate starcharts.",
			prices: [
				{name: "unobtainium", val: 350},
				{name: "science",     val: 250000}
			],
			requires: {tech: ["orbitalEngineering"]},
			upgrades: {jobs: ["scholar"]}
		}, {
			name: "mWReactor",
			title: "Microwarp Reactors",
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
			title: "Planet Busters",
			description: "Hissmeowra's output is twice as effective.",
			prices: [
				{name: "eludium", val: 250},
				{name: "science", val: 275000}
			],
			requires: {tech: ["advExogeology"]},
			effects: {
				"crackerRatio": 1
			}
		}, {
			name: "oilDistillation",
			title: "Oil Distillation",
			description: "Oil output is improved by 75%.",
			prices: [
				{name: "titanium", val: 5000},
				{name: "science",  val: 175000}
			],
			requires: {tech: ["rocketry"]},
			upgrades: {buildings: ["oilWell"]},
			effects: {
				"oilRatio": 0.75
			}
		}, {
			name: "factoryProcessing",
			title: "Factory Processing",
			description: "Every factory will increase oil refinement effectiveness by 5%.",
			prices: [
				{name: "titanium", val: 7500},
				{name: "concrate", val: 125},
				{name: "science",  val: 195000}
			],
			requires: {tech: ["oilProcessing"]},
			upgrades: {buildings: ["workshop"]},
			effects: {
				"factoryRefineRatio": 0.05
			}
	}],

	craftData: [{
			name: "wood",
			title: "Refine catnip",
			description: "A sturdy block of catnip wood. Difficult to process, but great building material.",
			prices: [
				{name: "catnip", val: 100}
			],
			unlocked: true,
			ignoreBonuses: true
		}, {
			name: "beam",
			title: "Wooden Beam",
			description: "Simple support structure made of a wood. Required for advanced construction.",
			prices: [
				{name: "wood", val: 175}
			],
			unlocked: true
		}, {
			name: "slab",
			title: "Stone Slab",
			description: "A small slab composed of minerals. Required for advanced construction.",
			prices: [
				{name: "minerals", val: 250}
			],
			unlocked: true
		}, {
			name: "concrate",
			title: "Concrete",
			description: "A block of reinforced concrete.",
			prices: [
				{name: "slab",  val: 2500},
				{name: "steel", val: 25}
			],
			unlocked: false,
			requires: {tech: ["mechanization"]}
		}, {
			name: "plate",
			title: "Metal Plate",
			description: "A metal plate. Required for advanced construction.",
			prices: [
				{name: "iron", val: 125}
			],
			unlocked: true
		}, {
			name: "steel",
			title: "Steel",
			description: "A durable metal made by smelting iron and coal. Required for construction of gears and complex machinery.",
			prices: [
				{name: "iron", val: 100},
				{name: "coal", val: 100}
			],
			unlocked: false,
			requires: {tech: ["steel"]}
		}, {
			name: "alloy",
			title: "Alloy",
			description: "A durable alloy of steel, iron and titanium. Required for advanced buildings and upgrades.",
			prices: [
				{name: "steel",    val: 75},
				{name: "titanium", val: 10}
			],
			unlocked: false,
			requires: {tech: ["chemistry"]}
		}, {
			name: "eludium",
			title: "Eludium",
			description: "Extremely rare and expensive alloy of unobtanium and titanium.",
			prices: [
				{name: "alloy",       val: 2500},
				{name: "unobtainium", val: 1000}
			],
			unlocked: false,
			requires: {tech: ["advExogeology"]}
		}, {
			name: "gear",
			title: "Gear",
			description: "An integral part of automated structures.",
			prices: [
				{name: "steel", val: 15}
			],
			unlocked: true
		}, {
			name: "parchment",
			title: "Parchment",
			description: "A material for writing on made from animal skin, required for cultural buildings.",
			prices: [
				{name: "furs", val: 175}
			],
			unlocked: false,
			requires: {tech: ["writing"]}
		}, {
			name: "manuscript",
			title: "Manuscript",
			description: "Written document required for technological advancement.Every manuscript will give a minor bonus to a maximum culture (this effect has a diminishing return)",
			prices: [
				{name: "parchment", val: 25},
				{name: "culture",   val: 400}
			],
			unlocked: true
		}, {
			name: "compedium",
			title: "Compendium",
			description: "A sum of all modern knowledge of the catkind. Every compendium will give +10 to max science",
			prices: [
				{name: "manuscript", val: 50},
				{name: "science",    val: 10000}
			],
			unlocked: false,
			requires: {tech: ["philosophy"]}
		}, {
			name: "blueprint",
			title: "Blueprint",
			description: "Strange piece of paper with blue lines.",
			prices: [
				{name: "compedium", val: 25},
				{name: "science",   val: 25000}
			],
			unlocked: false,
			requires: {tech: ["physics"]}
		}, {
			name: "scaffold",
			title: "Scaffold",
			description: "A large structure made of wood beams required for construction of very complex buildings and objects",
			prices: [
				{name: "beam", val: 50}
			],
			unlocked: true
		}, {
			name: "ship",
			title: "Trade Ship",
			description: "Ships can be used to discover new civilisations. May improve chances of getting certain rare resources",
			prices: [
				{name: "scaffold",  val: 100},
				{name: "plate",     val: 150},
				{name: "starchart", val: 25}
			],
			unlocked: false,
			requires: {tech: ["navigation"]},
			upgrades: {buildings: ["harbor"]}
		}, {
			name: "tanker",
			title: "Tanker",
			description: "Increase maximum oil capacity by 500",
			prices: [
				{name: "ship",      val: 200},
				{name: "alloy",     val: 1250},
				{name: "blueprint", val: 5}
			],
			unlocked: false,
			requires: {tech: ["robotics"]},
			upgrades: {buildings: ["harbor"]}
		}, {
			name: "kerosene",
			title: "Kerosene",
			description: "A rocket fuel processed from oil",
			prices: [
				{name: "oil", val: 7500}
			],
			unlocked: false,
			requires: {tech: ["oilProcessing"]}
		}, {
			name: "megalith",
			title: "Megalith",
			description: "A massive block that can be used to construct enormous structures",
			prices: [
				{name: "slab",  val: 75},
				{name: "beam",  val: 35},
				{name: "plate", val: 5}
			],
			unlocked: true
	}],

	effectsBase: {
		"scienceMax" : 0
	},

	tabName: 'Workshop',
	getVisible: function () {
		return this.game.bld.get('workshop').owned();
	},

	upgrades: null,
	upgradesByName: null,
	crafts: null,
	craftsByName: null,

	hideResearched: false,

	constructor: function (game) {
		this.upgrades = [];
		this.upgradesByName = {};
		this.crafts = [];
		this.craftsByName = {};

		for (var i = 0, len = this.upgradeData.length; i < len; i++) {
			var upgrade = new classes.KGSaveEdit.UpgradeMeta(game, this.upgradeData[i]);
			upgrade.metaObj = this;
			this.upgrades.push(upgrade);
			this.upgradesByName[upgrade.name] = upgrade;
		}

		this.meta.push(this.upgrades);

		for (i = 0, len = this.craftData.length; i < len; i++) {
			var craft = new classes.KGSaveEdit.CraftMeta(game, this.craftData[i]);
			craft.metaObj = this;
			this.crafts.push(craft);
			this.craftsByName[craft.name] = craft;
		}
	},

	renderTabBlock: function () {
		this.craftEffectivenessNode = dojo.create('div', null, this.tabBlockNode);

		var div = dojo.create('div', {'class': 'bottom-margin'}, this.tabBlockNode);
		this.game._createCheckbox('Hide researched upgrades', div, this, 'hideResearched');

		this.upgradesBlock = dojo.create('table', {
			id: 'upgradesBlock',
			'class': 'bottom-margin'
		}, this.tabBlockNode);

		this.craftsBlock = dojo.create('table', {id: 'workshopCraftsBlock'}, this.tabBlockNode);
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

	get: function(upgradeName) {
		return this.upgradesByName[upgradeName];
	},

	getCraft: function(craftName) {
		return this.craftsByName[craftName];
	},

	getCraftPrice: function(craft) {
		if (craft.name !== "ship") {
			return craft.prices;
		}

		//special ship hack
		var prices = dojo.clone(craft.prices);
		for (var i = prices.length - 1; i >= 0; i--) {
			if (prices[i].name === "starchart"){
				prices[i].val = prices[i].val *
					(1 - this.game.bld.getHyperbolicEffect(
						this.getEffect("satnavRatio") * this.game.space.getProgram("sattelite").val,
						0.75));
			}
		}
		return prices;
	},

	update: function () {
		this.craftEffectivenessNode.innerHTML = "Craft effectiveness: +" +
			(this.game.getCraftRatio() * 100).toFixed() + "%";

		this.effectsBase["scienceMax"] = Math.floor(this.game.resPool.get("compedium").value * 10);
		this.effectsBase["oilMax"] = Math.floor(this.game.resPool.get("tanker").value * 500);
		var cultureBonusRaw = Math.floor(this.game.resPool.get("manuscript").value);
		this.effectsBase["cultureMax"] = this.game.getTriValue(cultureBonusRaw, 0.01);

		this.game.callMethods(this.upgrades, 'update', this.hideResearched);
		this.game.callMethods(this.crafts, 'update');
	},

	getEffectBase: function (name) {
		return num(this.effectsBase[name]);
	},

	save: function (saveData) {
		var upgrades = this.game.filterMetadata(this.upgrades, ["name", "unlocked", "researched"]);
		var crafts = this.game.filterMetadata(this.crafts, ["name", "unlocked"]);

		saveData.workshop = {
			upgrades: upgrades,
			crafts:   crafts,
			hideResearched: Boolean(this.hideResearched)
		};
	},

	load: function (saveData) {
		if (!saveData.workshop) {
			return;
		}

		this.set('hideResearched', saveData.workshop.hideResearched);

		this.loadMetaData(saveData.workshop.upgrades, 'get');

		this.loadMetaData(saveData.workshop.crafts, 'getCraft', function (craft, saveCraft) {
			craft.unlocked = Boolean(saveCraft.unlocked);
		});
	}
});


dojo.declare('classes.KGSaveEdit.CraftMeta', classes.KGSaveEdit.MetaItem, {
	hideEffects: true,

	render: function () {
		this.domNode = dojo.create('tr', {
			'class': 'craft',
			innerHTML: '<td>' + (this.title || this.name) + '</td><td></td><td></td>'
		});
		this.nameNode = this.domNode.children[0];
		this.game._createCheckbox('Unlocked', this.domNode.children[1], this, 'unlocked');

		this.registerHighlight(this.domNode);
		this.registerTooltip(this.domNode);
	},

	update: function () {
		var req = this.game.checkRequirements(this);
		this.unlocked = req || this.unlockedNode.prevChecked;
		this.game.toggleDisabled(this.unlockedNode, req);

		//check and cache if you can't craft even once due to storage limits
		this.isLimited = this.game.resPool.isStorageLimited(this.getPrices());

		this.updateEnabled();
	},

	getPrices: function (simple) {
		return dojo.clone(simple ? this.prices : this.game.workshop.getCraftPrice(this));
	}
});

});
