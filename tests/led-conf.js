/**
start....
var led1, led2;
window.onload = function() {
**/



/* ============================================= */	
/**
     * New LED (height, width, pixels, padding);
     * 
     * Parameters:
     * Height of the display
     * Width of the display
     * Size of the pixels
     * Distance between pixels
led1 = new LED(12, 80, 6, 1);
**/

/* ============================================= */
    
/**
     *. Create (HTMLElement)
     * 
     * Creates the display and fits in with the item.
     * The panel has produced the CSS class 'LED'
     * 
led1.create(document.getElementById('led1'), 'red', 'black');
**/

/* ============================================= */    
/**
     *. SetText (string)
     * 
     * Sets the string to be scrolled. Special characters are reaching an action.
     * Behind the special characters in curly brackets the number or duration of action can be specified. 
     * If not specified, configuration values ​​are used.
     * 
     * The following actions are installed:
     * @ {Ms} - delay in milliseconds (cfg.pause_ms.)
     * # {Count} - flashing letters (cfg.blinkAmount}.
     * ^ {Count} - Horizontal scrolling font (cfg.scrollAmount.)
     * _ {Number} - The background flashes (cfg.blinkAmount.) 
     * The flashing color can be changed with LED.FlashBackground.
     ** - The Scripture rolls out of the display. (No parameter)
     * $ - Stops scrolling the
led1.setText(" pause@ blink#{1} scroll^{1} flash_{2} 1234567890?!,");
**/

/* ============================================= */
/**
then more panels if needed:
    led2 = new LED(1, 35, 3, 1);
	led2.create(document.getElementById('led2'))
	led2.setText("scroll^{1} flash_{2} ");
}
**/

/* ============================================= */
/* ============================================= */
/* ============================================= */

var led1, led2, led3, led4 ;
window.onload = function() {
	led1 = new LED(12, 80, 6, 1);
    led1.create(document.getElementById('led1'), 'red', 'black', 'green');    
	led1.setText(" pause@ blink#{1} scroll^{1} flash_{2} 1234567890?!,");
	
/* ============================================= */
	
    led2 = new LED(1, 35, 3, 1);
	led2.create(document.getElementById('led2'))
	led2.setText("scroll^{1} flash_{2} ");

/* ============================================= */		

	led3 = new LED(15, 100, 1, 1); 
	led3.create(document.getElementById('led3'))
//  	var p  = document.getElementById('led3');       // Create (HTML Element)
//  	var el = led3.create(p);                        // Creates the display and fits in with the item. ... And the panel has produced the CSS class 'LED'

// The values could be entered with the text, i.e. in set.text  or as a configuration command. If commands are entered no need of values in set.text  
//_COMMAND_ 
	led3.clear('silver', 'black'), //             			#000, #f00	COLORS					Text,Background color(default: red/black )
	led3.cfg.speed = 10,			//             			500ms		SPEED					Rolling speed (Default: )
	led3.cfg.blinkInterval = 50,	//             			3x/350ms	FLASH INTERVAL			Interval in flash
	led3.cfg.blinkAmount = 1,	   //	_{number}          	3x/350ms	BLINK BACKGROUND		Number of blinkes - The background flashes in white
	led3.cfg.blinkAmount = 4,	   //  #{count}			3x/350ms	BLINK TEXT              Flashing letters
	led3.cfg.ScrollAmount = 1,	  //  ^{count}   			1x			SCROLLS TEXT			Number of the horizontal scroll
	led3.cfg.scrollspeed = 150,	 //             			150			SCROLL SPEED			Speed of the horizontal scroll
	led3.cfg.pause_ms = 500,		//  @{Ms}          		500ms		PAUSE 					Duration of the pause (delay in milliseconds)
								   //	*(No parameter)                 CLEAR 					Clears until next text - text rolls out of the display
								   //	$(No parameter)                 STOPS                   Stops text after last one
								   //	s p a c e d                     TEXT SPACE				Separation between letters, words, phrases or commands
 								   //	text(No parameter)              ROLLS TEXT normally 	
  // other configs ...  
  //  jump(led1); // jumping ball
  //  line(0,0, 8, 20) // slash line on pause or start
  //    return;

  /* el.click( function(e) {   // Stop on click - with dialog  
       alert(e.dot);
  }); */

  /* el.click( function(e) {   // Stop on click - with dialog  
       alert(e.row);
}); */
  // return; 
	
	led3.setText("NORMAL TEXT   @    S P A C E D    @     BLINK BKG     _       BLINK TXT     #      SCROLL       ^  CLEAR IN FRONT *      BLINK BKG AND TXT#_#                PAUSE       @  STOP HERE    $ ");

/* ============================================= */	

    led4 = new LED(12, 110, 2, 1);
    var p  = document.getElementById('led4');
    var el = led4.create(p);
    led4.clear('black', 'silver');
    led4.cfg.speed = 20;
    led4.setText("USING ONLY COMMANDS IN TEXT ::SEE SOURCE:: STARTING BY     SOME NORMAL TEXT  @    S P A C E D TEXT  @     BLINK BACKGROUND 2x_{2}       BLINK TEXT 2x    #{2}             SCROLLS UP 2lines  ^{2}  CLEAR ALL DISPLAY IN FRONT UNTIL NEXT TEXT... *      DO ANY COMBINATION OF EFFECTS LIKE   BLINK BKG AND TXT #_#                PAUSE TO RELAX   @ NOW LOOPS AND PLAY AGAIN OR ...      STOPS HERE     $ ");   

/* ============================================= */	
}