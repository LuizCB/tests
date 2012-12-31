/**
 * 
 * 
 * Property: LED ()
 * Author: J. Strübig
 * 
 * Version 0.8 / Date: 21.12.2012
 * - SetColor (deleted)
 * The change in the led_panel.js had to set the colors in the create () function to be laid. 
 * It is no longer possible to change the color later. 
 * 
 * Version 0.7 / Date: 16.12.2012
 Eliminated logic error in the action () function - *
 * 
 * Version 0.6 / Date: 30.11.2011
 * - Bug in the Scroll function, the scroll could not be started
 * 
 * Version 0.5 / Date: 18.11.2011 - 21:11
 * Code written from scratch, more object-oriented
 * 
 * Version 0.4 / Date: 11:25 06/22/2010
 * -. Parameters of constructor and () create reversed
 * Fine work
 * ScrollOut () function
 * 
 * Version 0.3 / Date: 11:25 15/02/2009
 * Inheritance through prototype
 * 
 * Version 0.2 / Date: 11:24 02/14/2009
 * - First version
 * 
 * Methods:
 * 
 * Setext (string)
 * CharAt (top, left, char)
 * Print Print (string)
 * Set (top, left on / off)
 * 
 * Stop ()
 * Start ()
 * 
 * Pause (millisecond-)
 * Up (number)
 * Blink (number)
 * Flash (number)
 * ScrollOut () 
 * 
 * Clear ()
 * Copy (LED)
 * Create (parent, color, color)
 * 
 * Features LED.cfg
 * 
 * BlinkInterval
 * BlinkAmount
 * ScrollAmount
 * Scrollspeed
 * Pause_ms
 * 
**/

function LED(h, w, px, pad) {
	var bitmap = LED.charset.set;
	if(h < LED.charset.height) h  = LED.charset.height;

	this.cfg = {
        speed: 100,
        blinkInterval: 350,
        blinkAmount: 3,
        scrollAmount: 1,
        scrollSpeed: 150,
        pause_ms: 500
    };
	
	// local
	var 
    messageArray,
    columnPointer, // for scrolling
    char_offset,
    cursor = 0, // for print Print / charAt
    doScroll = false,
    stop = false, // ​​Flag for actions to
    _this = this,
    panel = null,
    isBusy = false;
    
/**
     * The function performs an asynchronous loop multiple times 
     * Count = The number of times the function is called
     * Repeat = number of iterations
*/
    var action = function(func, time, count, repeat) {
        var local_count;
        if(!repeat) repeat = 1;
        if(!time || time < 0) time = 0;

        stop = false; // Trigger
        doScroll = false; // scroll stop
        
        function outer_loop() {
            local_count = count;
            if(repeat--) inner_loop();
            else end();
        }
        function inner_loop() {
            func();
            if(--local_count) window.setTimeout(inner_loop, time);
            else outer_loop();
        }

        function end() {
            doScroll = !doScroll;
            // At the end scroll call or stop
           if(!stop && doScroll) window.setTimeout(scroll, time);
            else _this.stop();
            stop = true;
        }
        window.setTimeout(outer_loop, time);
    };
    
/**
     * The main function will be called during the display / scrolling of text.
**/
    var scroll = function() {
		// Text output
		var temp = messageArray[columnPointer++];
		if(columnPointer === messageArray.length) columnPointer = 0;

		if(isNaN(temp)) { // not a number
			// Special characters + optional number of repetitions
			switch(temp.substr(0, 1)) {
				case '#': _this.blink(temp.substring(1)); break;
				case '^': _this.up(temp.substring(1)); break;
				case '_': _this.flash(temp.substring(1)); break;
				case '@': _this.pause(temp.substring(1)); break;
                case '*': _this.scrollOut(); break;
                case '$': _this.stop(); break;
			}
		} else {
			panel.scrollLeft();
			panel.setByte(panel.width() - 1, temp);
		}
		if(doScroll)window.setTimeout(scroll, _this.cfg.speed);
	}

    this.clear = function(){
        cursor = 0;
        return panel.clear();
    }
    this.create = function(p, c, b) {
        return panel.create(p, c, b);
    };
    this.copy = function(p) {
        return panel.copy(p);

    };
    this.set = function(a,b,c) {
        return panel.set(a,b,c);
    };
    
    this.isBusy = function() { return isBusy;};
    
	this.start = function() {
		if(this.isBusy()) return;
		
		doScroll = true;
		stop = true;
		scroll();
		isBusy = true;
	};
	this.stop = function() {
		doScroll = false;
		stop = true;
		isBusy = false;
	};
	this.pause = function(c) {
		action(function() {}, c || this.cfg.pause_ms);
	};
	this.up = function(loop) {
		if(!loop) loop = this.cfg.scrollAmount;
       
        action(
        function() {
            panel.scrollUp(true);
        }, this.cfg.scrollSpeed, panel.height(), loop);
        
	};
	this.blink = function(c) {
		if(!c) c = this.cfg.blinkAmount;
		action(
        function() {
            panel.blink();
		}, _this.cfg.blinkInterval, c * 2);
	};
	this.flash = function(c) {
		if(!c) c = this.cfg.blinkAmount;
        action(
        function() {
			panel.flash();
		}, _this.cfg.blinkInterval, c * 2);
	};
	this.scrollOut = function() {
		var w = this.panel.width() ;
		action(
        function() {
				_this.panel.scrollLeft();
		}, this.cfg.speed, w);
    }
    
	this.charAt = function(t, l, char) {
		if(!t || t < 0) t = 0;
		if(!l || l < 0) l = 0;
		
        c = bitmap[char.toUpperCase()];
        if(!c) return;
        
		var off = char_offset - t;

		if(off < 0) off = 0;
		for(var i = 0; i < c.length; ++i) {
			var tmp = c[i] << off;

			panel.setByte(l + i, tmp, char);
			++cursor;
		}
		++cursor;
		if(cursor > panel.width()) cursor = 0;
	};

	this.print = function(txt) {
		for(var i = 0; i < txt.length; ++i) {
			this.charAt(0, cursor, txt.substr(i, 1));
		}
	};
    
	this.setText = function(txt) {
		if(this.isBusy()) return;
		if(typeof txt === 'undefined' || !txt.length) return;
		char_offset = parseInt(((panel.height() - LED.charset.height) / 2), 10);
		
		var text = txt.toUpperCase();
		messageArray = [];
		for (var i = 0; i < text.length; ++i){
            var c = text.substr(i, 1);
			var letter = bitmap[c];
   			
            if(!letter) {
				// Special functions.
				// A number in a brace behind it, is the associated function is passed
				var zahl = '';
				var k1 = text.indexOf('{', i) + 1;
				var k2 = text.indexOf('}', i);
				if(k1 && k1 - i === 2) { zahl = text.substring(k1, k2); i += k2 - k1 + 2;} 
                
				messageArray.push(c + zahl); 
			} else  {
				// Create the bitmap array
				for (var j = 0; j < letter.length; ++j) messageArray.push(letter[j] << char_offset);
				messageArray.push(0); // spacing between letters
			}
		}
        
		columnPointer = 0;
	};

    panel = new LED.Panel({
        height: h,
        width: w,
        pixel: px,
        padding: pad
    });
    
    this.panel  = panel;
    this.setText(' ');
    
    panel.click(function event(e)  {e.led = _this;});
}

if(!Array.prototype.forEach ) {
	Array.prototype.forEach = function(fun ){
		var len = this.length;
		if (typeof fun != "function")throw new TypeError();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) if (i in this) fun.call(thisp, this[i], i, this);
	};
}