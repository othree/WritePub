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
    zoom: function() {
        $('#zoom-back').remove();
        $(window).resize(w.toolbar.zoom);
        $('#content').addClass('zoom');
        var wr = $(window).width()/520,
            hr = $(window).height()/545,
            r  = wr > hr ? hr : wr,
            tranX = ($(window).width()*(1-1/r))/2,
            tranY = ($(window).height()*(1-1/r))/2,
            eh = $('#editor').css('height');
        $('#reader, #editor iframe').css({'zoom': r});
        if ($.browser.mozilla) {
            $('#reader, #editor iframe').css({'width': $(window).width()/r+'px', 'height': $(window).height()/r+'px', '-moz-transform': 'translate('+tranX+'px, '+tranY+'px) scale('+r+')'});
            $('#editor').css('height', '100%');
        } else if ($.browser.webkit) {
            $('#editor iframe').css({'width': $(window).width()/r+'px', 'height': $(window).height()/r+'px', '-webkit-transform': 'translate(0px, '+tranY+'px) scale('+r+')'});
            $('#editor').css('height', '100%');
        } else if ($.browser.msie) {
            $('#editor iframe').css({'width': $(window).width()/r+'px', 'height': $(window).height()/r+'px', 'margin-left': -tranX});
            $('#editor').css('height', '100%');
        }
        var back = $('<a id="zoom-back" href="">'+_('zoom')+'</a>').click(function () {
            $('#content').removeClass('zoom');
            $('#reader, #editor iframe').css({zoom: '1', width: '100%', '-moz-transform': '', '-webkit-transform': '', 'margin-left': 0});
            $('#editor').css('height', eh);
            $(window).unbind('resize', w.toolbar.zoom);
            $(this).remove();
            return false;
        });
        if (w.options.mode == 'w') {
            back.addClass('w');
        }
        $('body').append(back);
    },
    bar: null
}});

})(writepub);
