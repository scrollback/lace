require("../../src/js/jquery.progressbar.js");

QUnit.module("progressbar");

QUnit.test("should show", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$progressbar = $("<div>").progressbar({
			parent: $fixture
		});

	assert.equal($($progressbar, $fixture).length, 1, "added successfully!");
	assert.ok($($progressbar, $fixture).is(":visible"), "shown successfully!");
});

QUnit.asyncTest("should dismiss", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$progressbar = $("<div>").progressbar({
			parent: $fixture
		});

	$progressbar.progressbar("dismiss");

	setTimeout(function() {
		assert.equal($progressbar.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});

QUnit.asyncTest("should set width", function(assert) {
	var amount = Math.round(Math.random() * 100),
		$fixture = $("#qunit-fixture"),
		$progressbar = $("<div>").progressbar({
			parent: $fixture
		});

	$progressbar.progressbar("set", amount);

	setTimeout(function() {
		assert.equal(Math.round($progressbar.width() / $(document).width() * 100), amount, "width set successfully!");

		QUnit.start();
	}, 500);
});
