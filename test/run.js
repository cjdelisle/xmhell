;(function() {
    "use strict";

    var tests = [
        "ReversibilityTest",
        "ParserTest",
        "WriterTest"
    ];

    var Whiskey = require('whiskey');

    var ts = '';
    for (var i = 0; i < tests.length; i++) {
        ts += tests[i] + '.js ';
    }
    process.chdir(__dirname);
    Whiskey.run(['--tests', ts.trim()]);

})();
