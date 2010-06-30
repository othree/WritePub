/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function (w) {

$.extend(w, {ui: {
    init: function() {
        if (!w.inited || w.ui.inited) { return false; }
        w.ui.inited = true;
        var container = $('#container');
        if (container.length === 0) {
            $('body').append($('<div id="container"></div>'));
            container = $('#container');
        }
        container.html(w.ui.initTemplate);
        w.ui.updateHeader();
        w.toolbar.init(w.ui.toolbar(w.meta.toolbar));
        w.ui.frontMatter();
        w.ui.breadcrumbs(w.options.defaults.crumbs);
        w.inplace.init();
        w.ui.inplaceInit();
        if (w.options.mode) {
            w.editor.init();
            w.reader.init();
            w.reader.hide();
        } else {
            w.editor.hide();
            w.reader.init();
        }

        w.ui.breadEvent();
        w.ui.tocEvent();
        w.ui.goContentEvent();
        $('#backto-main').parent().hide();
    },
    switchViewport: function() {
        if ('w' == w.options.mode) {
            w.editor.show();
            w.reader.hide();
        } else {
            w.editor.hide();
            w.reader.show();
            w.reader.setContent( w.editor.getContent() );
        }
    },
    updateHeader: function() {
        $('#header h1').html(w.book.meta.title);
        $('#description').html(w.book.meta.description);
        $('#creator').html(w.book.meta.creator);
    },
    breadcrumbs: function(crumbs) {
        if (!w.ui.inited) { return false; }
        $('#breadcrumbs').empty();
        w.ui.fillList($('#breadcrumbs'), crumbs, 'bread');
    },
    breadEvent: function() {
        $('#breadcrumbs').click(function (e) {
            var uri = $(e.target).attr('href'),
                id = w.idExist($(e.target).attr('id'));
            if (id === false) {
                id = w.genId(uri);
            }
            if (id !== false) {
                if (id == 'mainpage') {
                    $('#backto-main').click();
                } else {
                    w.load(id);
                }
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });
    },
    toolbar: function(tools) {
        if (!w.ui.inited) { return false; }
        w.ui.fillList($('#toolbar'), tools, 'toolbar', function (id) { return '#'+id; });
        return $('#toolbar');
    },
    frontMatter: function() {
        if (!w.ui.inited) { return false; }
        w.ui.fillList($('#toc'), w.meta.frontMatter, 'front');
    },
    inplaceInit: function() {
        $.fn.yellow = function () {
            var background, color;
            $(this).mouseover(function () {
                background = $(this).css('background-color');
                color = $(this).css('color');
                $(this).css({backgroundColor: '#ffffaa', color: '#666'});
            }).mouseout(function () {
                $(this).css({backgroundColor: background, color: color});
            });
            return this;
        };
        $.fn.bookmetaInplace = function (meta) {
            $(this).dblclick(function(e) {
                w.inplace.show(this, w.book.meta[meta], function(e) {
                    w.book.meta[meta] = $("#inplace-input", this).val();
                    w.ui.updateHeader();
                    w.saveMeta();
                });
                return false;
            });
        };
        $("#header h1").yellow().bookmetaInplace('title');
        $("#description").yellow().bookmetaInplace('description');
        $("#creator").yellow().bookmetaInplace('creator');
    },
    toc: function() {
        if (!w.ui.inited) { return false; }
        $('#toc').html(w.toc.html());
    },
    tocEvent: function() {
        $('#toc').click(function (e) {
            var uri = $(e.target).attr('href'),
                id = w.idExist($(e.target).attr('id'));
            if (id === false) {
                id = w.genId(uri);
            }
            if (id !== false) {
                w.load(id);
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        });
    },
    goContentEvent: function () {
        if (!w.ui.inited) { return false; }
        $('#goto-content').click(function (e) {
            w.ui.toc();
            $('#goto-content').parent().hide();
            $('#backto-main').parent().show();
            w.load('ch1');
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
        $('#backto-main').click(function (e) {
            w.ui.frontMatter();
            $('#goto-content').parent().show();
            $('#backto-main').parent().hide();
            w.load('introduction');
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    },
    fillList: function(list, items, prefix, parseLink) {
        if (!w.ui.inited) { return false; }
        parseLink = $.isFunction(parseLink) ? parseLink : function (id) { return w.genFilePath(id); } ;
        var html = '';
        for (var id in items) {
            id = w.idExist(w.safeId(id));
            if (id !== false) {
                html += '<li id="'+prefix+'-'+id+'"><a id="'+id+'" href="'+parseLink(id)+'">'+_(items[id].title)+'</a></li>';
            }
        }
        list.html(html);
    },
    doneSave: function(id) {
        alert(id + ' saved !');
    },
    getBody: function() {
        return $('body');
    },
    initTemplate: '' +
        '<div id="header">' +
        '    <h1></h1>' +
        '    <p><span id="description"></span> by <span id="creator"></span></p>' +
        '</div>' +
        '<div id="nav">' +
        '    <ol id="breadcrumbs"></ol>' +
        '    <div id="progress"></div>' +
        '</div>' +
        '<div id="main">' +
        '    <div id="menu">' +
        '        <ul id="toolbar"></ul>' +
        '        <p><a id="backto-main" href="">'+_('back to main')+'</a></p>' +
        '        <ol id="toc"></ol>' +
        '        <p><a id="goto-content" href="">'+_('goto content')+'</a></p>' +
        '    </div>' +
        '    <div id="content">' +
        '        <div id="editor"><textarea id="editor-area"></textarea></div>' +
        '        <div id="reader"></div>' +
        '    </div>' +
        '</div>',
    inited: false
}});

})(writepub);
