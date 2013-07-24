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
}
//slides.push(new IntroSlide());



// SLIDE #2
MyBioSlide = function()
{
    this.name = "MyBioSlide";
    SimpleSlide.call(this);
}

MyBioSlide.prototype = new SimpleSlide();

MyBioSlide.prototype.init = function(App)
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

MyBioSlide.prototype.initAnimations = function()
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

MyBioSlide.prototype.createParticles = function()
{
     var particles = {
        positionStyle    : Type.CUBE,
        positionBase     : new THREE.Vector3( 0, 100, this.root.position.z ),
        positionSpread   : new THREE.Vector3( 500, 0, 150 ),
        
        velocityStyle    : Type.CUBE,
        velocityBase     : new THREE.Vector3( 0, -60, 0 ),
        velocitySpread   : new THREE.Vector3( 50, 20, 50 ), 
        accelerationBase : new THREE.Vector3( 0, -10,0 ),
        
        angleBase               : 0,
        angleSpread             : 720,
        angleVelocityBase       :  0,
        angleVelocitySpread     : 20,
        
        particleTexture : THREE.ImageUtils.loadTexture( 'resources/sakura6.png' ),
            
        sizeTween    : new Tween( [0, 0.25], [10, 15] ),
        colorBase   : new THREE.Vector3(0.66, 1.0, 0.9), // H,S,L
        opacityTween : new Tween( [2, 3], [0.8, 0] ),

        particlesPerSecond : 25,
        particleDeathAge   : 4.0,        
        emitterDeathAge    : 120
    };
    
    this.engine.setValues( particles );
    this.engine.initialize();
}
MyBioSlide.prototype.reloadSlide = function()
{
    this.engine.destroy();
    this.engine = new ParticleEngine(this.root);
    this.createParticles();
    SimpleSlide.prototype.reloadSlide.call(this);
}
MyBioSlide.prototype.update = function()
{
    var dt = this.clock.getDelta();
    this.engine.update( dt * 0.5 );  
    Sim.Object.prototype.update.call(this);
}
//slides.push(new MyBioSlide());


// SLIDE #3
PBGamesSlide = function()
{
    this.name = "PBGamesSlide";
    SimpleSlide.call(this);
}

PBGamesSlide.prototype = new SimpleSlide();

PBGamesSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 0;
    this.camera_pos.z = 30;

    this.game_images = [
        "aa.jpg", 1, 1,
        "acr.jpg", 1, 2,
        "ac3.png", 1, 3,
        "apb.png", 1, 4,
        "bf2.jpg", 1, 5,
        "bf3.png", 1, 6,
        "bf2142.jpg", 1, 7,
        "bfbc2.png", 1, 8,
        "bfp4f.png", 2, 1,
        "bfv.jpg", 2, 2,
        "blr.png", 2, 3,
        "cod.jpg", 2, 4,
        "cod2.jpg", 2, 5,
        "cod4.jpg", 2, 6,
        "fc3.png", 2, 7,
        "fearpm.jpg", 2, 8,
        "grfs.png", 3, 1,
        "gro.png", 3, 2,
        "heroes.gif", 3, 3,
        "hos.jpg", 3, 4,
        "moh.png", 3, 5,
        "mohwf.jpg", 3, 6,
        "unco.jpg", 3, 7,
        "waw.png", 3, 8
    ];

    this.root = new THREE.Object3D();
    this.targets = {table: [], sphere: []};
    this.image_objects = [];
    this.materials = [];
    for ( var i = 0; i < this.game_images.length; i += 3 )
    {
        var geometry = new THREE.PlaneGeometry(3, 3);
        var texture = THREE.ImageUtils.loadTexture("resources/titles/"+this.game_images[i]);
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, transparent: true, opacity: 0});
        this.materials.push(material);
        var object = new THREE.Mesh( geometry, material );
        object.position.x = Math.random() * 7 - 2;
        object.position.y = Math.random() * 5 - 2;
        object.position.z = Math.random() * 15 - 2;
        this.root.add(object);
        this.image_objects.push(object);

        var object = new THREE.Object3D();
        object.position.x = ( this.game_images[ i + 2 ] * 4 - 18) ;//- 1330 ; // row
        object.position.y = - ( this.game_images[ i + 1 ] * 6 - 13 );// + 990 ; // col
        this.targets.table.push( object );
    }

    // Sphere.
    /*
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
    */
    //this.root.position.z = -30;
    this.setObject3D(this.root);
    this.initAnimations();
}

PBGamesSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "animatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.materials),
        loop: false,
        duration: 2000
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "animatorOut";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.fadeOut(this.materials),
        loop: false,
        duration: 1000
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
}
PBGamesSlide.prototype.nextAnimation = function()
{
    // if we are reloaded our opacity will be reset.
    if (this.animations.isBeginning())
    {
        for (var i = 0; i < this.materials.length; i++)
        {
            this.materials[i].opacity = 0;
        }        
    }
    SimpleSlide.prototype.nextAnimation.call(this)
}

PBGamesSlide.prototype.onAnimationComplete = function()
{
    this.animating = !this.animating; // reset our animation flag to false.
    var animation = this.animations.current();
    // really irritating, "complete" must be set in animations context, due to the animation calling publish("complete")
    // but 'this' has to be set to our Slide.
    this.unsubscribe.call(animation, "complete", this);
    //console.log(this.name + ".onAnimationComplete complete index: " + this.animations.getIndex());
    if (this.animations.isBeginning())
    {
        ObjectEffects.prototype.transform( this.targets.table, 2000, this.image_objects, this.tweenRender );
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

PBGamesSlide.prototype.tweenRender = function ()
{
    //this.app.renderer.render( this.app.scene, this.app.camera );
}

PBGamesSlide.prototype.update = function ()
{
    TWEEN.update();
    Sim.Object.prototype.update.call(this);
}
//slides.push(new PBGamesSlide());



/* #4 Slide for PunkBuster Services */
PunkBusterServicesSlide = function()
{
    this.name = "PunkBusterServicesSlide";
    SimpleSlide.call(this);
}

PunkBusterServicesSlide.prototype = new SimpleSlide();

PunkBusterServicesSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.materials = [];
    this.root = new THREE.Object3D();
    // bfp4f    
    var texture = THREE.ImageUtils.loadTexture("resources/BattlefieldPlay4Free_box.jpg");
    var material = new THREE.MeshLambertMaterial( { color: 0x888888, map: texture, transparent: true, opacity: 0}); //
    this.materials.push(material);
    var geometry = new THREE.CubeGeometry(100,100,10);
    var bfp4f = new THREE.Mesh(geometry, material);
    bfp4f.position.set(250,220,5);
    bfp4f.rotation.y =  Math.PI*1.68;
    bfp4f.rotation.x = -0.01;

    // Note that the mesh is flagged to cast shadows
    bfp4f.castShadow = true;
    this.root.add(bfp4f);
    
    this.app.renderer.shadowMapEnabled = true;

    //spot light
    // spotlight #1 -- yellow, dark shadow
    var spotlight = new THREE.SpotLight(0xFFFFFF);
    spotlight.position.set(-75,25,100);
    spotlight.shadowCameraVisible = false;
    spotlight.shadowDarkness = 0.15;
    spotlight.intensity = 2;
    // must enable shadow casting ability for the light
    spotlight.castShadow = true;
    this.root.add(spotlight);

    // change the direction this spotlight is facing
    var lightTarget = new THREE.Object3D();
    lightTarget.position = bfp4f.position;
    this.root.add(lightTarget);
    spotlight.target = lightTarget;
    
    var spotlight3 = new THREE.SpotLight(0x0000ff);
    spotlight3.position.set(-250,250,-100);
    spotlight3.shadowCameraVisible = true;
    spotlight3.shadowDarkness = 0.95;
    spotlight3.intensity = 2;
    spotlight3.castShadow = true;
    this.root.add(spotlight3);
    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0,0,5);
    spotlight3.target = lightTarget;
    this.root.add(lightTarget);

    // text objects
    this.pbcl_text = this.create2dText("pbcl.dll", 120);
    this.pbcl_text.position.set(0,60,0);
    //this.root.add(this.pbcl_text);
    
    /* GLOW EFFECT */
    /*
    var glowMaterial = ObjectEffects.prototype.glowEffectMaterial(this.app.camera);
    this.glow = new THREE.Mesh( geometry.clone(), glowMaterial.clone() );
    this.glow.position = bfp4f.position;//(bfp4f.position.x, bfp4f.position.y, bfp4f.position.z);
    this.glow.rotation = bfp4f.rotation;
    this.glow.scale.multiplyScalar(1.2);
    this.root.add(this.glow);
    */

    // FLOOR: mesh to receive shadows
    var floorTexture = new THREE.ImageUtils.loadTexture( 'resources/checkerboard.jpg' );
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
    floorTexture.repeat.set( 10, 10 );
    // Note the change to Lambert material.
    var floorMaterial = new THREE.MeshLambertMaterial( { map: floorTexture, side: THREE.DoubleSide, transparent: true, opacity: 0 } );
    this.materials.push(floorMaterial);
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    // Note the mesh is flagged to receive shadows
    floor.receiveShadow = true;
    this.root.add(floor);
   
    this.setObject3D(this.root);
    this.initAnimations();
}
PunkBusterServicesSlide.prototype.runAnimation = function(animation)
{
    this.app.camera.position.set(0,150,400);
    this.animating = !this.animating; // set animating to true.
    this.animate(animation, this.animating);
}

PunkBusterServicesSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "animatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.materials),
        loop: false,
        duration: 5000
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "animatorIn";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.fadeOut(this.materials),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
}

PunkBusterServicesSlide.prototype.nextAnimation = function()
{
    // if we are reloaded our opacity will be reset.
    if (this.animations.isBeginning())
    {
        for (var i = 0; i < this.materials.length; i++)
        {
            this.materials[i].opacity = 0;
        }        
    }
    SimpleSlide.prototype.nextAnimation.call(this)
}

slides.push(new PunkBusterServicesSlide());