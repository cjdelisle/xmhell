;(function() {
    var addTag = function(container, tag, value) {
        container = container || {};
        for (var j = 2; typeof(container[tag]) !== 'undefined'; j++) {
            tag = tag.replace(/ [0-9]*$/, '') + " " + j;
        }
        container[tag] = value;
        return container;
    }

    module.exports = {
        addTag: addTag
    };

})();
