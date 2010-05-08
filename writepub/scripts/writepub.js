(function(){var b={};$.extend(b,{options:{defaults:{crumbs:{mainpage:{title:"main page"},introduction:{title:"introduction"}},booksPath:"books",fileExt:"html"}},meta:{toolbar:{read:{title:"read"},zoom:{title:"zoom"},download:{title:"download"},about:{title:"about"}},frontMatter:{introduction:{title:"introduction"},cover:{title:"cover"},titlepage:{title:"title page"},copyrightpage:{title:"copyright page"},authorspreface:{title:"author's preface"}}},book:{meta:{id:0,title:_("New Book"),creator:_("Hancorck"),
description:_("Book Description"),publisher:"",language:"",rights:"",toc:{root:true,sub:[0,{title:"Chapter 1",id:"1125834",sub:[0,{title:"Chapter 1-1",id:"1125348"},{title:"Chapter 1-2",id:"1155348"}]},{title:"Chapter 2",id:"112534778"}]}}}});$.extend(b,{init:function(a){if(b.inited)return false;b.inited=true;b.setOptions(a);b.options.mode=document.location.protocol=="file:"?"w":"r";b.options.path=document.location.pathname.replace(/[^\/]*$/,"");b.loadMeta();b.ui.init();b.toc.init("#toc");b.presentId=
b.getInitId();b.load(b.presentId)},setOptions:function(a){var c;for(c in b.options.defaults)b.options[c]=b.options.defaults[c];for(c in a)b.options[c]=a[c]},getInitId:function(){return document.location.hash||"introduction"},safeId:function(a){return a.replace(/[^\w\d-_%]/g,"")},chId:function(a){return!!a.match(/^ch\d(-\d)*$/)||!!a.match(/^\d+$/)},idExist:function(a){a=b.safeId(a);if(b.chId(a)||a.indexOf("http")===0||a=="mainpage")return a;else{for(var c in b.meta.frontMatter)if(c==a)return a;return false}},
genId:function(a){var c=a.lastIndexOf("/")+1,d=a.lastIndexOf(".");a=a.substring(c,d);return b.idExist(b.safeId(a))},genFilePath:function(a){a=b.idExist(a)||a;if(a.match(/^ch\d(-\d)*$/)){a=a.substring(2).split("-");for(var c=b.book.meta.toc.sub,d=a.pop(),e=0,f=a.length;e<f;e++)c=c[a[e]].sub;a=c[d].id}else a=a;return b.prependPath(a)},prependPath:function(a){return a.indexOf(".")===-1?b.options.booksPath+"/"+b.book.meta.id+"/"+a+"."+b.options.fileExt:b.options.booksPath+"/"+b.book.meta.id+"/"+a},load:function(a){a=
b.idExist(b.safeId(a));if(a!==false){b.setContent(b.loadContent(a));var c={mainpage:{title:"main page",value:b.book.meta.mainPage}};b.chId(a)||(c[a]={title:b.meta.frontMatter[a].title});b.ui.breadcrumbs(c);b.meta.id=a}},save:function(a){a=b.idExist(b.safeId(a));return a!==false?b.saveContent(a,b.getContent(a)):false},loadMeta:function(){var a=b.genFilePath("meta.json");a=b.loadFile(a);if(a!==false){a=JSON.parse(a);$.extend(b.book.meta,a)}},saveMeta:function(){var a=JSON.stringify(b.book.meta),c=b.genFilePath("meta.json");
b.saveFile(c,a)},loadContent:function(a){a=b.genFilePath(a);a=b.loadFile(a);return a=a===false?"["+_("No contents")+"]":a},saveContent:function(a,c){a=b.genFilePath(a);return b.saveFile(a,c)},setContent:function(a){if(typeof a=="string"){b.editor.setContent(a);return true}else return false},getContent:function(){return b.editor.getContent()},saveFile:function(a,c){a=b.options.path.substring(1)+a;a=a.replace(/\//g,"\\");return b.options.mode=="w"?saveFile(a,c):false},loadFile:function(a){a=$.ajax({url:document.location.protocol+
"//"+document.location.host+b.options.path+a,async:false});return a.status==200||a.status===0?a.responseText:false},inited:false});$.extend(b,{editor:{init:function(){if(b.editor.inited)return false;$("#editor").tinymce({script_url:"writepub/vendor/tinymce/jscripts/tiny_mce/tiny_mce.js",theme:"advanced",width:"100%",height:"450",plugins:"safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
theme_advanced_buttons1:"save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",theme_advanced_buttons2:"cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",theme_advanced_buttons3:"tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
theme_advanced_buttons4:"insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",theme_advanced_toolbar_location:"top",theme_advanced_toolbar_align:"left",theme_advanced_statusbar_location:"bottom",theme_advanced_resizing:false,oninit:function(c){b.editor._instance=c;b.editor.inited=true}});var a=$('<button id="save">Save</button>').click(function(){var c=b.meta.id;
c&&b.save(c)&&b.ui.doneSave(c)});$("#editor").after(a)},setContent:function(a){if(typeof a!="string")return false;b.editor.inited?b.editor._instance.setContent(a):setTimeout(function(){b.editor.setContent(a)},100)},getContent:function(){if(!b.editor.inited)return false;return b.editor._instance.getContent()},inited:false,_instance:null}});$.extend(b,{inplace:{init:function(){if(!b.inited||b.inplace.inited)return false;b.inplace.inited=true;var a=$("#inplace");if(a.length===0){$("body").append($(b.inplace.template));
a=$("#inplace")}a.find("form").submit(function(){$.isFunction(b.inplace.callback)&&b.inplace.callback.apply(this,arguments);b.inplace.callback=null;b.inplace.hide();return false});a.find("#inplace-cancel").click(function(){b.inplace.hide();$.isFunction(b.inplace.cancelback)&&b.inplace.cancelback.apply(this,arguments);b.inplace.callback=null;b.inplace.cancelback=null;return false});b.inplace.editor=a},esc:function(a){if(a.keyCode==27){b.inplace.hide();$.isFunction(b.inplace.cancelback)&&b.inplace.cancelback.apply(this,
arguments);b.inplace.cancelback=null}},show:function(a,c,d,e){if(!b.inited||!b.inplace.inited)return false;a=b.inplace.getCoord(a);var f={width:a.width,height:a.height};b.inplace.setCoord(b.inplace.editor,{top:a.top,left:a.left});b.inplace.setCoord(b.inplace.editor.find("#inplace-input"),f);b.inplace.editor.show().find("#inplace-input").val(c);b.inplace.callback=d;b.inplace.cancelback=e;$(document).bind("keydown",b.inplace.esc);setTimeout(function(){$("#inplace-input").focus()},100)},hide:function(){if(!b.inited||
!b.inplace.inited)return false;b.inplace.editor.hide();$(document).unbind("keydown",b.inplace.esc)},getCoord:function(a){if(!b.inited||!b.inplace.inited)return false;var c=$(a).offset();return{top:c.top,left:c.left,width:$(a).width(),height:$(a).height()}},setCoord:function(a,c){if(!b.inited||!b.inplace.inited)return false;var d=$(a).offset();if(c.top)d.top=c.top;if(c.left)d.left=c.left;$(a).offset(d);if(c.width)$(a).width(c.width*1.5<100?100:c.width*1.5);c.height&&$(a).height(c.height)},editor:null,
template:'<div id="inplace" style="display: none; position: absolute;">    <form id="inplace-form">        <input id="inplace-input"><br />        <input id="inplace-submit" type="submit" value="GO">        <a href="#cancel" id="inplace-cancel">Cancel</a>    </form></div>'}});$.extend(b,{toc:{init:function(a){if(!b.inited)return false;this.inited=true;this.toc=$(a);this.ui.init(a)},html:function(a){function c(d,e,f){if($.isArray(d)&&d.length>0){var g="";for(var h in d)if(!(d[h]===0||!d.hasOwnProperty(h))){var i=
e+parseInt(h,10);g+='<li><a id="'+i+'" href="'+b.genFilePath(i)+'">'+_(d[h].title)+"</a>"+c(d[h].sub,i+"-")+"</li>"}return f===true?g:"<ol>"+g+"</ol>"}else return""}a=a||b.book.meta.toc;return c(a.sub,"ch",a.root)},newCh:function(a){return{title:a,id:(new Date).getTime()+""}},move:function(a,c){return(a=b.toc.remove(a))?b.toc.insert(c,a):false},insert:function(a,c){if(!b.chId(a))return false;a=b.toc.chs(a);var d=a.slice(0,-1);d=b.toc.getCh(d);a=a.slice(-1);if(!d||d.sub.length<=a)return false;d.sub.splice(parseInt(a,
10),0,c);return true},remove:function(a){if(!b.chId(a))return false;var c=b.toc.chs(a),d=c.slice(0,-1);d=b.toc.getCh(d);c=c.slice(-1);if(!d||d.sub.length<c)return false;return d.sub.remove(a)},chs:function(a){return a.substring(2).split("-")},getCh:function(a){if(a.length===0)return b.book.meta.toc;a=a.slice();for(var c=b.book.meta.toc.sub,d=a.pop(),e=0,f=a.length;e<f;e++)c=c[a[e]].sub;return c[d]},toc:null}});$.extend(b.toc,{ui:{init:function(a){if(!b.toc.inited)return false;this.inited=true;this.attachEvent(a)},
up:function(a){function c(e){var f=b.toc.getCh(e);if(f.sub&&f.sub.length>1){e.push(f.sub.length-1+"");return c(e)}else return e}function d(e){var f=parseInt(e.pop(),10)-1;if(f>0){e.push(f+"");return c(e)}else return e}return d(a)},down:function(a){function c(e){var f=parseInt(e.pop(),10)+1,g=b.toc.getCh(e);if(f<g.sub.length){e.push(f);return e}else return e.length===0?false:c(e)}function d(e){e.slice(-1);var f=b.toc.getCh(e);if(f.sub&&f.sub.length>0){e.push("1");return e}else return c(e)}return d(a)},
left:function(a){a.pop();return a.length===0?false:a},right:function(a){var c=b.toc.getCh(a);if(c.sub&&c.sub.length>0){a.push("1");return a}else return false},insert:function(a){var c="ch"+a.join("-");b.toc.insert(c,b.toc.newCh(c));return a},select:function(a){if($.isArray(a))a="ch"+a.join("-");if(!b.chId(a))return false;$(b.toc.toc).find("a").removeClass("selected");this.target=a;return $("#"+a).addClass("selected").focus()},attachEvent:function(a){$(a).click(function(c){c=(c=c.target)?c.id:"";this.focused=
true;if(c===""||!b.chId(c))return false;b.toc.ui.select(c)});$(a).dblclick(function(c){if(!this.focused)return false;c=c.target;var d=b.toc.chs(c.id),e=b.toc.getCh(d);b.inplace.show(c,e.title,function(){e.title=$("#inplace-input",this).val();b.ui.toc()},function(){b.toc.ui.select(b.toc.ui.target)})});$(a).keydown(function(c){if(!this.focused)return false;var d=b.toc.chs(b.toc.ui.target),e;if(c.keyCode==13){e=b.toc.getCh(d);b.inplace.show($("#"+b.toc.ui.target),e.title,function(){e.title=$("#inplace-input",
this).val();b.ui.toc();b.toc.ui.select(b.toc.ui.target)},function(){b.toc.ui.select(b.toc.ui.target)})}else if(c.keyCode==38){d=b.toc.ui.up(d);b.toc.ui.select(d)}else if(c.keyCode==40){d=b.toc.ui.down(d);d!==false&&b.toc.ui.select(d)}else if(c.keyCode==37){d=b.toc.ui.left(d);d!==false&&b.toc.ui.select(d)}else if(c.keyCode==39){d=b.toc.ui.right(d);d!==false&&b.toc.ui.select(d)}else if(c.keyCode==45){d=b.toc.ui.insert(d);b.ui.toc();d!==false&&b.toc.ui.select(d)}})},focus:false}});$.extend(b,{ui:{init:function(){if(!b.inited||
b.ui.inited)return false;b.ui.inited=true;var a=$("#container");if(a.length===0){$("body").append($('<div id="container"></div>'));a=$("#container")}a.html(b.ui.initTemplate);b.ui.updateHeader();b.ui.toolbar(b.meta.toolbar);b.ui.frontMatter();b.ui.breadcrumbs(b.options.defaults.crumbs);b.editor.init();b.inplace.init();b.ui.inplaceInit();b.ui.tocEvent();b.ui.goContentEvent();$("#backto-main").parent().hide()},updateHeader:function(){$("#header h1").html(b.book.meta.title);$("#description").html(b.book.meta.description);
$("#creator").html(b.book.meta.creator)},breadcrumbs:function(a){if(!b.ui.inited)return false;$("#breadcrumbs").empty();b.ui.fillList($("#breadcrumbs"),a)},toolbar:function(a){if(!b.ui.inited)return false;b.ui.fillList($("#toolbar"),a)},frontMatter:function(){if(!b.ui.inited)return false;b.ui.fillList($("#toc"),b.meta.frontMatter)},inplaceInit:function(){$.fn.yellow=function(){var a;$(this).mouseover(function(){a=$(this).css("background-color");$(this).css("background-color","#ffffaa")}).mouseout(function(){$(this).css("background-color",
a)});return this};$.fn.bookmetaInplace=function(a){$(this).dblclick(function(){b.inplace.show(this,b.book.meta[a],function(){b.book.meta[a]=$("#inplace-input",this).val();b.ui.updateHeader()});return false})};$("#header h1").yellow().bookmetaInplace("title");$("#description").yellow().bookmetaInplace("description");$("#creator").yellow().bookmetaInplace("creator")},toc:function(){if(!b.ui.inited)return false;$("#toc").html(b.toc.html())},tocEvent:function(){$("#toc").click(function(a){var c=$(a.target).attr("href");
c=b.genId(c);if(c===false)c=b.idExist($(a.target).attr("id"));if(c!==false){b.load(c);a.stopPropagation();a.preventDefault();return false}})},goContentEvent:function(){if(!b.ui.inited)return false;$("#goto-content").click(function(a){b.ui.toc();$("#goto-content").parent().hide();$("#backto-main").parent().show();b.load(b.book.meta.toc.sub[1].id);a.stopPropagation();a.preventDefault();return false});$("#backto-main").click(function(a){b.ui.frontMatter();$("#goto-content").parent().show();$("#backto-main").parent().hide();
b.load("introduction");a.stopPropagation();a.preventDefault();return false})},fillList:function(a,c){if(!b.ui.inited)return false;var d="";for(var e in c){e=b.idExist(b.safeId(e));if(e!==false)d+='<li><a href="'+b.genFilePath(e)+'">'+_(c[e].title)+"</a></li>"}a.html(d)},doneSave:function(a){alert(a+" saved !")},getBody:function(){return $("body")},initTemplate:'<div id="header">    <h1></h1>    <p><span id="description"></span> by <span id="creator"></span></p></div><div id="nav">    <ol id="breadcrumbs"></ol>    <ul id="toolbar"></ul>    <div id="progress"></div></div><div id="main">    <div id="menu">        <p><a id="backto-main" href="">'+
_("back to main")+'</a></p>        <ol id="toc"></ol>        <p><a id="goto-content" href="">'+_("goto content")+'</a></p>    </div>    <div id="content">        <textarea id="editor"></textarea>    </div></div>',inited:false}});$(b.init);Array.prototype.remove=function(a,c){c=this.slice((c||a)+1||this.length);this.length=a<0?this.length+a:a;return this.push.apply(this,c)};window.writepub=b})();
