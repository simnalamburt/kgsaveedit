/*global dojo, require, classes, num*/

require(["dojo/on", "dojo/mouse"], function (on, mouse) {
"use strict";

dojo.declare('classes.KGSaveEdit.VillageManager', [classes.KGSaveEdit.UI.Tab, classes.KGSaveEdit.Manager], {
	jobsData: [{
			name: "woodcutter",
			title: "Woodcutter",
			description: "+0.015 wood per tick",
			unlocked: true,
			modifiers: {
				"wood": 0.015
			},
			flavor: "Must. Not. Scratch."
		}, {
			name: "farmer",
			title: "Farmer",
			description: "+1 catnip per tick",
			requires: {tech: ["agriculture"]},
			modifiers: {
				"catnip": 1
			}
		}, {
			name: "scholar",
			title: "Scholar",
			description: "+0.05 science per tick",
			requires: {buildings: ["library"]},
			modifiers: {},
			calculateEffects: function (self, game) {
				var modifiers = {
					"science": 0.05
				};

				if (game.workshop.get("astrophysicists").owned()) {
					modifiers["starchart"] = 0.0001; //i'm not entirely sure if it is too little or too much
				}

				self.modifiers = modifiers;
			}
		}, {
			name: "hunter",
			title: "Hunter",
			description: "+0.06 catpower per tick",
			requires: {tech: ["archery"]},
			modifiers: {
				"manpower": 0.06
			},
			flavor: "We're so cute we purr at our prey until it dies"
		}, {
			name: "miner",
			title: "Miner",
			description: "+0.05 mineral per tick",
			requires: {buildings: ["mine"]},
			modifiers: {
				"minerals": 0.05
			},
			flavor: "I don't really understand how can I hold a pick with my paws"
		}, {
			name: "priest",
			title: "Priest",
			description: "+0.0015 faith per tick",
			requires: {tech: ["theology"]},
			modifiers: {
				"faith": 0.0015
			}
		}, {
			name: "geologist",
			title: "Geologist",
			description: "+0.015 coal per tick",
			requires: {tech: ["archeology"]},
			modifiers: {},
			calculateEffects: function (self, game) {
				var coal = 0.015;
				var gold = 0;

				if (game.workshop.get("miningDrill").owned()) {
					coal += 0.010;
					gold += 0.0005;
				}
				if (game.workshop.get("unobtainiumDrill").owned()) {
					coal += 0.015;
					gold += 0.0005;
				}
				if (game.workshop.get("geodesy").owned()) {
					coal += 0.0075;
					gold += 0.0008;
				} else {
					// Drills don't add gold before geodesy.
					gold = 0;
				}

				var modifiers = {
					"coal": coal
				};
				if (gold > 0) {
					modifiers["gold"] = gold;
				}

				self.modifiers = modifiers;
			}
	}],

	traits: [
		//Grr... someone emaciated the evil Scientinst first...
		{name: "scientist", title: "Scientist"},
		// Note by evil scientist: Good job to whoever decided that.
		{name: "manager", title: "Manager"},
		{name: "engineer", title: "Engineer"},
		{name: "merchant", title: "Merchant"},
		{name: "wise", title: "Philosopher"},
		{name: "metallurgist", title: "Metallurgist"},
		{name: "chemist", title: "Chemist"},
		{name: "none", title: "None"}
	],

	jobs: null,
	jobsByName: null,

	traitsByName: null,

	tabName: 'Outpost',
	getVisible: function () {
		return this.game.resPool.get('kittens').owned() || this.game.resPool.get('zebras').owned() || this.game.bld.get('hut').owned();
	},

	leader: null,
	senators: null,
	maxSenators: 5,

	happiness: 1,
	catnipPerKitten: -0.85,

	hideSenate: true,

	kittens: null, //current kittens
	generatedKittens: null, //generated kittens
	censusKittens: null, //subset of kittens, used for census
	censusPage: 1, //current census page
	censusPageMax: 1, //highest census page
	kittensPerPage: 10,

	constructor: function (game) {
		this.jobs = [];
		this.jobsByName = {};
		this.jobNames = [];

		this.kittens = [];
		this.generatedKittens = [];
		this.censusKittens = [];
		this.traitsByName = {};

		this.senators = [];

		for (var i = 0, len = this.jobsData.length; i < len; i++) {
			var job = new classes.KGSaveEdit.JobMeta(game, this.jobsData[i]);
			job.metaObj = this;

			this.jobs.push(job);
			this.jobNames.push(job.name);
			this.jobsByName[job.name] = job;
		}

		for (i = 0, len = this.traits.length; i < len; i++) {
			var trait = this.traits[i];
			this.traitsByName[trait.name] = trait;
		}
	},

	getJob: function (name) {
		return this.jobsByName[name];
	},

	getTrait: function (name) {
		return this.traitsByName[name] || this.traitsByName.none;
	},

	renderTabBlock: function () {
		var div = dojo.create('div', {
			innerHTML: 'Free kittens <span id="freeKittensSpan">0 / 0</span>'
		}, this.tabBlockNode);
		this.freeKittensSpan = div.children[0];

		this.jobsBlock = dojo.create('div', {
			id: 'jobsBlock',
			'class': 'bottom-margin'
		}, this.tabBlockNode);

		var job;
		for (var i = 0, len = this.jobs.length; i < len; i++) {
			job = this.jobs[i];
			job.render();
			dojo.place(job.domNode, this.jobsBlock);
		}

		this.censusBlock = dojo.create('div', {
			id: 'censusBlock'
		}, this.tabBlockNode);

		this.governmentBlock = dojo.create('div', {
			id: 'governmentBlock'
		}, this.censusBlock);

		div = dojo.create('div', null, this.censusBlock);
		dojo.setStyle(div, 'margin-bottom', '5px');

			this.censusFilterNode = dojo.create('select', {
				innerHTML: '<option value="all">All jobs</option>'
			}, div);

			for (i = 0, len = this.jobs.length; i < len; i++) {
				job = this.jobs[i];
				job.filterNode = dojo.create('option', {
					value: job.name,
					innerHTML: job.title
				}, this.censusFilterNode);
			}

			this.governmentFilter = dojo.create('option', {
				value: 'leader',
				innerHTML: 'Leader'
			}, this.censusFilterNode);

			on(this.censusFilterNode, 'change', dojo.hitch(this, function () {
				this.takeCensus();
			}));

			this.censusPageBlock = dojo.create('span', {
				id: 'censusPageBlock',
				'class': 'floatRight hidden'
			}, div);

			this.censusPageFirst = dojo.create('a', {
				href: '#',
				innerHTML: '&lt;&lt;'
			}, this.censusPageBlock);
			on(this.censusPageFirst, 'click', dojo.hitch(this, function () {
				this.game.setInput(this.censusPageNode, 1);
			}));

			this.censusPagePrev = dojo.create('a', {
				href: '#',
				innerHTML: '&lt;'
			}, this.censusPageBlock);
			on(this.censusPagePrev, 'click', dojo.hitch(this, function () {
				this.game.setInput(this.censusPageNode, this.censusPage - 1);
			}));

			var span = dojo.create('span', {innerHTML: 'Page '}, this.censusPageBlock);

			var input = this.game._createInput({'class': 'integerInput'}, span, this, 'censusPage');
			input.minValue = 1;
			input.handler = dojo.hitch(this, this.renderCensus);

			this.censusPageCount = dojo.create('span', null, span);

			this.censusPageNext = dojo.create('a', {
				href: '#',
				innerHTML: '&gt;'
			}, this.censusPageBlock);
			on(this.censusPageNext, 'click', dojo.hitch(this, function () {
				this.game.setInput(this.censusPageNode,
					Math.min(this.censusPage + 1, this.censusPageMax));
			}));

			this.censusPageLast = dojo.create('a', {
				href: '#',
				innerHTML: '&gt;&gt;'
			}, this.censusPageBlock);
			on(this.censusPageLast, 'click', dojo.hitch(this, function () {
				this.game.setInput(this.censusPageNode, this.censusPageMax);
			}));

		this.censusKittensBlock = dojo.create('div', null, this.censusBlock);

		this.noCensusKittensBlock = dojo.create('div', {
			'class': 'ital',
			innerHTML: 'No Kittens found'
		}, this.censusKittensBlock);
	},

	toggleHideSenate: function (toggle) {
		dojo.toggleClass(this.censusBlock, 'hideSenators', toggle);
		this.hideSenate = dojo.hasClass('hideSenators');

		this.governmentFilter.textContent = this.hideSenate ? 'Leader' : 'Government';
		this.game.callMethods(this.generatedKittens, 'update');
		this.renderGovernment();
		if (this.governmentFilter.selected) {
			this.takeCensus();
		}
	},

	addKittens: function (limit) {
		while (this.generatedKittens.length < limit) {
			var kitten = new classes.KGSaveEdit.Kitten(this.game);
			this.generatedKittens.push(kitten);
		}
	},

	getKittens: function () {
		return this.game.resPool.get('kittens').value;
	},

	getFreeKittens: function(){
		var total = 0;
		for (var i = this.jobs.length - 1; i >= 0; i--) {
			total += this.jobs[i].value;
		}

		return this.getKittens() - total;
	},

	getTabName: function () {
		var title = this.getVillageTitle();
		var kittens = this.getFreeKittens();
		if (kittens > 0) {
			title += ' (' + kittens + ')';
		}
		return title;
	},

	getVillageTitle: function () {
		var kittens = this.getKittens();
		if (kittens > 5000) { return "Elders"; } //you gotta be kitten me
		if (kittens > 2000) { return "Galactic Union"; }
		if (kittens > 1500) { return "Planetary Council"; }
		if (kittens > 1200) { return "Consortium"; }
		if (kittens > 1000) { return "Civilisation"; } //all rights reserved, yada yada.
		if (kittens > 900)  { return "Society"; }
		if (kittens > 800)  { return "Reich"; }
		if (kittens > 700)  { return "Federation"; }
		if (kittens > 600)  { return "Hegemony"; }
		if (kittens > 500)  { return "Dominion"; }
		if (kittens > 400)  { return "Imperium"; }
		if (kittens > 300)  { return "Empire"; }
		if (kittens > 250)  { return "Megapolis"; }
		if (kittens > 200)  { return "Metropolis"; }
		if (kittens > 150)  { return "City"; }
		if (kittens > 100)  { return "Town"; }
		if (kittens > 50)   { return "Small town"; }
		if (kittens > 30)   { return "Settlement"; }
		if (kittens > 15)   { return "Village"; }
		if (kittens > 0)    { return "Small Village"; }
		return "Outpost";
	},

	getResConsumption: function () {
		var kittens = this.kittens.length;

		var res = {
			"catnip": this.catnipPerKitten * kittens,
			"furs":  -0.01 * kittens,
			"ivory": -0.007 * kittens,
			"spice": -0.001 * kittens
		};
		return res;
	},

	getResProduction: function () {
		if (!this.resourceProduction) {
			this.updateResourceProduction(); //lazy synch
		}
		var res = dojo.clone(this.resourceProduction);

		//special hack for iron will mode
		var zebras = this.game.resPool.get("zebras").value;
		if (zebras > 0) {
			res["manpower"] = num(res["manpower"]) + 0.15; //zebras are a bit stronger than kittens
		}
		if (zebras > 1) {
			res["manpower"] += this.game.bld.getHyperbolicEffect((zebras - 1) * 0.05, 2);
		}

		return res;
	},

	updateResourceProduction: function () {
		var productionRatio = 0.25 +
			this.game.workshop.getEffect("skillMultiplier");

		var res = {};

		for (var i in this.kittens) {
			var kitten = this.kittens[i];
			if (kitten.job) {
				var job = this.getJob(kitten.job);
				if (job) {

					var mod = this.getValueModifierPerSkill(num(kitten.skills[kitten.job]));
					for (var jobResMod in job.modifiers) {

						var diff = job.modifiers[jobResMod] * (1 + ((mod - 1) * productionRatio));

						if (diff > 0) {
							if (kitten.isLeader) {
								diff *= this.getLeaderBonus(kitten.rank);
							}
							diff *= this.happiness; //alter positive resource production from jobs
						}

						res[jobResMod] = num(res[jobResMod]) + diff;
					}
				}
			}
		}
		this.resourceProduction = res;
	},

	updateHappines: function () {
		var happiness = 100;
		var numKittens = this.getKittens();

		var unhappiness = (numKittens - 5) * 2;
		unhappiness *= 1 + this.game.bld.getEffect("unhappinessRatio", true); //limit ratio by 1.0 by 75% hyperbolic falloff

		if (numKittens > 5) {
			happiness -= unhappiness; //every kitten takes 2% of production rate if >5
		}

		var happinessBonus = this.game.bld.getEffect("happiness");
		happiness += happinessBonus;

		//boost happiness/production by 10% for every uncommon/rare resource
		var resources = this.game.resPool.resources;
		for (var i = resources.length - 1; i >= 0; i--) {
			if (resources[i].type !== "common" && resources[i].owned()) {
				happiness += 10;
			}
		}

		if (this.game.calendar.festivalDays) {
			happiness += 30;
		}

		happiness += this.game.resPool.get("karma").getValue(); //+1% to the production per karma point

		var overpopulation = numKittens - this.maxKittens;
		if (overpopulation > 0) {
			happiness -= overpopulation * 2; //overpopulation penalty
		}

		if (happiness < 25) {
			happiness = 25;
		}

		this.happiness = happiness / 100;
	},

	getRankExp: function (rank) {
		return 500 * Math.pow(1.75, rank);
	},

	getRankExpSum: function (rank) {
		var exp = 0;
		for (var i = rank; i > 0; i--) {
			exp += this.getRankExp(i - 1);
		}
		return exp;
	},

	getLeaderBonus: function (rank) {
		return rank === 0 ? 1.0 : (rank + 1) / 1.4;
	},

	sortKittens: function (kittens) {
		// var getRankExp = this.getRankExp;
		kittens.sort(function (a, b) {
			// return ((b.rank ? getRankExp(b.rank) : 0) + b.exp) -
				// ((a.rank ? getRankExp(a.rank) : 0) + a.exp);
			return (b.rank - a.rank) || (b.exp - a.exp);
		});
	},

	getSkillsSorted: function (skillsDict) {
		var skills = [];
		for (var skill in skillsDict) {
			skills.push({"name": skill, "val": skillsDict[skill]});
		}
		skills.sort(function (a, b) { return b.val - a.val; });
		return skills;
	},

	skillToText: function (value) {
		if (value >= 9000) { return "Master"; }
		if (value >= 5000) { return "Proficient"; }
		if (value >= 2500) { return "Skilled"; }
		if (value >= 1200) { return "Competent"; }
		if (value >= 500)  { return "Adequate"; }
		if (value >= 100)  { return "Novice"; }
		return "Dabbling";
	},

	getNextSkillExp: function (value) {
		if (value >= 20000) { return Number.MAX_VALUE; }
		if (value >= 9000)  { return 20000; }
		if (value >= 5000)  { return 9000; }
		if (value >= 2500)  { return 5000; }
		if (value >= 500)   { return 2500; }
		if (value >= 100)   { return 500; }
		return 100;
	},

	getPrevSkillExp: function (value) {
		if (value > 9000) { return 9000; }
		if (value > 5000) { return 5000; }
		if (value > 2500) { return 2500; }
		if (value > 1200) { return 1200; }
		if (value > 500)  { return 500; }
		if (value > 100)  { return 100; }
		return 0;
	},

	getValueModifierPerSkill: function (value) {
		if (value >= 9000) { return 1.75; }
		if (value >= 5000) { return 1.50; }
		if (value >= 1200) { return 1.30; }
		if (value >= 500)  { return 1.10; }
		if (value >= 100)  { return 1.05; }
		return 1.0;
	},

	getSkillLevel: function (exp) {
		var nextExp = this.getNextSkillExp(exp); //UGLY
		var prevExp = this.getPrevSkillExp(exp); //UGLY

		var expDiff = exp - prevExp;
		var expRequried = nextExp - prevExp;

		var expPercent = (expDiff / expRequried) * 100;

		return '<span title="' + exp.toFixed(2) + '">' +
			this.skillToText(exp) + ' (' + expPercent.toFixed() + '%)' + '</span>';
	},

	assignJobs: function (job, count) {
		var free = this.getFreeKittens();
		var jobObj = this.getJob(job);

		if (count < 0) {
			count = free;
		}
		count = Math.min(num(count) || 1, free);
		if (!count || !jobObj || !jobObj.unlocked) {
			return;
		}

		var workers = dojo.filter(this.kittens, function (k) {
			return !k.job;
		}).sort(function (a, b) {
			return num(b.skills[job]) - num(a.skills[job]);
		});

		var govern = false;
		for (var i = 0; i < count; i++) {
			var worker = workers[i];
			worker.job = job;

			jobObj.value++;
			worker.renderInfo();
			if (worker.isLeader || (worker.isSenator && this.showSenate)) {
				govern = true;
			}
		}

		jobObj.updateCount();

		if (govern) {
			this.renderGovernment();
		}
		if (job === this.censusFilterNode.value) {
			this.takeCensus();
		}
	},

	unassignJobs: function (job, count) {
		var jobObj = this.getJob(job);
		if (!jobObj || !jobObj.value) {
			return;
		}
		if (count < 0) {
			count = jobObj.value;
		}
		count = Math.min(Number(count) || 1, jobObj.value);

		var workers = dojo.filter(this.kittens, function (k) {
			return k.job === job;
		}).sort(function (a, b) {
			return num(a.skills[job]) - num(b.skills[job] || 0);
		});

		var govern = false;
		for (var i = 0; i < count; i++) {
			var worker = workers[i];
			worker.job = null;
			jobObj.value--;
			worker.renderInfo();

			if (worker.isLeader || (worker.isSenator && this.showSenate)) {
				govern = true;
			}
		}

		jobObj.updateCount();

		if (govern) {
			this.renderGovernment();
		}
		if (job === this.censusFilterNode.value) {
			this.takeCensus();
		}
	},

	countJobs: function () {
		var i;
		for (i = this.jobs.length - 1; i >= 0; i--) {
			this.jobs[i].value = 0;
		}

		for (i = this.kittens.length - 1; i >= 0; i--) {
			var job = this.jobsByName[this.kittens[i].job];
			if (job) {
				job.value++;
			}
		}

		for (i = this.jobs.length - 1; i >= 0; i--) {
			this.jobs[i].updateCount();
		}
	},

	synchKittens: function (force) {
		var kittens = this.getKittens();
		this.addKittens(kittens);

		if (force || this.kittens.length !== kittens) {
			this.kittens = this.generatedKittens.slice(0, kittens);

			this.countJobs();
			this.renderGovernment();
			this.takeCensus();
		}
	},

	renderGovernment: function () {
		var leaderInfo = '';
		var leader = this.leader;

		if (leader && this.kittens.indexOf(leader) > -1) {
			var nextRank = Math.floor(this.getRankExp(leader.rank));

			var name = leader.getGovernName(' :&lt;');

			leaderInfo = '<div><strong>Leader:</strong> ' + name + '<br>exp: ' +
				this.game.getDisplayValueExt(leader.exp);

			if (nextRank > leader.exp) {
				leaderInfo += ' (' + Math.floor(leader.exp / nextRank * 100) + '%)';
			}

			if (leader.rank > 0) {
				leaderInfo += '<br><br>Job bonus: x' +
					this.getLeaderBonus(leader.rank).toFixed(1) +
					' (' + (leader.job || 'null') + ')</div>';
			}
		}

		this.governmentBlock.innerHTML = leaderInfo;

		if (!this.hideSenate && this.senators.length) {
			var div = dojo.create('div', {innerHTML: '<strong>Council:</strong> '});
			var showSenate = false;
			var onclick = function () {
				this.fireSenator();
			};

			for (var i = 0, len = this.senators.length; i < len; i++) {
				var senator = this.senators[i];

				if (this.kittens.indexOf(senator) > -1) {
					showSenate = true;

					var span = dojo.create('span', {
						'class': 'senator',
						innerHTML: senator.getGovernName() + ' '
					}, div);

					var a = dojo.create('a', {
						'class': 'fireSenator',
						href: '#',
						title: 'Fire Councilor',
						innerHTML: '[-]'
					}, span);
					on(a, 'click', dojo.hitch(senator, onclick));
				}
			}

			if (showSenate) {
				dojo.place(div, this.governmentBlock);
			}
		}
	},

	takeCensus: function () {
		var job = this.censusFilterNode.value;
		var censusKittens = [];
		var i;

		if (job === 'all') {
			censusKittens = this.kittens.slice(0);
		} else if (job === 'leader') {
			var kittens = [this.leader];
			if (this.showSenate) {
				kittens = kittens.concat(this.senators);
			}

			for (i = kittens.length - 1; i >= 0; i--) {
				var kitten = kittens[i];
				if (kitten && this.kittens.indexOf(kittens[i]) > -1) {
					censusKittens.push(kittens[i]);
				}
			}
		} else {
			for (i = this.kittens.length - 1; i >= 0; i--) {
				if (this.kittens[i].job === job) {
					censusKittens.push(this.kittens[i]);
				}
			}
		}

		this.sortKittens(censusKittens);

		this.game.setInput(this.censusPageNode, 1, true);
		this.censusKittens = censusKittens;
		this.renderCensus();
	},

	renderCensus: function () {
		dojo.empty(this.censusKittensBlock);

		var kittens = this.censusKittens;
		var page = Math.max(num(this.censusPageNode.parsedValue), 1);
		var kittensPerPage = Math.max(Math.floor(this.kittensPerPage), 1) || 10;
		var pageMax = kittensPerPage > 0 ? Math.ceil(kittens.length / kittensPerPage) : 1;
		this.censusPageMax = pageMax;

		if (kittensPerPage > 1) {
			kittens = kittens.slice((page - 1) * kittensPerPage, page * kittensPerPage);
		}

		if (kittens.length) {
			for (var i = 0, len = kittens.length; i < len; i++) {
				if (!kittens[i].domNode) {
					kittens[i].render();
				}
				dojo.place(kittens[i].domNode, this.censusKittensBlock);
			}
		} else {
			dojo.place(this.noCensusKittensBlock, this.censusKittensBlock);
		}

		dojo.toggleClass(this.censusPageBlock, 'hidden', !this.getKittens() || kittensPerPage < 1);
		dojo.toggleClass(this.censusPageFirst, 'invisible', page <= 1);
		dojo.toggleClass(this.censusPagePrev, 'invisible', page <= 1);
		dojo.toggleClass(this.censusPageNext, 'invisible', page >= pageMax);
		dojo.toggleClass(this.censusPageLast, 'invisible', page >= pageMax);

		this.censusPageCount.textContent = ' of ' + pageMax;
	},

	update: function () {
		this.maxKittens = this.game.resPool.get('kittens').maxValue;

		this.freeKittensSpan.textContent = this.getFreeKittens() + ' / ' + this.getKittens();
		this.game.callMethods(this.jobs, 'update');

		this.updateHappines();
		this.updateResourceProduction();
	},

	save: function (saveData) {
		saveData.village = {
			kittens: this.game.mapMethods(this.kittens, 'save'),
			maxKittens: this.maxKittens,
			jobs: this.game.filterMetadata(this.jobs, ["name", "unlocked", "value"])
		};
	},

	load: function (saveData) {
		if (!saveData.village) {
			return;
		}

		this.loadMetaData(saveData.jobs, 'getJob', function (job, saveJob) {
			job.set('unlocked', saveJob.unlocked);
		});

		var kittens = saveData.village.kittens;
		if (kittens && kittens.length) {
			this.addKittens(kittens.length);
			for (var i = 0, len = kittens.length; i < len; i++) {
				this.generatedKittens[i].load(kittens[i] || {});
			}
		}
	}
});

dojo.declare('classes.KGSaveEdit.JobMeta', classes.KGSaveEdit.MetaItem, {
	game: null,

	name: 'Undefined',
	title: 'Undefined',
	unlocked: false,
	modifiers: {},
	value: 0,

	render: function () {
		this.domNode = dojo.create('div', {
			'class': 'job btn modern',
			innerHTML: '<div class="btnContent"><span>' + this.getName() + '</span></div>'
		});
		this.buttonContent = this.domNode.children[0];
		this.nameNode = this.buttonContent.children[0];
		on(this.nameNode, 'click', dojo.hitch(this,
			function() { this.assignJobs(1); }));

		this.unassignLinks = this.addLinkList([{
			id: "unassign",
			title: "[&ndash;]",
			handler: function() {
				this.unassignJobs(1);
			}
		}, {
			id: "unassign5",
			title: "[-5]",
			handler: function() {
				this.unassignJobs(5);
			}
		}, {
			id: "unassign25",
			title: "[-25]",
			handler: function() {
				this.unassignJobs(25);
			}
		}, {
			id: "unassignAll",
			title: "[-all]",
			handler: function() {
				this.unassignJobs(this.value);
			}
		}]);

		this.assignLinks = this.addLinkList([{
			id: "assign",
			title: "[+]",
			handler: function() {
				this.assignJobs(1);
			}
		}, {
			id: "assign5",
			title: "[+5]",
			handler: function() {
				this.assignJobs(5);
			}
		}, {
			id: "assign25",
			title: "[+25]",
			handler: function() {
				this.assignJobs(25);
			}
		}, {
			id: "assignall",
			title: "[+all]",
			handler: function() {
				var freeKittens = this.game.village.getFreeKittens();
				this.assignJobs(freeKittens);
			}
		}]);

		this.registerTooltip(this.domNode);
	},

	assignJobs: function (kittens) {
		if (this.unlocked) {
			this.game.village.assignJobs(this.name, kittens);
			this.game.update();
		}
	},

	unassignJobs: function (kittens) {
		this.game.village.unassignJobs(this.name, kittens);
		this.game.update();
	},

	getName: function () {
		return (this.title || this.name) + ' (' + this.value + ')';
	},

	getPrices: function () { },

	getEffects: function () {
		return dojo.clone(this.modifiers || {});
	},

	update: function () {
		this.unlocked = this.game.checkRequirements(this);
		dojo.toggleClass(this.nameNode, 'spoiler', !this.unlocked);
		dojo.toggleClass(this.domNode, 'btnDisabled',
			!this.unlocked || !this.game.village.getFreeKittens());
	},

	updateCount: function () {
		this.nameNode.textContent = this.getName();
	},

	addLinkList: function(links) {
		var linkList = {};

		var linksDiv = dojo.create("div", {
			'class': 'btnLinkContainer'
		}, this.buttonContent);

		var linksTooltip = dojo.create("div", {
			className: "btnLinkList hidden"
		}, linksDiv);

		//linksTooltip.innerHTML = "<div>FOO</div><div>BAR</div><div>BAZ</div>";

		if (!links.length){
			return linkList;
		}
		//------------- root href --------------
		var link = dojo.create("a", {
			href: "#",
			'class': 'btnLinkListRoot',
			innerHTML: links[0].title
		}, linksDiv);

		//linksTooltip.style.left = link.offsetLeft; //hack hack hack

		dojo.connect(link, 'click', this, dojo.partial(function(handler, event) {
			event.stopPropagation();
			event.preventDefault();

			dojo.hitch(this, handler)();

			this.update();
		}, links[0].handler));

		linkList[links[0].id] = { link : link };

		if (links.length <= 1){
			return linkList;
		}

		//-----------dropdown

		dojo.connect(linksDiv, mouse.enter, this, dojo.partial(function(tooltip) { dojo.removeClass(tooltip, 'hidden'); }, linksTooltip));
		dojo.connect(linksDiv, mouse.leave, this, dojo.partial(function(tooltip) { dojo.addClass(tooltip, 'hidden'); }, linksTooltip));

		for (var i = 1, len = links.length; i < len; i++) {
			link = dojo.create("a", {
				href: "#",
				innerHTML: links[i].title,
				'class': 'btnLinkListLink'
			}, linksTooltip);

			dojo.connect(link, "onclick", this, dojo.partial(function(handler, event) {
				event.stopPropagation();
				event.preventDefault();

				dojo.hitch(this, handler)();

				this.update();
			}, links[i].handler));
			linkList[links[i].id] = { link : link };
		}

		return linkList;
	}
});

dojo.declare('classes.KGSaveEdit.Kitten', classes.KGSaveEdit.core, {
	names: ["Angel", "Charlie", "Mittens", "Oreo", "Lily", "Ellie", "Amber", "Molly", "Jasper",
			"Oscar", "Theo", "Maddie", "Cassie", "Timber", "Meeko", "Micha", "Tami", "Plato" ],
	surnames: ["Smoke", "Dust", "Chalk", "Fur", "Clay", "Paws", "Tails", "Sand", "Scratch", "Berry", "Shadow"],

	game: null,
	village: null,

	name: "Undefined",
	surname: "Undefined",

	getRandomName: function () {
		return this.names[this.game.rand(this.names.length)];
	},

	getRandomSurname: function () {
		return this.surnames[this.game.rand(this.surnames.length)];
	},

	getRandomAge: function () {
		return 16 + this.game.rand(30);
	},

	getRandomTrait: function () {
		return this.traits[this.game.rand(this.traits.length)];
	},

	_traitOptionMap: function (trait) {
		return '<option value="' + trait.name + '">' + trait.title + '</option>';
	},

	job: null,
	trait: null,

	age: 0,

	skills: null,
	exp: 0,
	rank: 0,

	expectedExp: 0,

	isLeader: false,
	isSenator: false,

	constructor: function (game) {
		this.game = game;
		this.village = game.village;
		this.traits = this.village.traits;
		this.traitsByName = this.village.traitsByName;

		this.name = this.getRandomName();
		this.surname = this.getRandomSurname();
		this.trait = this.getRandomTrait();
		this.age = this.getRandomAge();

		this.skills = {};

		// this.render();
	},

	render: function () {
		this.domNode = dojo.create('div', {'class': 'kittenBlock'});
		this.renderEditBlock();

		var block = dojo.create('div', {'class': 'blockContainer'}, this.domNode);
		var div = dojo.create('div', {
			'class': 'kittenSubBlock',
			innerHTML : '[:3] '
		}, block);

		this.nameBlock = dojo.create('span', null, div);
		this.jobBlock = dojo.create('span', null, div);
		dojo.create('br', null, div);

		dojo.place(document.createTextNode('age: '), div);
		this.ageBlock = dojo.create('span', null, div);

		this.kittenSkillsBlock = dojo.create('div', {'class': 'kittenSkillsBlock'}, div);

		div = dojo.create('div', {
			'class': 'kittenSubBlock rightAlign',
			innerHTML: '<div><a href="#">Edit Kitten</a></div>'
		}, block);

		on(div.children[0].children[0], 'click', dojo.hitch(this, this.setEditMode));

		this.unassignJobNode = dojo.create('div', {innerHTML: '<a href="#">Unassign job</a>'}, div);
		on(this.unassignJobNode.children[0], 'click', dojo.hitch(this, function () {
			var job = this.village.getJob(this.job);
			if (job) {
				job.value--;
			}
			this.job = null;
			this.game.update();
		}));
		if (!this.village.getJob(this.job)) {
			dojo.addClass(this.unassignJobNode, 'hidden');
		}

		this.setLeaderNode = dojo.create('div', {innerHTML: '<a href="#" title="Make Leader">&#9734;</a>'}, div);
		on(this.setLeaderNode.children[0], 'click', dojo.hitch(this, function () {
			this.makeLeader();
		}));
		if (this.isLeader) {
			dojo.addClass(this.setLeaderNode, 'hidden');
		}

		this.setSenatorNode = dojo.create('div', {
			innerHTML: '<a href="#">Make Councilor</a>'
		}, div);
		on(this.setSenatorNode.children[0], 'click', dojo.hitch(this, function () {
			this.makeSenator();
		}));

		if (this.village.hideSenate || this.isSenate ||
		this.village.senators.length > this.village.maxSenators) {
			dojo.addClass(this.setSenatorNode, 'hidden');
		}

		this.renderInfo();
	},

	renderInfo: function () {
		if (!this.domNode) {
			return;
		}
		var kittenJob = this.village.getJob(this.job);

		this.nameBlock.textContent = this.name + ' ' + this.surname;
		this.jobBlock.textContent = ' - ' + this.job;
		dojo.toggleClass(this.jobBlock, 'hidden', !kittenJob);

		dojo.toggleClass(this.unassignJobNode, 'hidden', !kittenJob);

		this.ageBlock.textContent = this.age;

		var skillsText = [];
		var skillsArr = this.village.getSkillsSorted(this.skills);
		for (var i = 0, len = skillsArr.length; i < len; i++) {
			var exp = num(skillsArr[i].val);

			if (exp <= 0 && this.job !== skillsArr[i].name) {
				continue;
			}

			skillsText.push(this.village.getSkillLevel(exp) + ' ' + skillsArr[i].name);
		}

		this.kittenSkillsBlock.innerHTML = skillsText.join('<br>');
	},

	renderEditBlock: function () {
		var village = this.village;

		this.editBlock = dojo.create('div', {'class': 'kittenEditBlock hideSiblings hidden'}, this.domNode);
		var table = dojo.create('table', null, this.editBlock);

		var tr = dojo.create('tr', {
			innerHTML: '<td>Name</td><td> <a href="#">Random</a></td>'
		}, table);
		this.editNameNode = this.game._createInput({'class': 'textInput'},
			tr.children[1], null, null, 'first');

		on(tr.children[1].children[1], 'click', dojo.hitch(this, function () {
			this.editNameNode.value = this.getRandomName();
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Surname</td><td> <a href="#">Random</a></td>'
		}, table);
		this.editSurnameNode = this.game._createInput({'class': 'textInput'},
			tr.children[1], null, null, 'first');

		on(tr.children[1].children[1], 'click', dojo.hitch(this, function () {
			this.editSurnameNode.value = this.getRandomSurname();
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Age</td><td> <a href="#">Random</a></td>'
		}, table);
		this.editAgeNode = this.game._createInput({'class': 'integerInput'},
			tr.children[1], null, null, 'first', true);

		on(tr.children[1].children[1], 'click', dojo.hitch(this, function () {
			this.game.setInput(this.editAgeNode, this.getRandomAge(), true);
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Trait</td><td> <a href="#">Random</a></td>'
		}, table);
		var opts = dojo.map(this.traits, this._traitOptionMap);
		this.editTraitNode = dojo.create('select', {innerHTML: opts}, tr.children[1], 'first');
		this.editTraitNode.defaultVal = 'none';

		on(tr.children[1].children[1], 'click', dojo.hitch(this, function () {
			this.game.setSelectByValue(this.editTraitNode, this.getRandomTrait().name);
		}));

		tr = dojo.create('tr', {
			innerHTML: '<td>Rank</td><td></td>'
		}, table);
		this.editRankNode = this.game._createInput({'class': 'integerInput expEdit'},
			tr.children[1], null, null, null, true);

		tr = dojo.create('tr', {
			innerHTML: '<td>Exp</td><td> <a href="#" class="hidden">(Expected: 0)</a></td>'
		}, table);
		this.editExpNode = this.game._createInput({'class': 'expEdit'},
			tr.children[1], null, null, 'first', true);

		this.editExpectedExpNode = tr.children[1].children[1];
		on(this.editExpectedExpNode, 'click', dojo.hitch(this, function () {
			this.game.setInput(this.editExpNode, this.expectedExp);
			this.setExpectedExp();
		}));

		table = dojo.create('table', null, this.editBlock);
		this.editJobs = [];

		var handle = function () {
			var skill = '';
			if (this.expNode.parsedValue > 0) {
				skill = village.getSkillLevel(this.expNode.parsedValue);
			}
			this.skillNode.innerHTML = skill;
		};

		for (var i = 0, len = village.jobs.length; i < len; i++) {
			var job = village.jobs[i];
			var editJob = {
				name: job.name,
				title: job.title
			};
			tr = dojo.create('tr', {
				innerHTML: '<td>' + job.title + '</td><td> <span></span></td>'
			}, table);

			editJob.expNode = this.game._createInput({'class': 'expEdit'},
				tr.children[1], null, null, 'first', true);
			editJob.expNode.handler = dojo.hitch(editJob, handle);

			editJob.skillNode = tr.children[1].children[1];

			this.editJobs.push(editJob);
		}

		var div = dojo.create('div', {innerHTML: ' &nbsp; '}, this.editBlock);
		var btn = dojo.create('input', {
			type: 'button',
			value: 'Save'
		}, div, 'first');
		on(btn, 'click', dojo.hitch(this, this.saveEdits));

		btn = dojo.create('input', {
			type: 'button',
			value: 'Cancel'
		}, div);
		on(btn, 'click', dojo.hitch(this, function () {
			dojo.addClass(this.editBlock, 'hidden');
		}));

		on(this.editBlock, 'input.expEdit:input',
			dojo.hitch(this, this.setExpectedExp));
	},

	getGovernName: function (noTraitStr) {
		var trait = this.trait || this.traitsByName.none;
		return this.name + ' ' + this.surname + ' (' +
			(trait.title === 'None' ? 'No trait' + (noTraitStr || '') :
			trait.title + ' rank ' + this.rank) + ')';
	},

	makeLeader: function (noRender) {
		if (this.isLeader && this.village.leader === this) {
			return;
		}

		var oldLeader = this.village.leader;
		if (oldLeader && oldLeader !== this) {
			oldLeader.isLeader = false;
			if (!noRender) {
				oldLeader.update();
			}
		}

		this.village.leader = this;
		this.isLeader = true;

		if (!noRender) {
			this.village.renderGovernment();
		}
		if (this.village.governmentFilter.selected) {
			this.village.takeCensus();
		}
		this.update();
	},

	fireLeader: function (noRender) {
		this.isLeader = false;

		if (!noRender) {
			this.update();
		}
		if (this.village.leader === this) {
			this.village.leader = null;
			if (!noRender) {
				this.village.renderGovernment();
			}
			if (this.village.governmentFilter.selected) {
				this.village.takeCensus();
			}
		}
	},

	makeSenator: function (noRender) {
		this.isSenator = true;
		if (this.village.senators.indexOf(this) > -1) {
			return;
		}

		this.village.senators.push(this);

		if (!noRender) {
			if (this.village.senators.length >= 5) {
				this.village.updateKittens();
			} else {
				this.update();
			}
			this.village.renderGovernment();
		}

		if (this.village.governmentFilter.selected) {
			this.village.takeCensus();
		}
	},

	fireSenator: function (noRender) {
		this.isSenator = false;
		var index = this.village.senators.indexOf(this);

		if (index > -1) {
			var oldLength = this.village.senators.length;
			this.village.senators.splice(index, 1);
			if (!noRender) {
				if (oldLength >= 5) {
					this.village.updateKittens();
				} else {
					this.update();
				}
				this.village.renderGovernment();
			}
			if (this.village.governmentFilter.selected) {
				this.village.takeCensus();
			}
		} else if (!noRender) {
			this.render();
		}
	},

	setExpectedExp: function () {
		var exp = 0;
		var currExp = this.editExpNode.parsedValue;

		for (var i = this.editJobs.length - 1; i >= 0; i--) {
			exp += this.editJobs[i].expNode.parsedValue;
		}

		exp -= this.village.getRankExpSum(this.editRankNode.parsedValue);
		exp = Math.max(exp, 0) || 0;

		this.expectedExp = exp;
		this.editExpectedExpNode.textContent = '(Expected: ' + exp + ')';
		dojo.toggleClass(this.editExpectedExpNode, 'hidden', exp <= Math.ceil(currExp));
	},

	setEditMode: function () {
		this.editNameNode.value = this.name;
		this.editSurnameNode.value = this.surname;
		this.game.setInput(this.editAgeNode, this.age);
		this.game.setSelectByValue(this.editTraitNode, this.trait.name || this.trait);
		this.game.setInput(this.editRankNode, this.rank);
		this.game.setInput(this.editExpNode, this.exp);

		for (var i = this.editJobs.length - 1; i >= 0; i--) {
			var job = this.editJobs[i];
			this.game.setInput(job.expNode, num(this.skills[job.name]));
		}

		this.setExpectedExp();
		dojo.removeClass(this.editBlock, 'hidden');
	},

	saveEdits: function () {
		var skills = {};
		for (var i = 0, len = this.editJobs.length; i < len; i++) {
			var job = this.editJobs[i];
			var exp = job.expNode.parsedValue;
			if (exp > 0 || job.name === this.job) {
				skills[job.name] = exp;
			}
		}

		this.load({
			name: this.editNameNode.value,
			surname: this.editSurnameNode.value,
			age: this.editAgeNode.parsedValue,
			rank: this.editRankNode.parsedValue,
			exp: this.editExpNode.parsedValue,
			trait: this.editTraitNode.value,
			job: this.job,
			skills: skills,
			isLeader: this.isLeader,
			isSenator: this.isSenator
		});

		if (this.isLeader || (!this.village.hideSenate && this.isSenate)) {
			this.village.renderGovernment();
		}
	},

	update: function () {
		if (this.domNode) {
			dojo.toggleClass(this.setLeaderNode, 'hidden', Boolean(this.isLeader));
			dojo.toggleClass(this.setSenatorNode, 'hidden', this.village.hideSenate ||
				Boolean(this.isSenator) || this.village.senators.length >= this.village.maxSenators);
		}
	},

	save: function () {
		var saveKitten = this.game.filterMetaObj(this, ['name', 'surname', 'trait',
			'age', 'skills', 'exp', 'job', 'rank', 'isLeader', 'isSenator']);

		if (!saveKitten.name && !saveKitten.surname) {
			saveKitten.name = this.getRandomName();
			saveKitten.surname = this.getRandomSurname();
		}

		if (!this.village.getJob(saveKitten.job)) {
			saveKitten.job = null;
		}

		var newSkills = {};
		for (var job in saveKitten.skills) {
			var skill = saveKitten.skills[job];
			if (this.village.getJob(job) && (saveKitten.job === job || skill > 0)) {
				newSkills[job] = Math.max(num(skill), 0);
			}
		}
		saveKitten.skills = newSkills;

		return saveKitten;
	},

	load: function (data) {
		if (this.domNode) {
			dojo.addClass(this.editBlock, 'hidden');
		}

		var wasLeader = this.isLeader;
		var wasSenator = this.isSenator;

		this.name      = typeof data.name === 'string' ? data.name : this.village.getRandomName();
		this.surname   = typeof data.surname === 'string' ? data.surname : this.village.getRandomSurname();
		this.age       = Math.max(Math.floor(num(data.age)), 0);
		this.exp       = Math.max(num(data.exp), 0);
		this.trait     = data.trait;
		this.job       = this.village.getJob(data.job) ? data.job : undefined;
		this.rank      = Math.max(Math.floor(num(data.rank)), 0);
		this.isLeader  = Boolean(data.isLeader);
		this.isSenator = Boolean(data.isSenator);

		if (this.trait) {
			var trait = this.trait.name ? this.trait.name : this.trait;
			this.trait = this.traitsByName[trait];
		}
		if (!this.trait) {
			this.trait = this.traitsByName.none;
		}

		var newSkills = {};
		if (data.skills) {
			var skills = data.skills;
			for (var job in skills) {
				var skill = Math.max(num(skills[job]), 0);
				if (this.village.getJob(job) && (skill || this.job === job)) {
					newSkills[job] = skill;
				}
			}
		}
		this.skills = newSkills;

		if (this.isLeader) {
			this.makeLeader(true);
		} else if (wasLeader) {
			this.fireLeader(true);
		}

		if (this.isSenator) {
			this.makeSenator(true);
		} else if (wasSenator) {
			this.fireSenator(true);
		}

		this.renderInfo();
		this.update();
	}
});

});
