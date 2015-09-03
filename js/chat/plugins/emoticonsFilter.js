/**
 * Simple Emoticon filter that converts plain-text emoticons to <DIV> with css class names based on the emoticon
 *
 * @param megaChat
 * @returns {EmoticonsFilter}
 * @constructor
 */
var EmoticonsFilter = function(megaChat) {
    var self = this;

    self.emoticonsMap = {

        ':-)': 'smile',
        ':)': 'smile',

        ';-)': 'wink',
        ';)': 'wink',

        ':p': 'tongue',
        ':P': 'tongue',
        ':-P': 'tongue',
        ':-p': 'tongue',

        ':D': 'grin',
        ':d': 'grin',

        ':|': 'confuse',
        ':-|': 'confuse',

        ':o': 'grasp',
        ':O': 'grasp',

        ':-(': 'sad',
        ':(': 'sad',

        ';(': 'cry',
        ':\'(': 'cry',
        ';-(': 'cry',

        '(angry)': 'angry',

        '(mega)': 'mega'
    };

    //RegExpEscape

    var escapedRegExps = [];
    $.each(self.emoticonsMap, function(k, v) {
        escapedRegExps.push(
            RegExpEscape(k)
        );
    });

    var regExpStr = "(^|\\W)(" + escapedRegExps.join("|") + ")(?=(\\s|$))";

    self.emoticonsRegExp = new RegExp(regExpStr, "gi");

    megaChat.bind("onBeforeRenderMessage", function(e, eventData) {
        self.processMessage(e, eventData);
    });

    return this;
};

EmoticonsFilter.prototype.processMessage = function(e, eventData) {
    var self = this;

    // use the HTML version of the message if such exists (the HTML version should be generated by hooks/filters on the
    // client side.
    var messageContents = eventData.message.messageHtml ? eventData.message.messageHtml : eventData.message.getContents();

    if(!messageContents) {
        return; // ignore, maybe its a system message (or composing/paused composing notification)
    }

    messageContents = messageContents.replace(self.emoticonsRegExp, function(match) {
        var cssClassName = self.emoticonsMap[$.trim(match.toLowerCase())];

        if(cssClassName) {
            return '<span class="fm-chat-smile ' + cssClassName + '" title="' + match + '">' + match + '</span>'
        } else {
            return match;
        }
    });

    eventData.message.messageHtml = messageContents;
};
