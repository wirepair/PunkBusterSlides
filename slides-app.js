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
        var slide = this.slides.next()
        slide.init(this);
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
        //console.log("We are at the end of the slides!");
        return;
    } 

    if (this.slides.current() != null)
    {
        var current = this.slides.current();
        current.done();
        this.removeObject(current);
    }
    slide = this.slides.next();
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
 * Then we get a reference to the previous slide, re-add it and call
 * the slides reloadSlide method which helps reset our animations etc.
 *
 * @calls - slide.reloadSlide()
 */
SlidesApp.prototype.previousSlide = function()
{
    console.log("SlidesApp.previousSlide");
    if ( this.slides.isBeginning() )
    {
        //console.log("Already at beginning of slides!");
        return;
    }
    var slide = this.slides.current();
    slide.done();
    this.removeObject(slide);

    // go to the previous slide.
    //console.log("GOING TO PREVIOUS SLIDE!");
    slide = this.slides.prev();
    this.addObject(slide);

    slide.reloadSlide();
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

/* VARIOUS EFFECTS FOR OBJECTS */
ObjectEffects = function()
{

}
ObjectEffects.prototype = new Object();

/*
 * rotateIn - rotates the object (either root or single object) by
 * setting keys and values to be interpolated from a negative z incrementally to a positive
 * z axis.
 *
 */
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


/*
 * rotateIn - rotates the object (either root or single object) by
 * setting keys and values to be interpolated from a positive z incrementally to a negative
 * z axis.
 *
 */
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

/*
 * moveFloorIn - moves the object (either root or single object) by
 * setting keys and values to be interpolated from a negative z incrementally to a positive
 * z axis.
 *
 */
ObjectEffects.prototype.moveFloorIn = function(object3D)
{
    var inPositionKeys = [0, .25, .75, 1];
    var inPositionValues = [ { x : 0, y: 0, z : -10000}, 
                            { x: 0, y: 0, z: -750},
                            { x: 0, y: 0, z: -500},
                            { x : 0, y: -1, z : 0}
                            ];
    return [ 
            { keys:inPositionKeys, values:inPositionValues, target:object3D.position }
            ];
}

/*
 * moveFloorOut - moves the object (either root or single object) by
 * setting keys and values to be interpolated from a positive z incrementally to a negative
 * z axis.
 *
 */
ObjectEffects.prototype.moveFloorOut = function(object3D)
{
    var outPositionKeys = [0, .25, .75, 1];
    var outPositionValues = [ { x : 0, y: -1, z : 0}, 
                            { x: 0, y: 0, z: -250},
                            { x: 0, y: 0, z: -750},
                            { x : 0, y: 0, z : -10000}
                            ];
    return [ 
            { keys:outPositionKeys, values:outPositionValues, target:object3D.position }
            ];
}

/*
 * fadeIn - Set's an array of materials opacity level from 0 (transparent) to 1.
 * 
 */
ObjectEffects.prototype.fadeIn = function( materials )
{
    return [{ 
                keys:[0, .5, 1], 
                values:[ { opacity: 0},
                         { opacity: 0.5},
                         { opacity: 1} 
                         ],
                target: materials
                }];
}

/*
 * fadeOut - Set's an array of materials opacity level from 1 (visible) to 0 (transparent).
 * 
 */
ObjectEffects.prototype.fadeOut = function( materials )
{
    return [{ 
                keys:[0, .5, 1], 
                values:[ { opacity: 1},
                         { opacity: 0.5},
                         { opacity: 0} 
                         ],
                target: materials
                }];
}

/*
 * transform - Badly named, wrong location animation sequence using TWEEN.
 * 
 */
ObjectEffects.prototype.transform = function( targets, duration, objects, render_callback )
{
    TWEEN.removeAll();

    for ( var i = 0; i < objects.length; i ++ ) 
    {

        var object = objects[ i ];
        var target = targets[ i ];

        new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

        new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut )
            .start();

    }

    /*
    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render_callback )
        .start();
        */
}
/*
 * glowEffectMaterial - Uses a custom shader to make a glowing effect. Requires the camera
 * Not sure why...
 *
 */
ObjectEffects.prototype.glowEffectMaterial = function (camera)
{
    var customMaterial = new THREE.ShaderMaterial( 
    {
        uniforms: 
        { 
            "c":   { type: "f", value: 1.0 },
            "p":   { type: "f", value: 1.4 },
            glowColor: { type: "c", value: new THREE.Color(0xffff00) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader:   document.getElementById( 'glowvertexShader'   ).textContent,
        fragmentShader: document.getElementById( 'glowfragmentShader' ).textContent,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    return customMaterial
}


ObjectEffects.prototype.rotateAroundObjectAxis = function(object, axis, radians) {
    // new code for Three.js r50+
    object.matrix.makeRotationZ(radians);

    // old code for Three.js r49 and earlier:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
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
    this.object3D.visible = false;
    this.unsubscribeListeners();
    this.setCamera();
}

/*
 * create2dText - Creates text by creating a 2d canvas and maps it as a Texture.
 * TODO: Add parameters so callers can modify text color/size etc.
 */
SimpleSlide.prototype.create2dText = function(the_text, size)
{
    var size = size || 50;
    var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    context1.font = size + "px Arial";
    context1.fillStyle = "rgba(0,127,127," + ( Math.random() * 0.5 + 0.25 ) + ");";
    context1.fillText(the_text, 0, 50);
    
    // canvas contents will be used for a texture
    var text_texture = new THREE.Texture(canvas1) 
    text_texture.needsUpdate = true;
      
    var material = new THREE.MeshBasicMaterial( {map: text_texture, side:THREE.DoubleSide } );
    material.transparent = true;
    var mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas1.width, canvas1.height), material);
    mesh.rotation.x = -Math.PI / 20;
    return mesh;
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
    ( on ) ? animation.start() : animation.stop(); 
}

/*
 * onAnimateComplete - Called when an animation completes. Reset's our is animating flag.
 * We have to get a reference to the animation that just completed to unsubscribe it's
 * complete message handler. 
 *
 * We also do a check to see if we are at the end of the slide and we have not been
 * reloaded (via previousSlide call). In which case we call slide_next. If we are
 * reloaded we have to unset the reloaded flag so that we can continue to the next slide
 * if we want to.
 *
 * @calls publish("next_slide")
 *
 */
SimpleSlide.prototype.onAnimationComplete = function()
{
    this.animating = !this.animating; // reset our animation flag to false.
    var animation = this.animations.current();
    // really irritating, "complete" must be set in animations context, due to the animation calling publish("complete")
    // but 'this' has to be set to our Slide.
    //this.unsubscribe.call(animation, "complete", this);
    g_publisher.unsubscribe("complete", this);
    //console.log(this.name + ".onAnimationComplete complete index: " + this.animations.getIndex());
    
    if (this.animations.isEnd() && this.reloaded == false)
    {
        //console.log("all animations complete:" + this.name);
        //console.log("-------------------------------------------------------> PUBLISH SLIDE NEXT");
        //this.publish("slide_next");
        g_publisher.publish("slide_next");
    }

    if (this.reloaded == true)
    {
        //console.log("Resetting reloaded flag.");
        this.reloaded = false;
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
    //console.log("nextAnimation index: " + this.animations.getIndex());
    var animation = this.animations.next();

    //this.subscribe.call(animation, "complete", this, this.onAnimationComplete);
    g_publisher.subscribe("complete", this, this.onAnimationComplete);
    this.runAnimation(animation);
}

/* 
 * previousAnimation - Get a reference to the previous animation and subscribe to the
 * complete message. Then runs the animation. This is called when the user hits the
 * left arrow key.
 *
 * @calls runAnimation 
 */
SimpleSlide.prototype.previousAnimation = function()
{
    var animation = this.animations.prev();
    //console.log("PREVIOUS ANIMATION CALLED!");

    //this.subscribe.call(animation, "complete", this, this.onAnimationComplete);
    g_publisher.subscribe(animation, "complete", this, this.onAnomationComplete);
    console.log("previousAnimation index: " + this.animations.getIndex());
    this.runAnimation(animation);
    
}

/*
 * reloadSlide - Called by container app when the user hits the left arrow key
 * to signify they want to return to the preious slide. Sets the reloaded flag
 * to true so once the animation completes we don't automatically go to the next
 * slide.
 *
 * @calls - previousAnimation();
 *
 */
SimpleSlide.prototype.reloadSlide = function()
{
    this.reloaded = true;
    this.setCamera();
    this.previousAnimation();
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
    this.animating = !this.animating; // set animating to true.
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
    switch(keyCode)
    {
        case Sim.KeyCodes.KEY_LEFT:
            if (this.animations.isBeginning())
            {
                if (this.animating == false)
                {
                    //this.publish("slide_previous");
                    g_publisher.publish("slide_previous");
                }
            } 
            else
            {
                if (this.animating == true)
                {
                    this.animate(this.animations.current(), this.animating);
                }
                this.previousAnimation();
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
            }
            else
            {
                if (this.animating == true)
                {
                    this.animate(this.animations.current(), this.animating);
                }
                this.nextAnimation();
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
    //this.subscribe("slide_previous", this, this.previousSlide);
    //this.subscribe("slide_next", this, this.nextSlide);
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

    //this.unsubscribe("slide_previous", this);
    //this.unsubscribe("slide_next", this);
    g_publisher.unsubscribe("slide_previous", this);
    g_publisher.unsubcribe("slide_next", this);
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




