require("../../src/js/jquery.modal.js");

QUnit.module("modal");

QUnit.test("should show", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture
		});

	assert.equal($($modal, $fixture).length, 1, "added successfully!");
	assert.ok($($modal, $fixture).is(":visible"), "shown successfully!");
});

QUnit.asyncTest("should dismiss", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture
		});

	$modal.modal("dismiss");

	setTimeout(function() {
		assert.equal($modal.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});

QUnit.asyncTest("should dismiss on click on backdrop", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture,
			dismiss: true
		});

	$fixture.find(".backdrop").click();

	setTimeout(function() {
		assert.equal($modal.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});

QUnit.asyncTest("should not dismiss on click on backdrop", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture,
			dismiss: false
		});

	$fixture.find(".backdrop").click();

	setTimeout(function() {
		assert.ok($modal.is(":visible"), "not dismissed!");

		QUnit.start();
	}, 500);
});

QUnit.asyncTest("should dismiss on escape", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture,
			dismiss: true
		});

	$(document).trigger($.Event("keydown", { keyCode: 27 }));

	setTimeout(function() {
		assert.equal($modal.is(":visible"), false, "dismissed successfully!");

		QUnit.start();
	}, 500);
});

QUnit.asyncTest("should not dismiss on escape", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture,
			dismiss: false
		});

	$(document).trigger($.Event("keydown", { keyCode: 27 }));

	setTimeout(function() {
		assert.ok($modal.is(":visible"), "not dismissed!");

		QUnit.start();
	}, 500);
});

QUnit.test("should have backdrop", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture,
			backdrop: true
		});

	assert.equal($($(".backdrop"), $fixture).length, 1, "has backdrop!");
});

QUnit.test("should not have backdrop", function(assert) {
	var $fixture = $("#qunit-fixture"),
		$modal = $("<div>").text("A test modal").modal({
			parent: $fixture,
			backdrop: false
		});

	assert.equal($($(".backdrop"), $fixture).length, 0, "doesn't have backdrop!");
});
