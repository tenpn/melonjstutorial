/*!
 * 
 *   melonJS
 *   http://www.melonjs.org
 *		
 *   Step by step game creation tutorial
 *
 **/

// game resources
var g_resources= [{
	name: "area01_level_tiles",
	type: "image",
	src: "data/area01_tileset/area01_level_tiles.png"
    }, {
	name: "area01",
	type: "tmx",
	src: "data/area01.tmx"
    }, {
	name: "gripe_run_right",
	type: "image",
	src: "data/sprite/gripe_run_right.png"
    }, {
	name:"area01_bkg0",
	type:"image",
	src: "data/area01_parallax/area01_bkg0.png"
    }, {
	name:"area01_bkg1",
	type:"image",
	src: "data/area01_parallax/area01_bkg1.png"
    }, {
	name: "spinning_coin_gold",
	type: "image",
	src: "data/sprite/spinning_coin_gold.png"
    }, {
	name: "wheelie_right",
	type: "image",
	src: "data/sprite/wheelie_right.png"
    }];

// player entitiy
var PlayerEntity = me.ObjectEntity.extend({
	// ctor
	init: function(x, y, settings) {
	    this.parent(x, y, settings);
	    this.setVelocity(3, 15); // walking, jumping speed
	    this.updateColRect(8, 48, -1, 0);
	    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},

	// update player pos
	update: function() {
	    if (me.input.isKeyPressed('left')) {
		this.doWalk(true);
	    } else if (me.input.isKeyPressed('right')) {
		this.doWalk(false);
	    } else {
		this.vel.x = 0;
	    }

	    if (me.input.isKeyPressed('jump')) {
		this.doJump();
	    }

	    this.updateMovement();

	    if (this.vel.x != 0 || this.vel.y != 0){
		// update anim
		this.parent(this);
		return true;
	    }
	    return false;
	}
    });

var CoinEntity = me.CollectableEntity.extend({
	init: function(x, y, settings) {
		this.parent(x, y, settings); 
	},
	
	onCollision: function() {
	
	}
});
	
var jsApp	= 
{	
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function()
	{
		
		// init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas.");
         return;
		}
				
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		
		// set all resources to be loaded
		me.loader.onload = this.loaded.bind(this);
		
		// set all resources to be loaded
		me.loader.preload(g_resources);

		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()
	{
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
      
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("CoinEntity", CoinEntity);
		
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.X, "jump", true);

		// start the game 
		me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend(
{

   onResetEvent: function()
	{	
	    // load a level
	    me.levelDirector.loadLevel("area01");
	},
	
	
	/* ---
	
		 action to perform when game is finished (state change)
		
		---	*/
    onDestroyEvent: function()
	{
	
   }

});


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
