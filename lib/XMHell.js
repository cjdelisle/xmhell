module.exports = (function() {
    var Escape = require('./Escape');
    var Util = require('./Util');

    var read = function(data) {
        var i = data.indexOf('<')+1, isXML;
        var p = function(cont) {
            for (; i > 0; i = data.indexOf('<', i)+1) {
                switch (data[i]) {
                    case '?':
                        isXML = true;
                        break;

                    case '!':
                        var z;
                        if (data.substring(i, i+3) === '!--') {
                            z = data.indexOf('-->', i);
                            cont = Util.addTag(cont, '#COMMENT', data.substring(i+3, z));
                        } else if (data.substring(i, i+8) === '![CDATA[') {
                            z = data.indexOf(']]>', i);
                            cont = Util.addTag(cont, '#CDATA', data.substring(i+8, z));
                        } else if (data.substring(i, i+8) === '!DOCTYPE') {
                            z = data.indexOf('>', i);
                            cont = Util.addTag(cont, '#DOCTYPE', data.substring(i+9, z));
                        } else { throw Error("Unexpected data [" + data.substring(i, i+100)); }
                        i = z+1;
                        break;

                    case '/':
                        return cont || Escape.unescape(data.substring(data.indexOf('>', data.lastIndexOf('<',i-2)) + 1, i-1));

                    default:
                        if (!isXML) { throw new Error("this doesn't look like XML: [" + data.substring(0,100) + "]"); }
                        var tag = data.substring(i, data.indexOf('>', i));
                        if (tag[tag.length-1] === '/') {
                            cont = Util.addTag(cont, tag.replace(/\s*\/$/, ''), '');
                            continue;
                        }
                        i = data.indexOf('<', i+tag.length-1)+1;
                        cont = Util.addTag(cont, tag.replace(/\s*$/, ''), p());
                }
            }
            return cont;
        };
        return p();
    };

    var EscapingWriter = function (writer) {
        this.write = function(content) {
            writer.write(Escape.escape(content));
        };
    };

    var writeSpecial = function (w, key, keyval, callback) {
        var write = function(ending) {
            var val = keyval.shift();
            if (typeof(val) === 'function') {
                val(w, function() { w.write(ending); callback() });
            } else {
                w.write(String(val));
                w.write(ending);
                callback();
            }
        };
        switch (key) {
            case "#COMMENT": w.write("<!--"); write("-->\n"); break;
            case "#CDATA":   w.write("<![CDATA["); write("]]>\n"); break;
            case "#DOCTYPE": w.write("<!DOCTYPE "); write(">\n"); break;
            default: return false;
        }
        return true;
    };

    /**
     * Write out XML.
     * @param obj a JSON object.
     * @param w an object with a 'write' function.
     * @param andThen callback when it's done.
     * @param count should be undefined.
     */
    var write = function (obj, w, andThen, count) {
        if (count == undefined) {
            count = 0;
            w.write('<?xml version="1.0" encoding="UTF-8"?>');
            andThen = andThen || function() {};
        }

        switch (typeof(obj)) {
            case 'string': w.write(Escape.escape(obj)); andThen(); return;
            case 'undefined': andThen(); return;
            case 'function': obj(new EscapingWriter(w), andThen); return;
            case 'object': break;
            case 'number':
            case 'boolean': w.write(String(obj)); andThen(); return;
            default: w.write(typeof(obj)); andThen(); return;
        }

        var appendSpace = function() {
            for (var i = 0; i < count; i++) { w.write('  '); }
        };

        if (Object.keys(obj).length === 0) { andThen(); return; }
        w.write('\n');
        var keyVal = [];
        for (var key in obj) {
            if (Array.isArray(obj[key])) {
                var elems = obj[key];
                for (var i = 0; i < elems.length; i++) {
                    keyVal.push(key, elems[i]);
                }
            } else {
                keyVal.push(key, obj[key]);
            }
        }

        var addTag = function (callback) {
            var key = keyVal.shift();
            if (!key) { callback(); return; }
            appendSpace();

            // strip a trailing " 2" but leave '<tag key="val">
            // the trailing " 2" is used for multiple tags with
            // the same name.
            var k = key.replace(/ [0-9]*$/, '');

            if (!writeSpecial(w, k, keyVal, function() { addTag(callback); })) {
                var val = keyVal.shift();
                if (val === '') {
                    w.write('<' + k + ' />\n');
                    addTag(callback);
                } else {
                    w.write('<' + k + '>');
                    write(val, w, function() {
                        // strip anything following the tag name.
                        w.write('</' + key.replace(/ .*/, '') + '>\n');
                        addTag(callback);
                    }, count+1);
                    return;
                }
            }
        };
        addTag(function() {
            count--;
            appendSpace();
            andThen();
        });
    };

    return {
        escape: Escape.escape,
        unescape: Escape.unescape,
        parse: read,
        write: write
    };
})();
