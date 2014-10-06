require("../../src/js/jquery.alertbar.js");

QUnit.module("alertbar");

QUnit.test("should show", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$alertbar = $("<div>").text("A test alert").alertbar({
			parent: $fixture
		});

	assert.equal($($alertbar, $fixture).length, 1, "added successfully!");
	assert.ok($($alertbar, $fixture).is(":visible"), "shown successfully!");
});

QUnit.asyncTest("should dismiss", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$alertbar = $("<div>").text("A test alert").alertbar({
			parent: $fixture
		});

	$alertbar.alertbar("dismiss");

	setTimeout(function() {
		assert.equal($alertbar.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});

QUnit.asyncTest("should dismiss on click on close", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$alertbar = $("<div>").text("A test alert").alertbar({
			parent: $fixture
		});

	$alertbar.parent().find(".alert-remove").click();

	setTimeout(function() {
		assert.equal($alertbar.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});

QUnit.test("should have correct type", function(assert) {
	var type = "warning",
		$fixture = $("#qunit-fixture"),
		$alertbar = $("<div>").text("A test alert").alertbar({
			parent: $fixture,
			type: type
		});

	assert.ok($($alertbar.parent(), $fixture).hasClass(type), "has correct type: " + type + "!");
});
