# XMHell - XML to JSON and back.

*XML is like violence. Sure, it seems like a quick and easy solution at first, but then it spirals out of control into utter chaos.* - Sarkos

![xml-rocks](https://raw.github.com/cjdelisle/xmhell/master/xml.gif)

This library exports 4 functions.

* `parse()`: same as JSON.parse(), takes a string and returns a javascript object.
* `write()`: takes an object, a writer (anything with a function called write), and a callback.
Writes the JSON object as XML and then calls the callback when complete.
* `escape()`: Escapes XML entities.
* `unescape()`: You get the idea.

Example:

    > var XMHell = require('xmhell');
    > j = XMHell.parse('<?xml?>\n<doc><x><y>abcdefg</y></x><!-- comment --></doc>');
    { doc: 
       { x: { y: 'abcdefg' },
         '#COMMENT': ' comment ' } }
    > 
    > XMHell.write(j, process.stdout, function() { console.log('done!'); });
    <?xml version="1.0" encoding="UTF-8"?>
    <doc>
      <x>
        <y>abcdefg</y>
      </x>
      <!-- comment -->
    </doc>
    done!
    >

You can provide a function in place of a string in your JSON document and this function will be
called with a writer and a callback to be called upon completion. The provided writer escapes XML
entities.

    > var async = function(writer, callback) { writer.write('async & stuff'); callback(); };
    > XMHell.write({"a":async}, process.stdout);
    <?xml version="1.0" encoding="UTF-8"?>
    <a>async &amp; stuff</a>

Multiple tags by the same name are converted to numbered keys in the json hash.

    > XMHell.parse('<?xml?><doc><x/><x/><x/><x/><x/><x/></doc>');
    { doc: 
       { x: '',
         'x 2': '',
         'x 3': '',
         'x 4': '',
         'x 5': '',
         'x 6': '' } }

Any trailing numbers are stripped from the key when generating the tag name.

    > XMHell.write({'a 9000':1, 'a 3': 2, a:3}, process.stdout);
    <?xml version="1.0" encoding="UTF-8"?>
    <a>1</a>
    <a>2</a>
    <a>3</a>

Comments, cdata and doctypes are expressed using special keys called `#COMMENT`,
`#CDATA` and `#DOCTYPE`.

    > XMHell.parse('<?xml?><!DOCTYPE blah><!-- This is a comment --><![CDATA[yay cdata]]>');
    { '#DOCTYPE': 'blah',
      '#COMMENT': ' This is a comment ',
      '#CDATA': 'yay cdata' }


## There are millions of XML parsers, why would you do such a thing?!

This parser concentrates on making it possible to represent any valid XML as *something* in JSON
where it can be manipulated and then converted to XML. It preserves comments and prettyprints the
result with 2 spaces per tab.

## What if you feed it invalid XML?

No idea, how about you try and find out!
If it makes you feel better, this parser is guaranteed not to generate invalid json.

## Does it support attributes and namespaces?

Sure does!

    <feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xml:lang="en-US">
    </feed>

Converts to:

    "feed xmlns=\"http://www.w3.org/2005/Atom\" xmlns:media=\"http://search.yahoo.com/mrss/\" xml:lang=\"en-US\"": {
    }

## How about custom entities?

LOL you're joking right?

## This idea is bad and you should feel bad.

What did you expect? XMHeaven? Anyway this was
[not](http://en.wikipedia.org/wiki/Jean_Paoli)
[my](http://en.wikipedia.org/wiki/Tim_Bray)
[idea](http://en.wikipedia.org/wiki/Michael_Sperberg-McQueen).

## Your [angle bracket tax](http://www.codinghorror.com/blog/2008/05/xml-the-angle-bracket-tax.html) is due!

Send an invoice.
