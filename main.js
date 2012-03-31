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
    }, {
	name: "32x32_font",
	type: "image",
	src: "data/sprite/32x32_font.png"
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

	    var res = me.game.collide(this);
	    if (res) {
		if (res.obj.type == me.game.ENEMY_OBJECT) {
		    if ((res.y > 0) && this.jumping == false) {
			this.forceJump();
		    } else {
			this.flicker(45);
		    }
		}
	    }

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
	    if (me.game.HUD != null){
		me.game.HUD.updateItemValue("score", 250);
	    }
	    this.collidable=false;
	    me.game.remove(this);
	}
});

var EnemyEntity = me.ObjectEntity.extend({
	init:function(x, y, settings) {
	    // can define this in tiled, or here
	    settings.image="wheelie_right";
	    settings.spritewidth = 64;

	    this.parent(x, y, settings);

	    this.startX = x;
	    this.endX = x + settings.width - settings.spritewidth;

	    this.pos.x = x + settings.width - settings.spritewidth;
	    this.walkLeft = true;

	    this.setVelocity(4, 6);

	    this.collidable = true;
	    this.type = me.game.ENEMY_OBJECT;
	},

	// obj - other object
	onCollision: function(res, obj) {
	    // res.y > 0 means touched on the bottom
	    if (this.alive && (res.y > 0) && obj.falling) {
		this.flicker(45);
	    }
	},

	update: function() {
	    if (!this.visible)
		return false;

	    if (this.alive) {
		if (this.walkLeft && this.pos.x <= this.startX) {
		    this.walkLeft = false;
		} else if (this.walkLeft == false && this.pos.x >= this.endX) {
		    this.walkLeft = true;
		}
		this.doWalk(this.walkLeft);
	    } else {
		this.vel.x = 0;
	    }

	    this.updateMovement();

	    if (this.vel.x != 0 || this.vel.y != 0) {
		this.parent(this);
		return true;
	    }
	    return false;
	}
    });
	
var ScoreObject = me.HUD_Item.extend({
	init: function(x,y) {
	    this.parent(x, y);
	    this.font = new me.BitmapFont("32x32_font", 32);
	},

	draw: function(context, x, y){
	    this.font.draw(
		 context, this.value, this.pos.x + x, this.pos.y + y);
	},
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
		me.entityPool.add("EnemyEntity", EnemyEntity);
		
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.X, "jump", true);

		// start the game 
		me.state.change(me.state.PLAY);
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {
	    me.levelDirector.loadLevel("area01");
	    me.game.addHUD(0, 430, 640, 60);
	    me.game.HUD.addItem("score", new ScoreObject(620, 10));
	    me.game.sort();
	},

	onDestroyEvent: function() {
	    me.game.disableHUD();
	}
    });


//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});
