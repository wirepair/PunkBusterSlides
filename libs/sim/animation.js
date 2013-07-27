Sim.AnimationGroup = function()
{
	Sim.Object.call();
	this.running = false;
	this.animations = new Queue();
	// Do we run one animation after another? Or all at same time.
	this.isChain = false; // default: run all at same time.
}

Sim.AnimationGroup.prototype = new Sim.Object();

/*
 * init() - MUST be called after all animations are added.
 *
 */
Sim.AnimationGroup.prototype.init = function(param)
{
	param = param || {};
	if (this.animations.empty())
	{
		throw "Animations not set for AnimationGroup, must add before calling init()";
	}
	//this.duration = param.duration ? param.duration : Sim.Animator.default_duration;
	this.isChain = param.isChain || false;
	this.setOnGroupComplete();
}
/*
 * setOnGroupComplete - If the animation group is chained we iterate over
 * all animations and reset their onComplete to the group's onComplete. The
 * final animation has an onGroupComplete method set for it's oncomplete
 * so we can signify when all are completed.
 *
 * For concurrent animations, we get the largest duration animation and
 * set that animations onComplete to the onGroupComplete.
 *
 * Also note this will reset the animation list.
 */
Sim.AnimationGroup.prototype.setOnGroupComplete = function()
{
	var final_animation = this.animations.peek(); // set it to the first.
	do 
	{
		var animation = this.animations.next();
		// set this.duration to the longest duration.
		// also we only set the onGroupComplete of the longest running so
		// we will know when all animations are done.
		animation.onComplete = this.onComplete;
		if (animation.duration >= final_animation.duration)
		{
			final_animation = animation;
		}
	} while( this.animations.peek() != null );
	console.log("AnimationGroup has " + this.animations.length() + " animations.");
	
	if (this.isChain)
	{
		final_animation = this.animations.last();
	}
	else
	{
		final_animation.onComplete = this.onGroupComplete;
	}
	final_animation.parent = this; // save reference for our onComplete callback;
	this.animations.reset();

}
Sim.AnimationGroup.prototype.set = function(animations)
{
	this.animations.setList(animations);
}

Sim.AnimationGroup.prototype.add = function(animation)
{
	this.animations.push(animation);
}

Sim.AnimationGroup.prototype.start = function()
{
	if (this.running)
		return;
	// if we are chained, we run one animation at a time.
	if (this.isChain)
	{
		var animation = this.animations.next();
		if (animation == null)
		{
			this.running = false;
			this.onComplete();
			return;
		}
		animation.start();
		this.running = true;	
	}
	else
	{
		do {
			console.log("AnimationGroup.start iteration...");
			var animation = this.animations.next();
			animation.start();
		} while( this.animations.peek() != null );
		this.animations.reset();
		this.running = true;				
	}
}

Sim.AnimationGroup.prototype.stop = function()
{
	this.running = false;
	this.animations.reset(); // make sure we are at the beginning.
	do {
		var animation = this.animations.next();
		animation.stop();
	} while( this.animations.peek() != null );
	this.animations.reset();
	console.log("AnimationGroup.stop");
	//this.publish("complete");
	this.onComplete();
}

Sim.AnimationGroup.prototype.update = function()
{
	if (!this.running)
		return;

	do {
		var animation = this.animations.next();
		animation.update();
	} while( this.animations.peek() != null );
	this.animations.reset(); // reset back to beginning for next update call.
}

/* onComplete - Note this method will override all animations onComplete
 * so we can signify once when the entire group completes.
 *
 */
Sim.AnimationGroup.prototype.onComplete = function()
{
	console.log("AnimationGroup.onComplete called.");
	if (this.isChain)
	{
		// starts the next animation in our chain.
		this.start();
	} 
}

Sim.AnimationGroup.prototype.onGroupComplete = function()
{
	console.log("AnimationGroup ONGROUPCOMPLETE complete.");
	//this.publish("complete");
	g_publisher.publish("complete");
}

/*
 * Base Animator Object
 */
Sim.Animator = function()
{
	Sim.Object.call();
	this.running = false;
	this.parent = null;
}

Sim.Animator.prototype = new Sim.Object();

Sim.Animator.prototype.init = function(param)
{

}

Sim.Animator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
}

Sim.Animator.prototype.stop = function()
{
	this.running = false;
	console.log("Animator.stop");
	this.onComplete();
}

// Update - drive key frame evaluation
Sim.Animator.prototype.update = function()
{
	if (!this.running)
		return;
}
/*
 * onComplete - sends out a message saying we are
 * complete. NOTE: if part of an animation group this
 * method is overwitten with the animation goup's onComplete!
 */
Sim.Animator.prototype.onComplete = function()
{
	//this.publish.call(this.parent || this, "complete");
	g_publisher.publish("complete");
}

// Statics
Sim.Animator.default_duration = 1000;


/* SINGLE ANIMATION TweenJS style*/
Sim.TweenjsAnimator = function()
{
	Sim.Animator.call();
}
Sim.TweenjsAnimator.prototype = new Sim.Animator;

Sim.TweenjsAnimator.prototype.init = function(param)
{
	param = param || {};
	this.tweens =  param.tweens || [];
	this.duration = param.duration || 2000;
	var complete_cb = param.onComplete || this.onComplete;
	// for signaling completion.
	var complete = new TWEEN.Tween( this ).to({}, param.duration);
	
	complete.onComplete( complete_cb );
	this.tweens.push(complete);

}

Sim.TweenjsAnimator.prototype.start = function()
{
	if (this.running)
		return;

	console.log("calling start in TweenjsAnimator");
	for (var i = 0; i < this.tweens.length; i++)
	{
		this.tweens[i].start();
		console.log("Starting tween: " + i );
	}
	this.running = true;
}	

Sim.TweenjsAnimator.prototype.stop = function()
{
	for (var i = 0; i < this.tweens.length; i++)
	{
		this.tweens[i].stop();
	}
	this.running = false;
	console.log("TweenjsAnimator.stop");
	//this.publish("complete");
	this.onComplete();
}

Sim.TweenjsAnimator.prototype.update = function()
{
	if (!this.running)
		return;
	
	TWEEN.update();
	//Sim.Animator.prototype.update.call(this);
	console.log("I'm UPDATING!!!!");
}

Sim.TweenjsAnimator.prototype.onComplete = function()
{
	console.log("TweenjsAnimator onComplete called.");
	this.publish.call(this.parent || this, "complete");
}

// KeyFrameAnimator class
// Construction/initialization
Sim.KeyFrameAnimator = function() 
{
    Sim.Animator.call();
	
	this.interps = [];
	this.running = false;
}

Sim.KeyFrameAnimator.prototype = new Sim.Animator; //new Sim.Object;
	
Sim.KeyFrameAnimator.prototype.init = function(param)
{
	param = param || {};
	
	if (param.interps)
	{
		this.createInterpolators(param.interps);
	}	    		

	this.duration = param.duration ? param.duration : Sim.KeyFrameAnimator.default_duration;
	this.loop = param.loop ? param.loop : false;
}

Sim.KeyFrameAnimator.prototype.createInterpolators = function(interps)
{
	var i, len = interps.length;
	for (i = 0; i < len; i++)
	{
		var param = interps[i];
		var interp = new Sim.Interpolator();
		interp.init({ keys: param.keys, values: param.values, target: param.target });
		this.interps.push(interp);
	}
}

// Start/stop
Sim.KeyFrameAnimator.prototype.start = function()
{
	if (this.running)
		return;
	
	this.startTime = Date.now();
	this.running = true;
}

Sim.KeyFrameAnimator.prototype.stop = function()
{
	this.running = false;
	console.log("KeyFrameAnimator.stop");
	//this.publish("complete");
	this.onComplete();
}

// Update - drive key frame evaluation
Sim.KeyFrameAnimator.prototype.update = function()
{
	if (!this.running)
		return;
	
	var now = Date.now();
	var deltat = (now - this.startTime) % this.duration;
	var nCycles = Math.floor((now - this.startTime) / this.duration);
	var fract = deltat / this.duration;

	if (nCycles >= 1 && !this.loop)
	{
		this.running = false;
		console.log("KeyFrameAnimator.update complete.");
		//this.publish("complete");
		this.onComplete();
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(1);
		}
		return;
	}
	else
	{
		var i, len = this.interps.length;
		for (i = 0; i < len; i++)
		{
			this.interps[i].interp(fract);
		}
	}
}
// Statics
Sim.KeyFrameAnimator.default_duration = 1000;

//Interpolator class
//Construction/initialization
Sim.Interpolator = function() 
{
 Sim.Object.call();
	    		
	this.keys = [];
	this.values = [];
	this.target = null;
	this.running = false;
}

Sim.Interpolator.prototype = new Sim.Object;
	
Sim.Interpolator.prototype.init = function(param)
{
	param = param || {};
	
	if (param.keys && param.values)
	{
		this.setValue(param.keys, param.values);
	}	    		

	this.target = param.target ? param.target : null;
}

Sim.Interpolator.prototype.setValue = function(keys, values)
{
	this.keys = [];
	this.values = [];
	if (keys && keys.length && values && values.length)
	{
		this.copyKeys(keys, this.keys);
		this.copyValues(values, this.values);
	}
}

//Copying helper functions
Sim.Interpolator.prototype.copyKeys = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		to[i] = from[i];
	}
}

Sim.Interpolator.prototype.copyValues = function(from, to)
{
	var i = 0, len = from.length;
	for (i = 0; i < len; i++)
	{
		var val = {};
		this.copyValue(from[i], val);
		to[i] = val;
	}
}

Sim.Interpolator.prototype.copyValue = function(from, to)
{
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		to[ property ] = from[ property ];
	}
}

//Interpolation and tweening methods
Sim.Interpolator.prototype.interp = function(fract)
{
	var value;
	var i, len = this.keys.length;
	if (fract == this.keys[0])
	{
		value = this.values[0];
	}
	else if (fract >= this.keys[len - 1])
	{
		value = this.values[len - 1];
	}

	for (i = 0; i < len - 1; i++)
	{
		var key1 = this.keys[i];
		var key2 = this.keys[i + 1];

		if (fract >= key1 && fract <= key2)
		{
			var val1 = this.values[i];
			var val2 = this.values[i + 1];
			value = this.tween(val1, val2, (fract - key1) / (key2 - key1));
		}
	}
	
	if (this.target)
	{
		if (this.target instanceof Array)
		{
			for (var i = 0; i < this.target.length; i++)
			{
				this.copyValue(value, this.target[i]);	
			}
		}
		else
		{
			this.copyValue(value, this.target);
		}
	}
	else
	{
		this.publish("value", value);
	}
}

Sim.Interpolator.prototype.tween = function(from, to, fract)
{
	var value = {};
	for ( var property in from ) {
		
		if ( from[ property ] === null ) {		
		continue;		
		}

		var range = to[property] - from[property];
		var delta = range * fract;
		value[ property ] = from[ property ] + delta;
	}
	
	return value;
}