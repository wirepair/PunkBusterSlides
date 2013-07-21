// Global container for slides.
var slides = [];


// SLIDE #1
IntroSlide = function()
{
    this.name = "IntroSlide";
	SimpleSlide.call(this);
}

IntroSlide.prototype = new SimpleSlide();

IntroSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    this.root = new THREE.Object3D();
    var mohawk = "resources/isaac.mohawk.png";
    var geometry = new THREE.PlaneGeometry(3.337, 3);
    var texture = THREE.ImageUtils.loadTexture(mohawk);

    this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true } );
    var mesh = new THREE.Mesh( geometry, this.material ); 
    this.root.add(mesh);
    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
    //this.runAnimation(); // kick off first animation.
}

IntroSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    console.log(this.object3D);
    animatorIn.init({ 
        interps: ObjectEffects.prototype.rotateIn(this.object3D),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    animatorIn.name = "animatorIn";
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.init({ 
        interps: ObjectEffects.prototype.rotateOut(this.object3D),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    animatorOut.name = "animatorOut";
    this.animations.push(animatorOut);
    //animatorOut.subscribe("complete", this, this.onAnimationComplete);
}
slides.push(new IntroSlide());



// SLIDE #2
SecondSlide = function()
{
    this.name = "SecondSlide";
    SimpleSlide.call(this);
}

SecondSlide.prototype = new SimpleSlide();

SecondSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.root = new THREE.Object3D();
    this.root.position.z = -100;
    this.engine = new ParticleEngine(this.root);
    this.createParticles();
    this.clock = new THREE.Clock();
    var seppuku = "resources/seppuku.jpg";
    var s_geometry = new THREE.PlaneGeometry(1, 1.5);
    var s_texture = THREE.ImageUtils.loadTexture(seppuku);
    var s_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: s_texture } );
    var s_mesh = new THREE.Mesh( s_geometry, s_material ); 
    s_mesh.position.y = 0.98;
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial( { color: 0xffffff, transparent: false } );
    var size = 8, step = 1;
    for ( var i = - size; i <= size; i += step ) {

        geometry.vertices.push( new THREE.Vector3( - size, - 0.04, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, - 0.04, i ) );

        geometry.vertices.push( new THREE.Vector3( i, - 0.04, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, - 0.04,   size ) );

    }

    var line = new THREE.Line( geometry, material, THREE.LinePieces );
    
    this.root.add(s_mesh);
    //line.position.y = -1;
    
    this.root.add(line);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

SecondSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "animatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.moveFloorIn(this.object3D),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "animatorIn";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.moveFloorOut(this.object3D),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
}

SecondSlide.prototype.createParticles = function()
{
     var particles = {
        positionStyle    : Type.CUBE,
        positionBase     : new THREE.Vector3( 0, 200, 0 ),
        positionSpread   : new THREE.Vector3( 500, 0, 500 ),
        
        velocityStyle    : Type.CUBE,
        velocityBase     : new THREE.Vector3( 0, -60, 0 ),
        velocitySpread   : new THREE.Vector3( 50, 20, 50 ), 
        accelerationBase : new THREE.Vector3( 0, -10,0 ),
        
        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       :  0,
        angleVelocitySpread     : 60,
        
        particleTexture : THREE.ImageUtils.loadTexture( 'resources/cherry.jpg' ),
            
        sizeTween    : new Tween( [0, 0.25], [1, 10] ),
        colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
        opacityTween : new Tween( [2, 3], [0.8, 0] ),

        particlesPerSecond : 200,
        particleDeathAge   : 4.0,       
        emitterDeathAge    : 60
    };
    
    this.engine.setValues( particles );
    this.engine.initialize();
}
SecondSlide.prototype.reloadSlide = function()
{
    this.engine.destroy();
    this.engine = new ParticleEngine(this.root);
    this.createParticles();
    SimpleSlide.prototype.reloadSlide.call(this);
}
SecondSlide.prototype.update = function()
{
    var dt = this.clock.getDelta();
    this.engine.update( dt * 0.5 );  
    Sim.Object.prototype.update.call(this);
}
slides.push(new SecondSlide());


// SLIDE #2
ThirdSlide = function()
{
    this.name = "ThirdSlide";
    SimpleSlide.call(this);
}

ThirdSlide.prototype = new SimpleSlide();

ThirdSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.game_images = [
        "aa.jpg", 1, 1,
        "acr.jpg", 1, 2,
        "ac3.png", 3, 3,
        "apb.png", 1, 4,
        "bf2.jpg", 1, 5,
        "bf3.png", 1, 6,
        "bf2142.jpg", 1, 7,
        "bfbc2.png", 1, 8,
        "bfp4f.png", 1, 9,
        "bfv.jpg", 1, 10,
        "blr.png", 1, 11,
        "cod.jpg", 2, 3,
        "cod2.jpg", 13, 3,
        "cod4.jpg", 14, 3,
        "fc3.png", 15, 3,
        "fearpm.jpg", 16, 3,
        "grfs.png", 17, 3,
        "gro.png", 18, 3,
        "heroes.gif", 1, 4,
        "hos.jpg", 2, 4,
        "moh.png", 3, 4,
        "mohwf.jpg", 4, 4,
        "unco.jpg", 5, 4,
        "waw.png", 6, 4
    ];

    this.root = new THREE.Object3D();
    this.targets = {table: [], sphere: []};
    this.image_objects = [];
    for ( var i = 0; i < this.game_images.length; i += 3 )
    {
        var geometry = new THREE.PlaneGeometry(3, 3);
        var texture = THREE.ImageUtils.loadTexture("resources/titles/"+this.game_images[i]);
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true});
        //var mesh = new THREE.Mesh( geometry, material );
        var object = new THREE.Mesh( geometry, material );
        object.position.x = Math.random() * 6 - 2;
        object.position.y = Math.random() * 6 - 2;
        object.position.z = Math.random() * 6 - 2;
        this.root.add(object);
        this.image_objects.push(object);

        var object = new THREE.Object3D();
        object.position.x = ( this.game_images[ i + 1 ] * 4 ) ;//- 1330 ;
        object.position.y = - ( this.game_images[ i + 2 ] * 5 );// + 990 ;
        this.targets.table.push( object );
    }

    // Sphere.
    var vector = new THREE.Vector3();
    for ( var i = 0, l = this.image_objects.length; i < l; i++) 
    {
        var phi = Math.acos( -1 + ( 2 * i ) / l );
        var theta = Math.sqrt( l * Math.PI ) * phi;

        var object = new THREE.Object3D();

        object.position.x = 10 * Math.cos( theta ) * Math.sin( phi );
        object.position.y = 10 * Math.sin( theta ) * Math.sin( phi );
        object.position.z = 10 * Math.cos( phi );

        vector.copy( object.position ).multiplyScalar( 2 );

        object.lookAt( vector );
        this.targets.sphere.push( object );

    }
    this.root.position.z = -30;
    this.setObject3D(this.root);
    this.initAnimations();
}

ThirdSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "animatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.object3D),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "animatorOut";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.fadeOut(this.object3D),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
    //animatorOut.subscribe("complete", this, this.onAnimationComplete);
}

ThirdSlide.prototype.onAnimationComplete = function()
{
    this.animating = !this.animating; // reset our animation flag to false.
    var animation = this.animations.current();
    // really irritating, "complete" must be set in animations context, due to the animation calling publish("complete")
    // but 'this' has to be set to our Slide.
    this.unsubscribe.call(animation, "complete", this);
    //console.log(this.name + ".onAnimationComplete complete index: " + this.animations.getIndex());
    if (this.animations.isBeginning())
    {
        //this.app.camera.position.z = 30;
        ObjectEffects.prototype.transform( this.targets.sphere, 2000, this.image_objects, this.tweenRender );
    }
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

ThirdSlide.prototype.tweenRender = function ()
{
    //this.app.renderer.render( this.app.scene, this.app.camera );
}

ThirdSlide.prototype.update = function ()
{
    TWEEN.update();
    this.root.rotation.x -= 0.01
    this.root.rotation.y -= 0.001
    Sim.Object.prototype.update.call(this);
}
slides.push(new ThirdSlide());
