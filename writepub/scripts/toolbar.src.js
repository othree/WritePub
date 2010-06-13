/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */
(function (w) {

$.extend(w, {toolbar: {
    init: function (bar) {
        if (!w.inited || w.toolbar.inited) { return false; }
        w.toolbar.inited = true;
        this.bar = bar;
        bar.bind('click', w.toolbar.event);
        if (w.options.mode == 'w') {
            bar.find('#toolbar-write').hide();
        } else {
            bar.find('#toolbar-write').hide();
            bar.find('#toolbar-read').hide();
        }
    },
    event: function (e) {
        var todo = e.target.href;
        if (todo) {
            todo = todo.substring(todo.indexOf('#')+1);
            if ($.isFunction(w.toolbar[todo])) {
                w.toolbar[todo].call(e.target, e);
            }
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    },
    read: function() {
        w.switchViewport('r');
        w.toolbar.bar.find('#toolbar-write').show();
        w.toolbar.bar.find('#toolbar-read').hide();
    },
    write: function() {
        w.switchViewport('w');
        w.toolbar.bar.find('#toolbar-write').hide();
        w.toolbar.bar.find('#toolbar-read').show();
    },
    bar: null
}});

})(writepub);
