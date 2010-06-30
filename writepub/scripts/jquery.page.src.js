/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function () {

    var pageHeight = 472,
        win,
        context,
        curPage = 1;

    function newPage (context, cb) {
        if (context === null) {
            this.count = 0;
        } else {
            this.count = ++this.count || 1;
            var page = $('<div class="paper" id="page-'+this.count+'"><div class="page"></div></div>').appendTo(context).find('.page');
            if ($.isFunction(cb)) { cb('page-'+this.count); }
            return page;
        }
    }

    function findAnchor (anchor, offset) {
        var i,
            elem,
            result;
        for (i in anchor.childNodes) {
            elem = anchor.childNodes[i];
            if (elem.nodeType == 3) {
                if (elem.length > offset) { return [elem, offset]; }
                else { offset -= elem.length; }
            } else if (elem.nodeType == 1) {
                result = findAnchor(elem, offset);
                if (typeof result == "number") {
                    offset = result;
                } else {
                    return result;
                }
            }
        }
        return offset;
    }

    function reflowElement (page, element) {
        var doc = element.ownerDocument,
            r = doc.createRange && doc.createRange(),
            startAnchor = element,
            endAnchor,
            endOffset,
            offset = 0,
            content,
            height,
            flag = false,
            last = false;
        if (!r) { return; }
        r.setStartBefore(element);
        while(flag === false) {
            offset += 30;
            endAnchor = findAnchor(startAnchor, offset);
            if (typeof endAnchor == "number") { 
                offset -= 30;
                break;
            }
            r.setEnd(endAnchor[0], endAnchor[1]);
            content = r.cloneContents();
            page.append(content);
            height = page.height();
            if (height > pageHeight) {
                flag = true;
                offset -= 30;
            }
            page.find('> *:last').remove();
        }
        flag = false;
        while(flag === false) {
            offset += 1;
            endAnchor = findAnchor(startAnchor, offset);
            if (typeof endAnchor == "number") { 
                offset -= 1;
                break;
            }
            r.setEnd(endAnchor[0], endAnchor[1]);
            content = $(r.cloneContents());
            page.append(content);
            height = page.height();
            if (last === true) {
                flag = true;
                r.deleteContents();
            } else if (height > pageHeight) {
                offset -= 2;
                last = true;
                page.find('> *:last').remove();
            } else {
                page.find('> *:last').remove();
            }
        }


    }

    function reflowPage (page, context) {
        if (page.children().length === 0) {
            page.parents('.paper').remove();
        } else {
            var height = page.height(),
                content,
                nextPage;
            if (height > pageHeight) {
                content = page.find('> *:last');
                nextPage = $(page).parent('.paper').next('.paper').find('.page');
                if (nextPage.length === 0) {
                    nextPage = newPage(context);
                }
                content.prependTo(nextPage);
                height = page.height();
                if (height > pageHeight) {
                    reflowPage( page, context );
                } else {
                    reflowElement( page, nextPage.find('> *:first')[0] );
                    reflowPage( nextPage, context );
                }
                return true;
            } else if (height < pageHeight) {
                nextPage = $(page).parent('.paper').next('.paper').find('.page');
                if (nextPage.length !== 0) {
                    content = nextPage.find('> *:first');
                    if (content.length !== 0) {
                        content.appendTo(page);
                        height = page.height();
                        if (height > pageHeight) {
                            content.prependTo(nextPage);
                        } else {
                            reflowPage( nextPage, context );
                            reflowPage( page, context );
                        }
                    }
                }
            }
        }
        return false;
    }

    function reflow (context) {
        setTimeout(function () {
            var anchor = $(win.getSelection().anchorNode);
            var page = anchor.parents('.page');
            $(context).find('.paper .paper').each(function () {
                $(this).find('.page > *').insertBefore(this);
            }).remove();
            reflowPage(page, context);
        }, 1);
    }

    function addContent (content, context, newPageCB) {
        var page = $('.paper:last-child > .page', context);
        if (page.length === 0) {
            page = newPage(context, newPageCB);
        }
        content.appendTo(page);
        reflowPage(page, context);
    }

    function pageUp() {
        curPage--;
        if (curPage > 0) {
           $(context).animate({'scrollTop': $('#page-'+curPage, context).attr('offsetTop')-10}, 300 );
        } else {
            curPage = 1;
        }
    }
    function pageDown() {
        curPage++;
        if ($('#page-'+curPage, context).length == 1) {
           $(context).animate({'scrollTop': $('#page-'+curPage, context).attr('offsetTop')-10}, 300 );
        } else {
            curPage--;
        }
    }

    function docKeyDown(e) {
        if (e.keyCode == 33) {
            pageUp();
            return false;
        } else if (e.keyCode == 34) {
            pageDown();
            return false;
        }
    }

    $.fn.page = function (customWin, newPageCB) {
        context = this[0] || this;
        win = customWin || window;
        curPage = 1;
        newPage(null);
        $(context).find('.paper, .page').each(function () {
            $(this).find('.page > *').insertBefore(this);
        }).remove().end().css('overflow', 'hidden');
        $('> *', context).each(function () {
            var elem = this;
            addContent($(elem), context, newPageCB);
        });
        //$(context).bind({'keypress click': function () {
            //reflow(context);
        //}});
        
        if (win.document !== document) {
            $(win.document).unbind('keydown', docKeyDown);
            $(win.document).bind('keydown', docKeyDown);
        }
        $(document).unbind('keydown', docKeyDown);
        $(document).bind('keydown', docKeyDown);

        return function () {
            reflow(context);
        };
    };

    $.fn.dePage = function () {
        $(this).unbind({'keydown click': reflow});
        $(document).unbind('keydown', docKeyDown);
    };


})();
