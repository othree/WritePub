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
