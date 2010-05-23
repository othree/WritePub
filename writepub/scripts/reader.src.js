/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function (w) {

$.extend(w, {reader: {
    init: function () {
        if (!w.inited) { return false; }
        this.inited = true;
        this._instance = $('#reader');
    },
    setContent: function (content) {
        if (typeof content != 'string') { return false; }
        if (w.reader.inited) {
            w.reader._instance.html(content);
            w.reader._instance.page();
        } else {
            setTimeout(function () {
                w.reader._instance.html(content);
                w.reader._instance.page();
            }, 100);
        }
    },
    getContent: function () {
        if (!w.editor.inited) { return false; }
        return w.reader._instance.html();
    },
    show: function () {
        this._instance.show();
    },
    hide: function () {
        this._instance.hide();
    },
    inited: false,
    _instance: null
}});

})(writepub);
