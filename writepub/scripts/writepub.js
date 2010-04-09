(function(){var a={};$.extend(a,{options:{defaults:{crumbs:[{title:"main page",id:"main page"},{title:"introduction",id:"introduction"}],booksPath:"books",fileExt:"html"}},meta:{toolbar:[{title:"read",id:"read"},{title:"zoom",id:"zoom"},{title:"download",id:"download"},{title:"about",id:"about"}],frontMatter:[{title:"introduction",id:"introduction"},{title:"cover",id:"cover"},{title:"title page",id:"title page"},{title:"copyright page",id:"copyright page"},{title:"author's preface",id:"author's preface"}]},
book:{meta:{title:_("New Book"),desc:_("Book Description"),toc:[{title:"Chapter 1",id:"ch1"}]}}});$.extend(a,{init:function(b){if(a.inited)return false;a.inited=true;a.setOptions(b);a.options.mode=document.location.protocol=="file:"?"w":"r";a.options.path=document.location.pathname.replace(/[^\/]*$/,"");a.loadMeta();a.ui.init();a.presentId=a.getInitId();a.load(a.presentId)},setOptions:function(b){var c;for(c in a.options.defaults)a.options[c]=a.options.defaults[c];for(c in b)a.options[c]=b[c]},getInitId:function(){return document.location.hash||
"introduction"},safeId:function(b){return b.replace(/[^\w\d-_%]/g,"")},idExist:function(b){b=a.safeId(b);if(b.match(/^ch\d(-\d)*$/))return b;else{for(var c=0,d=a.meta.frontMatter.length;c<d;c++)if(a.safeId(a.meta.frontMatter[c].title)==b)return b;return false}},load:function(b){b=a.idExist(a.safeId(b));b!==false&&a.setContent(a.loadContent(b))},save:function(b){b=a.idExist(a.safeId(b));b!==false&&a.saveContent(b,a.getContent(b))},loadMeta:function(){var b=a.loadFile(a.options.booksPath+"/0/meta.json");
if(b!==false){b=JSON.parse(b);$.extend(a.book.meta,b)}},saveMeta:function(){var b=JSON.stringify(a.book.meta);a.saveFile(a.options.booksPath+"/0/meta.json",b)},loadTOC:function(){},loadContent:function(b){b=a.loadFile(a.options.booksPath+"/0/"+b+"."+a.options.fileExt);return b=b===false?"["+_("No contents")+"]":b},saveContent:function(b,c){return a.saveFile(a.options.booksPath+"/0/"+b+"."+a.options.fileExt,c)},setContent:function(b){if(typeof b=="string"){a.editor.setContent(b);return true}else return false},
getContent:function(){return a.editor.getContent()},saveFile:function(b,c){return a.options.mode=="w"?saveFile(b,c):false},loadFile:function(b){var c=document.location.protocol+"//"+document.location.host+a.options.path+b;if(a.options.mode=="w")return loadFile(b);else{b=$.ajax({url:c,async:false});return b.status==200?b.responseText:false}},inited:false});$.extend(a,{editor:{load:function(){if(a.editor.inited)return false;$("#editor").tinymce({script_url:"writepub/vendor/tinymce/jscripts/tiny_mce/tiny_mce.js",
theme:"advanced",width:"100%",height:"475",plugins:"safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",theme_advanced_buttons1:"save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",theme_advanced_buttons2:"cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
theme_advanced_buttons3:"tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",theme_advanced_buttons4:"insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",theme_advanced_toolbar_location:"top",theme_advanced_toolbar_align:"left",theme_advanced_statusbar_location:"bottom",theme_advanced_resizing:false,
oninit:function(b){a.editor._instance=b;a.editor.inited=true}})},setContent:function(b){if(typeof b!="string")return false;a.editor.inited?a.editor._instance.setContent(b):setTimeout(function(){a.editor.setContent(b)},100)},getContent:function(){if(!a.editor.inited)return false;return a.editor._instance.getContent()},inited:false,_instance:null}});$.extend(a,{ui:{init:function(){if(!a.inited||a.ui.inited)return false;a.ui.inited=true;var b=$("#container");if(b.length===0){$("body").append($('<div id="container"></div>'));
b=$("#container")}b.html(a.ui.initTemplate);a.ui.updateHeader();a.ui.toolbar(a.meta.toolbar);a.ui.frontMatter(a.meta.frontMatter);a.ui.breadcrumbs(a.options.defaults.crumbs);a.editor.load()},updateHeader:function(){$("#header h1").html(a.book.meta.title);$("#desc").html(a.book.meta.desc)},breadcrumbs:function(b){if(!a.ui.inited)return false;a.ui.fillList($("#breadcrumbs"),b)},toolbar:function(b){if(!a.ui.inited)return false;a.ui.fillList($("#toolbar"),b)},frontMatter:function(b){if(!a.ui.inited)return false;
a.ui.fillList($("#toc"),b);$("#toc").click(function(c){var d=$(c.target).attr("href"),e=d.indexOf("#");if(e!=-1){a.load(d.substring(e+1));c.stopPropagation();c.preventDefault();return false}})},fillList:function(b,c){for(var d="",e,f=0,g=c.length;f<g;f++){e=a.idExist(a.safeId(c[f].id));if(e!==false)d+='<li><a href="#'+e+'">'+_(c[f].title)+"</a></li>"}b.html(d)},getBody:function(){return $("body")},initTemplate:'<div id="header">    <h1></h1>    <p id="desc"></p></div><div id="nav">    <ol id="breadcrumbs">    </ol>    <ul id="toolbar">    </ul>    <div id="progress"></div></div><div id="main">    <div id="menu">        <ol id="toc">        </ol>        <p>            <a id="goto-content" href="">'+
_("goto content")+'</a>        </p>    </div>    <div id="content">        <textarea id="editor"></textarea>    </div></div>',inited:false}});$(a.init);window.writepub=a})();
