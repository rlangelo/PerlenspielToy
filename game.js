// game.js for Perlenspiel 3.2

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-15 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.

Perlenspiel uses dygraphs (Copyright © 2009 by Dan Vanderkam) under the MIT License for data visualization.
See dygraphs License.txt, <http://dygraphs.com> and <http://opensource.org/licenses/MIT> for more information.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

var DRAW = {
	
	BOTTOM_ROW: 16,
	RESET_X: 15,
	WIDTH: 16,
	HEIGHT: 17,
	
	color: PS.COLOR_BLACK,
	underColor: PS.COLOR_WHITE,
	dragging: false,
	moving: false,
	sound: 1,
	
	clean : function () {
		"use strict";
		var i;
		
		DRAW.dragging = false;
		DRAW.underColor = PS.COLOR_WHITE;
		for (i = 0; i < DRAW.BOTTOM_ROW; i += 1)
		{
			PS.color(PS.ALL, i, PS.COLOR_WHITE);
		}
	},
	
	analyze : function () {
		if (SHAPE.coord.length > 0)
		{
			var i, pos_x, pos_y, result, y_below, pos;
			for (i = SHAPE.coord.length-1; i > -1; i -= 1)
			{
				pos_x = parseInt(SHAPE.coord[i].x_pos);
				pos_y = parseInt(SHAPE.coord[i].y_pos);
				y_below = pos_y + 1; 
				result = PS.unmakeRGB(PS.color(pos_x, y_below), {});
				if (result.r == 255 && result.g == 255 && result.b == 255)
				{
					DRAW.move(pos_x, pos_y);
				}
				else
				{
					pos = {
						x_pos: pos_x, 
						y_pos: pos_y
						};
					SHAPE.updated.push(pos);
					//PS.debug("Not-white below    ");
				}
			}
			SHAPE.coord = [];
			DRAW.reanalyze();
		}
		else {
			
		}
	},
	
	reanalyze : function () {
		if (SHAPE.updated.length > 0)
		{
			var i, pos_x, pos_y, result, y_below, pos;
			for (i = SHAPE.updated.length-1; i > -1; i -= 1)
			{
				pos_x = parseInt(SHAPE.updated[i].x_pos);
				pos_y = parseInt(SHAPE.updated[i].y_pos);
				y_below = pos_y + 1; 
				result = PS.unmakeRGB(PS.color(pos_x, y_below), {});
				if (result.r == 255 && result.g == 255 && result.b == 255)
				{
					DRAW.move(pos_x, pos_y);
				}
				else
				{
					pos = {
						x_pos: pos_x, 
						y_pos: pos_y
						};
					SHAPE.coord.push(pos);
					//PS.debug("Not-white below    ");
				}
			}
			SHAPE.updated = [];
			DRAW.analyze();
		}
		else {
				
		}
	},
	
	move : function (x, y) {
		"use strict";
		var y_below = parseInt(y) + 1;
		var y_above = y_below -1;
		var result;
		result = PS.unmakeRGB(PS.color(x, y_below), {});
		while (result.r == 255 && result.g == 255 && result.b == 255)
		{
			PS.color(x, y_below, DRAW.color);
			PS.color(x, y_above, PS.COLOR_WHITE);
			y_below += 1;
			y_above = y_below - 1;
			result = PS.unmakeRGB(PS.color(x, y_below), {});
		}
		PS.color(x, y, PS.COLOR_WHITE);
		DRAW.moving = true;	
	},

	upSound : function(){
		"use strict";
		DRAW.sound += 1;
		if (DRAW.sound > 9) {
		    DRAW.sound = 1;
		}
		PS.glyph(13, DRAW.BOTTOM_ROW, DRAW.sound.toString());
	},

	downSound : function(){
		"use strict";
		DRAW.sound -= 1;
		if (DRAW.sound < 1) {
		    DRAW.sound = 9;
		}
		PS.glyph(13, DRAW.BOTTOM_ROW, DRAW.sound.toString());
	},

    downRed : function(){
        var result, newRed;
        result = PS.unmakeRGB(PS.color(10, DRAW.BOTTOM_ROW), {});
        newRed = result.r - 5;
        if (newRed < 0)
        {
            newRed = 0;
        }
        for (i = 9; i < 12; i += 1) {
            PS.color(i, DRAW.BOTTOM_ROW, newRed, PS.CURRENT, PS.CURRENT);
        }
        DRAW.color = PS.color(10, DRAW.BOTTOM_ROW);
    },

    upRed : function(){
    var result, newRed;
    result = PS.unmakeRGB(PS.color(10, DRAW.BOTTOM_ROW), {});
    newRed = result.r + 5;
    if (newRed > 255)
    {
        newRed = 255;
    }
    for (i = 9; i < 12; i += 1) {
        PS.color(i, DRAW.BOTTOM_ROW, newRed, PS.CURRENT, PS.CURRENT);
    }
    DRAW.color = PS.color(10, DRAW.BOTTOM_ROW);
    },

    downGreen: function () {
        var result, newGreen;
        result = PS.unmakeRGB(PS.color(10, DRAW.BOTTOM_ROW), {});
        newGreen = result.g - 5;
        if (newGreen < 0) {
            newGreen = 0;
        }
        for (i = 9; i < 12; i += 1) {
            PS.color(i, DRAW.BOTTOM_ROW, PS.CURRENT, newGreen, PS.CURRENT);
        }
        DRAW.color = PS.color(10, DRAW.BOTTOM_ROW);
    },

    upGreen: function () {
        var result, newGreen;
        result = PS.unmakeRGB(PS.color(10, DRAW.BOTTOM_ROW), {});
        newGreen = result.g + 5;
        if (newGreen > 255) {
            newGreen = 255;
        }
        for (i = 9; i < 12; i += 1) {
            PS.color(i, DRAW.BOTTOM_ROW, PS.CURRENT, newGreen, PS.CURRENT);
        }
        DRAW.color = PS.color(10, DRAW.BOTTOM_ROW);
    },

    downBlue: function () {
        var result, newBlue;
        result = PS.unmakeRGB(PS.color(10, DRAW.BOTTOM_ROW), {});
        newBlue = result.b - 5;
        if (newBlue < 0) {
            newBlue = 0;
        }
        for (i = 9; i < 12; i += 1) {
            PS.color(i, DRAW.BOTTOM_ROW, PS.CURRENT, PS.CURRENT, newBlue);
        }
        DRAW.color = PS.color(10, DRAW.BOTTOM_ROW);
    },

    upBlue: function () {
        var result, newBlue;
        result = PS.unmakeRGB(PS.color(10, DRAW.BOTTOM_ROW), {});
        newBlue = result.b + 5;
        if (newBlue > 255) {
            newBlue = 255;
        }
        for (i = 9; i < 12; i += 1) {
            PS.color(i, DRAW.BOTTOM_ROW, PS.CURRENT, PS.CURRENT, newBlue);
        }
        DRAW.color = PS.color(10, DRAW.BOTTOM_ROW);
    }

};

var SHAPE = {
	coord: [],
	updated: [],
};

PS.init = function( system, options ) {
	"use strict";
	var i, lastx, lasty;
	
	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize( DRAW.WIDTH, DRAW.HEIGHT );
	PS.border(PS.ALL, PS.ALL, 0);
	lastx = DRAW.WIDTH -1;
	lasty = DRAW.BOTTOM_ROW;
	for (i = 0; i < lastx+1; i += 1)
	{
		PS.color(i, lasty, 0x778899);
	}
	DRAW.RESET_X = lastx;
	PS.glyphColor(0, lasty, PS.COLOR_BLACK);
	PS.glyph(0, lasty, "<");
	PS.exec(0, lasty, DRAW.downRed);

	PS.glyphColor(1, lasty, PS.COLOR_RED);
	PS.glyph(1, lasty, "R");

	PS.glyphColor(2, lasty, PS.COLOR_BLACK);
	PS.glyph(2, lasty, ">");
	PS.exec(2, lasty, DRAW.upRed);

	PS.glyphColor(3, lasty, PS.COLOR_BLACK);
	PS.glyph(3, lasty, "<");
	PS.exec(3, lasty, DRAW.downGreen);

	PS.glyphColor(4, lasty, PS.COLOR_GREEN);
	PS.glyph(4, lasty, "G");

	PS.glyphColor(5, lasty, PS.COLOR_BLACK);
	PS.glyph(5, lasty, ">");
	PS.exec(5, lasty, DRAW.upGreen);

	PS.glyphColor(6, lasty, PS.COLOR_BLACK);
	PS.glyph(6, lasty, "<");
	PS.exec(6, lasty, DRAW.downBlue);

	PS.glyphColor(7, lasty, PS.COLOR_BLUE);
	PS.glyph(7, lasty, "B");

	PS.glyphColor(8, lasty, PS.COLOR_BLACK);
	PS.glyph(8, lasty, ">");
	PS.exec(8, lasty, DRAW.upBlue);

	for (i=9; i < 12; i +=1)
	{
		PS.color(i, lasty, DRAW.color);
	}

	PS.glyphColor(12, lasty, PS.COLOR_BLACK);
	PS.glyph(12,lasty, "<");
	PS.exec(12, lasty, DRAW.downSound);

	PS.glyphColor(13, lasty, PS.COLOR_BLACK);
	PS.glyph(13,lasty, DRAW.sound.toString());

	PS.glyphColor(14, lasty, PS.COLOR_BLACK);
	PS.glyph(14,lasty, ">");
	PS.exec(14, lasty, DRAW.upSound);

	PS.glyphColor(lastx, lasty, PS.COLOR_BLACK);
	PS.glyph(lastx, lasty, "X");
	PS.exec(lastx, lasty, DRAW.clean);

	DRAW.clean();
	
	// Add any other initialization code you need here
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";
	var pos = {
		x_pos: x, 
		y_pos: y };
	if ( y < DRAW.BOTTOM_ROW)
	{
		DRAW.dragging = true;
		DRAW.underColor = DRAW.color;
		PS.color(x, y, DRAW.color);
		SHAPE.coord.push(pos);
	}

	// Uncomment the following line to inspect parameters
	//PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
	DRAW.dragging = false;
	if (y != DRAW.BOTTOM_ROW) {
	    switch (DRAW.sound) {
	        case 1:
	            PS.audioPlay("fx_click");
	            break;
	        case 2:
	            PS.audioPlay("fx_bang");
	            break;
	        case 3:
	            PS.audioPlay("fx_ding");
	            break;
	        case 4:
	            PS.audioPlay("fx_bucket");
	            break;
	        case 5:
	            PS.audioPlay("fx_drip1");
	            break;
	        case 6:
	            PS.audioPlay("fx_squawk");
	            break;
	        case 7:
	            PS.audioPlay("fx_whistle");
	            break;
	        case 8:
	            PS.audioPlay("fx_tada");
	            break;
	        case 9:
	            PS.audioPlay("fx_wilhelm");
	            break;
	        default:
	            break;
	    }
	}

	DRAW.analyze();
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";
	var pos = {
		x_pos: x, 
		y_pos: y };
	var alreadyIn = false;
	DRAW.moving = false;
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
	if (y < DRAW.BOTTOM_ROW)
	{
		DRAW.underColor = PS.color(x, y);
		PS.color(x, y, DRAW.color);
		if (DRAW.dragging)
		{
			DRAW.underColor = DRAW.color;
			for (var i = 0, len = SHAPE.coord.length; i < len; i++)
			{
				if (parseInt(SHAPE.coord[i].x_pos) == parseInt(x) && parseInt(SHAPE.coord[i].y_pos) == parseInt(y))
				{
					alreadyIn = true;
					break;
				}
			}
			if (!alreadyIn) {
				SHAPE.coord.push(pos);
			}
		}
	}
	else
	{
		DRAW.dragging = false;
	}
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
	if ( y < DRAW.BOTTOM_ROW && !DRAW.moving)
	{
		PS.color(x, y, DRAW.underColor);
	}
	
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.swipe ( data, options )
// Called when a mouse/finger swipe across the grid is detected
// It doesn't have to do anything
// [data] = an object with swipe information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.swipe = function( data, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters

	/*
	 var len, i, ev;
	 PS.debugClear();
	 PS.debug( "PS.swipe(): start = " + data.start + ", end = " + data.end + ", dur = " + data.duration + "\n" );
	 len = data.events.length;
	 for ( i = 0; i < len; i += 1 ) {
	 ev = data.events[ i ];
	 PS.debug( i + ": [x = " + ev.x + ", y = " + ev.y + ", start = " + ev.start + ", end = " + ev.end +
	 ", dur = " + ev.duration + "]\n");
	 }
	 */

	// Add code here for when an input event is detected
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

