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
	this.slides = new Queue(); // our queue to hold each slide.
    this.focus();
}

/*
 * Initial start of our slides 
 */
SlidesApp.prototype.start = function()
{
    this.nextSlide();
}

/*
 * Adds each slide to our queue of slides. 
 * @param slides - Array
 * 
 * @calls - nextSlide
 *
 */
SlidesApp.prototype.registerSlides = function(slides)
{
    this.slides.setList(slides);
    do {
        var slide = this.slides.next();
        slide.loadResources();
    } while ( this.slides.peek()  != null)
    this.slides.reset();
    this.nextSlide();
}
/*
 * slideComplete - called when a user hits the right arrow and the call back
 * is recieved
 * @calls - nextSlide
 *
 */
SlidesApp.prototype.slideComplete = function()
{
    this.nextSlide();
}

SlidesApp.prototype.goto = function(index)
{
    this.slides.get(index); // update index
    this.nextSlide();
}
/*
 * nextSlide - Checks if we are at the the end of the slide deck.
 * Next, checks if we have a current slide and if we do call it's
 * done method to close down subscribers, hide the root mesh object etc.
 * Then it prepares the next slide adds the object and calls it's go method.
 *
 * @calls - slide.go()
 */
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

    if (this.slides.current() != null)
    {
        var current = this.slides.current();
        current.done();
        this.removeObject(current);
    }
    slide = this.slides.next();
    slide.init(this);
    this.addObject(slide);
    slide.go();
}

/* 
 * previousSlide - Called by our pub/sub callback when the user
 * presses the left arrow key and their are no more animations left.
 * Checks if we are at the beginning (does nothing if we are). 
 * Get's an instance of the current slide (the one that we were just on)
 * and calls it's done method and removes the slide from our list of
 * current objects.
 *
 */
SlidesApp.prototype.previousSlide = function()
{
    console.log("SlidesApp.previousSlide");
    if ( this.slides.isBeginning() )
    {
        console.log("Already at beginning of slides!");
        return;
    }
    var slide = this.slides.current();
    slide.done();
    this.removeObject(slide);

    // go to the previous slide.
    //console.log("GOING TO PREVIOUS SLIDE!");
    slide = this.slides.prev();
    slide.init(this);
    this.addObject(slide);
    slide.go();
}


/* 
 * handleKeyDown - The top level key handler which propagates the key event
 * down to each slide. Grabs a reference to the current slide and calls it's
 * handleKeyDown method.
 * @param keyCode - the key code
 * @param charCode - the char code ( i think this is for some other browsers )
 *
 * @calls slide.handleKeyDown
 *
 */
SlidesApp.prototype.handleKeyDown = function(keyCode, charCode)
{
    var slide = this.slides.current();
    if (slide == null)
    {
        return;
    }
    slide.handleKeyDown.call(slide, keyCode, charCode);
}

//SlidesApp.prototype.onAnimationComplete = function()
//{
    //console.log("SlidesApp.onAnimationComplete complete.");
//}


/*
 * update - Called for every render tick propgates to the
 * Sim.Object which iterates over every object currently set
 * in the scene.
 * 
 * @calls - Sim.App.update()
 */
SlidesApp.prototype.update = function()
{
    Sim.App.prototype.update.call(this);
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
    this.animating = false; // is the slide currently running an animation?
    this.reloaded = false;  // has the slide been reloaded (via previousSlide)?

    // Default camera positions. Modify values in the setCamera method
    this.camera_pos = new Object();
    this.camera_pos.x = 0;
    this.camera_pos.y = 0;
    this.camera_pos.z = 3.3333;

    this.materials = [];
    this.root = new THREE.Object3D();
}

SimpleSlide.prototype.loadResources = function()
{
    // use this method to load individual resources.
}
/*
 * go - Called by our app container during nextSlide. Sets the object3d visible if 
 * we were 'reloaded'. Resets animations back to their beginning. Also sets up
 * subscribers to notify the container app if it needs to go to the previous slide
 * or the next slide. Previous slides are called if the user hits the left arrow
 * and we are currently at the beginning of our animation queue. Likewise,
 * next slide is called when we are at the end of our animation queue.
 *
 * @calls - nextAnimation to kick off the first animation.
 *
 */ 
SimpleSlide.prototype.go = function()
{
    this.setCamera();
    if (this.object3D != null)
    {
        this.object3D.visible = true;
    }
    console.log("go called.");
    this.animations.reset();
    // Register subscribers to our 'app'
    //this.subscribe("slide_next", this.app, this.app.slideComplete);
    //this.subscribe("slide_previous", this.app, this.app.previousSlide);
    g_publisher.subscribe("slide_next", this.app, this.app.slideComplete);
    g_publisher.subscribe("slide_previous", this.app, this.app.previousSlide);
    this.nextAnimation();
}

/*
 * done - Called by our container app signaling that it should set it's
 * objects to being invisible and unregister it's subsribers. Also resets
 * the camera position (although this shouldn't really be necessary).
 */
SimpleSlide.prototype.done = function()
{
    console.log("done called");
    this.root.visible = false;
    this.app.objects = [];
    this.app.reset();

    // delete old references.
    //this.object3D = null;
    this.root = null;
    this.materials = null;
    this.animations = null;
    this.unsubscribeListeners();
    this.setCamera();
}

/*
 * create2dText - Creates text by creating a 2d canvas and maps it as a Texture.
 * TODO: Add parameters so callers can modify text color/size etc.
 */
SimpleSlide.prototype.create2dText = function(the_text, size, width, height, align)
{

    var size = size || 50;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = width || 350;
    var height = height || 150;
    var align = align || 'center';
    canvas.width = width;
    canvas.height = height;
    context.font = size+'pt Calibri';
    context.textAlign = align;
    context.fillStyle = 'white';
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    console.log("x: " + x + " y: " + y);
    context.fillText(the_text, x, y);
    var text_texture = new THREE.Texture(canvas);
    text_texture.needsUpdate = true;
      
    var material = new THREE.MeshBasicMaterial( {map: text_texture, side:THREE.DoubleSide } );
    material.transparent = true;
    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas.width/2, canvas.height/2), material);
    

    return mesh;
}
SimpleSlide.prototype.createWireframeFloor = function(color)
{
    var color = color || 0xffffff
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { color: color, transparent: true } );
    var size = 1000, step = 100;
    for ( var i = - size; i <= size; i += step ) {

        geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

        geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

    }
    this.materials.push(material);
    var line = new THREE.Line( geometry, material, THREE.LinePieces );
    return line;
}
SimpleSlide.prototype.createDottedFloor = function(coords, color, texture)
{
    var coords = coords || [4000,4000,10,10];
    var color = color || 0xD8D8D8;
    var texture = texture || THREE.ImageUtils.loadTexture('resources/disc.png');
    var plane = new THREE.PlaneGeometry(coords[0], coords[1], coords[2], coords[3]);
    var material = new THREE.ParticleBasicMaterial( { map: texture, size: 15, color: color} );
    var floor = new THREE.ParticleSystem(plane, material);
    floor.rotation.x = -1.50;
    return floor;
}


/*
 * setCamera - Sets the camera position when a slide is first called. This is important 
 * as it allows each slide to set it's own camera position. The defaults are set in 
 * each slides init method. Each slide has the ability to override this method.
 *
 */
SimpleSlide.prototype.setCamera = function()
{
    this.app.camera.position.set(this.camera_pos.x, this.camera_pos.y, this.camera_pos.z);
}

/*
 * animate - Called for every animation when a user hits a key. If an animation *is* running
 * already, we stop it and publish the complete event.
 * @params animation - An animation (Sim.KeyFrameAnimator)
 * @params on - boolean if running or not. (this.animating).
 *
 * @calls animation.start() or stop()
 *
 */
SimpleSlide.prototype.animate = function(animation, on)
{
    console.log("animation running " + on);
    ( on ) ? animation.start() : animation.stop(); 
}

/*
 * onAnimateComplete - Called when an animation completes. Reset's our is animating flag.
 * We have to get a reference to the animation that just completed to unsubscribe it's
 * complete message handler. 
 *
 * @calls publish("next_slide")
 *
 */
SimpleSlide.prototype.onAnimationComplete = function()
{
    console.log("===================================== onAnimationComplete hit");
    this.animating = !this.animating; // reset our animation flag to false.
    if (this.animations == null)
        return;
    var animation = this.animations.current();
    // really irritating, "complete" must be set in animations context, due to the animation calling publish("complete")
    // but 'this' has to be set to our Slide.
    //this.unsubscribe.call(animation, "complete", this);
    g_publisher.unsubscribe("complete", this);
    //console.log(this.name + ".onAnimationComplete complete index: " + this.animations.getIndex());
    
    if (this.animations.isEnd())
    {
        console.log("all animations complete:" + this.name);
        console.log("-------------------------------------------------------> PUBLISH SLIDE NEXT");
        //this.publish("slide_next");
        g_publisher.publish("slide_next");
    }  
}

/*
 * nextAnimation - Called on start of slide or when a user hits the right arrow key.
 * Subscribes to the complete message so we can be signaled when the animation completes.
 * Then simply starts the animation.
 *
 *
 * @calls - runAnimation
 */
SimpleSlide.prototype.nextAnimation = function()
{
    console.log("nextAnimation index: " + this.animations.getIndex());
    var animation = this.animations.next();

    g_publisher.subscribe("complete", this, this.onAnimationComplete);
    this.runAnimation(animation);
}

/*
 * runAnimation - Called with an animation and sets the flag to animating.
 * 
 * @param animation - a Sim.KeyFrameAnimation
 *
 * @calls - this.animate
 */
SimpleSlide.prototype.runAnimation = function(animation)
{
    console.log("Running runAnimation for " + this.name + " animation.name = " + animation.name);
    this.animating = true; // set animating to true.
    this.animate(animation, this.animating);
}

/*
 * handleKeyDown - called on key down event, propgated up from our
 * container app. Here is where we determine if we need to go to the next
 * animation, or next slide. Or previous animation or previous slide.
 *
 */
SimpleSlide.prototype.handleKeyDown = function(keyCode, charCode)
{
    console.log("IN HANDLEKEYDOWN ANIMATING? " + this.animating);
    switch(keyCode)
    {
        case Sim.KeyCodes.KEY_LEFT:
            
            if (this.animating == false)
            {
                //this.publish("slide_previous");
                g_publisher.publish("slide_previous");
            }
            else
            {
                // stop current animation.
                //this.animate(this.animations.current(), this.animating);
                //g_publisher.publish("slide_previous");
            }
            break;
        case Sim.KeyCodes.KEY_RIGHT:
            if (this.animations.isEnd())
            {
                if (this.animating == false)
                {
                    //this.publish("slide_next");
                    g_publisher.publish("slide_next");
                }
                else
                {
                    console.log("ANIMATING BUT GO TO NEXT?");
                    //this.animate(this.animations.current(), this.animating);
                }
            }
            else
            {
                //if (this.animating == true)
                //{
                //    this.animate(this.animations.current(), this.animating);
                //}
                console.log("this.animating is..." + this.animating);
                if (this.animating == false)
                {
                    this.nextAnimation();
                }
            }
            break;
    }
}

/*
 * subscribeListeners - Subscribes so we can publish the slide next
 * and previous messages.
 *
 */
SimpleSlide.prototype.subscribeListeners = function()
{
    g_publisher.subscribe("slide_previous", this, this.previousSlide);
    g_publisher.subscribe("slide_next", this, this.nextSlide);
}

/*
 * unsubscribeListeners - unsubscribes so we we don't mess up
 * our various slide state by listening for messages for a slide
 * we are not on.
 *
 */
SimpleSlide.prototype.unsubscribeListeners = function()
{
    g_publisher.unsubscribe("slide_previous", this);
    g_publisher.unsubscribe("slide_next", this);
}


SimpleSlide.prototype.previousSlide = function()
{
    //console.log("SimpleSlide.previousSlide publish");
    this.object3D.visibility = false;
}

SimpleSlide.prototype.nextSlide = function()
{
    //console.log("SimpleSlide.nextSlide publish");
    //this.publish("slide_next");
}




