;(function() {
    var unescapeXML = function (s) {
        var xmlChars = {
            '&lt;': '<',
            '&gt;': '>',
            '&amp;': '&',
            '&quot;': '"',
            '&apos;': "'"
        };
        return s.replace(/&[^;]*;/g, function (ch) {
            return xmlChars[ch] || ((ch[1] === '#') ?
                (function() {
                    var n = Number(ch.substring(2, ch.length-1));
                    if (isNaN(n)) { throw new Error("unrecognized entity ["+ch+"]"); }
                    return unescape("%"+n.toString(16))
                })() :
                (function() {
                    throw new Error("unrecognized entity ["+ch+"]");
                })());
        });
    };
    var escapeXML = function (s) {
        var xmlChars = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return s.replace(/[<>&"']/g, function (ch) {
            return xmlChars[ch];
        });
    }
    module.exports = {
        escape: escapeXML,
        unescape: unescapeXML
    };
})();
