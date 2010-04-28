/*global writepub _ tinyMCE saveFile loadFile */

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
                ch1: {title: 'Chapter 1'}
            }
        }
    }
});

$.extend(w, {
    init: function (options) {
        if (w.inited) { return false; }
        w.inited = true;
        w.setOptions(options);
        w.options.mode = document.location.protocol == 'file:' ? 'w' : 'r';
        w.options.path = document.location.pathname.replace(/[^\/]*$/, '');

        w.loadMeta();
        w.ui.init();
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
    idExist: function (id) {
        id = w.safeId(id);
        if (id.match(/^ch\d(-\d)*$/) || id.indexOf('http') === 0 || id == 'mainpage') {
            return id;
        } else {
           for ( var eid in w.meta.frontMatter) {
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
    genFilePath: function (filename) {
        if (filename.indexOf('.') === -1) {
            return w.options.booksPath + '/' + w.book.meta.id + '/' + filename + '.' + w.options.fileExt;
        } else {
            return w.options.booksPath + '/' + w.book.meta.id + '/' + filename;
        }
    },
    load: function (id) {
        id = w.idExist(w.safeId(id));
        if (id !== false) {
            w.setContent(w.loadContent(id));
            var crumbs = {
                mainpage: {title: 'main page', value: w.book.meta.mainPage}
            };
            if (id.match(/^ch\d+(-\d+)*$/)) {
                crumbs[id] = {title: w.book.meta.toc[id].title};
            } else {
                crumbs[id] = {title: w.meta.frontMatter[id].title};
            }
            w.ui.breadcrumbs(crumbs);
            w.meta.id = id;
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
            w.editor.setContent(content);
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
        return w.options.mode == 'w' ? saveFile(realPath, content) : false;
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
    inited: false
});

$.extend(w, {editor: {
    load: function () {
        if (w.editor.inited) { return false; }
        $('#editor').tinymce({
            script_url : 'writepub/vendor/tinymce/jscripts/tiny_mce/tiny_mce.js',
            // General options
            theme: "advanced",
            width: "100%",
            height: "450",
            plugins : "safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

            // Theme options
            theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
            theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
            theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
            theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",
            theme_advanced_toolbar_location : "top",
            theme_advanced_toolbar_align : "left",
            theme_advanced_statusbar_location : "bottom",
            theme_advanced_resizing : false,
            oninit: function (inst) {
                w.editor._instance = inst;
                w.editor.inited = true;
            }
        });
        var save = $('<button id="save">Save</button>').click(function () {
            var id = w.meta.id;
            if (id) {
                var done = w.save(id);
                if (done) {
                    w.ui.doneSave(id);
                }
            }
        });
        $('#editor').after( save );
    },
    setContent: function (content) {
        if (typeof content != 'string') { return false; }
        if (w.editor.inited) {
            w.editor._instance.setContent(content);
        } else {
            setTimeout(function () {
                w.editor.setContent(content);
            }, 100);
        }
    },
    getContent: function () {
        if (!w.editor.inited) { return false; }
        return w.editor._instance.getContent();
    },
    inited: false,
    _instance: null
}});

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
            w.inplace.callback = null;
            w.inplace.hide();
            return false;
        });
        w.inplace.editor = inplace;
    },
    show: function (target, value, callback) {
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
        w.inplace.editor.find('#inplace-input').val(value);
        w.inplace.editor.show();
        w.inplace.callback = callback;
    },
    hide: function () {
        if (!w.inited || !w.inplace.inited) { return false; }
        w.inplace.editor.hide();
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
        if (coord.width) { $(target).width(coord.width+4); }
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
        w.ui.toolbar(w.meta.toolbar);
        w.ui.frontMatter();
        w.ui.breadcrumbs(w.options.defaults.crumbs);
        w.editor.load();
        w.inplace.init();
        w.ui.inplaceInit();

        w.ui.tocEvent();
        w.ui.goContentEvent();
        $('#backto-main').parent().hide();
    },
    updateHeader: function() {
        $('#header h1').html(w.book.meta.title);
        $('#description').html(w.book.meta.description);
        $('#creator').html(w.book.meta.creator);
    },
    breadcrumbs: function(crumbs) {
        if (!w.ui.inited) { return false; }
        $('#breadcrumbs').empty();
        w.ui.fillList($('#breadcrumbs'), crumbs);
    },
    toolbar: function(tools) {
        if (!w.ui.inited) { return false; }
        w.ui.fillList($('#toolbar'), tools);
    },
    frontMatter: function() {
        if (!w.ui.inited) { return false; }
        w.ui.fillList($('#toc'), w.meta.frontMatter);
    },
    inplaceInit: function() {
        $.fn.yellow = function () {
            $(this).mouseover(function () {
                $.data(this, 'bc', $(this).css('background-color'));
                $(this).css('background-color', '#ffffaa');
            }).mouseout(function () {
                $(this).css('background-color', $.data(this, 'bc'));
            });
            return this;
        };
        $("#header h1").yellow().dblclick(function(e) {
            w.inplace.show(this, w.book.meta.title, function(e) {
                w.book.meta.title = $("#inplace-input", this).val();
                w.ui.updateHeader();
            });
            return false;
        });
        $("#description").yellow().dblclick(function(e) {
            w.inplace.show(this, w.book.meta.description, function(e) {
                w.book.meta.description = $("#inplace-input", this).val();
                w.ui.updateHeader();
            });
            return false;
        });
        $("#creator").yellow().dblclick(function(e) {
            w.inplace.show(this, w.book.meta.creator, function(e) {
                w.book.meta.creator = $("#inplace-input", this).val();
                w.ui.updateHeader();
            });
            return false;
        });
    },
    toc: function() {
        if (!w.ui.inited) { return false; }
        w.ui.fillList($('#toc'), w.book.meta.toc);
    },
    tocEvent: function() {
        $('#toc').click(function (e) {
            var uri = $(e.target).attr('href'),
                id = w.genId(uri);
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
    fillList: function(list, items) {
        if (!w.ui.inited) { return false; }
        var html = '';
        for (var id in items) {
            id = w.idExist(w.safeId(id));
            if (id !== false) {
                html += '<li><a href="'+w.genFilePath(id)+'">'+_(items[id].title)+'</a></li>';
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
        '    <ul id="toolbar"></ul>' +
        '    <div id="progress"></div>' +
        '</div>' +
        '<div id="main">' +
        '    <div id="menu">' +
        '        <p><a id="backto-main" href="">'+_('back to main')+'</a></p>' +
        '        <ol id="toc"></ol>' +
        '        <p><a id="goto-content" href="">'+_('goto content')+'</a></p>' +
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
