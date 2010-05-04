(function(){var b={};$.extend(b,{options:{defaults:{crumbs:{mainpage:{title:"main page"},introduction:{title:"introduction"}},booksPath:"books",fileExt:"html"}},meta:{toolbar:{read:{title:"read"},zoom:{title:"zoom"},download:{title:"download"},about:{title:"about"}},frontMatter:{introduction:{title:"introduction"},cover:{title:"cover"},titlepage:{title:"title page"},copyrightpage:{title:"copyright page"},authorspreface:{title:"author's preface"}}},book:{meta:{id:0,title:_("New Book"),creator:_("Hancorck"),
description:_("Book Description"),publisher:"",language:"",rights:"",toc:{root:true,sub:[0,{title:"Chapter 1",id:"1125834",sub:[0,{title:"Chapter 1-1",id:"1125348"}]}]}}}});$.extend(b,{init:function(a){if(b.inited)return false;b.inited=true;b.setOptions(a);b.options.mode=document.location.protocol=="file:"?"w":"r";b.options.path=document.location.pathname.replace(/[^\/]*$/,"");b.loadMeta();b.ui.init();b.presentId=b.getInitId();b.load(b.presentId)},setOptions:function(a){var c;for(c in b.options.defaults)b.options[c]=
b.options.defaults[c];for(c in a)b.options[c]=a[c]},getInitId:function(){return document.location.hash||"introduction"},safeId:function(a){return a.replace(/[^\w\d-_%]/g,"")},chId:function(a){return!!a.match(/^ch\d(-\d)*$/)||!!a.match(/^\d+$/)},idExist:function(a){a=b.safeId(a);if(b.chId(a)||a.indexOf("http")===0||a=="mainpage")return a;else{for(var c in b.meta.frontMatter)if(c==a)return a;return false}},genId:function(a){var c=a.lastIndexOf("/")+1,d=a.lastIndexOf(".");a=a.substring(c,d);return b.idExist(b.safeId(a))},
genFilePath:function(a){a=b.idExist(a)||a;if(a.match(/^ch\d(-\d)*$/)){a=a.substring(2).split("-");for(var c=b.book.meta.toc.sub,d=a.pop(),e=0,f=a.length;e<f;e++)c=c[a[e]].sub;a=c[d].id}else a=a;return b.prependPath(a)},prependPath:function(a){return a.indexOf(".")===-1?b.options.booksPath+"/"+b.book.meta.id+"/"+a+"."+b.options.fileExt:b.options.booksPath+"/"+b.book.meta.id+"/"+a},load:function(a){a=b.idExist(b.safeId(a));if(a!==false){b.setContent(b.loadContent(a));var c={mainpage:{title:"main page",
value:b.book.meta.mainPage}};b.chId(a)||(c[a]={title:b.meta.frontMatter[a].title});b.ui.breadcrumbs(c);b.meta.id=a}},save:function(a){a=b.idExist(b.safeId(a));return a!==false?b.saveContent(a,b.getContent(a)):false},loadMeta:function(){var a=b.genFilePath("meta.json");a=b.loadFile(a);if(a!==false){a=JSON.parse(a);$.extend(b.book.meta,a)}},saveMeta:function(){var a=JSON.stringify(b.book.meta),c=b.genFilePath("meta.json");b.saveFile(c,a)},loadContent:function(a){a=b.genFilePath(a);a=b.loadFile(a);return a=
a===false?"["+_("No contents")+"]":a},saveContent:function(a,c){a=b.genFilePath(a);return b.saveFile(a,c)},setContent:function(a){if(typeof a=="string"){b.editor.setContent(a);return true}else return false},getContent:function(){return b.editor.getContent()},saveFile:function(a,c){a=b.options.path.substring(1)+a;a=a.replace(/\//g,"\\");return b.options.mode=="w"?saveFile(a,c):false},loadFile:function(a){a=$.ajax({url:document.location.protocol+"//"+document.location.host+b.options.path+a,async:false});
return a.status==200||a.status===0?a.responseText:false},inited:false});$.extend(b,{editor:{init:function(){if(b.editor.inited)return false;$("#editor").tinymce({script_url:"writepub/vendor/tinymce/jscripts/tiny_mce/tiny_mce.js",theme:"advanced",width:"100%",height:"450",plugins:"safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
theme_advanced_buttons1:"save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",theme_advanced_buttons2:"cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",theme_advanced_buttons3:"tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
theme_advanced_buttons4:"insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",theme_advanced_toolbar_location:"top",theme_advanced_toolbar_align:"left",theme_advanced_statusbar_location:"bottom",theme_advanced_resizing:false,oninit:function(c){b.editor._instance=c;b.editor.inited=true}});var a=$('<button id="save">Save</button>').click(function(){var c=b.meta.id;
c&&b.save(c)&&b.ui.doneSave(c)});$("#editor").after(a)},setContent:function(a){if(typeof a!="string")return false;b.editor.inited?b.editor._instance.setContent(a):setTimeout(function(){b.editor.setContent(a)},100)},getContent:function(){if(!b.editor.inited)return false;return b.editor._instance.getContent()},inited:false,_instance:null}});$.extend(b,{inplace:{init:function(){if(!b.inited||b.inplace.inited)return false;b.inplace.inited=true;var a=$("#inplace");if(a.length===0){$("body").append($(b.inplace.template));
a=$("#inplace")}a.find("form").submit(function(){$.isFunction(b.inplace.callback)&&b.inplace.callback.apply(this,arguments);b.inplace.callback=null;b.inplace.hide();return false});a.find("#inplace-cancel").click(function(){b.inplace.callback=null;b.inplace.hide();return false});b.inplace.editor=a},show:function(a,c,d){if(!b.inited||!b.inplace.inited)return false;a=b.inplace.getCoord(a);var e={width:a.width,height:a.height};b.inplace.setCoord(b.inplace.editor,{top:a.top,left:a.left});b.inplace.setCoord(b.inplace.editor.find("#inplace-input"),
e);b.inplace.editor.find("#inplace-input").val(c);b.inplace.editor.show();b.inplace.callback=d},hide:function(){if(!b.inited||!b.inplace.inited)return false;b.inplace.editor.hide()},getCoord:function(a){if(!b.inited||!b.inplace.inited)return false;var c=$(a).offset();return{top:c.top,left:c.left,width:$(a).width(),height:$(a).height()}},setCoord:function(a,c){if(!b.inited||!b.inplace.inited)return false;var d=$(a).offset();if(c.top)d.top=c.top;if(c.left)d.left=c.left;$(a).offset(d);c.width&&$(a).width(c.width*
2);c.height&&$(a).height(c.height)},editor:null,template:'<div id="inplace" style="display: none; position: absolute;">    <form id="inplace-form">        <input id="inplace-input"><br />        <input id="inplace-submit" type="submit" value="GO">        <a href="#cancel" id="inplace-cancel">Cancel</a>    </form></div>'}});$.extend(b,{toc:{init:function(){},html:function(a){function c(d,e,f){if($.isArray(d)&&d.length>0){var h="";for(var g in d)if(!(d[g]===0||!d.hasOwnProperty(g))){var i=e+parseInt(g,
10);h+='<li><a id="'+i+'" href="'+b.genFilePath(i)+'">'+_(d[g].title)+"</a>"+c(d[g].sub,i+"-")+"</li>"}return f===true?h:"<ol>"+h+"</ol>"}else return""}a=a||b.book.meta.toc;return c(a.sub,"ch",a.root)},move:function(a,c){return(a=b.toc.remove(a))?b.toc.insert(c,a):false},insert:function(a,c){if(!b.isCh(a))return false;var d=b.toc.chs(a),e=d.slice(0,-1);e=b.toc.getCh(e);d=d.slice(-1);if(!e||e.sub.length<=d)return false;e.sub.splice(a,0,c);return true},remove:function(a){if(!b.isCh(a))return false;
var c=b.toc.chs(a),d=c.slice(0,-1);d=b.toc.getCh(d);c=c.slice(-1);if(!d||d.sub.length<c)return false;return d.sub.remove(a)},chs:function(a){return a.substring(2).split("-")},getCh:function(a){for(var c=b.book.meta.toc.sub,d=a.pop(),e=0,f=a.length;e<f;e++)c=c[a[e]].sub;return c[d]}}});$.extend(b,{ui:{init:function(){if(!b.inited||b.ui.inited)return false;b.ui.inited=true;var a=$("#container");if(a.length===0){$("body").append($('<div id="container"></div>'));a=$("#container")}a.html(b.ui.initTemplate);
b.ui.updateHeader();b.ui.toolbar(b.meta.toolbar);b.ui.frontMatter();b.ui.breadcrumbs(b.options.defaults.crumbs);b.editor.init();b.inplace.init();b.ui.inplaceInit();b.ui.tocEvent();b.ui.goContentEvent();$("#backto-main").parent().hide()},updateHeader:function(){$("#header h1").html(b.book.meta.title);$("#description").html(b.book.meta.description);$("#creator").html(b.book.meta.creator)},breadcrumbs:function(a){if(!b.ui.inited)return false;$("#breadcrumbs").empty();b.ui.fillList($("#breadcrumbs"),
a)},toolbar:function(a){if(!b.ui.inited)return false;b.ui.fillList($("#toolbar"),a)},frontMatter:function(){if(!b.ui.inited)return false;b.ui.fillList($("#toc"),b.meta.frontMatter)},inplaceInit:function(){$.fn.yellow=function(){var a;$(this).mouseover(function(){a=$(this).css("background-color");$(this).css("background-color","#ffffaa")}).mouseout(function(){$(this).css("background-color",a)});return this};$.fn.bookmetaInplace=function(a){$(this).dblclick(function(){b.inplace.show(this,b.book.meta[a],
function(){b.book.meta[a]=$("#inplace-input",this).val();b.ui.updateHeader()});return false})};$("#header h1").yellow().bookmetaInplace("title");$("#description").yellow().bookmetaInplace("description");$("#creator").yellow().bookmetaInplace("creator")},toc:function(){if(!b.ui.inited)return false;$("#toc").html(b.toc.html())},tocEvent:function(){$("#toc").click(function(a){var c=$(a.target).attr("href");c=b.genId(c);if(c===false)c=b.idExist($(a.target).attr("id"));if(c!==false){b.load(c);a.stopPropagation();
a.preventDefault();return false}})},goContentEvent:function(){if(!b.ui.inited)return false;$("#goto-content").click(function(a){b.ui.toc();$("#goto-content").parent().hide();$("#backto-main").parent().show();b.load(b.book.meta.toc.sub[1].id);a.stopPropagation();a.preventDefault();return false});$("#backto-main").click(function(a){b.ui.frontMatter();$("#goto-content").parent().show();$("#backto-main").parent().hide();b.load("introduction");a.stopPropagation();a.preventDefault();return false})},fillList:function(a,
c){if(!b.ui.inited)return false;var d="";for(var e in c){e=b.idExist(b.safeId(e));if(e!==false)d+='<li><a href="'+b.genFilePath(e)+'">'+_(c[e].title)+"</a></li>"}a.html(d)},doneSave:function(a){alert(a+" saved !")},getBody:function(){return $("body")},initTemplate:'<div id="header">    <h1></h1>    <p><span id="description"></span> by <span id="creator"></span></p></div><div id="nav">    <ol id="breadcrumbs"></ol>    <ul id="toolbar"></ul>    <div id="progress"></div></div><div id="main">    <div id="menu">        <p><a id="backto-main" href="">'+
_("back to main")+'</a></p>        <ol id="toc"></ol>        <p><a id="goto-content" href="">'+_("goto content")+'</a></p>    </div>    <div id="content">        <textarea id="editor"></textarea>    </div></div>',inited:false}});$(b.init);Array.prototype.remove=function(a,c){c=this.slice((c||a)+1||this.length);this.length=a<0?this.length+a:a;return this.push.apply(this,c)};window.writepub=b})();
