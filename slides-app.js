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
        slide.init(this);
    } while ( this.slides.peek()  != null)
    this.slides.reset();
    this.nextSlide();
}

SlidesApp.prototype.slideComplete = function()
{
    //console.log("SlidesApp.slideComplete SLIDE COMPLETETETLTELTELTEL");
    this.nextSlide();
}
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
    //slide.object3D.visible = true;
    // reset our camera if the slide changed it.
    this.addObject(slide);
    //slide.subscribe("slide_next", this, this.slideComplete);
    //slide.subscribe("slide_previous", this. this.previousSlide);
    slide.go();

    //slide.nextAnimation();
}

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
    //slide.object3D.visible = false;
    //slide.unsubscribeListeners();
    //slide.animations.reset(); // reset our animations since we are done with this slide for now.
    this.removeObject(slide);

    // go to the previous slide.
    //console.log("GOING TO PREVIOUS SLIDE!");
    slide = this.slides.prev();
    // reset our camera if the slide changed it.
    
    //this.resetCamera();
    //slide.object3D.visible = true;
    this.addObject(slide);
    
    // re-subscribe our listeners.
    //slide.subscribeListeners();
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
    //console.log("SlidesApp.onAnimationComplete complete.");
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

    new TWEEN.Tween( this )
        .to( {}, duration * 2 )
        .onUpdate( render_callback )
        .start();
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
    // Default camera positions. Modify values in the setCamera method
    this.camera_pos = new Object();
    this.camera_pos.x = 0;
    this.camera_pos.y = 0;
    this.camera_pos.z = 3.3333;
}

// Called by our app
SimpleSlide.prototype.go = function()
{
    if (this.object3D != null)
    {
        this.object3D.visible = true;
    }
    this.setCamera();
    // Register subscribers to our 'app'
    this.subscribe("slide_next", this.app, this.app.slideComplete);
    this.subscribe("slide_previous", this.app, this.app.previousSlide);
    this.nextAnimation();
}

// Called by our app
SimpleSlide.prototype.done = function()
{
    this.object3D.visible = false;
    this.unsubscribeListeners();
    this.animations.reset(); // reset our animations since we are done with this slide for now.
}

SimpleSlide.prototype.create3dText = function(the_text, params)
{
    params = params || {};
    shapes = THREE.FontUtils.generateShapes( "Hello world", {
    font: "optimer",
    weight: "bold",
    size: 10
    } );
    geom = new THREE.ShapeGeometry( shapes );
    mat = new THREE.MeshBasicMaterial();
    mesh = new THREE.Mesh( geom, mat );


    mesh.rotation.x = -Math.PI / 20;
    return mesh;
}
// The default, each slide can override.
SimpleSlide.prototype.setCamera = function()
{
    this.app.camera.x = this.camera_pos.x;
    this.app.camera.y = this.camera_pos.y;
    this.app.camera_z = this.camera_pos.z;
}
SimpleSlide.prototype.createText = function(the_text, params)
{
    var element = document.createElement( 'div' );
    element.style.cssText = "font-size: 160px; color: rgba(255,255,255,0.5); width: 150; height:150; box-shadow: 0px 0px 12px rgba(0,255,255,0.5); border: 1px solid rgba(127,255,255,0.25);text-align: center; background-color: rgba(0,127,127," + ( Math.random() * 0.5 + 0.25 ) + ");";
    element.innerHTML = the_text;
    element.style.display = "block";
    element.style.position = "absolute";
    //element.style.left = 150 + 'px';
    //element.style.top = 150 + 'px';
    //document.body.appendChild(element);
    var object = new THREE.CSS3DObject( element );
    
    object.position.x = Math.random() * 6 - 2;
    object.position.y = Math.random() * 6 - 2;
    object.position.z = Math.random() * 6 - 2;
    return object;
}

SimpleSlide.prototype.animate = function(animation, on)
{
    //console.log("animate: " + on);
    ( on ) ? animation.start() : animation.stop(); 
}
SimpleSlide.prototype.onAnimationComplete = function()
{
    this.animating = !this.animating; // reset our animation flag to false.
    var animation = this.animations.current();
    // really irritating, "complete" must be set in animations context, due to the animation calling publish("complete")
    // but 'this' has to be set to our Slide.
    this.unsubscribe.call(animation, "complete", this);
    //console.log(this.name + ".onAnimationComplete complete index: " + this.animations.getIndex());
    
    if (this.animations.isEnd() && this.reloaded == false)
    {
        //console.log("all animations complete:" + this.name);
        //console.log("-------------------------------------------------------> PUBLISH SLIDE NEXT");
        this.publish("slide_next");
    }

    if (this.reloaded == true)
    {
        //console.log("Resetting reloaded flag.");
        this.reloaded = false;
    }
    
}
/*
 * Increment our animation counter and call runAnimation
 */
SimpleSlide.prototype.nextAnimation = function()
{
    //console.log("nextAnimation index: " + this.animations.getIndex());
    var animation = this.animations.next();

    this.subscribe.call(animation, "complete", this, this.onAnimationComplete);
    this.runAnimation(animation);
}
/* 
 * Run the previous animation.
 */
SimpleSlide.prototype.previousAnimation = function()
{
    var animation = this.animations.prev();
    //console.log("PREVIOUS ANIMATION CALLED!");

    this.subscribe.call(animation, "complete", this, this.onAnimationComplete);
    //console.log("previousAnimation index: " + this.animations.getIndex());
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
    switch(keyCode)
    {
        case Sim.KeyCodes.KEY_LEFT:
            if (this.animations.isBeginning())
            {
                if (this.animating == false)
                {
                    this.publish("slide_previous");
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
                    this.publish("slide_next");
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
    //console.log("SimpleSlide.previousSlide publish");
    this.object3D.visibility = false;
}

SimpleSlide.prototype.nextSlide = function()
{
    //console.log("SimpleSlide.nextSlide publish");
    //this.publish("slide_next");
}




