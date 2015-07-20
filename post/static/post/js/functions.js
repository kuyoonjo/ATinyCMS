/**
 * Created by yuchen on 7/17/15.
 */

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

function HighlightCode() {
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}