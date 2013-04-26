# XMHell

Read XML into a JSON structure and then convert that JSON back into XML.
If it's good enough for the web, it's good enough for config files!


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

LOL you're not serious right?

## This idea is bad and you should feel bad.

It was [not](http://en.wikipedia.org/wiki/Jean_Paoli) [my](http://en.wikipedia.org/wiki/Tim_Bray)
[idea](http://en.wikipedia.org/wiki/Michael_Sperberg-McQueen).

## Your [angle bracket tax](http://www.codinghorror.com/blog/2008/05/xml-the-angle-bracket-tax.html) is due!

Send an invoice.
