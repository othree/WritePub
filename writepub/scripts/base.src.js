/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function () {

var w = {};

$.extend(w, {
    options: {
        defaults: {
            crumbs: {
                mainpage: {title: 'main page'},
                introduction: {title: 'introduction'}
            },
            booksPath: 'books',
            fileExt: 'html'
        }
    },
    meta: {
        toolbar: {
            read: {title: 'read'},
            zoom: {title: 'zoom'},
            download: {title: 'download'},
            about: {title: 'about'}
        },
        frontMatter: {
            introduction: {title: 'introduction'},
            cover: {title: 'cover'},
            titlepage: {title: 'title page'},
            copyrightpage: {title: 'copyright page'},
            authorspreface: {title: 'author\'s preface'}
        }
    },
    book: {
        meta: {
            id: 0,
            title: _('New Book'),
            creator: _('Hancorck'),
            description: _('Book Description'),
            publisher: '',
            language: '',
            rights: '',
            toc: {
                root: true,
                sub: [
                    0,
                    {
                        title: 'Chapter 1', id: '1125834' , sub: [
                            0,
                            {title: 'Chapter 1-1', id: '1125348'},
                            {title: 'Chapter 1-2', id: '1155348'}
                        ]
                    },
                    {title: 'Chapter 2', id: '112534778'}
                ]
            }
        }
    }
});

$.extend(w, {
    init: function (options) {
        if (w.inited) { return false; }
        w.inited = true;
        w.setOptions(options);
        w.options.writable = document.location.protocol == 'file:';
        w.options.mode = w.options.writable ? 'w':'r';
        w.options.path = document.location.pathname.replace(/[^\/]*$/, '');

        w.options.debug = (document.location.search.indexOf('debug') > 0);
        if (w.options.debug) {
            w.options.writable = 'w'; 
            w.options.mode = 'w'; 
        }

        w.loadMeta();
        w.ui.init(w.options.mode);
        w.switchViewport();
        w.toc.init('#toc');
        w.presentId = w.getInitId();
        w.load(w.presentId);
    },
    setOptions: function (options) {
        var i;
        for (i in w.options.defaults) {
            w.options[i] = w.options.defaults[i];
        }
        for (i in options) {
            w.options[i] = options[i];
        }
    },
    getInitId: function () {
        return document.location.hash || 'introduction';
    },
    safeId: function (id) {
        return id.replace(/[^\w\d-_%]/g, '');
    },
    chId: function (id) {
        return !!id.match(/^ch\d(-\d)*$/) || !!id.match(/^\d+$/);
    },
    idExist: function (id) {
        var eid;
        id = w.safeId(id);
        if (w.chId(id) || id.indexOf('http') === 0 || id == 'mainpage') {
            return id;
        } else {
            for ( eid in w.meta.frontMatter) {
                if (eid == id) { return id; }
            }
            for ( eid in w.meta.toolbar) {
                if (eid == id) { return id; }
            }
            return false;
        }
    },
    genId: function (uri) {
        var start = uri.lastIndexOf('/')+1,
            end = uri.lastIndexOf('.'),
            id = uri.substring(start, end);
        return w.idExist(w.safeId(id));
    },
    genFilePath: function (id) {
        var filename;
        id = w.idExist(id) || id;
        if (id.match(/^ch\d(-\d)*$/)) {
            var chs = id.substring(2).split('-'),
                ch = w.book.meta.toc.sub,
                last = chs.pop();
            for (var i=0, len=chs.length; i<len; i++) {
                ch = ch[chs[i]].sub;
            }
            filename = ch[last].id;
        } else {
            filename = id;
        }
        return w.prependPath(filename);
    },
    prependPath: function (filename) {
        if (filename.indexOf('.') === -1) {
            return w.options.booksPath + '/' + w.book.meta.id + '/' + filename + '.' + w.options.fileExt;
        } else {
            return w.options.booksPath + '/' + w.book.meta.id + '/' + filename;
        }
    },
    load: function (id) {
        id = w.idExist(w.safeId(id));
        if (id !== false) {
            var crumbs = {
                mainpage: {title: 'main page', value: w.book.meta.mainPage}
            };
            if (w.chId(id)) {
                var chs = w.toc.chs(id), ch = w.book.meta.toc.sub, shc = 'ch';
                for (var i = 0, len=chs.length; i < len; i++) {
                    ch = ch[chs[i]];
                    shc += ((i===0?'':'-')+chs[i]);
                    crumbs[shc] = {title: ch.title};
                    if (i+1 == len) {
                        id = ch.id;
                    } else {
                        ch = ch.sub;
                    }
                }
            } else {
                crumbs[id] = {title: w.meta.frontMatter[id].title};
            }
            w.ui.breadcrumbs(crumbs);
            w.meta.id = id;
            w.setContent(w.loadContent(id));
        }
    },
    save: function (id) {
        id = w.idExist(w.safeId(id));
        if (id !== false) {
            return w.saveContent(id, w.getContent(id));
        } else { return false; }
    },
    loadMeta: function () {
        var filePath = w.genFilePath('meta.json'),
            meta = w.loadFile(filePath);
        if (meta !== false) {
            meta = JSON.parse(meta);
            $.extend(w.book.meta, meta);
        }
    },
    saveMeta: function () {
        var meta = JSON.stringify(w.book.meta),
            filePath = w.genFilePath('meta.json');
        w.saveFile(filePath, meta);
    },
    loadContent: function (id) {
        var filePath = w.genFilePath(id),
            content = w.loadFile(filePath);
        content = (content === false)? '['+_('No contents')+']' : content ;
        return content;
    },
    saveContent: function (id, content) {
        var filePath = w.genFilePath(id);
        return w.saveFile(filePath, content);
    },
    setContent: function (content) {
        if (typeof content == 'string') {
            w.viewport.setContent(content);
            return true;
        } else {
            return false;
        }
    },
    getContent: function (id) {
        return w.editor.getContent();
    },
    saveFile: function (filePath, content) {
        var realPath = w.options.path.substring(1) + filePath;
        realPath = realPath.replace(/\//g, '\\');
        return w.options.mode == 'w' ? saveFile(realPath, convertUnicodeToFileFormat(content)) : false;
    },
    loadFile: function (filePath) {
        var realPath;
        /* if (w.options.mode == 'w') {
            realPath = w.options.path.substring(1) + filePath;
            realPath = realPath.replace(/\//g, '\\');
            return loadFile(realPath);
        } else { */
            realPath = document.location.protocol + '//' + document.location.host + w.options.path + filePath;
            var ajax = $.ajax({
                url: realPath,
                async: false
            });
            return ajax.status == 200 || ajax.status === 0 ? ajax.responseText : false ;
        // }
    },
    switchViewport: function () {
        var mode = w.options.mode;
        w.viewport = ('w' == w.options.mode)? w.editor : w.reader;
        w.ui.switchViewport();
    },
    viewport: null,
    inited: false
});

window.writepub = w;

})();
