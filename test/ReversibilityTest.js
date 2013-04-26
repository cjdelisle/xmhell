;(function() {
    "use strict";
    var PATH = __dirname + '/ReversibilityTest_samples';
    var Fs = require ("fs");
    var XMHell = require ("../index");
    var JsDiff = require("diff");

    var mkTest = function (fileName) {
        return function (test, assert) {
            Fs.readFile(fileName, 'utf8', function (err, xml) {
                if (err) { throw err; }
                var dat = XMHell.parse(xml);
                var out = '';
                //console.log(JSON.stringify(dat, null, '  '));
                XMHell.write(dat, {write:function(x){out+=x;}}, function() {
                    //console.log("{{{"+out+"}}}");
                    if (xml !== out) {
                        console.log(JsDiff.createPatch("differences", xml, out, "", ""));
                        assert.fail();
                    }
                    test.finish();
                });
            });     
            
        }
    };

    Fs.readdirSync(PATH).forEach(function(fileName) {
        if (fileName.match(/\.xml$/)) {
            exports["test_" + fileName] = mkTest(PATH + '/' + fileName);
        }
    });

})();
