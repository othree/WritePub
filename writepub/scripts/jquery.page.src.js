/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function () {

    var pageHeight = 16*(28-2);

    function newPage (context, cb) {
        this.count = ++this.count || 1;
        var page = $('<div class="paper"><div class="page" id="page-'+this.count+'"></div></div>').appendTo(context).find('.page');
        if ($.isFunction(cb)) { cb('page-'+this.count); }
        return page;
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
        var r = document.createRange(),
            startAnchor = element,
            endAnchor,
            endOffset,
            offset = 0,
            content,
            height,
            flag = false,
            last = false;
        r.setStartBefore(element);
        while(flag === false) {
            offset += 16;
            endAnchor = findAnchor(startAnchor, offset);
            if (typeof endAnchor == "number") { 
                offset -= 16;
                break;
            }
            r.setEnd(endAnchor[0], endAnchor[1]);
            content = r.cloneContents();
            page.append(content);
            height = page.height();
            if (height > pageHeight) {
                flag = true;
                offset -= 16;
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

    function reflow () {
        setTimeout(function () {
            var anchor = $(window.getSelection().anchorNode);
            var page = anchor.parents('.page');
            reflowPage(page);
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

    $.fn.page = function (newPageCB) {
        var that = this;
        $('> *', that).each(function () {
            addContent($(this), that, newPageCB);
        });
        $(this).bind({'keydown click': reflow});
    };

})();
