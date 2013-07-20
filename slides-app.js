// Constructor
SlidesApp = function()
{
    this.name = "SlidesApp";
	Sim.App.call(this);
}

// Subclass Sim.App
SlidesApp.prototype = new Sim.App();

// Our custom initializer
SlidesApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	this.slides = new Queue();
    this.focus();
}

SlidesApp.prototype.start = function()
{
    this.nextSlide();
}

SlidesApp.prototype.registerSlides = function(slides)
{
    this.slides.setList(slides);
    do {
        var slide = this.slides.next()
        slide.init();
    } while ( this.slides.peek()  != null)
    this.slides.reset();
    this.nextSlide();
}

SlidesApp.prototype.slideComplete = function()
{
    console.log("SlidesApp.slideComplete SLIDE COMPLETETETLTELTELTEL");
    this.nextSlide();
}
SlidesApp.prototype.nextSlide = function()
{
    console.log("SlidesApp.nextSlide");
    var slide;
    if ( this.slides.isEnd() )
    {
        // We're done.
        console.log("We are at the end of the slides!");
        return;
    } 
    console.log("next slide");
    if (this.slides.current() != null)
    {
        this.slides.current().unsubscribeListeners();
    }
    slide = this.slides.next();
    this.addObject(slide);
    slide.subscribe("slide_next", this, this.slideComplete);
    slide.subscribe("slide_previous", this, this.previousSlide);

    slide.nextAnimation();
}

SlidesApp.prototype.previousSlide = function()
{
    console.log("SlidesApp.previousSlide");
    if ( this.slides.isBeginning() )
    {
        console.log("Already at beginning of slides!");
        return;
    }
    var slide = this.slides.current();
    slide.unsubscribeListeners();
    slide.animations.reset(); // reset our animations since we are done with this slide for now.
    this.removeObject(slide);

    // go to the previous slide.
    console.log("GOING TO PREVIOUS SLIDE!");
    slide = this.slides.prev();
    this.addObject(slide);
    // re-subscribe our listeners.
    slide.subscribeListeners();
    slide.reloadSlide();
}


SlidesApp.prototype.handleKeyDown = function(keyCode, charCode)
{
    var slide = this.slides.current();
    if (slide == null)
    {
        return;
    }
    slide.handleKeyDown.call(slide, keyCode, charCode);
}

SlidesApp.prototype.onAnimationComplete = function()
{
    console.log("SlidesApp.onAnimationComplete complete.");
}

SlidesApp.prototype.update = function()
{
    Sim.App.prototype.update.call(this);
}

/* VARIOUS EFFECTS FOR OBJECTS */
ObjectEffects = function()
{

}
ObjectEffects.prototype = new Object();

ObjectEffects.prototype.rotateIn = function(object3D)
{
    var inPositionKeys = [0, .25, .75, 1];
    var inPositionValues = [ { x : 0, y: 0, z : -100}, 
                            { x: 0, y: 0, z: -75},
                            { x: 0, y: 0, z: -50},
                            { x : 0, y: 0, z : 0}
                            ];
    var inRotationKeys = [0, .5, 1];
    var inRotationValues = [ { z: 0 }, 
                                    { z: Math.PI},
                                    { z: Math.PI * 2 },
                                    ];
    return [ 
            { keys:inPositionKeys, values:inPositionValues, target:object3D.position },
            { keys:inRotationKeys, values:inRotationValues, target:object3D.rotation } 
            ];
}

ObjectEffects.prototype.rotateOut = function(object3D)
{
    var outPositionKeys = [0, .25, .75, 1];
    var outPositionValues = [ { x : 0, y: 0, z : 0}, 
                            { x: 0, y: 0, z: -25},
                            { x: 0, y: 0, z: -75},
                            { x : 0, y: 0, z : -100}
                            ];
    var outRotationKeys = [0, .5, 1];
    var outRotationValues = [ { z: 0 }, 
                                    { z: Math.PI},
                                    { z: Math.PI * 2 },
                                    ];
    return [ 
            { keys:outPositionKeys, values:outPositionValues, target:object3D.position },
            { keys:outRotationKeys, values:outRotationValues, target:object3D.rotation } 
            ];
}


/* BASIC SLIDE OBJECT */
SimpleSlide = function()
{
    Sim.Object.call(this);

}
SimpleSlide.prototype = new Sim.Object();

SimpleSlide.prototype.init = function(App)
{
    this.app = App; // save a ref to our app.
    this.animations = new Queue();
    this.animating = false;
    this.reloaded = false;
}

SimpleSlide.prototype.animate = function(animation, on)
{
    console.log("animate: " + on);
    ( on ) ? animation.start() : animation.stop(); 
}
SimpleSlide.prototype.onAnimationComplete = function()
{
    this.animating = !this.animating; // reset our animation flag to false.
    var animation = this.animations.current();
    // really irritating, "complete" must be set in animations context, due to the animation calling publish("complete")
    // but 'this' has to be set to our Slide.
    this.unsubscribe.call(animation, "complete", this);
    console.log("this.animations.isBeginning = " + this.animations.isBeginning());
    console.log("this.animations.isEnd = " + this.animations.isEnd());
    console.log("this.reloaded = " + this.reloaded);
    console.log(this.name + ".onAnimationComplete complete index: " + this.animations.getIndex());
    
    if (this.animations.isEnd() && this.reloaded == false)
    {
        console.log("all animations complete:" + this.name);
        console.log("-------------------------------------------------------> PUBLISH SLIDE NEXT");
        this.publish("slide_next");
    }

    if (this.reloaded == true)
    {
        console.log("Resetting reloaded flag.");
        this.reloaded = false;
    }
    
}
/*
 * Increment our animation counter and call runAnimation
 */
SimpleSlide.prototype.nextAnimation = function()
{
    console.log("nextAnimation index: " + this.animations.getIndex());
    var animation = this.animations.next();
    //this.subscribe("complete", this, this.onAnimationComplete);
    this.subscribe.call(animation, "complete", this, this.onAnimationComplete);
    this.runAnimation(animation);
}
/* 
 * Decrement our animation counter and call runAnimation.
 */
SimpleSlide.prototype.previousAnimation = function()
{
    var animation = this.animations.prev();
    console.log("PREVIOUS ANIMATION CALLED!");

    this.subscribe.call(animation, "complete", this, this.onAnimationComplete);
    console.log("previousAnimation index: " + this.animations.getIndex());
    this.runAnimation(animation);
    
}
SimpleSlide.prototype.reloadSlide = function()
{
    this.reloaded = true;
    this.previousAnimation();
}
/*
 * Check if need to reset object visibility (we were called from previousSlide)
 * We determine that by checking our index and seeing if is the same as our length. 
 * If it is we re-decrement it and set the objects visibility to true.
 */
SimpleSlide.prototype.runAnimation = function(animation)
{
    this.animating = !this.animating; // set animating to true.
    this.animate(animation, this.animating);
}
// Allow each slide to handle key events.
SimpleSlide.prototype.handleKeyDown = function(keyCode, charCode)
{
    console.log("=====================================================================> " + this.name + "KEY DOWN");
    switch(keyCode)
    {
        case Sim.KeyCodes.KEY_LEFT:
            (this.animations.isBeginning()) ? this.publish("slide_previous") : this.previousAnimation();
            break;
        case Sim.KeyCodes.KEY_RIGHT:
            console.log("hand isEnd?: " + this.animations.isEnd());
            (this.animations.isEnd()) ? this.publish("slide_next") : this.nextAnimation();
            //this.nextAnimation();
            break;
    }
}
SimpleSlide.prototype.subscribeListeners = function()
{
    this.subscribe("slide_previous", this, this.previousSlide);
    this.subscribe("slide_next", this, this.nextSlide);
}

SimpleSlide.prototype.unsubscribeListeners = function()
{
    this.unsubscribe("slide_previous", this);
    this.unsubscribe("slide_next", this);
}


SimpleSlide.prototype.previousSlide = function()
{
    console.log("SimpleSlide.previousSlide publish");
    this.object3D.visibility = false;
}

SimpleSlide.prototype.nextSlide = function()
{
    console.log("SimpleSlide.nextSlide publish");
    //this.publish("slide_next");
}




