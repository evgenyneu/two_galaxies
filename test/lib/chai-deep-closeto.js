(function(chaiDeepCloseTo) {
  "use strict";

  // Module systems magic dance.

  if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
    // NodeJS
    module.exports = chaiDeepCloseTo;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
        return chaiDeepCloseTo;
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    chai.use(chaiDeepCloseTo);
  }

})(function(chai, _) {
  "use strict";

  var Assertion = chai.Assertion;

  Assertion.addMethod("clsTo", function(expected, delta, msg) {
    var actual = _.flag(this, "object");

    if (![ actual, expected ].every(Array.isArray)) {
      return this.closeTo(expected, delta, msg);
    }

    msg = msg || "";
    for (var i = 0, imax = Math.max(actual.length, expected.length); i < imax; ++i) {
      new Assertion(actual[i]).deep.closeTo(expected[i], delta, msg + "[" + i + "]");
    }

    return this;
  });

  Assertion.overwriteMethod("closeTo", function(_super) {
    return function(expected, delta, msg) {
      var actual = _.flag(this, "object");

      if ( _.flag(this, "deep") && [ actual, expected ].every(Array.isArray) ) {
        return this.clsTo(expected, delta, msg);
      }

      return _super.apply(this, arguments);
    };
  });

});
