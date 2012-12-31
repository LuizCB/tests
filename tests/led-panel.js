/**
 * 
 * Item: LED
 * 
 * Version 3.0 - 21.12.2012
 * 
 * The points are now controlled via the ausschließich CSS. This makes it a little faster.
 * (See comments from Jarbas)
 * 
 * 
 * Version 2.0 - 18.10.2012
 * 
 * The objects in their own namespace relocated.
 * 
 * Version 1.1 - 16.10.2012
 * 
 * Speed ​​improved. There will be only the 'dots' changes, the color has changed.
 * 
 * Version: 1.0 - 06.11.2011 - 23:11
 * 
 * Divided into objects
 * 
 * LED.Panel
 * LEDT.Point
 * LED.EventElement
 * LED.Element
 * 
 * 
 * Version: 0.5 - 11:09 22.02.2009
 * 
 * Fix: strict warnings
 * 
 * Version: 0.4 - 16:49 19.02.2009
 * 
 * Fix: clear () Function
 * 
 * Version: 0.3 - 11:21 15.02.2009
 * 
 * Functions outsourced prototype
 * Parameter of each () changed
 * 
 * ----------------------------------------------
 * LED.Panel
 * 
 * new({})
 * 
 * Object: 
 * 	height (default:1)
 * 	width (default:1)
 * 	pixel (default:1)
 * 	padding (default:0)
 * 
 * Methods:
 * 
 * Circle (optional) specifies whether the scrolling "in the circle"
 * 
 * Scrollup (circle)
 * scrollDown(circle)
 * ScrollLeft (circle)
 * scrollDown(circle) 
 * 
 * ScrollCol (col, dir) true = up
 * scrollRow(row, dir) true = left
 * 
 * copy(LED.Panel)
 * 
 * set(top, left, on/off)	
 * get(top, left)
 * setByte(col, byte)
 * getByte(col)
 * 
 * Dots ([status]) returns all items, or with the desired status (default: undefined)
 * 
 * create(parent)
 
 * width()
 * height()
 * pixel()
 * clear([backgroundcolor] [, color]);
 * 
 * 
 * ----------------------------------------------
 * = LED.Point> LED.EventElement
 * 
 * status()
 * set(status)
 * toogle()
 * 
 * ----------------------------------------------
 LED.EventElement * => LED.Element
 * 
 * 
 * [Event] function
 * 	'click dblclick keydown keyup blur focus change mousedown mouseup mouseout mouseover mousemove'
 * 
 * On each without
 * 
 * [Element].click(function() {});
 * [Element].keydown(function() {});
 * ...
 * 
 * 
 * ----------------------------------------------
 * LED.Element
 * 
 * style({})
 * Color (foreground, background)
 * add2element(HTMLelement)
     

*/



LED.FlashBackground = '#fff';
LED.color 			= '#fff'; 
LED.backgroundColor = '#000';
LED.className 		= 'LED_Panel';
LED.resetCSS 		= {
    overflow:'hidden', 
    verticalAlign: 'baseline', 
    fontWeight: 'inherit', 
    fontFamily: 'inherit',
    fontStyle: 'inherit', 
    fontSize: '100%', 
    border: 0, 
    padding: 0, 
    margin: 0
};

(function (global, window, undefined) { // anonym function to create a local namespace

var doc = window.document, myStylesheet;

/**
 * Local Helper Function
 **/
function createStylesheet(){
    if(myStylesheet) return;
    if(!doc.styleSheets) throw new TypeError('Your browser doesn\'t support styleSheets!');
    var myStyle = doc.createElement("style");
    myStyle.setAttribute( "type", "text/css" );
    doc.getElementsByTagName("head")[0].appendChild(myStyle);
    
    var styles = doc.styleSheets.length;
	myStylesheet = doc.styleSheets[styles-1];
    if(!myStylesheet) throw new TypeError('Error creating the styleSheet!');
}
function addStyle(name, style) {
	createStylesheet();
    if( doc.styleSheets[0].cssRules ) {
		myStylesheet.insertRule(name + "{" + CSSString(style) + "}", 0);
        doc.styleSheets[0].cssRules[doc.styleSheets[0].cssRules.length - 1];
	} else if ( doc.styleSheets[0].rules ) {
		myStylesheet.addRule(name, CSSString(style));
        doc.styleSheets[0].rules[doc.styleSheets[0].rules.length - 1]
	}
}
function CSSString(style){
	var str = '', a;
	for(a in style) str += a.replace(/([A-Z])/, function(x, letter) { return '-' + letter.toLowerCase(); }) + ':' + style[a] +';';
	return str;
}

function Extend(base, parent){
    function F() { }
    F.prototype = parent.prototype || parent;
    base.prototype = new F();
    base._parent = parent.prototype ? parent : null;
}

/**
 * Element a generic HTMLElement
**/
function Element(o) {// @param object(style, type, className, id, resetCSS)
    if(!o.type) o.type = 'span';
    var element = doc.createElement(o.type);
    this.element = function() { return element;};
    if(o.className) element.className= o.className;
    if(o.id) element.id = o.id;

    this.style(o.style);
}
Extend(Element, {
    add2element: function(parent) {return parent.appendChild(this.element());},
    style: function(o) {for(var a in o) this.element().style[a] = o[a];},
    is: function(obj) {return this.element() === obj;}
});

/**
 * one pixel
**/
function Point(o) { // @param object(top, left)
	Point._parent.call(this, {type: 'span', style: o.style, className: o.className, id: o.id});

    var 
    prev_status = true,
    status = false
    ;
    
    this.status = function() { return status;};
    this.set = function(set) { 
        status = !!set;
        if(status !== prev_status) {
			this.element().className = status ? 'on' : 'off';
			prev_status = status;
		}
        return status;
    };
}
Extend(Point, Element);
Point.prototype.toogle = function() {return this.set(!this.status());};

/**
 * EventElement
 * 
 * catches DOM Events
**/
function EventElement(o) {
    EventElement._parent.call(this, o);
    
    var 
    evt_handler = {},
    element = this.element(),
    _this = this;
    
    /**
     * create eventhandler
     * 
     * first catch some of the DOM Events
     * then add functions for adding the eventfunction
     * */
    'click dblclick keydown keyup blur focus change mousedown mouseup mouseout mouseover mousemove'
    .split(' ')
    .forEach(function(evt) {
		evt_handler[evt] = function() {return false; };
        // DOM Event
        element['on' + evt] = function(e){
			e = (e || window.event);
            if(!e.target) e.target = e.srcElement;
            return evt_handler[evt](e);
        };
        // Eventhandler function without 'on'
        _this[evt] = function(cb) {
            var old = evt_handler[evt];
            evt_handler[evt] = function(e) {
                old.call(_this, e);
                return cb.call(_this, e);
            };
        };
	} );
}
Extend(EventElement, Element);

/**
 * a Panel is an rectangle with Points
 * Base: EventElement
**/
function Panel(o) {
	var ID = LED.className + +(new Date);
	Panel._parent.call(this, {type:'div', className: LED.className, id: ID});
    
    if(o.width === null || o.width < 1) o.width = 1;
    if(o.height === null || o.height < 1) o.height = 1;
    if(o.pixel === null || o.pixel < 1) o.pixel= 1;
    if(o.padding === null || o.padding < 0) o.padding = 0;

    var 
    bits = [],
    dots = [], 
    color,
    backcolor,
    pixel_height = o.pixel + o.padding,
    i, j
    ;

	this.width = function() {return o.width;};
	this.height = function() {return o.height;};
	this.pixel = function() {return o.pixel;};

    // init 
    for(i = this.height(); i--;) bits[this.height() - i - 1] = Math.pow(2, i);
    
    this.style({
        position: 'relative',
        width: (this.width() * pixel_height) + 'px',
        height:  (this.height() * pixel_height) + 'px'
    });

    // set Bitmask at column
    this.setByte = function(col, c) {
        if(col < 0 || col > this.width()) return;
        for(i = this.height() ; i--;) this.set(i, col, (c & bits[i]));
    };
    // get Bitmask from a column
    this.getByte = function(col) {
        if(col < 0 || col >= this.width()) return null;
        var b = 0;
        for(i = this.height(); i--;) if(this.get(i, col)) b += bits[i];
        return b;
    };
    /**
     * for each dot, callback(dot, row, column)
     * if callback return false iteration stops
     */
	this.each = function(cb) {
		for(i = dots.length ; i--;) {
            for(j = dots[i].length ; j--;) {
                if(false === cb(dots[i][j], i, j)) break;
        }}
	};
	this.clear = function() {
		this.each(function(d) {d.set(false);});
	};
    
    this.set = function(t, l, on){
		if(dots[t] && dots[t][l]) dots[t][l].set(on);
	};
	this.get = function(t, l){
		return (dots[t] && dots[t][l]) ? dots[t][l].status() : null;
	};
    var className;
    this.flash = function() {
        if(!className) {
            className = this.element().className;
            this.element().className += ' flash';
        } else {
            this.element().className = className;
            className = '';
        }
    }
    this.blink = function() {
        if(!className) {
            className = this.element().className;
            this.element().className += ' blink';
        } else {
            this.element().className = className;
            className = '';
        }
    }
    this.create = function(parent, c, bg) {
		if(bg) backcolor = bg;
		if(c) color = c;
        if(!color) color = LED.color;
		if(!backcolor) backcolor = LED.backgroundColor;
		
		var style = LED.resetCSS;
		var spanStyle = {
			float:'left',
			width: o.pixel + 'px',
			height: o.pixel + 'px',
			margin:'0 ' + o.padding + 'px ' +  o.padding + 'px 0',
			color: color,
			backgroundColor:backcolor
		};
		for(i in spanStyle) style[i]  = spanStyle[i];
        
        addStyle('#' + ID + ' span', style);
        addStyle('#' + ID + ' span.on', {
			backgroundColor: color
		});
        addStyle('#' + ID + '.blink span.on', {
			backgroundColor:backcolor
		});
        addStyle('#' + ID + '.flash span.off', {
			backgroundColor:LED.FlashBackground
		});

        dots = [];

		for(i = 0; i < this.height(); ++i) {
			if(!dots[i]) dots[i] = [];
			for(j = 0; j < this.width(); ++j) {
                var dot = new Point({
                    className: 'off'
                });
                dot.add2element(this.element());
                dots[i][j] = dot;
			}
		}
		this.clear();
        if(parent) {
			this.add2element(parent);
			parent.className += ' LED';
		}
        
		return this;
	};
    this.click(function(e) {
		this.each(function(dot, r, c) {
			if(dot.is(e.target)) {
				e.dot = dot;
				e.row = r;
				e.col = c;
				return false;
			}
		});// each();
	});

}
Extend(Panel, EventElement);

Panel.prototype.copy = function(led) {
    this.each(
        function(dot, t, l){
            led.set(t, l, dot.status());
        }
    );
};
Panel.prototype.dots = function(status) {
    var tmp = [];

    var get_dot = typeof status === 'undefined' ? 
    function(d) {tmp.push(d); } :
    function(d) {if(d.status() === status) tmp.push(d);}
    ;
    
    this.each(get_dot);
    
    return tmp;
};
Panel.prototype.onclick=function () {};


function ScrollPanel(o) {
	ScrollPanel._parent.call(this, o);
}
Extend(ScrollPanel, Panel);

ScrollPanel.prototype.scrollLeft = function(circle) {return this.scrollH(true, circle);};
ScrollPanel.prototype.scrollRight = function(circle) {return this.scrollH(false, circle);};

ScrollPanel.prototype.scrollH = function(dir, circle) {
    var max = dir ? this.width() - 1 : 0;
    var min = dir ? 0 : this.width() - 1;
    
    for(var j = 0; j < this.height(); ++j) {
        var tmp = this.get(j, min);
        this.scrollRow(j, dir);
        this.set(j, max, circle ? tmp : false);
    }
};
ScrollPanel.prototype.scrollUp = function(circle) {return this.scrollV(true, circle);};
ScrollPanel.prototype.scrollDown = function(circle) {return this.scrollV(false, circle);};

ScrollPanel.prototype.scrollV = function(dir, circle) {
    var max = dir ? this.height() - 1 : 0;
    var min = dir ? 0 : this.height() - 1;
    
    for(var j = 0; j < this.width(); ++j) {
        var tmp = this.get(min, j);
        this.scrollCol(j, dir);
        this.set(max, j, circle ? tmp : false);
    }
};
ScrollPanel.prototype.scrollCol = function(col, dir) { // dir: true = up
    var i, h = this.height();
    if(dir) {
        for(i = 0; i < h - 1; ++i){
			this.set(i, col, this.get(i + 1, col));
		}
    } else {
        i = h;
        while(--i) {
            this.set(i, col, this.get(i - 1, col));
        }
    }
    this.onscroll(col, dir);
};
ScrollPanel.prototype.scrollRow = function(row, dir) { // dir: true = left
	var i, w = this.width();
    if(dir) {
        for(i = 1; i < w; ++i)  {
			this.set(row, i - 1, this.get(row, i));
		}
    } else {
        i = w;
        while(--i) {
			this.set(row, i, this.get(row, i - 1));
        }
    }
    this.onscroll(row, dir);
};
ScrollPanel.prototype.onscroll= function () {};

global.Panel = ScrollPanel;

})(LED, window); // end anonym function 