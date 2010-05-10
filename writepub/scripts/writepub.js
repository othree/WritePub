(function(){var a={};$.extend(a,{options:{defaults:{crumbs:{mainpage:{title:"main page"},introduction:{title:"introduction"}},booksPath:"books",fileExt:"html"}},meta:{toolbar:{read:{title:"read"},zoom:{title:"zoom"},download:{title:"download"},about:{title:"about"}},frontMatter:{introduction:{title:"introduction"},cover:{title:"cover"},titlepage:{title:"title page"},copyrightpage:{title:"copyright page"},authorspreface:{title:"author's preface"}}},book:{meta:{id:0,title:_("New Book"),creator:_("Hancorck"),
description:_("Book Description"),publisher:"",language:"",rights:"",toc:{root:true,sub:[0,{title:"Chapter 1",id:"1125834",sub:[0,{title:"Chapter 1-1",id:"1125348"},{title:"Chapter 1-2",id:"1155348"}]},{title:"Chapter 2",id:"112534778"}]}}}});$.extend(a,{init:function(b){if(a.inited)return false;a.inited=true;a.setOptions(b);a.options.writable=document.location.protocol=="file:";a.options.mode=a.options.writable?"w":"r";a.options.path=document.location.pathname.replace(/[^\/]*$/,"");a.options.debug=
document.location.search.indexOf("debug")>0;if(a.options.debug){a.options.writable="w";a.options.mode="w"}a.loadMeta();a.ui.init(a.options.mode);a.switchViewport();a.toc.init("#toc");a.presentId=a.getInitId();a.load(a.presentId)},setOptions:function(b){var c;for(c in a.options.defaults)a.options[c]=a.options.defaults[c];for(c in b)a.options[c]=b[c]},getInitId:function(){return document.location.hash||"introduction"},safeId:function(b){return b.replace(/[^\w\d-_%]/g,"")},chId:function(b){return!!b.match(/^ch\d(-\d)*$/)||
!!b.match(/^\d+$/)},idExist:function(b){var c;b=a.safeId(b);if(a.chId(b)||b.indexOf("http")===0||b=="mainpage")return b;else{for(c in a.meta.frontMatter)if(c==b)return b;for(c in a.meta.toolbar)if(c==b)return b;return false}},genId:function(b){var c=b.lastIndexOf("/")+1,d=b.lastIndexOf(".");b=b.substring(c,d);return a.idExist(a.safeId(b))},genFilePath:function(b){b=a.idExist(b)||b;if(b.match(/^ch\d(-\d)*$/)){b=b.substring(2).split("-");for(var c=a.book.meta.toc.sub,d=b.pop(),e=0,f=b.length;e<f;e++)c=
c[b[e]].sub;b=c[d].id}else b=b;return a.prependPath(b)},prependPath:function(b){return b.indexOf(".")===-1?a.options.booksPath+"/"+a.book.meta.id+"/"+b+"."+a.options.fileExt:a.options.booksPath+"/"+a.book.meta.id+"/"+b},load:function(b){b=a.idExist(a.safeId(b));if(b!==false){var c={mainpage:{title:"main page",value:a.book.meta.mainPage}};if(a.chId(b))for(var d=a.toc.chs(b),e=a.book.meta.toc.sub,f="ch",g=0,h=d.length;g<h;g++){e=e[d[g]];f+=(g===0?"":"-")+d[g];c[f]={title:e.title};if(g+1==h)b=e.id;else e=
e.sub}else c[b]={title:a.meta.frontMatter[b].title};a.ui.breadcrumbs(c);a.meta.id=b;a.setContent(a.loadContent(b))}},save:function(b){b=a.idExist(a.safeId(b));return b!==false?a.saveContent(b,a.getContent(b)):false},loadMeta:function(){var b=a.genFilePath("meta.json");b=a.loadFile(b);if(b!==false){b=JSON.parse(b);$.extend(a.book.meta,b)}},saveMeta:function(){var b=JSON.stringify(a.book.meta),c=a.genFilePath("meta.json");a.saveFile(c,b)},loadContent:function(b){b=a.genFilePath(b);b=a.loadFile(b);return b=
b===false?"["+_("No contents")+"]":b},saveContent:function(b,c){b=a.genFilePath(b);return a.saveFile(b,c)},setContent:function(b){if(typeof b=="string"){a.viewport.setContent(b);return true}else return false},getContent:function(){return a.editor.getContent()},saveFile:function(b,c){b=a.options.path.substring(1)+b;b=b.replace(/\//g,"\\");return a.options.mode=="w"?saveFile(b,convertUnicodeToFileFormat(c)):false},loadFile:function(b){b=$.ajax({url:document.location.protocol+"//"+document.location.host+
a.options.path+b,async:false});return b.status==200||b.status===0?b.responseText:false},switchViewport:function(){a.viewport="w"==a.options.mode?a.editor:a.reader;a.ui.switchViewport()},viewport:null,inited:false});window.writepub=a})();
(function(a){$.extend(a,{reader:{init:function(){if(!a.inited)return false;this.inited=true;this._instance=$("#reader")},setContent:function(b){if(typeof b!="string")return false;a.reader.inited?a.reader._instance.html(b):setTimeout(function(){a.reader.html(b)},100)},getContent:function(){if(!a.editor.inited)return false;return a.reader._instance.html()},show:function(){this._instance.show()},hide:function(){this._instance.hide()},inited:false,_instance:null}})})(writepub);
(function(a){$.extend(a,{editor:{init:function(){if(!a.inited)return false;$("#editor-area").tinymce({script_url:"writepub/vendor/tinymce/jscripts/tiny_mce/tiny_mce.js",theme:"advanced",width:"100%",height:"450",plugins:"safari,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",theme_advanced_buttons1:"save,newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
theme_advanced_buttons2:"cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",theme_advanced_buttons3:"tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",theme_advanced_buttons4:"insertlayer,moveforward,movebackward,absolute,|,styleprops,spellchecker,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,blockquote,pagebreak,|,insertfile,insertimage",
theme_advanced_toolbar_location:"top",theme_advanced_toolbar_align:"left",theme_advanced_statusbar_location:"bottom",theme_advanced_resizing:false,oninit:function(c){a.editor._instance=c;a.editor.inited=true}});var b=$('<button id="save">Save</button>').click(function(){var c=a.meta.id;c&&a.save(c)&&a.ui.doneSave(c)});$("#editor").append(b)},setContent:function(b){var c=this;if(typeof b!="string")return false;c.inited?c._instance.setContent(b):setTimeout(function(){c.setContent(b)},100)},getContent:function(){if(!this.inited)return false;
return this._instance.getContent()},show:function(){$("#editor").show();$("#save").show()},hide:function(){$("#editor").hide();$("#save").hide()},inited:false,_instance:null}})})(writepub);
(function(a){$.extend(a,{inplace:{init:function(){if(!a.inited||a.inplace.inited)return false;a.inplace.inited=true;var b=$("#inplace");if(b.length===0){$("body").append($(a.inplace.template));b=$("#inplace")}b.find("form").submit(function(){$.isFunction(a.inplace.callback)&&a.inplace.callback.apply(this,arguments);a.inplace.callback=null;a.inplace.hide();return false});b.find("#inplace-cancel").click(function(){a.inplace.hide();$.isFunction(a.inplace.cancelback)&&a.inplace.cancelback.apply(this,
arguments);a.inplace.callback=null;a.inplace.cancelback=null;return false});a.inplace.editor=b},esc:function(b){if(b.keyCode==27){a.inplace.hide();$.isFunction(a.inplace.cancelback)&&a.inplace.cancelback.apply(this,arguments);a.inplace.cancelback=null}},show:function(b,c,d,e){if(!a.inited||!a.inplace.inited)return false;b=a.inplace.getCoord(b);var f={width:b.width,height:b.height};a.inplace.setCoord(a.inplace.editor,{top:b.top,left:b.left});a.inplace.setCoord(a.inplace.editor.find("#inplace-input"),
f);a.inplace.editor.show().find("#inplace-input").val(c);a.inplace.callback=d;a.inplace.cancelback=e;$(document).bind("keydown",a.inplace.esc);setTimeout(function(){$("#inplace-input").focus()},100)},hide:function(){if(!a.inited||!a.inplace.inited)return false;a.inplace.editor.hide();$(document).unbind("keydown",a.inplace.esc)},getCoord:function(b){if(!a.inited||!a.inplace.inited)return false;var c=$(b).offset();return{top:c.top,left:c.left,width:$(b).width(),height:$(b).height()}},setCoord:function(b,
c){if(!a.inited||!a.inplace.inited)return false;var d=$(b).offset();if(c.top)d.top=c.top;if(c.left)d.left=c.left;$(b).offset(d);if(c.width)$(b).width(c.width*1.5<100?100:c.width*1.5);c.height&&$(b).height(c.height)},editor:null,template:'<div id="inplace" style="display: none; position: absolute;">    <form id="inplace-form">        <input id="inplace-input"><br />        <input id="inplace-submit" type="submit" value="GO">        <a href="#cancel" id="inplace-cancel">Cancel</a>    </form></div>'}})})(writepub);
(function(a){$.extend(a,{toc:{init:function(b){if(!a.inited)return false;this.inited=true;this.toc=$(b);this.ui.init(b)},html:function(b){function c(d,e,f){if($.isArray(d)&&d.length>0){var g="";for(var h in d)if(!(d[h]===0||!d.hasOwnProperty(h))){var i=e+parseInt(h,10);g+='<li><a id="'+i+'" href="'+a.genFilePath(i)+'">'+_(d[h].title)+"</a>"+c(d[h].sub,i+"-")+"</li>"}return f===true?g:"<ol>"+g+"</ol>"}else return""}b=b||a.book.meta.toc;return c(b.sub,"ch",b.root)},newCh:function(b){return{title:b,
id:(new Date).getTime()+""}},move:function(b,c){var d=a.toc.getCh(b);a.toc.remove(b);return d?a.toc.insert(c,d):false},insert:function(b,c){var d=b.slice(0,-1);d=a.toc.getCh(d);b=b.slice(-1);if(d&&!d.sub)d.sub=[0];if(!d||d.sub.length<b)return false;d.sub.splice(b,0,c);return true},remove:function(b){var c=b.slice(0,-1);c=a.toc.getCh(c);b=b.pop();if(!c||c.sub.length<b)return false;c.sub.remove(b);return true},stab:function(b){var c=b.slice(0,-1),d=c.pop()+1;if(d===0)return b;else{c.push(d);a.toc.move(b,
c);return c}},tab:function(b){var c=b.slice(),d=c.pop()-1;if(d===0)return b;else{c.push(d);d=a.toc.getCh(c);c.push(d.sub?d.sub.length:1);a.toc.move(b,c);return c}},chs:function(b){return $.map(b.substring(2).split("-"),function(c){return parseInt(c,10)})},shc:function(b){return"ch"+b.join("-")},getCh:function(b){if(b.length===0)return a.book.meta.toc;b=b.slice();for(var c=a.book.meta.toc.sub,d=b.pop(),e=0,f=b.length;e<f;e++)c=c[b[e]].sub;return c[d]},toc:null}});$.extend(a.toc,{ui:{init:function(b){if(!a.toc.inited)return false;
this.inited=true;this.attachEvent(b)},up:function(b){function c(e){var f=a.toc.getCh(e);if(f.sub&&f.sub.length>1){e.push(f.sub.length-1);return c(e)}else return e}function d(e){var f=e.pop()-1;if(f>0){e.push(f);return c(e)}else return e}b=b.slice();return d(b)},down:function(b){function c(e){var f=e.pop()+1,g=a.toc.getCh(e);if(f<g.sub.length){e.push(f);return e}else return e.length===0?false:c(e)}function d(e){e.slice(-1);var f=a.toc.getCh(e);if(f.sub&&f.sub.length>1){e.push(1);return e}else return c(e)}
b=b.slice();return d(b)},left:function(b){b.pop();return b.length===0?false:b},right:function(b){var c=a.toc.getCh(b);if(c.sub&&c.sub.length>0){b.push(1);return b}else return false},insert:function(b){a.toc.insert(b,a.toc.newCh(a.toc.shc(b)));return b},remove:function(b){a.toc.remove(b);return b},select:function(b){a.inplace.hide();if($.isArray(b))b="ch"+b.join("-");if(!a.chId(b))return false;$(a.toc.toc).find("a").removeClass("selected");this.target=b;return $("#"+b).addClass("selected").focus()},
attachEvent:function(b){$(b).click(function(c){c=(c=c.target)?c.id:"";this.focused=true;if(c===""||!a.chId(c))return false;a.toc.ui.select(c)});$(b).dblclick(function(c){if(!this.focused)return false;c=c.target;var d=a.toc.chs(c.id),e=a.toc.getCh(d);a.inplace.show(c,e.title,function(){e.title=$("#inplace-input",this).val();a.ui.toc();a.toc.ui.select(a.toc.ui.target);a.saveMeta()},function(){a.toc.ui.select(a.toc.ui.target)})});$(b).keydown(function(c){if(!this.focused)return false;var d=a.toc.chs(a.toc.ui.target),
e,f;if(c.keyCode==13){e=a.toc.getCh(d);d.push(e.sub&&e.sub.length>1?e.sub.length:1);d=a.toc.ui.insert(d);if(d!==false){a.ui.toc();a.toc.ui.select(d);c=jQuery.Event("keydown");c.keyCode=32;$(this).trigger(c)}}else if(c.keyCode==32){e=a.toc.getCh(d);a.inplace.show($("#"+a.toc.ui.target),e.title,function(){e.title=$("#inplace-input",this).val();a.ui.toc();a.toc.ui.select(a.toc.ui.target);a.saveMeta()},function(){a.toc.ui.select(a.toc.ui.target)})}else if(c.keyCode==38){f=a.toc.ui.up(d);if(f!==false){if(c.shiftKey){f.length>
d.length&&f.push(f.pop()+1);a.toc.move(d,f);a.ui.toc()}a.toc.ui.select(f)}return false}else if(c.keyCode==40){f=a.toc.ui.down(d);if(f!==false){if(c.shiftKey){a.toc.move(d,f);a.ui.toc()}a.toc.ui.select(f)}return false}else if(c.keyCode==37){d=a.toc.ui.left(d);d!==false&&a.toc.ui.select(d)}else if(c.keyCode==39){d=a.toc.ui.right(d);d!==false&&a.toc.ui.select(d)}else if(c.keyCode==45){c.shiftKey&&d.push(d.pop()+1);d=a.toc.ui.insert(d);if(d!==false){a.ui.toc();a.toc.ui.select(d);c=jQuery.Event("keydown");
c.keyCode=32;$(this).trigger(c)}}else if(c.keyCode==46){if(d.length==1&&d[0]==1)return false;if(confirm("Remove ?")){f=a.toc.ui.up(d);a.toc.ui.remove(d);a.ui.toc();f!==false&&a.toc.ui.select(f)}}else if(c.keyCode==9){d=c.shiftKey?a.toc.stab(d):a.toc.tab(d);a.ui.toc();d!==false&&a.toc.ui.select(d);return false}})},focus:false}})})(writepub);
(function(a){$.extend(a,{ui:{init:function(){if(!a.inited||a.ui.inited)return false;a.ui.inited=true;var b=$("#container");if(b.length===0){$("body").append($('<div id="container"></div>'));b=$("#container")}b.html(a.ui.initTemplate);a.ui.updateHeader();a.ui.toolbar(a.meta.toolbar);a.ui.frontMatter();a.ui.breadcrumbs(a.options.defaults.crumbs);a.inplace.init();a.ui.inplaceInit();if(a.options.mode){a.editor.init();a.reader.init();a.reader.hide()}else{a.editor.hide();a.reader.init()}a.ui.tocEvent();
a.ui.goContentEvent();$("#backto-main").parent().hide()},switchViewport:function(){if("w"==a.options.mode){a.editor.show();a.reader.hide();a.editor.setContent(a.reader.getContent())}else{a.editor.hide();a.reader.show();a.reader.setContent(a.editor.getContent())}},updateHeader:function(){$("#header h1").html(a.book.meta.title);$("#description").html(a.book.meta.description);$("#creator").html(a.book.meta.creator)},breadcrumbs:function(b){if(!a.ui.inited)return false;$("#breadcrumbs").empty();a.ui.fillList($("#breadcrumbs"),
b)},toolbar:function(b){if(!a.ui.inited)return false;a.ui.fillList($("#toolbar"),b)},frontMatter:function(){if(!a.ui.inited)return false;a.ui.fillList($("#toc"),a.meta.frontMatter)},inplaceInit:function(){$.fn.yellow=function(){var b;$(this).mouseover(function(){b=$(this).css("background-color");$(this).css("background-color","#ffffaa")}).mouseout(function(){$(this).css("background-color",b)});return this};$.fn.bookmetaInplace=function(b){$(this).dblclick(function(){a.inplace.show(this,a.book.meta[b],
function(){a.book.meta[b]=$("#inplace-input",this).val();a.ui.updateHeader();a.saveMeta()});return false})};$("#header h1").yellow().bookmetaInplace("title");$("#description").yellow().bookmetaInplace("description");$("#creator").yellow().bookmetaInplace("creator")},toc:function(){if(!a.ui.inited)return false;$("#toc").html(a.toc.html())},tocEvent:function(){$("#toc").click(function(b){var c=$(b.target).attr("href"),d=a.idExist($(b.target).attr("id"));if(d===false)d=a.genId(c);if(d!==false){a.load(d);
b.stopPropagation();b.preventDefault();return false}})},goContentEvent:function(){if(!a.ui.inited)return false;$("#goto-content").click(function(b){a.ui.toc();$("#goto-content").parent().hide();$("#backto-main").parent().show();a.load("ch1");b.stopPropagation();b.preventDefault();return false});$("#backto-main").click(function(b){a.ui.frontMatter();$("#goto-content").parent().show();$("#backto-main").parent().hide();a.load("introduction");b.stopPropagation();b.preventDefault();return false})},fillList:function(b,
c){if(!a.ui.inited)return false;var d="";for(var e in c){e=a.idExist(a.safeId(e));if(e!==false)d+='<li><a href="'+a.genFilePath(e)+'">'+_(c[e].title)+"</a></li>"}b.html(d)},doneSave:function(b){alert(b+" saved !")},getBody:function(){return $("body")},initTemplate:'<div id="header">    <h1></h1>    <p><span id="description"></span> by <span id="creator"></span></p></div><div id="nav">    <ol id="breadcrumbs"></ol>    <ul id="toolbar"></ul>    <div id="progress"></div></div><div id="main">    <div id="menu">        <p><a id="backto-main" href="">'+
_("back to main")+'</a></p>        <ol id="toc"></ol>        <p><a id="goto-content" href="">'+_("goto content")+'</a></p>    </div>    <div id="content">        <div id="editor"><textarea id="editor-area"></textarea></div>        <div id="reader"></div>    </div></div>',inited:false}})})(writepub);
(function(a){$(a.init);Array.prototype.remove=function(b,c){c=this.slice((c||b)+1||this.length);this.length=b<0?this.length+b:b;return this.push.apply(this,c)};config={};config.userAgent=navigator.userAgent.toLowerCase();config.browser={isIE:config.userAgent.indexOf("msie")!=-1&&config.userAgent.indexOf("opera")==-1,isGecko:navigator.product=="Gecko"&&config.userAgent.indexOf("WebKit")==-1,ieVersion:/MSIE (\d.\d)/i.exec(config.userAgent),isSafari:config.userAgent.indexOf("applewebkit")!=-1,isBadSafari:!(new RegExp("[\u0150\u0170]",
"g")).test("\u0150"),firefoxDate:/gecko\/(\d{8})/i.exec(config.userAgent),isOpera:config.userAgent.indexOf("opera")!=-1,isLinux:config.userAgent.indexOf("linux")!=-1,isUnix:config.userAgent.indexOf("x11")!=-1,isMac:config.userAgent.indexOf("mac")!=-1,isWindows:config.userAgent.indexOf("win")!=-1}})(writepub);
