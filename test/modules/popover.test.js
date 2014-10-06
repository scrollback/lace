require("../../src/js/jquery.popover.js");

QUnit.module("popover");

QUnit.test("should show", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$origin = $("<div>").css({
			width: "1em",
			height: "1em",
			margin: "auto"
		}).appendTo($fixture),
		$popover = $("<div>").text("A test popover").popover({
			parent: $fixture,
			origin: $origin
		});

	assert.equal($($popover, $fixture).length, 1, "added successfully!");
	assert.ok($($popover, $fixture).is(":visible"), "shown successfully!");
});

QUnit.asyncTest("should dismiss", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$origin = $("<div>").css({
			width: "1em",
			height: "1em",
			margin: "auto"
		}).appendTo($fixture),
		$popover = $("<div>").text("A test popover").popover({
			parent: $fixture,
			origin: $origin
		});

	$popover.popover("dismiss");

	setTimeout(function() {
		assert.equal($popover.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});

QUnit.asyncTest("should dismiss on click on outside", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$origin = $("<div>").css({
			width: "1em",
			height: "1em",
			margin: "auto"
		}).appendTo($fixture),
		$popover = $("<div>").text("A test popover").popover({
			parent: $fixture,
			origin: $origin
		});

	$fixture.find(".popover-layer").click();

	setTimeout(function() {
		assert.equal($popover.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});
