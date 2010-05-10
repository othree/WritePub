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
