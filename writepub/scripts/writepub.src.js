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
            download: {title: 'download'}
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
/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function (w) {

$.extend(w, {page: {
    init: function () {
        if (!w.inited) { return false; }
        this.inited = true;
    },
    inited: false
}});

})(writepub);
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
        } else {
            setTimeout(function () {
                w.reader.html(content);
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
/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function (w) {

$.extend(w, {editor: {
    init: function () {
        if (!w.inited) { return false; }
        $('#editor-area').tinymce({
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
        $('#editor').append( save );
    },
    setContent: function (content) {
        var that = this;
        if (typeof content != 'string') { return false; }
        if (that.inited) {
            that._instance.setContent(content);
        } else {
            setTimeout(function () {
                that.setContent(content);
            }, 100);
        }
    },
    getContent: function () {
        if (!this.inited) { return false; }
        return this._instance.getContent();
    },
    show: function () {
        $('#editor').show();
        $('#save').show();
    },
    hide: function () {
        $('#editor').hide();
        $('#save').hide();
    },
    inited: false,
    _instance: null
}});

})(writepub);
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
/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function (w) {

$.extend(w, {toc: {
    init: function(target) {
        if (!w.inited) { return false; }
        this.inited = true;
        this.toc = $(target);
        this.ui.init(target);
    },
    html: function(toc) {
        toc = toc || w.book.meta.toc;
        function t (items, prefix, root) {
            if ($.isArray(items) && items.length > 0) {
                var html = '';
                for(var i in items) {
                    if (items[i] === 0 || !items.hasOwnProperty(i)) { continue; }
                    var id = prefix + (parseInt(i, 10));
                    html += '<li><a id="'+id+'" href="'+w.genFilePath(id)+'">'+_(items[i].title)+'</a>'+t(items[i].sub, id+'-')+'</li>';
                }
                if (root === true) {
                    return html;
                } else {
                    return '<ol>'+html+'</ol>';
                }
            } else {
                return '';
            }
        }
        return t(toc.sub, 'ch', toc.root);
    },
    newCh: function(title) {
        return {
            title: title,
            id: (new Date()).getTime()+""
        };
    },
    move: function(from, to) {
        var item = w.toc.getCh(from);
        w.toc.remove(from);
        return (item)? w.toc.insert(to, item) : false ;
    },
    insert: function(chs, item) {
        var chsParent = chs.slice(0,-1),
            chParent = w.toc.getCh(chsParent),
            chIndex = chs.slice(-1);
        if (chParent && !chParent.sub) { chParent.sub = [0]; }
        if (!chParent || chParent.sub.length < chIndex) { return false; }
        chParent.sub.splice(chIndex, 0, item);
        return true;
    },
    remove: function(chs) {
        var chsParent = chs.slice(0,-1),
            chParent = w.toc.getCh(chsParent),
            chIndex = chs.pop();
        if (!chParent || chParent.sub.length < chIndex) { return false; }
        chParent.sub.remove(chIndex);
        return true;
    },
    stab: function(chs) {
        var newchs = chs.slice(0, -1),
            previous = newchs.pop()+1;
        if (previous === 0) { return chs; }
        else {
            newchs.push(previous);
            w.toc.move(chs, newchs);
            return newchs;
        }
    },
    tab: function(chs) {
        var newchs = chs.slice(),
            previous = newchs.pop()-1;
        if (previous === 0) { return chs; }
        else {
            newchs.push(previous);
            previous = w.toc.getCh(newchs);
            newchs.push(previous.sub ? previous.sub.length : 1);
            w.toc.move(chs, newchs);
            return newchs;
        }
    },
    chs: function(ch) {
        return $.map(ch.substring(2).split('-'), function(v) {
            return parseInt(v, 10);
        });
    },
    shc: function(chs) {
        return "ch"+chs.join('-');
    },
    getCh: function(chs) {
        if (chs.length === 0) { return w.book.meta.toc; }
        chs = chs.slice();
        var ch = w.book.meta.toc.sub,
            last = chs.pop();
        for (var i=0, len=chs.length; i<len; i++) {
            ch = ch[chs[i]].sub;
        }
        return ch[last];
    },
    toc: null
}});

$.extend(w.toc, {ui: {
    init: function(target) {
        if (!w.toc.inited) { return false; }
        this.inited = true;
        this.attachEvent(target);
    },
    up: function(chs) {
        chs = chs.slice();
        function findLast(chs) {
            var ch = w.toc.getCh(chs);
            if (ch.sub && ch.sub.length > 1) {
                chs.push((ch.sub.length-1));
                return findLast(chs);
            } else {
                return chs;
            }
        }
        function minus(chs) {
            var last = chs.pop() - 1;
            if (last > 0) {
                chs.push(last);
                return findLast(chs);
            } else { return chs; }
        }
        return minus(chs);
    },
    down: function(chs) {
        chs = chs.slice();
        function findFirst(chs) {
            var ch = w.toc.getCh(chs);
            if (ch.sub && ch.sub.length > 1) {
                chs.push(1);
                return findFirst(chs);
            } else {
                return chs;
            }
        }
        function findNext(chs) { //through parent
            var last = chs.pop() + 1,
                ch = w.toc.getCh(chs);
            if (last < ch.sub.length) {
                chs.push(last);
                return chs;
            } else {
                return chs.length === 0 ? false : findNext(chs);
            }
        }
        function plus(chs) {
            var last = chs.slice(-1),
                ch = w.toc.getCh(chs);
            if (ch.sub && ch.sub.length > 1) {
                chs.push(1);
                return chs;
            } else { 
                return findNext(chs);
            }
        }
        return plus(chs);
    },
    left: function(chs) {
        chs.pop();
        return chs.length === 0 ? false : chs ;
    },
    right: function(chs) {
        var ch = w.toc.getCh(chs);
        if (ch.sub && ch.sub.length > 0) {
            chs.push(1);
            return chs;
        } else { return false; }
    },
    insert: function(chs) {
        w.toc.insert(chs, w.toc.newCh(w.toc.shc(chs)));
        return chs;
    },
    remove: function(chs) {
        w.toc.remove(chs);
        return chs;
    },
    select: function(id) {
        w.inplace.hide();
        if ($.isArray(id)) { id = 'ch'+id.join('-'); }
        if (!w.chId(id)) { return false; }
        $(w.toc.toc).find('a').removeClass('selected');
        this.target = id;
        return $('#'+id).addClass('selected').focus();
    },
    attachEvent: function(target) {
        $(target).click(function (e) {
            var target = e.target,
                ch = target ? target.id : "";
            this.focused = true;
            if (ch === "" || !w.chId(ch)) { return false; }
            w.toc.ui.select(ch);
        });
        $(target).dblclick(function (e) {
            if (!this.focused) { return false; }
            var target = e.target,
                chs = w.toc.chs(target.id),
                ch = w.toc.getCh(chs);
            w.inplace.show(target, ch.title, function (value) {
                ch.title = $("#inplace-input", this).val();
                w.ui.toc();
                w.toc.ui.select(w.toc.ui.target);
                w.saveMeta();
            }, function () {
                w.toc.ui.select(w.toc.ui.target);
            });   
        });
        $(target).keydown(function (e) {
            if (!this.focused) { return false; }
            var target = e.target,
                chs = w.toc.chs(w.toc.ui.target),
                ch, newchs, event;
            if (e.keyCode == 13) { //enter
                ch = w.toc.getCh(chs);
                chs.push((ch.sub && ch.sub.length > 1)? ch.sub.length : 1);
                chs = w.toc.ui.insert(chs);
                if (chs !== false) {
                    w.ui.toc();
                    w.toc.ui.select(chs);
                    event = jQuery.Event('keydown');
                    event.keyCode = 32;
                    $(this).trigger(event);
                }
            } else if (e.keyCode == 32) { //space
                ch = w.toc.getCh(chs);
                w.inplace.show($('#'+w.toc.ui.target), ch.title, function (value) {
                    ch.title = $("#inplace-input", this).val();
                    w.ui.toc();
                    w.toc.ui.select(w.toc.ui.target);
                    w.saveMeta();
                }, function () {
                    w.toc.ui.select(w.toc.ui.target);
                });   
            } else if (e.keyCode == 38) { //up
                newchs = w.toc.ui.up(chs);
                if (newchs !== false) {
                    if (e.shiftKey) {
                        if (newchs.length > chs.length) {
                            newchs.push(newchs.pop()+1);
                        } 
                        w.toc.move(chs, newchs);
                        w.ui.toc();
                    }
                    w.toc.ui.select(newchs);
                }
                return false;
            } else if (e.keyCode == 40) { //down
                newchs = w.toc.ui.down(chs);
                if (newchs !== false) {
                    if (e.shiftKey) {
                        //if (newchs.length < chs.length) {
                            //newchs.push(newchs.pop());
                        //} 
                        w.toc.move(chs, newchs);
                        w.ui.toc();
                    }
                    w.toc.ui.select(newchs);
                }
                return false;
            } else if (e.keyCode == 37) { //left
                chs = w.toc.ui.left(chs);
                if (chs !== false) { w.toc.ui.select(chs); }
            } else if (e.keyCode == 39) { //right
                chs = w.toc.ui.right(chs);
                if (chs !== false) { w.toc.ui.select(chs); }
            } else if (e.keyCode == 45) { //insert
                if (e.shiftKey) {
                    chs.push(chs.pop()+1);
                }
                chs = w.toc.ui.insert(chs);
                if (chs !== false) {
                    w.ui.toc();
                    w.toc.ui.select(chs);
                    event = jQuery.Event('keydown');
                    event.keyCode = 32;
                    $(this).trigger(event);
                }
            } else if (e.keyCode == 46) { //remove
                if (chs.length == 1 && chs[0] == 1) { return false; }
                if (confirm("Remove ?")) {
                    newchs = w.toc.ui.up(chs);
                    w.toc.ui.remove(chs);
                    w.ui.toc();
                    if (newchs !== false) { w.toc.ui.select(newchs); }
                }
            } else if (e.keyCode == 9) { //tab
                if (e.shiftKey) {
                    chs = w.toc.stab(chs);
                } else {
                    chs = w.toc.tab(chs);
                }
                w.ui.toc();
                if (chs !== false) { w.toc.ui.select(chs); }
                return false;
            } else {
                //alert(e.keyCode);
            }
        });
    },
    focus: false
}});

})(writepub);
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
        w.ui.toolbar(w.meta.toolbar);
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

        w.ui.tocEvent();
        w.ui.goContentEvent();
        $('#backto-main').parent().hide();
    },
    switchViewport: function() {
        if ('w' == w.options.mode) {
            w.editor.show();
            w.reader.hide();
            w.editor.setContent( w.reader.getContent() );
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
            var background;
            $(this).mouseover(function () {
                background = $(this).css('background-color');
                $(this).css('background-color', '#ffffaa');
            }).mouseout(function () {
                $(this).css('background-color', background);
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
        '        <div id="editor"><textarea id="editor-area"></textarea></div>' +
        '        <div id="reader"></div>' +
        '    </div>' +
        '</div>',
    inited: false
}});

})(writepub);
/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function (w) {

$(w.init);

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// From TiddlyWiki
config = {};
// Browser detection... In a very few places, there's nothing else for it but to know what browser we're using.
config.userAgent = navigator.userAgent.toLowerCase();
config.browser = {
    isIE: config.userAgent.indexOf("msie") != -1 && config.userAgent.indexOf("opera") == -1,
    isGecko: navigator.product == "Gecko" && config.userAgent.indexOf("WebKit") == -1,
    ieVersion: /MSIE (\d.\d)/i.exec(config.userAgent), // config.browser.ieVersion[1], if it exists, will be the IE version string, eg "6.0"
    isSafari: config.userAgent.indexOf("applewebkit") != -1,
    isBadSafari: !((new RegExp("[\u0150\u0170]","g")).test("\u0150")),
    firefoxDate: /gecko\/(\d{8})/i.exec(config.userAgent), // config.browser.firefoxDate[1], if it exists, will be Firefox release date as "YYYYMMDD"
    isOpera: config.userAgent.indexOf("opera") != -1,
    isLinux: config.userAgent.indexOf("linux") != -1,
    isUnix: config.userAgent.indexOf("x11") != -1,
    isMac: config.userAgent.indexOf("mac") != -1,
    isWindows: config.userAgent.indexOf("win") != -1
};

})(writepub);
