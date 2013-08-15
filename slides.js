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
    var geometry = new THREE.PlaneGeometry(3.337, 3);

    this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.texture, transparent: true } );
    var mesh = new THREE.Mesh( geometry, this.material ); 
    this.root.add(mesh);
    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}


IntroSlide.prototype.loadResources = function()
{
    this.texture = THREE.ImageUtils.loadTexture("resources/isaac.mohawk.png");
}

IntroSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    console.log(this.object3D);
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.material),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    animatorIn.name = "animatorIn";
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.init({ 
        interps: ObjectEffects.prototype.fadeOut(this.material),
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
    this.root.position.z = -100;
    this.engine = new ParticleEngine(this.root);
    this.createParticles();
    this.clock = new THREE.Clock();
    
    var s_geometry = new THREE.PlaneGeometry(1, 1.5);
    
    var s_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.s_texture } );
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
    this.root.add(line);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

MyBioSlide.prototype.loadResources = function()
{
    this.s_texture = THREE.ImageUtils.loadTexture("resources/seppuku.jpg");
    this.particle_texture = THREE.ImageUtils.loadTexture( 'resources/sakura6.png' );
}

MyBioSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "MyBioSlideanimatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.moveFloorIn(this.object3D),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "MyBioSlideanimatorIn";
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
        
        particleTexture : this.particle_texture,
            
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
MyBioSlide.prototype.update = function()
{
    var dt = this.clock.getDelta();
    this.engine.update( dt * 0.5 );  
    Sim.Object.prototype.update.call(this);
}
MyBioSlide.prototype.done = function()
{
    this.engine.destroy();
    this.engine = null;
    SimpleSlide.prototype.done.call(this);
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

    

    this.targets = {table: [], sphere: []};
    this.image_objects = [];

    for ( var i = 0; i < this.game_images.length; i += 3 )
    {
        var geometry = new THREE.PlaneGeometry(3, 3);
        
        var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.game_textures[i/3], transparent: true, opacity: 0});
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

    this.setObject3D(this.root);
    this.initAnimations();
}

PBGamesSlide.prototype.loadResources = function()
{
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
    this.game_textures = [];
    
    for ( var i = 0; i < this.game_images.length; i += 3 )
    {
        var texture = new THREE.ImageUtils.loadTexture("resources/titles/"+this.game_images[i]);

        console.log("Loading i: " + i + " " + this.game_images[i]);

        this.game_textures.push(texture);
    }
}

PBGamesSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.AnimationGroup;
    animatorIn.name = "PBGamesSlideanimatorIn";
    var fadeIn = this.createFadeIn();
    animatorIn.add(fadeIn);
    var moveObjects = this.moveObjects(this.targets.table, this.image_objects, 2000);
    animatorIn.add(moveObjects);
    animatorIn.init();

    this.addChild(animatorIn);
    this.animations.push(animatorIn);


    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "PBGamesSlideanimatorOut";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.fadeOut(this.materials),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
}

PBGamesSlide.prototype.createFadeIn = function()
{
    var fadeIn = new Sim.KeyFrameAnimator;
    fadeIn.name = "PBGamesSlidefadeIn";
    fadeIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.materials),
        loop: false,
        duration: 500
    });
    return fadeIn;
}


PBGamesSlide.prototype.moveObjects = function(targets, objects, duration)
{

    var tween_group = [];
    for ( var i = 0; i < objects.length; i ++ ) 
    {

        var object = objects[ i ];
        var target = targets[ i ];

        tween_group.push(new TWEEN.Tween( object.position )
            .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut ));

        tween_group.push(new TWEEN.Tween( object.rotation )
            .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
            .easing( TWEEN.Easing.Exponential.InOut ));

    }
    var tweenjs = new Sim.TweenjsAnimator;
    tweenjs.name = "PBGameSlidemoveObjects";
    tweenjs.init({tweens: tween_group, duration: duration * 2 }); //, onComplete: group.onGroupComplete
    return tweenjs;
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
 
    this.pnka_position = new THREE.Object3D();
    this.pnka_position.position.set(-250, 220, 5);

    this.pnkb_position = new THREE.Object3D();
    this.pnkb_position.position.set(-250, 55, 5);
    
    this.pbcl_position = new THREE.Object3D();
    this.pbcl_position.position.set(250, 55, 5);

    this.root.add(this.pnka_position);
    this.root.add(this.pnkb_position);
    this.root.add(this.pbcl_position);
    
    // bfp4f    
    
    var material = new THREE.MeshLambertMaterial( { color: 0x888888, map: this.bfp4f_texture, transparent: true, opacity: 0}); //
    this.materials.push(material);
    var geometry = new THREE.CubeGeometry(100,150,10);
    this.bfp4f = new THREE.Mesh(geometry, material);
    this.bfp4f.position.set(250,220,5);
    this.bfp4f.rotation.y =  Math.PI*1.68;
    this.bfp4f.rotation.x = -0.01;

    // Note that the mesh is flagged to cast shadows
    this.bfp4f.castShadow = true;
    this.root.add(this.bfp4f);
    
    this.app.renderer.shadowMapEnabled = true;

    this.pnkbstra_text = this.createTextObject("PnkBstrA.exe", this.pnka_position, 0, 55, 0);
    this.root.add(this.pnkbstra_text);
   
    this.pnkbstrb_text = this.createTextObject("PnkBstrB.exe", this.pnkb_position, 0, 55, 0); 
    this.root.add(this.pnkbstrb_text);

    this.pbcl_text = this.createTextObject("pbcl.dll", this.pbcl_position, 0, 55, 0);     
    this.root.add(this.pbcl_text);

    
    // GEARS

    // PnkBstrA gear
    this.pba_gear = copyModel(this.gear_geometry, this.gear_material);
    this.pba_gear.scale.x =  this.pba_gear.scale.y = this.pba_gear.scale.z = 25;
    this.pba_gear.position.set(250, 220, 5);


    // PnkBstrB gear
    this.pbb_gear = copyModel(this.gear_geometry, this.gear_material);
    this.pbb_gear.scale.x =  this.pbb_gear.scale.y = this.pbb_gear.scale.z = 25;
    this.pbb_gear.position.set(-250, 220, 5);

    // pbcl.dll gear
    this.pbcl_gear = copyModel(this.gear_geometry, this.gear_material);
    this.pbcl_gear.scale.x =  this.pbcl_gear.scale.y = this.pbcl_gear.scale.z = 25;
    this.pbcl_gear.position.set(250, 220, 5);                

    // set transparency for the gears.
    for (var i = 0; i < this.pba_gear.material.materials.length; i++)
    {
        this.pba_gear.material.materials[i].transparent = true;
        this.pba_gear.material.materials[i].opacity = 0;
        this.pbb_gear.material.materials[i].transparent = true;
        this.pbb_gear.material.materials[i].opacity = 0;
        this.pbcl_gear.material.materials[i].transparent = true;
        this.pbcl_gear.material.materials[i].opacity = 0;
    }

    this.root.add(this.pba_gear);
    this.root.add(this.pbb_gear);
    this.root.add(this.pbcl_gear);
    this.initAnimations();

    
    this.createLighting();

    // FLOOR: mesh to receive shadows
    
    this.floor_texture.wrapS = this.floor_texture.wrapT = THREE.RepeatWrapping; 
    this.floor_texture.repeat.set( 10, 10 );
    // Note the change to Lambert material.
    var floorMaterial = new THREE.MeshLambertMaterial( { map: this.floor_texture, side: THREE.DoubleSide, transparent: true, opacity: 0 } );
    this.materials.push(floorMaterial);
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    // Note the mesh is flagged to receive shadows
    floor.receiveShadow = true;
    this.root.add(floor);
   
    this.setObject3D(this.root);
    
}
PunkBusterServicesSlide.prototype.loadResources = function()
{
    this.bfp4f_texture = THREE.ImageUtils.loadTexture("resources/BattlefieldPlay4Free_box.jpg");
    this.floor_texture = new THREE.ImageUtils.loadTexture( 'resources/checkerboard.jpg' );

    // Gear Model
    var loader = new THREE.ColladaLoader();
    var that = this;
    this.pba_gear = new THREE.Object3D();
    this.pbb_gear = new THREE.Object3D();
    this.pbcl_gear = new THREE.Object3D();
    var that = this;
    loader.load("resources/models/Gear-Handmade.dae", function ( collada ) {
        that.dae = collada.scene;
        skin = collada.skins[ 0 ];

        that.dae.position.x = 250;
        that.dae.position.y = 220;
        that.dae.position.z = 5;
        // set the model to the center so we can rotate it properly.
        that.dae.children[0].position.set(0,0,0); 
        that.dae.updateMatrix();
        that.gear_geometry = that.dae.children[ 0 ].geometry;
        that.gear_material = that.dae.children[ 0 ].material;        
    });
}

PunkBusterServicesSlide.prototype.createTextObject = function(text, position, x, y, z)
{
     // text objects
    object = this.create2dText(text, 30);
    object.position.set(position.position.x + x,
                        position.position.y + y,
                        position.position.z + z);
    console.log("putting text object " + text + " at " + object.position.x + " " + object.position.y + " " + object.position.z );
    object.material.opacity = 0;
    this.materials.push(object);
    return object;
}

PunkBusterServicesSlide.prototype.createLighting = function()
{
    //spot light
    // spotlight #1 -- light up bfp4f box
    var spotlight = ObjectEffects.prototype.createSpotlight(0xffffff);
    spotlight.position.set(-350,25,100);
    this.root.add(spotlight);

    // change the direction this spotlight is facing
    var lightTarget = new THREE.Object3D();
    lightTarget.position = this.bfp4f.position;
    this.root.add(lightTarget);
    spotlight.target = lightTarget;
    
    // spot light 2 light up gears/text.
    var gear_spotlight = ObjectEffects.prototype.createSpotlight(0xffffff);
    gear_spotlight.position.set(350,25,100);
    this.root.add(gear_spotlight);

    // change the direction this spotlight is facing
    var lightTarget = new THREE.Object3D();
    lightTarget.position = this.pnka_position.position;
    this.root.add(lightTarget);
    gear_spotlight.target = lightTarget;
    

    // blue light on checkerboard.
    var blue_light = ObjectEffects.prototype.createSpotlight(0x0000ff);
    blue_light.position.set(-250,250,-100);
    this.root.add(blue_light);

    // point it to the ground.
    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0,0,5);
    blue_light.target = lightTarget;
    this.root.add(lightTarget);
}

PunkBusterServicesSlide.prototype.runAnimation = function(animation)
{
    this.app.camera.position.set(0,150,500);
    this.animating = !this.animating; // set animating to true.
    this.animate(animation, this.animating);
}

PunkBusterServicesSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "PunkBusterServicesSlideanimatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.materials),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);

    // PnkBstrA
    var pnka_animation = this.buildAnimationGroup(this.pba_gear, this.pnkbstra_text.material, "PnkBstrA_animation", this.pnka_position);
    this.addChild(pnka_animation);
    this.animations.push(pnka_animation);

    // PnkBstrB
    var pnkb_animation = this.buildAnimationGroup(this.pbb_gear, this.pnkbstrb_text.material, "PnkBstrB_animation", this.pnkb_position);
    this.addChild(pnkb_animation);
    this.animations.push(pnkb_animation);

    // pbcl.dll
    var pbcl_animation = this.buildAnimationGroup(this.pbcl_gear, this.pbcl_text.material, "pbcl_animation", this.pbcl_position);
    this.addChild(pbcl_animation);
    this.animations.push(pbcl_animation);

    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "PunkBusterServicesSlideanimatorOut";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.fadeOut(this.materials),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
}

PunkBusterServicesSlide.prototype.buildAnimationGroup = function(model, text_material, name, position)
{
    var animation_group = new Sim.AnimationGroup;
    animation_group.name = name;
    
    var gear_fadein = new Sim.KeyFrameAnimator;
    gear_fadein.init({
        interps: ObjectEffects.prototype.fadeIn([model.material.materials[0],model.material.materials[1]]),
        loop:false,
        duration: 500
    });
    //this.addChild(gear_fadein);
    animation_group.add(gear_fadein);
    position.rotation.z = 10;
    if (name == 'PnkBstrA_animation')
    {
        var gear_animation = ObjectEffects.prototype.tweenObjectToAxisRotateZ([model],[position], 1000, 'x' );
        //this.addChild(gear_animation);
        animation_group.add(gear_animation);        
    }
    else
    {
        console.log("object " + name + " at " + model.position.y + " target " + position.position.y);
        var gear_animation = ObjectEffects.prototype.tweenObjectToAxisRotateZ([model],[position], 1000, 'y' );
        //this.addChild(gear_animation);
        animation_group.add(gear_animation);   
    }

    var text_visible = new Sim.KeyFrameAnimator;
    text_visible.init({
        interps: ObjectEffects.prototype.makeVisible( text_material ),
        loop: false,
        duration: 510
    });

    animation_group.add(text_visible);
    //this.addChild(gear_animation);
    return animation_group;
}
//slides.push(new PunkBusterServicesSlide());



PnkBstrASlide = function()
{
    this.name = "PnkBstrASlide";
    SimpleSlide.call(this);
}

PnkBstrASlide.prototype = new SimpleSlide();

PnkBstrASlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    this.floor = this.createWireframeFloor();
    this.floor.position.set(0,20,-400); // move floor a bit back.
    this.root.add(this.floor);
    
    this.heading_position = new THREE.Object3D();
    this.heading_position.position.set(0,290,0);
    this.heading_text = this.createHeading("PnkBstrA Service", this.heading_position);
    this.root.add(this.heading_text);
    
    this.bullets_position = new THREE.Object3D();
    this.bullets_position.position.set(-280, 240, 0);

    this.loader_text = this.createTextObject("- Loads and manages PnkBstrB.exe", this.bullets_position, 0,0,0);
    this.root.add(this.loader_text);

    this.re_text = this.createTextObject("- Contains no anti-RE'ing functionality", this.bullets_position, 0, -25, 0);
    this.root.add(this.re_text);

    this.listens_text = this.createTextObject("- Listens on 127.0.0.1:44301", this.bullets_position, 0, -50, 0);
    this.root.add(this.listens_text);

    this.cmd_text = this.createTextObject("- Accepts commands from pbcl.dll", this.bullets_position, 0, -75, 0);
    this.root.add(this.cmd_text);

    this.delete_text = this.createTextObject("- Deletes PnkBstrB service on unload.", this.bullets_position, 0, -100, 0);
    this.root.add(this.delete_text);

    var s_geometry = new THREE.PlaneGeometry(400, 150);
    var s_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.cmds_texture, transparent: true } );
    this.materials.push(s_material);
    this.pnkbstra_mesh = new THREE.Mesh( s_geometry, s_material ); 
    this.pnkbstra_target = [140, 200, -80];
    this.pnkbstra_mesh.position.set(1000, 200, -80);
    this.pnkbstra_mesh.rotation.y = -0.1
    //this.pnkbstra_mesh.rotation.x = 0.1
    
    this.root.add(this.pnkbstra_mesh);
    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

PnkBstrASlide.prototype.loadResources = function()
{
    this.cmds_texture = new THREE.ImageUtils.loadTexture("resources/pnkbstra_cmds.png");
}

PnkBstrASlide.prototype.createHeading = function(text, position)
{
    object = this.create2dText(text, 40, 400, 100, 'center');
    object.position.set(position.position.x,
                        position.position.y,
                        position.position.z);
    console.log("putting text object " + text + " at " + object.position.x + " " + object.position.y + " " + object.position.z );
    object.material.opacity = 0;
    this.materials.push(object.material);
    return object;
}
PnkBstrASlide.prototype.createTextObject = function(text, position, x, y, z)
{
     // text objects
    object = this.create2dText(text, 20, 1000, 50, 'left');
    object.position.set(position.position.x + x,
                        position.position.y + y,
                        position.position.z + z);
    console.log("putting text object " + text + " at " + object.position.x + " " + object.position.y + " " + object.position.z );
    object.material.opacity = 0;
    this.materials.push(object.material);

    return object;
}

PnkBstrASlide.prototype.initAnimations = function()
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

    var slideIn = new Sim.KeyFrameAnimator;
    slideIn.init({ 
        interps: ObjectEffects.prototype.slideIn(this.pnkbstra_mesh, this.pnkbstra_target),
        loop: false,
        duration: 500
    });
    slideIn.name = "PnkBstrASlide_slideIn";
    this.animations.push(slideIn);
    this.addChild(slideIn);

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

PnkBstrASlide.prototype.runAnimation = function(animation)
{
    this.app.camera.position.set(0,150,400);
    this.animating = !this.animating; // set animating to true.
    this.animate(animation, this.animating);
}

//slides.push(new PnkBstrASlide());




FnkBstrASlide = function()
{
    this.name = "FnkBstrASlide";
    SimpleSlide.call(this);
}

FnkBstrASlide.prototype = new SimpleSlide();

FnkBstrASlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    
    parameters = { color: 0xffffff, envMap: this.textureCube, shading: THREE.FlatShading };
    cubeMaterial = new THREE.MeshBasicMaterial( parameters );
    //this.materials.push(cubeMaterial)

    var geo = new THREE.SphereGeometry( 50, 50, 50);
    this.discoball_mesh = new THREE.Mesh( geo, cubeMaterial );
    this.discoball_mesh.position.set(0, 250, 0);
    this.root.add(this.discoball_mesh);
    
 
    // LIGHTS
    //this.createLighting();
    this.createFakeLights();
    // FLOOR: mesh to receive shadows
    
    this.floorTexture.wrapS = this.floorTexture.wrapT = THREE.RepeatWrapping; 
    this.floorTexture.repeat.set( 10, 10 );
    // Note the change to Lambert material.
    var floorMaterial = new THREE.MeshLambertMaterial( { map: this.floorTexture, side: THREE.DoubleSide, transparent: true, opacity: 1 } );
    this.materials.push(floorMaterial);
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    // Note the mesh is flagged to receive shadows
    floor.receiveShadow = true;
    //this.root.add(floor);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

FnkBstrASlide.prototype.loadResources = function()
{
    this.floorTexture = new THREE.ImageUtils.loadTexture( 'resources/checkerboard.jpg' );
    this.textureCube = THREE.ImageUtils.loadTextureCube( ["resources/disco/disco000.png","resources/disco/disco002.png","resources/disco/disco003.png","resources/disco/disco008.png","resources/disco/disco005.png","resources/disco/disco006.png"] );
}

FnkBstrASlide.prototype.createLighting = function()
{
    
    this.lights = [];
    for (var i = 0; i < 20; i++)
    {
        var color = getRandomColor();
        var light = ObjectEffects.prototype.createSpotlight(color);
        light.exponent = 500;
        light.intensity = 5;
        light.position.set(0, 100, 0);
        light.target.position.x = 50 * i;

        light.target.position.y = 0;//getRandomInt(-150, 250);
        light.target.position.z = -i * 50; 
        console.log("target: " + light.target.position.x + " " + light.target.position.y  + " " + light.target.position.z );
        
        this.root.add(light);
        this.lights.push(light);
    }
}
FnkBstrASlide.prototype.createFakeLights = function()
{
    this.particles = [];
    this.color = [];
    this.h = 0;
    this.geometry = new THREE.Geometry();
    this.particle_materials = [];

    this.group = new THREE.Object3D();


    var geo = new THREE.SphereGeometry( 70, 32, 8 ); // Extra geometry to be broken down for MeshFaceMaterial
    var parameters = { color: 0xf0ff0f };
    cubeMaterial = new THREE.MeshBasicMaterial( parameters );
    this.lights = new THREE.Mesh(geo, cubeMaterial);
    this.root.add(this.lights);
    /*
    this.parameters = [
                    [ [1, 1, 0.5], 5 ],
                    [ [0.95, 1, 0.5], 4 ],
                    [ [0.90, 1, 0.5], 3 ],
                    [ [0.85, 1, 0.5], 2 ],
                    [ [0.80, 1, 0.5], 1 ]
                ];
    for ( var i = 0; i < 200; i ++ ) 
    {

        var vertex = new THREE.Vector3();
        vertex.x = getRandomInt(-250, 250);
        vertex.y = getRandomInt(10, 250);
        vertex.z = getRandomInt(-250, -500);

        this.geometry.vertices.push( vertex );

    }
    

    for ( var i = 0; i < this.parameters.length; i ++ ) {

        this.color = this.parameters[i][0];
        size  = this.parameters[i][1];

        this.particle_materials[i] = new THREE.ParticleBasicMaterial( { size: size } );

        var particle = new THREE.ParticleSystem( this.geometry, this.particle_materials[i] );

        particle.rotation.x = Math.random() * 6;
        particle.rotation.y = Math.random() * 6;
        particle.rotation.z = Math.random() * 6;
        this.particles.push(particle);
        this.root.add(particle);
    }
    */
}

FnkBstrASlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.init({ 
        interps: ObjectEffects.prototype.moveFloorIn(this.root),
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

FnkBstrASlide.prototype.runAnimation = function(animation)
{
    this.app.camera.position.set(0,150,1000);
    this.animating = !this.animating; // set animating to true.
    this.animate(animation, this.animating);
}


FnkBstrASlide.prototype.update = function()
{
    Sim.Object.prototype.update.call(this);
    var timer = 0.0005 * Date.now();   
    if (this.discoball_mesh != null)
    {
        this.discoball_mesh.rotation.y += 0.001;
    }
    /*
    if (this.lights)
    {
        for (var i = 0; i < this.lights.length; i++)
        {
            this.lights[i].target.position.x = Math.cos(timer) * 25 * i;
            this.lights[i].target.position.z = Math.sin(timer) * 25 * i;
            //this.lights[i].exponent = 1 / i;
        }
    }*/
    
    if (this.particles)
    {
        
        /*
        for (var i = 0; i < this.particles.length; i++)
        {
            this.particles[i].rotation.z = timer * ( i < 4 ? i + 1 : - ( i + 1 ) );
        }

        for (var i = 0; i < this.particle_materials.length; i ++ ) 
        {
            this.color = this.parameters[i][0];

            this.h = ( 360 * ( this.color[0] + timer ) % 360 ) / 360;
            this.particle_materials[i].color.setHSL( this.h, this.color[1], this.color[2] );
        }
        */
    }
    
}
slides.push(new FnkBstrASlide());

/*

    loader.load.call(this, "resources/models/Gear-Handmade.dae", function ( collada ) {

                that.dae = collada.scene;
                skin = collada.skins[ 0 ];

                that.dae.scale.x = that.dae.scale.y = that.dae.scale.z = 25;
                that.dae.position.x = 250;
                that.dae.position.y = 220;
                that.dae.position.z = 5;
                // set the model to the center so we can rotate it properly.
                that.dae.children[0].position.set(0,0,0); 
                that.dae.updateMatrix();
                 //that.dae.children[0].opacity = 0;
                that.pba_gear = that.dae.clone(); //new THREE.Mesh( that.dae.children[0].geometry, that.dae.children[0].material );
                that.pbb_gear = that.dae.clone(); //new THREE.Mesh( that.dae.children[0].geometry, that.dae.children[0].material );
                
                that.pbb_gear.position.set(-250, 220, 5);

                that.pbcl_gear = that.dae.clone();//new THREE.Mesh( that.dae.children[0].geometry, that.dae.children[0].material );

                for (var i = 0; i < that.dae.children[0].material.materials.length; i++)
                {
                   that.dae.children[0].material.materials[i].transparent = true;
                   that.dae.children[0].material.materials[i].opacity = 0;
                   // clone materials too
                   that.pba_gear.children[0].material.materials[i] = that.dae.children[0].material.materials[i].clone();
                   that.pbb_gear.children[0].material.materials[i] = that.dae.children[0].material.materials[i].clone();
                   that.pbcl_gear.children[0].material.materials[i] = that.dae.children[0].material.materials[i].clone();

                }
               
                that.root.add(that.pba_gear);
                that.root.add(that.pbb_gear);
                that.root.add(that.pbcl_gear);
                // must init our animations after model has loaded here.
                that.initAnimations.call(that);
    });

*/





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