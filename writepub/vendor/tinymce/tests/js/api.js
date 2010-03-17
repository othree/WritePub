/**
 * Fakes a mouse event.
 *
 * @param {Element/String} e DOM element object or element id to send fake event to.
 * @param {String} na Event name to fake like "click".
 * @param {Object} o Optional object with data to send with the event like cordinates.
 */
function fakeMouseEvent(e, na, o) {
	var ev;

	o = tinymce.extend({
		screenX : 0,
		screenY : 0,
		clientX : 0,
		clientY : 0
	}, o);

	e = tinymce.DOM.get(e);

	if (e.fireEvent) {
		ev = document.createEventObject();
		tinymce.extend(ev, o);
		e.fireEvent('on' + na, ev);
		return;
	}

	ev = document.createEvent('MouseEvents');

	if (ev.initMouseEvent)
		ev.initMouseEvent(na, true, true, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, false, false, true, false, 0, null);

	e.dispatchEvent(ev);
};

/**
 * Fakes a key event.
 *
 * @param {Element/String} e DOM element object or element id to send fake event to.
 * @param {String} na Event name to fake like "keydown".
 * @param {Object} o Optional object with data to send with the event like keyCode and charCode.
 */
function fakeKeyEvent(e, na, o) {
	var ev;

	o = tinymce.extend({
		keyCode : 13,
		charCode : 0
	}, o);

	e = tinymce.DOM.get(e);

	if (e.fireEvent) {
		ev = document.createEventObject();
		tinymce.extend(ev, o);
		e.fireEvent('on' + na, ev);
		return;
	}

	if (document.createEvent) {
		try {
			// Fails in Safari
			ev = document.createEvent('KeyEvents');
			ev.initKeyEvent(na, true, true, window, false, false, false, false, o.keyCode, o.charCode);
		} catch (ex) {
			ev = document.createEvent('Events');
			ev.initEvent(na, true, true);

			ev.keyCode = o.keyCode;
			ev.charCode = o.charCode;
		}
	} else {
		ev = document.createEvent('UIEvents');

		if (ev.initUIEvent)
			ev.initUIEvent(na, true, true, window, 1);

		ev.keyCode = o.keyCode;
		ev.charCode = o.charCode;
	}

	e.dispatchEvent(ev);
};

(function() {
	test('tinymce - is', 9, function() {
		ok(!tinymce.is(null, 'test'));
		ok(!tinymce.is('', 'test'));
		ok(tinymce.is('', 'string'));
		ok(tinymce.is(3, 'number'));
		ok(tinymce.is(3.1, 'number'));
		ok(tinymce.is([], 'array'));
		ok(tinymce.is({}, 'object'));
		ok(tinymce.is(window.abc, 'undefined'));
		ok(!tinymce.is(window.abc));
	});

	test('tinymce - each', 6, function() {
		var c;

		c = 0;
		tinymce.each([1, 2, 3], function(v) {
			c += v;
		});
		equals(c, 6);

		c = 0;
		tinymce.each([1, 2, 3], function(v, i) {
			c += i;
		});
		equals(c, 3);

		c = 0;
		tinymce.each({a : 1, b : 2, c : 3}, function(v, i) {
			c += v;
		});
		equals(c, 6);

		c = '';
		tinymce.each({a : 1, b : 2, c : 3}, function(v, k) {
			c += k;
		});
		equals(c, 'abc');

		c = 0;
		tinymce.each(null, function(v) {
			c += v;
		});
		equals(c, 0);

		c = 0;
		tinymce.each(1, function(v) {
			c += v;
		});
		equals(c, 0);
	});

	test('tinymce - map', 1, function() {
		var c;

		c = tinymce.map([1,2,3], function(v) {
			return v + 1;
		});
		equals(c.join(','), '2,3,4');
	});

	test('tinymce - grep', 3, function() {
		var c;

		c = tinymce.grep([1,2,3,4], function(v) {
			return v > 2;
		});
		equals(c.join(','), '3,4');

		c = [1,2,3,4];
		c.test = 1
		c = tinymce.grep(c);
		ok(!c.test);
		equals(c.join(','), '1,2,3,4');
	});

	test('tinymce - explode', 2, function() {
		equals(tinymce.explode(' a, b, c ').join(','), 'a,b,c');
		equals(tinymce.explode(' a;  b; c ', ';').join(','), 'a,b,c');
	});

	test('tinymce - inArray', 4, function() {
		equals(tinymce.inArray([1,2,3], 2), 1);
		equals(tinymce.inArray([1,2,3], 7), -1);
		equals(tinymce.inArray({a : 1, b : 2, c : 3}, 2), -1);
		equals(tinymce.inArray(null, 7), -1);
	});

	test('tinymce - extend', 5, function() {
		var o;

		o = tinymce.extend({
			a : 1,
			b : 2,
			c : 3
		}, {
			a : 2,
			d : 4
		});

		equals(o.a, 2);
		equals(o.b, 2);
		equals(o.d, 4);

		o = tinymce.extend({
			a : 1,
			b : 2,
			c : 3
		}, {
			a : 2,
			d : 4
		}, {
			e : 5
		});

		equals(o.d, 4);
		equals(o.e, 5);
	});

	test('tinymce - trim', 5, function() {
		equals(tinymce.trim('a'), 'a');
		equals(tinymce.trim(' \r  a'), 'a');
		equals(tinymce.trim('a  \n  '), 'a');
		equals(tinymce.trim('   a  \t  '), 'a');
		equals(tinymce.trim(null), '');
	});

	test('tinymce - create', 13, function() {
		var o;

		tinymce.create('tinymce.Test1', {
			Test1 : function(c) {
				this.c = c;
				this.c++;
			},

			method1 : function() {
				this.c++;
			},

			method2 : function() {
				this.c++;
			}
		});

		tinymce.create('tinymce.Test2:tinymce.Test1', {
			Test2 : function(c) {
				this.parent(c);
				this.c += 2;
			},

			method1 : function() {
				this.c+=2;
			},

			method2 : function() {
				this.parent();
				this.c+=2;
			}
		});

		tinymce.create('tinymce.Test3:tinymce.Test2', {
			Test3 : function(c) {
				this.parent(c);
				this.c += 4;
			},

			method1 : function() {
				this.c+=2;
			},

			method2 : function() {
				this.parent();
				this.c+=3;
			}
		});

		tinymce.create('tinymce.Test4:tinymce.Test3', {
			method2 : function() {
				this.parent();
				this.c+=3;
			},

			'static' : {
				method3 : function() {
					return 3;
				}
			}
		});

		tinymce.create('static tinymce.Test5', {
			method1 : function() {
				return 3;
			}
		});

		o = new tinymce.Test1(3);
		equals(o.c, 4);
		o.method1();
		equals(o.c, 5);

		o = new tinymce.Test2(3);
		equals(o.c, 6);
		o.method1();
		equals(o.c, 8);
		o.method2();
		equals(o.c, 11);

		o = new tinymce.Test3(3);
		equals(o.c, 10);
		o.method1();
		equals(o.c, 12);
		o.method2();
		equals(o.c, 18);

		o = new tinymce.Test4(3);
		equals(o.c, 10);
		o.method1();
		equals(o.c, 12);
		o.method2();
		equals(o.c, 21);
		equals(tinymce.Test4.method3(), 3);

		equals(tinymce.Test5.method1(), 3);
	});

	test('tinymce - walk', 3, function() {
		var c;

		c = 0;
		tinymce.walk({
			a : {
				a1 : 1,
				a2 : 2,
				a3 : 3
			},

			b : {
				b1 : 4,
				b2 : {
					b21 : 5,
					b22 : 6,
					b23 : 7
				},
				b3 : 8
			}
		}, function(v) {
			if (tinymce.is(v, 'number'))
				c += v;
		});
		equals(c, 36);

		c = 0;
		tinymce.walk({
			items : [
				1,
				{items : [2, {a1 : 3, items : [4, 5], b1 : 6}, 7]},
				8
			]
		}, function(v) {
			if (tinymce.is(v, 'number'))
				c += v;
		}, 'items');
		equals(c, 27);

		c = 0;
		tinymce.walk(null);
		equals(c, 0);
	});

	test('tinymce - createNS', 2, function() {
		tinymce.createNS('a.b.c.d.e');
		a.b.c.d.e.x = 1;
		tinymce.createNS('a.b.c.d.e.f');
		a.b.c.d.e.f = 2;
		equals(a.b.c.d.e.x, 1);
		equals(a.b.c.d.e.f, 2);
	});

	test('tinymce - get', 2, function() {
		tinymce.createNS('a.b.c.d.e');
		a.b.c.d.e.x = 1;
		equals(tinymce.resolve('a.b.c.d.e.x'), 1);
		ok(!tinymce.resolve('a.b.c.d.e.y'));
	});
})();

(function() {
	var DOM = new tinymce.dom.DOMUtils(document, {keep_values : true});

	test('tinymce.dom.DOMUtils - parseStyle', 9, function() {
		var dom;

		DOM.add(document.body, 'div', {id : 'test'});

		dom = new tinymce.dom.DOMUtils(document, {hex_colors : true, keep_values : true, url_converter : function(u, n, e) {
			return 'X' + u + 'Y';
		}});

		equals(
			dom.serializeStyle(dom.parseStyle('border: 1px solid red; color: green')),
			'border: 1px solid red; color: green;'
		);

		equals(
			dom.serializeStyle(dom.parseStyle('border: 1px solid rgb(0, 255, 255); color: green')),
			'border: 1px solid #00ffff; color: green;'
		);

		equals(
			dom.serializeStyle(dom.parseStyle('border-top: 1px solid red; border-left: 1px solid red; border-bottom: 1px solid red; border-right: 1px solid red;')),
			'border: 1px solid red;'
		);

		equals(
			dom.serializeStyle(dom.parseStyle('background: transparent url(test.gif);')),
			'background: transparent url(Xtest.gifY);'
		);

		equals(
			dom.serializeStyle(dom.parseStyle('background: transparent url(http://www.site.com/test.gif?a=1&b=2);')),
			'background: transparent url(Xhttp://www.site.com/test.gif?a=1&b=2Y);'
		);

		dom.setHTML('test', '<span id="test2" style="border: 1px solid #00ff00;"></span>');
		equals(dom.getAttrib('test2', 'style'), 'border: 1px solid #00ff00;');

		dom.setHTML('test', '<span id="test2" style="background-image: url(test.gif);"></span>');
		equals(dom.getAttrib('test2', 'style'), 'background-image: url(Xtest.gifY);');

		dom.get('test').innerHTML = '<span id="test2" style="border: 1px solid #00ff00"></span>';
		equals(dom.getAttrib('test2', 'style'), tinymce.isIE ? 'border: #00ff00 1px solid;' : 'border: 1px solid #00ff00;'); // IE has a separate output

		dom.get('test').innerHTML = '<span id="test2" style="background-image: url(http://www.site.com/test.gif);"></span>';
		equals(dom.getAttrib('test2', 'style'), 'background-image: url(Xhttp://www.site.com/test.gifY);');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - addClass', 10, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').className = '';
		DOM.addClass('test', 'abc');
		equals(DOM.get('test').className, 'abc');

		DOM.get('test').className = '';
		equals(DOM.addClass('test', 'abc'), 'abc');
		equals(DOM.addClass(null, 'abc'), false);

		DOM.addClass('test', '123');
		equals(DOM.get('test').className, 'abc 123');

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.addClass(DOM.select('span', 'test'), 'abc');
		equals(DOM.get('test2').className, 'abc');
		equals(DOM.get('test3').className, 'abc');
		equals(DOM.get('test4').className, 'abc');
		DOM.get('test').innerHTML = '';

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.addClass(['test2', 'test3', 'test4'], 'abc');
		equals(DOM.get('test2').className, 'abc');
		equals(DOM.get('test3').className, 'abc');
		equals(DOM.get('test4').className, 'abc');
		DOM.get('test').innerHTML = '';

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - removeClass', 4, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').className = 'abc 123 xyz';
		DOM.removeClass('test', '123');
		equals(DOM.get('test').className, 'abc xyz');

		DOM.get('test').innerHTML = '<span id="test2" class="test1"></span><span id="test3" class="test test1 test"></span><span id="test4" class="test1 test"></span>';
		DOM.removeClass(DOM.select('span', 'test'), 'test1');
		equals(DOM.get('test2').className, '');
		equals(DOM.get('test3').className, 'test test');
		equals(DOM.get('test4').className, 'test');
		DOM.get('test').innerHTML = '';

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - hasClass', 7, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').className = 'abc 123 xyz';
		ok(DOM.hasClass('test', 'abc'));
		ok(DOM.hasClass('test', '123'));
		ok(DOM.hasClass('test', 'xyz'));
		ok(!DOM.hasClass('test', 'aaa'));

		DOM.get('test').className = 'abc';
		ok(DOM.hasClass('test', 'abc'));

		DOM.get('test').className = 'aaa abc';
		ok(DOM.hasClass('test', 'abc'));

		DOM.get('test').className = 'abc aaa';
		ok(DOM.hasClass('test', 'abc'));

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - add', 5, function() {
		var e;

		DOM.add(document.body, 'div', {id : 'test'});

		DOM.add('test', 'span', {'class' : 'abc 123'}, 'content <b>abc</b>');
		e = DOM.get('test').getElementsByTagName('span')[0];
		equals(e.className, 'abc 123');
		equals(e.innerHTML.toLowerCase(), 'content <b>abc</b>');
		DOM.remove(e);

		DOM.add('test', 'span', {'class' : 'abc 123'});
		e = DOM.get('test').getElementsByTagName('span')[0];
		equals(e.className, 'abc 123');
		DOM.remove(e);

		DOM.add('test', 'span');
		e = DOM.get('test').getElementsByTagName('span')[0];
		equals(e.nodeName, 'SPAN');
		DOM.remove(e);

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.add(['test2', 'test3', 'test4'], 'span', {'class' : 'abc 123'});
		equals(DOM.select('span', 'test').length, 6);

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - create', 3, function() {
		var e;

		e = DOM.create('span', {'class' : 'abc 123'}, 'content <b>abc</b>');

		equals(e.nodeName, 'SPAN');
		equals(e.className, 'abc 123');
		equals(e.innerHTML.toLowerCase(), 'content <b>abc</b>');
	});

	test('tinymce.dom.DOMUtils - createHTML', 4, function() {
		equals(DOM.createHTML('span', {'id' : 'id1', 'class' : 'abc 123'}, 'content <b>abc</b>'), '<span id="id1" class="abc 123">content <b>abc</b></span>');
		equals(DOM.createHTML('span', {'id' : 'id1', 'class' : 'abc 123'}), '<span id="id1" class="abc 123" />');
		equals(DOM.createHTML('span'), '<span />');
		equals(DOM.createHTML('span', null, 'content <b>abc</b>'), '<span>content <b>abc</b></span>');
	});

	test('tinymce.dom.DOMUtils - uniqueId', 3, function() {
		DOM.counter = 0;

		equals(DOM.uniqueId(), 'mce_0');
		equals(DOM.uniqueId(), 'mce_1');
		equals(DOM.uniqueId(), 'mce_2');
	});

	test('tinymce.dom.DOMUtils - showHide', 10, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.show('test');
		equals(DOM.get('test').style.display, 'block');
		ok(!DOM.isHidden('test'));

		DOM.hide('test');
		equals(DOM.get('test').style.display, 'none');
		ok(DOM.isHidden('test'));

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.hide(['test2', 'test3', 'test4'], 'test');
		equals(DOM.get('test2').style.display, 'none');
		equals(DOM.get('test3').style.display, 'none');
		equals(DOM.get('test4').style.display, 'none');

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.show(['test2', 'test3', 'test4'], 'test');
		equals(DOM.get('test2').style.display, 'block');
		equals(DOM.get('test3').style.display, 'block');
		equals(DOM.get('test4').style.display, 'block');

		// Cleanup
		DOM.setAttrib('test', 'style', '');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - select', 4, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setHTML('test', '<div>test 1</div><div>test 2 <div>test 3</div></div><div>test 4</div>');
		equals(DOM.select('div', 'test').length, 4);
		ok(DOM.select('div', 'test').reverse);

		DOM.setHTML('test', '<div class="test1 test2 test3">test 1</div><div class="test2">test 2 <div>test 3</div></div><div>test 4</div>')
		equals(DOM.select('div.test2', 'test').length, 2);

		DOM.setHTML('test', '<div class="test1 test2 test3">test 1</div><div class="test2">test 2 <div>test 3</div></div><div>test 4</div>')
		equals(DOM.select('div div', 'test').length, 1, null, tinymce.isWebKit); // Issue: http://bugs.webkit.org/show_bug.cgi?id=17461
		//alert(DOM.select('div div', 'test').length +","+DOM.get('test').querySelectorAll('div div').length);

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - is', 3, function() {
		DOM.add(document.body, 'div', {id : 'test'});
		DOM.setHTML('test', '<div id="textX" class="test">test 1</div>');

		ok(DOM.is(DOM.get('textX'), 'div'));
		ok(DOM.is(DOM.get('textX'), 'div#textX.test'));
		ok(!DOM.is(DOM.get('textX'), 'div#textX2'));

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - encode', 1, function() {
		equals(DOM.encode('abc<>"&\'���'), 'abc&lt;&gt;&quot;&amp;\'���');
	});

	test('tinymce.dom.DOMUtils - setGetAttrib', 11, function() {
		var dom;

		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setAttrib('test', 'class', 'test 123');
		equals(DOM.getAttrib('test', 'class'), 'test 123');

		DOM.setAttrib('test', 'src', 'url');
		equals(DOM.getAttrib('test', 'src'), 'url');
		equals(DOM.getAttrib('test', '_mce_src'), 'url');
		equals(DOM.getAttrib('test', 'abc'), '');

		DOM.setAttribs('test', {'class' : '123', title : 'abc'});
		equals(DOM.getAttrib('test', 'class'), '123');
		equals(DOM.getAttrib('test', 'title'), 'abc');

		dom = new tinymce.dom.DOMUtils(document, {keep_values : true, url_converter : function(u, n, e) {
			return '&<>"' + u + '&<>"' + n;
		}});

		dom.setAttribs('test', {src : '123', href : 'abc'});
		equals(DOM.getAttrib('test', 'src'), '&<>"123&<>"src');
		equals(DOM.getAttrib('test', 'href'), '&<>"abc&<>"href');

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.setAttribs(['test2', 'test3', 'test4'], {test1 : "1", test2 : "2"});
		equals(DOM.getAttrib('test2', 'test1'), '1');
		equals(DOM.getAttrib('test3', 'test2'), '2');
		equals(DOM.getAttrib('test4', 'test1'), '1');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getAttribs', 2, function() {
		var dom;

		function check(obj, val) {
			var count = 0;

			val = val.split(',');

			tinymce.each(obj, function(o) {
				if (tinymce.inArray(val, o.nodeName.toLowerCase()) != -1 && o.specified)
					count++;
			});

			return count == obj.length;
		};

		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').innerHTML = '<span id="test2" class="test"></span>';
		ok(check(DOM.getAttribs('test2'), 'id,class'));

		DOM.get('test').innerHTML = '<input id="test2" type="checkbox" name="test" value="1" disabled readonly checked></span>';
		ok(check(DOM.getAttribs('test2'), 'id,type,name,value,disabled,readonly,checked'), 'Expected attributed: type,name,disabled,readonly,checked');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - setGetStyles', 7, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setStyle('test', 'font-size', '20px');
		equals(DOM.getStyle('test', 'font-size'), '20px', null, tinymce.isWebKit);

		DOM.setStyle('test', 'fontSize', '21px');
		equals(DOM.getStyle('test', 'fontSize'), '21px', null, tinymce.isWebKit);

		DOM.setStyles('test', {fontSize : '22px', display : 'inline'});
		equals(DOM.getStyle('test', 'fontSize'), '22px', null, tinymce.isWebKit);
		equals(DOM.getStyle('test', 'display'), 'inline', null, tinymce.isWebKit);

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.setStyles(['test2', 'test3', 'test4'], {fontSize : "22px"});
		equals(DOM.getStyle('test2', 'fontSize'), '22px');
		equals(DOM.getStyle('test3', 'fontSize'), '22px');
		equals(DOM.getStyle('test4', 'fontSize'), '22px');

		DOM.setAttrib('test', 'style', '');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getPos', 2, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setStyles('test', {position : 'absolute', left : 100, top : 110});
		equals(DOM.getPos('test').x, 100);
		equals(DOM.getPos('test').y, 110);

		DOM.setAttrib('test', 'style', '');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getParent', 6, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').innerHTML = '<div><span>ab<a id="test2" href="">abc</a>c</span></div>';

		equals(DOM.getParent('test2', function(n) {return n.nodeName == 'SPAN';}).nodeName, 'SPAN');
		equals(DOM.getParent('test2', function(n) {return n.nodeName == 'BODY';}).nodeName, 'BODY');
		equals(DOM.getParent('test2', function(n) {return n.nodeName == 'BODY';}, document.body), null);
		equals(DOM.getParent('test2', function(n) {return false;}), null);
		equals(DOM.getParent('test2', 'SPAN').nodeName, 'SPAN');
		equals(DOM.getParent('test2', 'body', DOM.get('test')), null);

		DOM.get('test').innerHTML = '';

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getParents', 4, function() {
		DOM.add(document.body, 'div', {id : 'test'});
		DOM.get('test').innerHTML = '<div><span class="test">ab<span><a id="test2" href="">abc</a>c</span></span></div>';

		equals(DOM.getParents('test2', function(n) {return n.nodeName == 'SPAN';}).length, 2);
		equals(DOM.getParents('test2', 'span').length, 2);
		equals(DOM.getParents('test2', 'span.test').length, 1);
		equals(DOM.getParents('test2', 'body', DOM.get('test')).length, 0);

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - is', 2, function() {
		DOM.add(document.body, 'div', {id : 'test'});
		DOM.get('test').innerHTML = '<div><span class="test">ab<span><a id="test2" href="">abc</a>c</span></span></div>';

		ok(DOM.is(DOM.select('span', 'test'), 'span'));
		ok(DOM.is(DOM.select('#test2', 'test'), '#test2'));

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getViewPort', 4, function() {
		var wp;

		wp = DOM.getViewPort();
		equals(wp.x, 0);
		equals(wp.y, 0);
		ok(wp.w > 0);
		ok(wp.h > 0);
	});

	test('tinymce.dom.DOMUtils - getRect', 5, function() {
		var r;

		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setStyles('test', {position : 'absolute', left : 100, top : 110, width : 320, height : 240});
		r = DOM.getRect('test');
		equals(r.x, 100);
		equals(r.y, 110);
		equals(r.w, 320);
		equals(r.h, 240);

		DOM.setAttrib('test', 'style', '');

		DOM.get('test').innerHTML = '<div style="width:320px;height:240px"><div id="test2" style="width:50%;height:240px"></div></div>';
		r = DOM.getRect('test2');
		equals(r.w, 160);

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getSize', 2, function() {
		var r;

		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').innerHTML = '<div style="width:320px;height:240px"><div id="test2" style="width:50%;height:240px"></div></div>';
		r = DOM.getSize('test2');
		equals(r.w, 160);

		DOM.get('test').innerHTML = '<div style="width:320px;height:240px"><div id="test2" style="width:100px;height:240px"></div></div>';
		r = DOM.getSize('test2');
		equals(r.w, 100);

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getNext', 5, function() {
		var r;

		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').innerHTML = '<strong>A</strong><span>B</span><em>C</em>';
		equals(DOM.getNext(DOM.get('test').firstChild, '*').nodeName, 'SPAN');
		equals(DOM.getNext(DOM.get('test').firstChild, 'em').nodeName, 'EM');
		equals(DOM.getNext(DOM.get('test').firstChild, 'div'), null);
		equals(DOM.getNext(null, 'div'), null);
		equals(DOM.getNext(DOM.get('test').firstChild, function(n) {return n.nodeName == 'EM'}).nodeName, 'EM');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - getPrev', 5, function() {
		var r;

		DOM.add(document.body, 'div', {id : 'test'});

		DOM.get('test').innerHTML = '<strong>A</strong><span>B</span><em>C</em>';
		equals(DOM.getPrev(DOM.get('test').lastChild, '*').nodeName, 'SPAN');
		equals(DOM.getPrev(DOM.get('test').lastChild, 'strong').nodeName, 'STRONG');
		equals(DOM.getPrev(DOM.get('test').lastChild, 'div'), null);
		equals(DOM.getPrev(null, 'div'), null);
		equals(DOM.getPrev(DOM.get('test').lastChild, function(n) {return n.nodeName == 'STRONG'}).nodeName, 'STRONG');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - loadCSS', 1, function() {
		var c = 0;

		DOM.loadCSS('css/unit.css?a=1,css/unit.css?a=2,css/unit.css?a=3');

		tinymce.each(document.getElementsByTagName('link'), function(n) {
			if (n.href.indexOf('unit.css?a=') != -1)
				c++;
		});

		equals(c, 3, null, tinymce.isOpera);
	});

	test('tinymce.dom.DOMUtils - insertAfter', 2, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setHTML('test', '<span id="test2"></span>');
		DOM.insertAfter(DOM.create('br'), 'test2');
		equals(DOM.get('test2').nextSibling.nodeName, 'BR');

		DOM.setHTML('test', '<span>test</span><span id="test2"></span><span>test</span>');
		DOM.insertAfter(DOM.create('br'), 'test2');
		equals(DOM.get('test2').nextSibling.nodeName, 'BR');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - isBlock', 4, function() {
		ok(DOM.isBlock(DOM.create('div')));
		ok(DOM.isBlock('DIV'));
		ok(!DOM.isBlock('SPAN'));
		ok(!DOM.isBlock('div'));
	});

	test('tinymce.dom.DOMUtils - remove', 3, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setHTML('test', '<span id="test2"><span>test</span><span>test2</span></span>');
		DOM.remove('test2', 1);
		equals(DOM.get('test').innerHTML.toLowerCase(), '<span>test</span><span>test2</span>');

		DOM.setHTML('test', '<span id="test2"><span>test</span><span>test2</span></span>');
		equals(DOM.remove('test2').nodeName, 'SPAN');

		DOM.get('test').innerHTML = '<span id="test2"></span><span id="test3"></span><span id="test4"></span>';
		DOM.remove(['test2', 'test4']);
		equals(DOM.select('span', 'test').length, 1);

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - replace', 2, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setHTML('test', '<span id="test2"><span>test</span><span>test2</span></span>');
		DOM.replace(DOM.create('div', {id : 'test2'}), 'test2', 1);
		equals(DOM.get('test2').innerHTML.toLowerCase(), '<span>test</span><span>test2</span>');

		DOM.setHTML('test', '<span id="test2"><span>test</span><span>test2</span></span>');
		DOM.replace(DOM.create('div', {id : 'test2'}), 'test2');
		equals(DOM.get('test2').innerHTML, '');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - toHex', 5, function() {
		equals(DOM.toHex('rgb(0, 255, 255)'), '#00ffff');
		equals(DOM.toHex('rgb(255, 0, 0)'), '#ff0000');
		equals(DOM.toHex('rgb(0, 0, 255)'), '#0000ff');
		equals(DOM.toHex('rgb  (  0  , 0  , 255  )  '), '#0000ff');
		equals(DOM.toHex('   RGB  (  0  , 0  , 255  )  '), '#0000ff');
	});

	test('tinymce.dom.DOMUtils - getOuterHTML', 3, function() {
		DOM.add(document.body, 'div', {id : 'test'});

		DOM.setHTML('test', '<span id="test2"><span>test</span><span>test2</span></span>');
		equals(DOM.getOuterHTML('test2').toLowerCase(), tinymce.isIE ? '<span id=test2><span>test</span><span>test2</span></span>' : '<span id="test2"><span>test</span><span>test2</span></span>');

		DOM.setHTML('test', '<span id="test2"><span>test</span><span>test2</span></span>');
		DOM.setOuterHTML('test2', '<div id="test2">123</div>');
		equals(tinymce.trim(DOM.getOuterHTML('test2') || '').toLowerCase(), tinymce.isIE ? '<div id=test2>123</div>' : '<div id="test2">123</div>');

		DOM.setHTML('test', '<span id="test2"><span>test</span><span>test2</span></span>');
		DOM.setOuterHTML('test2', '<div id="test2">123</div><div id="test3">abc</div>');
		equals(tinymce.trim(DOM.get('test').innerHTML).toLowerCase().replace(/>\s+</g, '><'), tinymce.isIE ? '<div id=test2>123</div><div id=test3>abc</div>' : '<div id="test2">123</div><div id="test3">abc</div>');

		DOM.remove('test');
	});

	test('tinymce.dom.DOMUtils - processHTML', 10, function() {
		var dom;

		dom = new tinymce.dom.DOMUtils(document, {hex_colors : true, keep_values : true, url_converter : function(u) {
			return '&<>"' + u + '&<>"';
		}});

		equals(
			dom.processHTML('<span style="background-image:url(\'http://www.somesite.com\');">test</span>'),
			'<span style="background-image:url(\'http://www.somesite.com\');" _mce_style="background-image: url(&amp;&lt;&gt;&quot;http://www.somesite.com&amp;&lt;&gt;&quot;);">test</span>'
		);

		equals(
			dom.processHTML('test1 <strong>test2</strong> <strong id="test1">test3</strong> <em>test2</em> <em id="test2">test3</em>'),
			'test1 <strong>test2</strong> <strong id="test1">test3</strong> <em>test2</em> <em id="test2">test3</em>'
		);

		equals(
			dom.processHTML('some content <img src="some.gif" /> some more content <a href="somelink.htm">link</a>'),
			'some content <img src="some.gif" _mce_src="&amp;&lt;&gt;&quot;some.gif&amp;&lt;&gt;&quot;" /> some more content <a href="somelink.htm" _mce_href="&amp;&lt;&gt;&quot;somelink.htm&amp;&lt;&gt;&quot;">link</a>'
		);

		equals(
			dom.processHTML('some content <img src=some.gif /> some more content <a href=somelink.htm>link</a>'),
			'some content <img src="some.gif" _mce_src="&amp;&lt;&gt;&quot;some.gif&amp;&lt;&gt;&quot;" /> some more content <a href="somelink.htm" _mce_href="&amp;&lt;&gt;&quot;somelink.htm&amp;&lt;&gt;&quot;">link</a>'
		);

		equals(
			dom.processHTML("some content <img src='some.gif' /> some more content <a href='somelink.htm'>link</a>"),
			'some content <img src="some.gif" _mce_src="&amp;&lt;&gt;&quot;some.gif&amp;&lt;&gt;&quot;" /> some more content <a href="somelink.htm" _mce_href="&amp;&lt;&gt;&quot;somelink.htm&amp;&lt;&gt;&quot;">link</a>'
		);

		equals(
			dom.processHTML('some content <img src="some.gif" _mce_src="&amp;&lt;&gt;&quot;some.gif&amp;&lt;&gt;&quot;" /> some more content <a href="somelink.htm" _mce_href="&amp;&lt;&gt;&quot;somelink.htm&amp;&lt;&gt;&quot;">link</a>'),
			'some content <img src="some.gif" _mce_src="&amp;&lt;&gt;&quot;some.gif&amp;&lt;&gt;&quot;" /> some more content <a href="somelink.htm" _mce_href="&amp;&lt;&gt;&quot;somelink.htm&amp;&lt;&gt;&quot;">link</a>'
		);

		equals(
			dom.processHTML('<span style="border-left-color: rgb(0, 255, 255); border-top-color: rgb(0, 255, 255);"></span>'),
			'<span style="border-left-color: rgb(0, 255, 255); border-top-color: rgb(0, 255, 255);" _mce_style="border-left-color: #00ffff; border-top-color: #00ffff;"></span>'
		);

		equals(
			dom.processHTML('<span style="background: url(test.gif);"></span>'),
			'<span style="background: url(test.gif);" _mce_style="background: url(&amp;&lt;&gt;&quot;test.gif&amp;&lt;&gt;&quot;);"></span>'
		);

		equals(
			dom.processHTML('<a href="test.html"/>'),
			'<a href="test.html" _mce_href="&amp;&lt;&gt;&quot;test.html&amp;&lt;&gt;&quot;"></a>'
		);

		equals(
			dom.processHTML('<a/>'),
			'<a></a>'
		);

		equals(
			dom.processHTML('<checkbox selected>'),
			'<checkbox selected="selected">',
			'Force boolean attribute format'
		);

		equals(
			dom.processHTML('<span title=" selected "></span>'),
			'<span title=" selected "></span>',
			'Attribute with boolean value'
		);
	});

	test('tinymce.dom.DOMUtils - encodeDecode', 2, function() {
		equals(DOM.encode('���&<>"'), '���&amp;&lt;&gt;&quot;');
		equals(DOM.decode('&aring;&auml;&ouml;&amp;&lt;&gt;&quot;'), '���&<>"');
	});

	test('tinymce.dom.DOMUtils - split', 1, function() {
		var point, parent;

		DOM.add(document.body, 'div', {id : 'test'}, '<p><b>text1<span>inner</span>text2</b></p>');

		parent = DOM.select('p', DOM.get('test'))[0];
		point = DOM.select('span', DOM.get('test'))[0];

		DOM.split(parent, point);
		equals(DOM.get('test').innerHTML.toLowerCase().replace(/\s+/g, ''), '<p><b>text1</b></p><span>inner</span><p><b>text2</b></p>');

		DOM.remove('test');
	});

	DOM.remove('test');
})();

(function() {
	var Event = tinymce.dom.Event, DOM = new tinymce.dom.DOMUtils(document, {keep_values : true});

	test('tinymce.dom.Event - addRemove', 2, function() {
		var c = 0;

		DOM.add(document.body, 'div', {id : 'test'});
		DOM.get('test').innerHTML = '<span id="test2"></span>';

		function mouseCheck(e) {
			if (e.clientX == 10 || e.clientX == 101)
				c++;
		};

		function mouseCheckCancel(e) {
			if (e.clientX == 101)
				return Event.cancel(e);
		};

		function keyCheck(e) {
			if (e.keyCode == 13)
				c++;
		};

		Event.add('test2', 'click', mouseCheckCancel);
		Event.add('test', 'click', mouseCheck);
		fakeMouseEvent('test', 'click', {clientX : 10});
		fakeMouseEvent('test2', 'click', {clientX : 101});

		Event.add('test', 'keydown', keyCheck);
		fakeKeyEvent('test', 'keydown', {keyCode : 13});

		equals(c, 2, '[%d] Event count doesn\'t add up. Value: %d should be %d.', tinymce.isWebKit);

		c = 0;
		Event.remove('test', 'click', mouseCheck);
		Event.remove('test', 'keydown', keyCheck);
		fakeMouseEvent('test', 'click', {clientX : 10});
		fakeKeyEvent('test', 'keydown', {keyCode : 13});

		equals(c, 0, '[%d] Event count doesn\'t add up. Value: %d should be %d.', tinymce.isWebKit);

		DOM.remove('test');
	});
})();

(function() {
	var Serializer = tinymce.dom.Serializer, DOM = new tinymce.dom.DOMUtils(document, {keep_values : true});

	test('tinymce.DOM.Serializer - serialize', 77, function() {
		var ser = new tinymce.dom.Serializer({dom : DOM}), h;

		DOM.add(document.body, 'div', {id : 'test'});
		DOM.counter = 0;

		ser.setRules('@[id|title|class|style],div,img[src|alt|-style|border],span,hr');
		DOM.setHTML('test', '<img title="test" src="file.gif" alt="test" border="0" style="border: 1px solid red" class="test" /><span id="test2">test</span><hr />');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><img title="test" class="test" src="file.gif" alt="test" border="0" /><span id="test2">test</span><hr /></div>');

		ser.setRules('*a[*],em/i[*],strong/b[*i*]');
		DOM.setHTML('test', '<a href="test">test</a><strong title="test" class="test">test2</strong><em title="test">test3</em>');
		equals(ser.serialize(DOM.get('test')), '<a href="test">test</a><strong title="test">test2</strong><em title="test">test3</em>');

		ser.setRules('br,hr,input[type|name|value],div[id],span[id],strong/b,a,em/i,a[!href|!name],img[src|border=0|title={$uid}]');
		DOM.setHTML('test', '<br /><hr /><input type="text" name="test" value="val" class="no" /><span id="test2" class="no"><b class="no">abc</b><em class="no">123</em></span>123<a href="file.html">link</a><a name="anchor"></a><a>no</a><img src="file.gif" />');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><br /><hr /><input type="text" name="test" value="val" /><span id="test2"><strong>abc</strong><em>123</em></span>123<a href="file.html">link</a><a name="anchor"></a>no<img src="file.gif" border="0" title="mce_0" /></div>');

		ser.setRules('input[type|name|value|checked|disabled|readonly|length|maxlength],select[multiple],option[value|selected],table,tr,td[nowrap],ul[compact]');

		DOM.setHTML('test', '<input type="checkbox" value="1">');
		equals(ser.serialize(DOM.get('test')), '<input type="checkbox" value="1" />');

		DOM.setHTML('test', '<input type="checkbox" value="1" checked disabled readonly>');
		equals(ser.serialize(DOM.get('test')), '<input type="checkbox" value="1" checked="checked" disabled="disabled" readonly="readonly" />');

		DOM.setHTML('test', '<input type="checkbox" value="1" checked="1" disabled="1" readonly="1">');
		equals(ser.serialize(DOM.get('test')), '<input type="checkbox" value="1" checked="checked" disabled="disabled" readonly="readonly" />');

		DOM.setHTML('test', '<input type="checkbox" value="1" checked="true" disabled="true" readonly="true">');
		equals(ser.serialize(DOM.get('test')), '<input type="checkbox" value="1" checked="checked" disabled="disabled" readonly="readonly" />');

		DOM.setHTML('test', '<input type="checkbox" value="1" checked="false" disabled="false" readonly="false">');
		equals(ser.serialize(DOM.get('test')), '<input type="checkbox" value="1" />');

		DOM.setHTML('test', '<input type="checkbox" value="1" checked="0" disabled="0" readonly="0">');
		equals(ser.serialize(DOM.get('test')), '<input type="checkbox" value="1" />');


		DOM.setHTML('test', '<select><option value="1">test1</option><option value="2" selected>test2</option></select>');
		equals(ser.serialize(DOM.get('test')), '<select><option value="1">test1</option><option value="2" selected="selected">test2</option></select>');

		DOM.setHTML('test', '<select><option value="1">test1</option><option selected="1" value="2">test2</option></select>');
		equals(ser.serialize(DOM.get('test')), '<select><option value="1">test1</option><option value="2" selected="selected">test2</option></select>');

		DOM.setHTML('test', '<select><option value="1">test1</option><option value="2" selected="true">test2</option></select>');
		equals(ser.serialize(DOM.get('test')), '<select><option value="1">test1</option><option value="2" selected="selected">test2</option></select>');

		DOM.setHTML('test', '<select><option value="1" selected="1">test1</option><option value="2" selected="0">test2</option></select>');
		equals(ser.serialize(DOM.get('test')), '<select><option value="1" selected="selected">test1</option><option value="2">test2</option></select>');

		DOM.setHTML('test', '<select><option value="1" selected="1">test1</option><option value="2" selected="false">test2</option></select>');
		equals(ser.serialize(DOM.get('test')), '<select><option value="1" selected="selected">test1</option><option value="2">test2</option></select>');


		DOM.setHTML('test', '<select multiple></select>');
		equals(ser.serialize(DOM.get('test')), '<select multiple="multiple"></select>');

		DOM.setHTML('test', '<select multiple="multiple"></select>');
		equals(ser.serialize(DOM.get('test')), '<select multiple="multiple"></select>');

		DOM.setHTML('test', '<select multiple="1"></select>');
		equals(ser.serialize(DOM.get('test')), '<select multiple="multiple"></select>');

		DOM.setHTML('test', '<select multiple="0"></select>');
		equals(ser.serialize(DOM.get('test')), '<select></select>');

		DOM.setHTML('test', '<select multiple="false"></select>');
		equals(ser.serialize(DOM.get('test')), '<select></select>');

		DOM.setHTML('test', '<select></select>');
		equals(ser.serialize(DOM.get('test')), '<select></select>');


		DOM.setHTML('test', '<ul compact></ul>');
		equals(ser.serialize(DOM.get('test')), '<ul compact="compact"></ul>');

		DOM.setHTML('test', '<ul compact="compact"></ul>');
		equals(ser.serialize(DOM.get('test')), '<ul compact="compact"></ul>');

		DOM.setHTML('test', '<ul compact="1"></ul>');
		equals(ser.serialize(DOM.get('test')), '<ul compact="compact"></ul>');

		DOM.setHTML('test', '<ul compact="0"></ul>');
		equals(ser.serialize(DOM.get('test')), '<ul></ul>');

		DOM.setHTML('test', '<ul compact="false"></ul>');
		equals(ser.serialize(DOM.get('test')), '<ul></ul>');

		DOM.setHTML('test', '<ul></ul>');
		equals(ser.serialize(DOM.get('test')), '<ul></ul>');



		DOM.setHTML('test', '<table><tr><td></td></tr></table>');
		equals(ser.serialize(DOM.get('test')), '<table><tr><td></td></tr></table>');

		DOM.setHTML('test', '<table><tr><td nowrap></td></tr></table>');
		equals(ser.serialize(DOM.get('test')), '<table><tr><td nowrap="nowrap"></td></tr></table>');

		DOM.setHTML('test', '<table><tr><td nowrap="nowrap"></td></tr></table>');
		equals(ser.serialize(DOM.get('test')), '<table><tr><td nowrap="nowrap"></td></tr></table>');

		DOM.setHTML('test', '<table><tr><td nowrap="1"></td></tr></table>');
		equals(ser.serialize(DOM.get('test')), '<table><tr><td nowrap="nowrap"></td></tr></table>');

		DOM.setHTML('test', '<table><tr><td nowrap="false"></td></tr></table>');
		equals(ser.serialize(DOM.get('test')), '<table><tr><td></td></tr></table>');

		DOM.setHTML('test', '<table><tr><td nowrap="0"></td></tr></table>');
		equals(ser.serialize(DOM.get('test')), '<table><tr><td></td></tr></table>');

		DOM.setHTML('test', '<input type="text" />');
		equals(ser.serialize(DOM.get('test')), '<input type="text" />');

		DOM.setHTML('test', '<input type="text" value="text" length="128" maxlength="129" />');
		equals(ser.serialize(DOM.get('test')), '<input type="text" value="text" length="128" maxlength="129" />');

		ser.setRules('a[href|target<_blank?_top|title:forced value]');
		DOM.setHTML('test', '<a href="file.htm" target="_blank" title="title">link</a><a href="#" target="test">test2</a>');
		equals(ser.serialize(DOM.get('test')), '<a href="file.htm" target="_blank" title="forced value">link</a><a href="#" title="forced value">test2</a>');

		ser.setRules('form[method],input[type|name|value]');
		DOM.setHTML('test', '<form method="post"><input type="hidden" name="method" value="get" /></form>');
		equals(ser.serialize(DOM.get('test')), '<form method="post"><input type="hidden" name="method" value="get" /></form>');

		ser.setRules('*[*]');
		DOM.setHTML('test', '<label for="test">label</label>');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><label for="test">label</label></div>');

		ser.setRules('*[*]');
		DOM.setHTML('test', '<!-- abc -->');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><!-- abc --></div>', null, tinymce.isOldWebKit);

		ser.setRules('*[*]');
		DOM.setHTML('test', '<span style="border: 1px solid red">test</span>');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><span style="border: 1px solid red;">test</span></div>', null, tinymce.isOldWebKit);

		ser.setRules('*[*]');
		DOM.setHTML('test', '<span title="test abc">test</span>');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><span title="test abc">test</span></div>');

		ser.setRules('*[*]');
		DOM.setHTML('test', '<div _mce_name="mytag" class="test">test</div>');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><mytag class="test">test</mytag></div>', null, tinymce.isOldWebKit);

		ser.setRules('*[*]');
		DOM.setHTML('test', '<div test:attr="test">test</div>');
		equals(ser.serialize(DOM.get('test'), {getInner : 1}), '<div test:attr="test">test</div>');

		ser.setRules('#p');
		DOM.setHTML('test', '<p>test</p><p></p>');
		equals(ser.serialize(DOM.get('test')), '<p>test</p><p>&nbsp;</p>', null, tinymce.isOldWebKit);

		ser.setRules('img[src|border=0|alt=]');
		DOM.setHTML('test', '<img src="file.gif" border="0" alt="" />');
		equals(ser.serialize(DOM.get('test')), '<img src="file.gif" border="0" alt="" />');

		ser.setRules('img[src|border=0|alt=],*[*]');
		DOM.setHTML('test', '<img src="file.gif" /><hr />');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><img src="file.gif" border="0" alt="" /><hr /></div>');

		ser.setRules('*[*]');
		DOM.setHTML('test', '<span id="test2"><b>abc</b></span>123<a href="file.html">link</a>');
		a = ser.onPreProcess.add(function(se, o) {
			equals(o.test, 'abc');
			DOM.setAttrib(o.node.getElementsByTagName('span')[0], 'class', 'abc');
		});
		b = ser.onPostProcess.add(function(se, o) {
			equals(o.test, 'abc');
			o.content = o.content.replace(/<b>/g, '<b class="123">');
		});
		equals(ser.serialize(DOM.get('test'), {test : 'abc'}), '<div id="test"><span class="abc" id="test2"><b class="123">abc</b></span>123<a href="file.html">link</a></div>');
		ser.onPreProcess.remove(a);
		ser.onPostProcess.remove(b);

		ser.setRules('*[*]');
		DOM.setHTML('test', '<ol><li>a</li><ol><li>b</li><li>c</li></ol><li>e</li></ol>');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><ol><li>a<ol><li>b</li><li>c</li></ol></li><li>e</li></ol></div>');

		ser = new tinymce.dom.Serializer({valid_elements : 'img[src|border=0|alt=]', extended_valid_elements : 'div[id],img[src|alt=]'});
		DOM.setHTML('test', '<img src="file.gif" alt="" />');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><img src="file.gif" alt="" /></div>', null, tinymce.isOldWebKit);

		ser = new tinymce.dom.Serializer({invalid_elements : 'hr,br'});
		DOM.setHTML('test', '<img src="file.gif" /><hr /><br />');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><img src="file.gif" /></div>');

		ser = new tinymce.dom.Serializer({entity_encoding : 'numeric'});
		DOM.setHTML('test', '&lt;&gt;&amp;&quot;&nbsp;���');
		equals(ser.serialize(DOM.get('test')), '<div id="test">&lt;&gt;&amp;"&#160;&#229;&#228;&#246;</div>');

		ser = new tinymce.dom.Serializer({entity_encoding : 'named'});
		DOM.setHTML('test', '&lt;&gt;&amp;&quot;&nbsp;���');
		equals(ser.serialize(DOM.get('test')), '<div id="test">&lt;&gt;&amp;"&nbsp;&aring;&auml;&ouml;</div>');

		ser = new tinymce.dom.Serializer({entity_encoding : 'named+numeric',entities : '160,nbsp,34,quot,38,amp,60,lt,62,gt'});
		DOM.setHTML('test', '&lt;&gt;&amp;&quot;&nbsp;���');
		equals(ser.serialize(DOM.get('test')), '<div id="test">&lt;&gt;&amp;"&nbsp;&#229;&#228;&#246;</div>');

		ser = new tinymce.dom.Serializer({entity_encoding : 'raw'});
		DOM.setHTML('test', '&lt;&gt;&amp;&quot;&nbsp;���');
		equals(ser.serialize(DOM.get('test')), '<div id="test">&lt;&gt;&amp;"\u00a0���</div>');

		ser.setRules('+a[id|style|rel|rev|charset|hreflang|dir|lang|tabindex|accesskey|type|name|href|target|title|class|onfocus|onblur|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup],-strong/-b[class|style],-em/-i[class|style],-strike[class|style],-u[class|style],#p[id|style|dir|class|align],-ol[class|style],-ul[class|style],-li[class|style],br,img[id|dir|lang|longdesc|usemap|style|class|src|onmouseover|onmouseout|border|alt=|title|hspace|vspace|width|height|align],-sub[style|class],-sup[style|class],-blockquote[dir|style],-table[border=0|cellspacing|cellpadding|width|height|class|align|summary|style|dir|id|lang|bgcolor|background|bordercolor],-tr[id|lang|dir|class|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor],tbody[id|class],thead[id|class],tfoot[id|class],-td[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|bgcolor|background|bordercolor|scope],-th[id|lang|dir|class|colspan|rowspan|width|height|align|valign|style|scope],caption[id|lang|dir|class|style],-div[id|dir|class|align|style],-span[style|class|align],-pre[class|align|style],address[class|align|style],-h1[id|style|dir|class|align],-h2[id|style|dir|class|align],-h3[id|style|dir|class|align],-h4[id|style|dir|class|align],-h5[id|style|dir|class|align],-h6[id|style|dir|class|align],hr[class|style],-font[face|size|style|id|class|dir|color],dd[id|class|title|style|dir|lang],dl[id|class|title|style|dir|lang],dt[id|class|title|style|dir|lang],*[*]');
		DOM.setHTML('test', '<br /><hr /><span class="test"><img src="file.gif" /></span>');
		equals(ser.serialize(DOM.get('test')), '<div id="test"><br /><hr /><span class="test"><img src="file.gif" alt="" /></span></div>');

		ser = new tinymce.dom.Serializer({entity_encoding : 'raw'});
		ser.setRules('*[*]');
		DOM.setHTML('test', 'test1<prefix:test>Test</prefix:test>test2');
		equals(ser.serialize(DOM.get('test')), '<div id="test">test1<prefix:test>Test</prefix:test>test2</div>');

		ser.setRules('style');
		DOM.setHTML('test', '<style> body { background:#fff }</style>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<style><!--\n body { background:#fff }\n--></style>');

		ser.setRules('style');
		DOM.setHTML('test', '<style>\r\n<![CDATA[\r\n   body { background:#fff }]]></style>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<style><!--\n   body { background:#fff }\n--></style>');

		ser.setRules('script[type|language|src]');

		DOM.setHTML('test', '<script>// <img src="test"><a href="#"></a></script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n// <img src="test"><a href="#"></a>\n// ]]></script>');

		DOM.setHTML('test', '<script>1 < 2;</script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n1 < 2;\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript">1 < 2;</script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n1 < 2;\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript">\n\t1 < 2;\n\t if (2 < 1)\n\t\talert(1);\n</script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n\t1 < 2;\n\t if (2 < 1)\n\t\talert(1);\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript"><!-- 1 < 2; // --></script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n 1 < 2;\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript">\n\n<!-- 1 < 2;\n\n--></script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n 1 < 2;\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript">// <![CDATA[1 < 2; // ]]></script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n1 < 2;\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript"><![CDATA[1 < 2; ]]></script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n1 < 2;\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript">\n\n<![CDATA[\n\n1 < 2;\n\n]]>\n\n</script>');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '<script type="text/javascript">// <![CDATA[\n1 < 2;\n// ]]></script>');

		DOM.setHTML('test', '<script type="text/javascript" src="test.js"></script>');
		equals(ser.serialize(DOM.get('test')), '<script type="text/javascript" src="test.js"></script>');

		ser.setRules('noscript[test]');
		DOM.setHTML('test', '<noscript test="test"><br></noscript>');
		equals(ser.serialize(DOM.get('test')), '<noscript test="test"><br></noscript>');

		DOM.setHTML('test', '<noscript><br></noscript>');
		equals(ser.serialize(DOM.get('test')), '<noscript><br></noscript>');

		DOM.setHTML('test', '<noscript><!-- text --><br></noscript>');
		equals(ser.serialize(DOM.get('test')), '<noscript><!-- text --><br></noscript>');

		ser.setRules('map[id|name],area[shape|coords|href|target|alt]');
		DOM.setHTML('test', '<map id="planetmap" name="planetmap"><area shape="rect" coords="0,0,82,126" href="sun.htm" target="_blank" alt="Sun" /></map>');
		equals(ser.serialize(DOM.get('test')), '<map id="planetmap" name="planetmap"><area shape="rect" coords="0,0,82,126" href="sun.htm" target="_blank" alt="Sun" /></map>');

		DOM.setHTML('test', '123<![CDATA[<test>]]>abc');
		equals(ser.serialize(DOM.get('test')), '123<![CDATA[<test>]]>abc');

		DOM.setHTML('test', '123<![CDATA[<te\n\nst>]]>abc');
		equals(ser.serialize(DOM.get('test')).replace(/\r/g, ''), '123<![CDATA[<te\n\nst>]]>abc');

		ser.setRules('ul,li,br');
		DOM.setHTML('test', '<ul><li>test<br /></li><li>test<br /></li><li>test<br /></li></ul>');
		equals(ser.serialize(DOM.get('test')), '<ul><li>test</li><li>test</li><li>test</li></ul>');

		ser.setRules('input[type|value|name|id|maxlength|size|tabindex]');
		DOM.setHTML('test', '<input type="checkbox" value="test" /><input type="button" />');
		equals(ser.serialize(DOM.get('test')), '<input type="checkbox" value="test" /><input type="button" />');

		DOM.remove('test');
	});
})();

(function() {
	var Dispatcher = tinymce.util.Dispatcher;

	test('tinymce.util.Dispatcher - dispatcher', 5, function() {
		var ev, v, f;

		ev = new Dispatcher();
		ev.add(function(a, b, c) {
			v = a + b + c;
		});
		ev.dispatch(1, 2, 3);
		equals(v, 6);

		ev = new Dispatcher();
		v = 0;
		f = ev.add(function(a, b, c) {
			v = a + b + c;
		});
		ev.remove(f);
		ev.dispatch(1, 2, 3);
		equals(v, 0);

		ev = new Dispatcher({test : 1});
		v = 0;
		f = ev.add(function(a, b, c) {
			v = a + b + c + this.test;
		});
		ev.dispatch(1, 2, 3);
		equals(v, 7);

		ev = new Dispatcher();
		v = 0;
		f = ev.add(function(a, b, c) {
			v = a + b + c + this.test;
		}, {test : 1});
		ev.dispatch(1, 2, 3);
		equals(v, 7);

		ev = new Dispatcher();
		v = '';
		f = ev.add(function(a, b, c) {
			v += 'b';
		}, {test : 1});
		f = ev.addToTop(function(a, b, c) {
			v += 'a';
		}, {test : 1});
		ev.dispatch();
		equals(v, 'ab');
	});
})();

(function() {
	var Cookie = tinymce.util.Cookie;

	test('tinymce.util.Cookie - cookie', 4, function() {
		var f = document.location.protocol == 'file:';

		Cookie.set('test', 'test123');
		equals(Cookie.get('test'), 'test123', null, f);

		Cookie.set('test', 'test1234');
		equals(Cookie.get('test'), 'test1234', null, f);

		Cookie.setHash('test', {a : 1, b : 2});
		ok(Cookie.getHash('test') ? Cookie.getHash('test').b == 2 : null, null, f);

		Cookie.setHash('test', {a : 1, b : 3});
		ok(Cookie.getHash('test') ? Cookie.getHash('test').b == 3 : null, null, f);
	});
})();

(function() {
	var JSON = tinymce.util.JSON;

	test('tinymce.util.JSON - serialize', 1, function() {
		equals(JSON.serialize({arr1 : [1, 2, 3, [1, 2, 3]], bool1 : true, float1: 3.14, int1 : 123, null1 : null, obj1 : {key1 : "val1", key2 : "val2"}, str1 : 'abc\u00C5123'}), '{"arr1":[1,2,3,[1,2,3]],"bool1":true,"float1":3.14,"int1":123,"null1":null,"obj1":{"key1":"val1","key2":"val2"},"str1":"abc\\u00c5123"}');
	});

	test('tinymce.util.JSON - parse', 1, function() {
		equals(JSON.parse('{"arr1":[1,2,3,[1,2,3]],"bool1":true,"float1":3.14,"int1":123,"null1":null,"obj1":{"key1":"val1","key2":"val2"},"str1":"abc\\u00c5123"}').str1, 'abc\u00c5123');
	});
})();

(function() {
	var URI = tinymce.util.URI;

	test('tinymce.util.URI - parseFullURLs', 2, function() {
		equals(new URI('http://abc:123@www.site.com:8080/path/dir/file.ext?key1=val1&key2=val2#hash').getURI(), 'http://abc:123@www.site.com:8080/path/dir/file.ext?key1=val1&key2=val2#hash');
		ok(new URI('http://a2bc:123@www.site.com:8080/path/dir/file.ext?key1=val1&key2=val2#hash').getURI() != 'http://abc:123@www.site.com:8080/path/dir/file.ext?key1=val1&key2=val2#hash');
	});

	test('tinymce.util.URI - relativeURLs', 26, function() {
		equals(new URI('http://www.site.com/dir1/dir2/file.html').toRelative('http://www.site.com/dir1/dir3/file.html'), '../dir3/file.html');
		equals(new URI('http://www.site.com/dir1/dir2/file.html').toRelative('http://www.site.com/dir3/dir4/file.html'), '../../dir3/dir4/file.html');
		equals(new URI('http://www.site.com/dir1/').toRelative('http://www.site.com/dir1/dir3/file.htm'), 'dir3/file.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('http://www.site2.com/dir1/dir3/file.htm'), 'http://www.site2.com/dir1/dir3/file.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('http://www.site.com:8080/dir1/dir3/file.htm'), 'http://www.site.com:8080/dir1/dir3/file.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('https://www.site.com/dir1/dir3/file.htm'), 'https://www.site.com/dir1/dir3/file.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('/file.htm'), '../../file.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('/file.htm?id=1#a'), '../../file.htm?id=1#a');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('mailto:test@test.com'), 'mailto:test@test.com');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('news:test'), 'news:test');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('javascript:void(0);'), 'javascript:void(0);');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('about:blank'), 'about:blank');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('#test'), '#test');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('test.htm'), 'test.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('http://www.site.com/dir1/dir2/test.htm'), 'test.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('dir2/test.htm'), 'dir2/test.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('../dir2/test.htm'), 'test.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('../dir3/'), '../dir3/');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('../../../../../../test.htm'), '../../test.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('//www.site.com/test.htm'), '../../test.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('@@tinymce'), '@@tinymce'); // Zope 3 URL
		equals(new URI('http://www.site.com/dir1/dir2/').toRelative('../@@tinymce'), '../@@tinymce'); // Zope 3 URL
		equals(new URI('http://www.site.com/').toRelative('dir2/test.htm'), 'dir2/test.htm');
		equals(new URI('http://www.site.com/').toRelative('./'), './');
		equals(new URI('http://www.site.com/test/').toRelative('../'), '../');
		equals(new URI('http://www.site.com/test/test/').toRelative('../'), '../');
	});

	test('tinymce.util.URI - absoluteURLs', 17, function() {
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('../dir3'), 'http://www.site.com/dir1/dir3');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('../dir3', 1), '/dir1/dir3');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('../../../../dir3'), 'http://www.site.com/dir3');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('../abc/def/../../abc/../dir3/file.htm'), 'http://www.site.com/dir1/dir3/file.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('http://www.site.com/dir2/dir3'), 'http://www.site.com/dir2/dir3');
		equals(new URI('http://www.site2.com/dir1/dir2/').toAbsolute('http://www.site2.com/dir2/dir3'), 'http://www.site2.com/dir2/dir3');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('mailto:test@test.com'), 'mailto:test@test.com');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('news:test'), 'news:test');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('javascript:void(0);'), 'javascript:void(0);');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('about:blank'), 'about:blank');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('#test'), '#test');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('test.htm'), 'http://www.site.com/dir1/dir2/test.htm');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('../@@tinymce'), 'http://www.site.com/dir1/@@tinymce'); // Zope 3 URL
		equals(new URI('http://www.site.com/dir1/dir2/').getURI(), 'http://www.site.com/dir1/dir2/');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('/dir1/dir1/'), 'http://www.site.com/dir1/dir1/');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('https://www.site.com/dir1/dir2/', true), 'https://www.site.com/dir1/dir2/');
		equals(new URI('http://www.site.com/dir1/dir2/').toAbsolute('http://www.site.com/dir1/dir2/', true), '/dir1/dir2/');
	});

	test('tinymce.util.URI - strangeURLs', 3, function() {
		equals(new URI('//www.site.com').getURI(), '//www.site.com');
		equals(new URI('mailto:test@test.com').getURI(), 'mailto:test@test.com');
		equals(new URI('news:somegroup').getURI(), 'news:somegroup');
	});
})();

(function() {
	var Parser = tinymce.xml.Parser;

	test('tinymce.util.Parser - parser', 3, function() {
		var f = document.location.protocol == 'file:', p, d;

		p = new Parser({async : false});
		p.load('test.xml', function(d) {
			equals(d.getElementsByTagName('tag').length, 1);
		});

		p = new Parser({async : false});
		p.load('test.xml', function(d) {
			equals(tinymce.trim(p.getText(d.getElementsByTagName('tag')[0])), '���');
		});

		p = new Parser({async : false});
		d = p.loadXML('<root><tag>���</tag></root>');
		equals(tinymce.trim(p.getText(d.getElementsByTagName('tag')[0])), '���');
	});
})();

tinymce.dom.Event.add(window, 'load', function() {
	// IE6 chokes if you stress it
	window.setTimeout(function() {
		QUnit.setup();
	}, 1);
});
