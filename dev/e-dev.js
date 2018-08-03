/* global dojo, require, classes, jsondiffpatch */

require(["dojo/on"], function (on) {
"use strict";

if (!window.jsondiffpatch) {
	return;
}

var instance = jsondiffpatch.create({
	objectHash: function (obj, index) {
		if (typeof obj._id !== 'undefined') {
			return obj._id;
		}
		if (typeof obj.id !== 'undefined') {
			return obj.id;
		}
		if (typeof obj.name !== 'undefined') {
			return obj.name;
		}
		return '$$index:' + index;
	}
});

dojo.declare("classes.KGSaveEdit.DevMode", classes.KGSaveEdit.UI.Tab, {
	overwriteCompareOnImport: true,
	showUnchanged: false,

	tabName: "Dev",
	tabNodeClass: "smallCaps",

	renderTabBlock: function () {
		var self = this;
		var div = dojo.create("div", {
			class: "bottom-margin",
			innerHTML: 'Dev Save Compare<br>' +
				'<textarea id="devCompareArea" class="saveArea" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea><br>' +
				'<input id="devCompareRun" type="button" value="Compare">&nbsp;'
		}, self.tabBlockNode);

		self.compareDataArea = dojo.byId("devCompareArea");

		var input = self.game._createCheckbox("Show unchanged properties", div, self, "showUnchanged");

		input.cbox.handler = function () {
			self.toggleUnchanged();
		};

		self.compareSummaryBlock = dojo.create("div", {
			id: "devCompareSummary",
			class: "margin-bottom hidden"
		}, self.tabBlockNode);

		self.compareResultsBlock = dojo.create("pre", {
			id: "devCompareResults",
			class: "devCompareBlock",
			style: "max-height: 300px; overflow-y: auto;"
		}, self.tabBlockNode);

		on(dojo.byId("devCompareRun"), "click", function () {
			var data = self.compareDataArea.value.trim();
			data = data[0] === "{" ? data : self.game.decompressSave(data);
			var json = JSON.parse(data);
			self.runCompare(json);
		});

		dojo.empty("importDevSpan");
		input = self.game._createCheckbox("Set dev compare data", dojo.byId("importDevSpan"), self, "overwriteCompareOnImport");
		input.label.style.marginLeft = "5px"; //sigh
	},

	setCompareData: function (data) {
		if (typeof data !== "string") {
			data = JSON.stringify(data);
		}
		this.compareDataArea.value = data;
	},

	runCompare: function (ref) {
		var current = this.game.exportSave();
		var delta = instance.diff(ref, current);

		this.compareResultsBlock.innerHTML = "";

		if (!delta) {
			this.compareSummaryBlock.innerHTML = "No differences found.";
			dojo.removeClass(this.compareSummaryBlock, "hidden");
			return;
		}

		var negatedKittens = [];

		//remove negative job experience wipes from the delta for cleaner output
		//keeps other changes to kittens/village, if any
		if (delta.village && delta.village.kittens) {
			var newKittens = {};

			for (var index in delta.village.kittens) {
				var deltaKitten = delta.village.kittens[index];
				if (index === "_t" || !deltaKitten.skills) {
					newKittens[index] = deltaKitten;
					continue;
				}

				var keepKitten = false;

				if (Object.keys(deltaKitten).toString() !== "skills") {
					keepKitten = true;
				}

				var kittenNegated = false;
				var keptSkills = {};
				for (var key in deltaKitten.skills) {
					var skill = deltaKitten.skills[key];
					if (skill.length === 3 && skill[0] <= 0 && skill[1] === 0 && skill[2] === 0) {
						if (!kittenNegated) {
							negatedKittens.push(index);
							kittenNegated = true;
						}
					} else {
						keptSkills[key] = skill;
						keepKitten = true;
					}
				}

				if (keepKitten) {
					var clone = {};
					for (var keepKey in deltaKitten) {
						if (keepKey === "skills") {
							if (!$.isEmptyObject(keptSkills)) {
								clone[keepKey] = keptSkills;
							}
						} else {
							clone[keepKey] = deltaKitten[keepKey];
						}
					}

					newKittens[index] = clone;
				}
			}

			var keys = Object.keys(newKittens);
			if (!keys.length || keys.toString() === "_t") {
				delete delta.village.kittens;

				if (Object.keys(delta.village).length === 0) {
					delete delta.village;
				}
			} else {
				delta.village.kittens = newKittens;
			}
		}

		var summaryHTML = "";

		if (negatedKittens.length > 0) {
			summaryHTML = negatedKittens.length + " kittens had non-positive job experience values wiped.<br><br>";
			console.log("negatedKittens indeces: " + negatedKittens.join(", "));
		}

		if ($.isEmptyObject(delta)) {
			summaryHTML += "No other differences found.";
		} else {
			this.compareResultsBlock.innerHTML = jsondiffpatch.formatters.html.format(delta, ref);
			this.toggleUnchanged();
		}

		this.compareSummaryBlock.innerHTML = summaryHTML;
		dojo.toggleClass(this.compareSummaryBlock, "hidden", !summaryHTML);
	},

	toggleUnchanged: function () {
		jsondiffpatch.formatters.html.showUnchanged(this.showUnchanged, this.compareResultsBlock, 0);
	}
});


});
