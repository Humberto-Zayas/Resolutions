// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by simple.js.
import { name as packageName } from "meteor/simple";

// Write your tests here!
// Here is an example.
Tinytest.add('simple - example', function (test) {
  test.equal(packageName, "simple");
});
