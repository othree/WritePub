all: writepub.js

writepub.js: writepub.src.js
	cat writepub.src.js | closure-compiler > writepub.js

writepub.src.js:
	cat base.src.js page.src.js reader.src.js editor.src.js inplace.src.js toc.src.js ui.src.js misc.src.js > writepub.src.js

clean:
	rm writepub.src.js writepub.js
