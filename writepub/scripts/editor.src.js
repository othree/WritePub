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
            theme_advanced_buttons1 : "bold,italic,formatselect,link,unlink,image,underline,backcolor,strikethrough,sup,sub,code,numlist,bullist,blockquote,justifyleft,justifycenter,justifyright",
            theme_advanced_buttons2 : "",
            theme_advanced_buttons3 : "",
            theme_advanced_buttons4 : "",
            //theme_advanced_buttons1 : "save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
            //theme_advanced_buttons2 : "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
            //theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
            //theme_advanced_buttons4 : "insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",
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
