/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function (w) {

$.extend(w, {inplace: {
    init: function () {
        if (!w.inited || w.inplace.inited) { return false; }
        w.inplace.inited = true;
        var inplace = $('#inplace');
        if (inplace.length === 0) {
            $('body').append($(w.inplace.template));
            inplace = $('#inplace');
        }
        inplace.find('form').submit(function (e) {
            if ($.isFunction(w.inplace.callback)) { w.inplace.callback.apply(this, arguments); }
            w.inplace.callback = null;
            w.inplace.hide();
            return false;
        });
        inplace.find('#inplace-cancel').click(function (e) {
            w.inplace.hide();
            if ($.isFunction(w.inplace.cancelback)) { w.inplace.cancelback.apply(this, arguments); }
            w.inplace.callback = null;
            w.inplace.cancelback = null;
            return false;
        });
        w.inplace.editor = inplace;
    },
    esc: function(e) {
        if (e.keyCode == 27) {
            w.inplace.hide();
            if ($.isFunction(w.inplace.cancelback)) { w.inplace.cancelback.apply(this, arguments); }
            w.inplace.cancelback = null;
        }
    },
    show: function (target, value, callback, cancelback) {
        if (!w.inited || !w.inplace.inited) { return false; }
        var coord = w.inplace.getCoord(target),
            offset = {
                top: coord.top,
                left: coord.left
            },
            size = {
                width: coord.width,
                height: coord.height
            };
        w.inplace.setCoord(w.inplace.editor, offset);
        w.inplace.setCoord(w.inplace.editor.find('#inplace-input'), size);
        w.inplace.editor.show().find('#inplace-input').val(value);
        w.inplace.callback = callback;
        w.inplace.cancelback = cancelback;
        $(document).bind('keydown', w.inplace.esc);
        setTimeout(function () {
            $('#inplace-input').focus();
        }, 100);
    },
    hide: function () {
        if (!w.inited || !w.inplace.inited) { return false; }
        w.inplace.editor.hide();
        $(document).unbind('keydown', w.inplace.esc);
    },
    getCoord: function (target) {
        if (!w.inited || !w.inplace.inited) { return false; }
        var offset = $(target).offset();
        return {
            top: offset.top,
            left: offset.left,
            width: $(target).width(),
            height: $(target).height()
        };
    },
    setCoord: function (target, coord) {
        if (!w.inited || !w.inplace.inited) { return false; }
        var newCoord = $(target).offset();
        if (coord.top) { newCoord.top = coord.top; }
        if (coord.left) { newCoord.left = coord.left; }
        $(target).offset(newCoord);
        //if (coord.width) { $(target).width(coord.width+4); }
        if (coord.width) { $(target).width(coord.width*1.5 < 100 ? 100 : coord.width*1.5); }
        if (coord.height) { $(target).height(coord.height); }
    },
    editor: null,
    template: '' +
        '<div id="inplace" style="display: none; position: absolute;">' +
        '    <form id="inplace-form">' +
        '        <input id="inplace-input"><br />' +
        '        <input id="inplace-submit" type="submit" value="GO">' +
        '        <a href="#cancel" id="inplace-cancel">Cancel</a>' +
        '    </form>' +
        '</div>'
}});

})(writepub);
