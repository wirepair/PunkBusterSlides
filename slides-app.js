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
    var idx = index-1;
    console.log("Going to " + idx);
    var slide;
    if (this.slides.current() != null)
    {
        var current = this.slides.current();
        current.done();
        this.removeObject(current);
    }
    slide = this.slides.get(idx); // update index
    console.log("==============================" + slide.name);
    slide.init(this);
    this.addObject(slide);
    slide.go();
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
 * go - Called by our app container during nextSlide. Sets the object3d to visible. 
 * Resets animations back to their beginning. Also sets up subscribers
 * to notify the container app if it needs to go to the previous slide
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
    // need to reset the camera in the event a slide modified it's lookAt (see PrespectiveSlide)
    this.app.camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 10000 );
    // delete old references.
    this.root = null;
    this.materials = null;
    this.animations = null;
    this.unsubscribeListeners();
    this.setCamera();
}

/*
 * create2dText - Creates text by creating a 2d canvas and maps it as a Texture.
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
/*
 * Create's a TRONish wireframe floor.
 * @param color - RBG color value, default is white.
 */
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
/*
 * createDottedFloor - Creates a plane and maps a particle system to each vertex
 * of the geometry.
 *
 * @param color - The color to map to the texture
 * @param coords - An array of 4 values width/height, segmentsWidth, segmentsHeight
 * more segments == more particles.
 * @param texture - the texture to use for the particles, default is a disc. 
 *
 * @returns the floor particle system.
 */
SimpleSlide.prototype.createDottedFloor = function(color, coords, texture)
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

SimpleSlide.prototype.initFadeAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.materials),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    animatorIn.name = "animatorIn";
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.init({ 
        interps: ObjectEffects.prototype.fadeOut(this.materials),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    animatorOut.name = "animatorOut";
    this.animations.push(animatorOut);
}

SimpleSlide.prototype.initFloorAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "floorAnimatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.moveFloorIn(this.object3D),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "floorAnimatorOut";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.moveFloorOut(this.object3D),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
}

SimpleSlide.prototype.moveMeshDown = function(mesh)
{
    var down = new Sim.KeyFrameAnimator;
    down.name = "moveDownAnimation";
    var m = mesh.position;
    var mr = mesh.rotation;
    var keys = [0, .25, 1];
    var position_values = [
        { x: m.x, y: m.y-500, z: m.z}, 
        { x: m.x, y: m.y-1000, z: m.z},
        { x: m.x, y: m.y-1850, z: m.z}
    ];
    
    var interps = [{keys: keys, values: position_values, target: mesh.position}];
    down.init({
        interps: interps,
        loop: false,
        duration: 500
    });
    return down;
}

SimpleSlide.prototype.moveMeshSide = function(mesh, z, rotate)
{
    var side = new Sim.KeyFrameAnimator;
    side.name = "moveSideAnimation";
    var m = mesh.position;
    var mr = mesh.rotation;
    var keys = [0, .25, 1];
    var position_values = [
        { x: 0,     y: 150, z: 0}, 
        { x: -150, y: 150, z: -50},
        { x: -300, y: 150, z: z}
    ];

    var opacity_values = [
        { opacity: 1},
        {opacity: 0.9},
        {opacity: 0.7}
    ];

    var interps = [
        {keys: keys, values: position_values, target: mesh.position},
        {keys: keys, values: opacity_values, target: mesh.material}
    ];

    if (rotate)
    {
        var rotation_values = [
            { x: 0, y: 0, z: 0}, 
            { x: 0, y: 0.05, z: 0.05},
            { x: 0, y: 0.1, z: 0.10}
        ];
        interps.push({keys: keys, values: rotation_values, target: mesh.rotation});

    }

    side.init({
        interps: interps,
        loop: false,
        duration: 500
    });
    return side;
}

SimpleSlide.prototype.moveMeshRightSide = function(mesh, z, rotate)
{
    var side = new Sim.KeyFrameAnimator;
    side.name = "moveSideAnimation";
    var m = mesh.position;
    var mr = mesh.rotation;
    var keys = [0, .25, 1];
    var position_values = [
        { x: 0,     y: 150, z: 0}, 
        { x: 150, y: 150, z: -50},
        { x: 300, y: 150, z: z}
    ];
    
    var opacity_values = [
        {opacity: 1},
        {opacity: 0.9},
        {opacity: 0.7}
    ];
    var interps = [
        {keys: keys, values: position_values, target: mesh.position},
        {keys: keys, values: opacity_values, target: mesh.material}
    ];

    if (rotate)
    {
        var rotation_values = [
            { x: 0, y: 0, z: 0}, 
            { x: 0, y: 0, z: -0.05},
            { x: -0.2, y: -0.2, z: -0.2}
        ];
        interps.push({keys: keys, values: rotation_values, target: mesh.rotation});
    }


    side.init({
        interps: interps,
        loop: false,
        duration: 500
    });
    return side;
}


SimpleSlide.prototype.moveMeshBack = function(mesh, z)
{
    var back = new Sim.KeyFrameAnimator;
    back.name = "moveSideAnimation";
    var m = mesh.position;

    var keys = [0, .25, 1];
    var position_values = [
        { x: 0, y: 150, z: -5}, 
        { x: 0, y: 150, z: -20},
        { x: 0, y: 150, z: -40}
    ];

    var opacity_values = [
        { opacity: 1},
        {opacity: 0.7},
        {opacity: 0.5}
    ];
    var interps = [
        {keys: keys, values: position_values, target: mesh.position},
        {keys: keys, values: opacity_values, target: mesh.material}
    ];
    back.init({
        interps: interps,
        loop: false,
        duration: 500
    });
    return back;
}
/*
 * animate - Called for every animation when a user hits a key. If an animation *is* running
 * already, we stop it and publish the complete event.
 * @params animation - An animation (Sim.Animator or it's subclasses.)
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
 * onAnimateComplete - Called when an animation completes. Resets our is animating flag.
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
    g_publisher.unsubscribe("complete", this);
    
    if (this.animations.isEnd())
    {
        console.log("all animations complete:" + this.name);
        console.log("-------------------------------------------------------> PUBLISH SLIDE NEXT");
        g_publisher.publish("slide_next");
    }  
}

/*
 * nextAnimation - Called on start of slide or when a user hits the right arrow key.
 * Subscribes to the complete message so we can be signaled when the animation completes.
 * Then starts the animation.
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
                // BREAKS STUFF SO DISABLED FOR NOW.
                //this.animate(this.animations.current(), this.animating);
                //g_publisher.publish("slide_previous");
            }
            break;
        case Sim.KeyCodes.KEY_RIGHT:
            if (this.animations.isEnd())
            {
                if (this.animating == false)
                {
                    g_publisher.publish("slide_next");
                }
            }
            else
            {
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
    this.object3D.visibility = false;
}

SimpleSlide.prototype.nextSlide = function()
{
}




