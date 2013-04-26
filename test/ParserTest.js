;(function() {
    "use strict";
    var PATH = __dirname + '/ParserTest_samples';
    var Fs = require ("fs");
    var XMHell = require ("../index");
    var JsDiff = require("diff");
    var nThen = require("nthen");

    var mkTest = function (xmlFile, jsonFile) {
        return function (test, assert) {
            Fs.readFile(xmlFile, 'utf8', function (err, xml) {
                if (err) { throw err; }
                var dat = XMHell.parse(xml);
                var datB = require(jsonFile);
                assert.deepEqual(dat, datB);
                test.finish();
            });
        }
    };

    var files = Fs.readdirSync(PATH);
    files.forEach(function(fileName) {
        if (fileName.match(/\.xml$/)) {
            var jsonI = files.indexOf(fileName.replace(/\.xml$/, '.js'));
            if (jsonI === -1) { throw new Error(); }
            exports["test_" + fileName] = mkTest(PATH + '/' + fileName, PATH + '/' + files[jsonI]);
        }
    });

})();
