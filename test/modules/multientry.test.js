require("../../src/js/jquery.multientry.js");

QUnit.module("multientry");

QUnit.test("should be created", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$multientry = $.multientry("create").appendTo($fixture);

	assert.equal($($multientry, $fixture).length, 1, "added successfully!");
	assert.ok($($multientry, $fixture).is(":visible"), "shown successfully!");
});

QUnit.test("should add values", function(assert) {
	expect(3);

	var vals, elems = [ "test", "hello", "world" ],
		$fixture = $("#qunit-fixture"),
		$multientry = $.multientry("create").appendTo($fixture);

	vals = $multientry.multientry("add", elems).multientry("items");

	elems.forEach(function(elem) {
		assert.ok((vals.indexOf(elem) > -1), "'" + elem + "' added successfully!");
	});
});

QUnit.test("should add values on text entry", function(assert) {
	expect(9);

	var vals, elems = [ "test", "hello", "world" ],
		keycodes = [ 13, 32, 188 ],
		$fixture = $("#qunit-fixture"),
		$multientry = $.multientry("create").appendTo($fixture);

	keycodes.forEach(function(code) {
		elems.forEach(function(elem) {
			$multientry.find("[contenteditable=true]").text(elem + " ").trigger($.Event("keydown", { keyCode: code }));

			vals = $multientry.multientry("items");

			assert.ok((vals.indexOf(elem) > -1), "'" + elem + "' added successfully (keycode: " + code + ")!");
		});

		$multientry.multientry("remove", $multientry.multientry("items"));
	});
});

QUnit.test("should remove values", function(assert) {
	expect(3);

	var vals, elems = [ "test", "hello", "world" ],
		$fixture = $("#qunit-fixture"),
		$multientry = $.multientry("create").multientry("add", elems).appendTo($fixture);

	elems.forEach(function(elem) {
		vals = $multientry.multientry("remove", elem).multientry("items");

		assert.equal(vals.indexOf(elem), -1, "'" + elem + "' removed successfully!");
	});
});

QUnit.test("should remove values on click on close", function(assert) {
	expect(3);

	var vals, elems = [ "test", "hello", "world" ],
		$fixture = $("#qunit-fixture"),
		$multientry = $.multientry("create").multientry("add", elems).appendTo($fixture);

	elems.forEach(function(elem) {
		$multientry.find(".item-text:contains(" + elem + ")").parent().find(".item-remove").click();

		vals = $multientry.multientry("items");

		assert.equal(vals.indexOf(elem), -1, "'" + elem + "' removed successfully!");
	});
});
