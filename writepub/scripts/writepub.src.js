/*global writepub _ saveFile loadFile manualConvertUTF8ToUnicode mozConvertUTF8ToUnicode netscape 
         Components convertUnicodeToHtmlEntities mozConvertUnicodeToUTF8 ieCopyFile mozillaSaveFile
         ieSaveFile javaSaveFile mozillaLoadFile ieLoadFile javaLoadFile ActiveXObject */

(function () {

var w = {};

$.extend(w, {
    options: {
    },
    meta: {
        toolbar: [
            {title: 'read', id: 'read'},
            {title: 'zoom', id: 'zoom'},
            {title: 'download', id: 'download'},
            {title: 'about', id: 'about'}
        ]
    },
    book: {
        meta: {
            title: _('New Book'),
            desc: _('Book Description')
        }
    }
});

$.extend(w, {
    init: function () {
        w.inited = true;
        w.options.mode = document.location.protocol == 'file:' ? 'w' : 'r';
        w.options.path = document.location.pathname.replace(/[^\/]*$/, '');

        w.loadMeta();
        w.ui.init();
        w.load('introduction');
    },
    load: function () {
    },
    loadMeta: function () {
        var meta = w.loadFile('meta.json');
        if (meta !== false) {
            meta = JSON.parse(meta);
            $.extend(w.book.meta, meta);
        }
    },
    saveMeta: function () {
        var meta = w.book.meta;
        var path = 'meta.json';
        meta = JSON.stringify(meta);
        w.saveFile(path, meta);
    },
    loadTOC: function () {
    },
    loadContent: function () {
    },
    setContent: function () {
    },
    saveFile: function (filePath, content) {
        var realPath = document.location.protocol + '//' + document.location.host + w.options.path + filePath;
        return w.options.mode == 'w' ? saveFile(filePath, content) : false;
    },
    loadFile: function (filePath) {
        var realPath = document.location.protocol + '//' + document.location.host + w.options.path + filePath;
        if (w.options.mode == 'w') {
            return loadFile(filePath);
        } else {
            var ajax = $.ajax({
                url: realPath,
                async: false
            });
            return ajax.status == 200 ? ajax.responseText : false ;
        }
    },
    loadEditor: function () {
    },
    inited: false
});

$.extend(w, {ui: {
    init: function() {
        if (!w.inited) { return false; }
        w.ui.inited = true;
        var container = $('#container');
        if (container.length === 0) {
            $('body').append($('<div id="container"></div>'));
            container = $('#container');
        }
        container.html(w.ui.initTemplate);
        w.ui.updateHeader();
        w.ui.toolbar(w.meta.toolbar);
    },
    updateHeader: function() {
        $('#header h1').html(w.book.meta.title);
        $('#desc').html(w.book.meta.desc);
    },
    breadcrumbs: function(crumbs) {
        if (!w.ui.inited) { return false; }
        w.ui.fillList($('#breadcrumbs'), crumbs);
    },
    toolbar: function(tools) {
        if (!w.ui.inited) { return false; }
        w.ui.fillList($('#toolbar'), tools);
    },
    fillList: function(list, items) {
        var html = '';
        for (var i = 0, len = items.length; i < len; i++) {
            html += '<li><a href="#'+items[i].id+'">'+_(items[i].title)+'</a></li>';
        }
        list.html(html);
    },
    getBody: function() {
        return $('body');
    },
    initTemplate: '' +
        '<div id="header">' +
        '    <h1></h1>' +
        '    <p id="desc"></p>' +
        '</div>' +
        '<div id="nav">' +
        '    <ol id="breadcrumbs">' +
        '    </ol>' +
        '    <ul id="toolbar">' +
        '    </ul>' +
        '    <div id="progress"></div>' +
        '</div>' +
        '<div id="main">' +
        '    <div id="menu">' +
        '        <ol id="toc">' +
        '        </ol>' +
        '        <p>' +
        '            <a id="goto-content" href="">'+_('goto content')+'</a>' +
        '        </p>' +
        '    </div>' +
        '    <div id="content">' +
        '        <textarea id="editor"></textarea>' +
        '    </div>' +
        '</div>',
    inited: false
}});

$(w.init);

window.writepub = w;

})();
