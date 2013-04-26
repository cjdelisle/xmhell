/*
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE Blah>
<a>Hello</a>
<!-- World -->
<![CDATA[abcdefg]]>
<b>zz</b>
*/

var async = function(say) {
    return function(writer, callback) {
        process.nextTick(function() {
            writer.write(say);
            process.nextTick(callback);
        });
    };
};

module.exports = {
    '#DOCTYPE':async("Blah"),
    a:async("Hello"),
    '#COMMENT':async(" World "),
    '#CDATA':async("abcdefg"),
    'b':'zz'
};
