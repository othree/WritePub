/*global writepub _ tinyMCE saveFile loadFile convertUnicodeToFileFormat config */

(function () {

    var pageHeight = 16*(28-2);

    function newPage (context, cb) {
        this.count = ++this.count || 1;
        var page = $('<div class="paper"><div class="page" id="page-'+this.count+'"></div></div>').appendTo(context).find('.page');
        if ($.isFunction(cb)) { cb('page-'+this.count); }
        return page;
    }

    //var page = newPage();

    function reflowPage (page, context) {
        if (page.children().length === 0) {
            page.parents('.paper').remove();
        } else {
            var height = page.height(),
                content,
                nextPage;
            if (height > pageHeight) {
                content = page.find(':last-child');
                nextPage = $(page).parent('.paper').next('.paper').find('.page');
                if (nextPage.length === 0) {
                    nextPage = newPage(context);
                }
                content.prependTo(nextPage);
                height = page.height();
                if (height > pageHeight) {
                   reflowPage( page );
                } else {
                    reflowPage( nextPage );
                }
                return true;
            } else if (height < pageHeight) {
                nextPage = $(page).parent('.paper').next('.paper').find('.page');
                if (nextPage.length !== 0) {
                    content = nextPage.find(':first-child');
                    if (content.length !== 0) {
                        content.appendTo(page);
                        height = page.height();
                        if (height > pageHeight) {
                            content.prependTo(nextPage);
                        } else {
                            reflowPage( nextPage );
                            reflowPage( page );
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
        $('*', that).each(function () {
            addContent($(this), that, newPageCB);
        });
        $(this).bind({'keydown click': reflow});
    };

})();
