// Global container for slides.
var slides = [];


/*****************************************************************************/
/* Intro to Punking PunkBuster Slide                                         */
/*****************************************************************************/

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
    this.initFadeAnimations();
}

IntroSlide.prototype.loadResources = function()
{
    this.texture = THREE.ImageUtils.loadTexture("resources/isaac.mohawk.png");
}


/*****************************************************************************/
/* My Bio Slide                                                              */
/*****************************************************************************/

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
    this.initFloorAnimations();
}

MyBioSlide.prototype.loadResources = function()
{
    this.s_texture = THREE.ImageUtils.loadTexture("resources/seppuku.jpg");
    this.particle_texture = THREE.ImageUtils.loadTexture( 'resources/sakura6.png' );
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


/*****************************************************************************/
/* Games using PunkBuster Slide                                              */
/*****************************************************************************/

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

/*****************************************************************************/
/* PunkBuster Services Slide                                                 */
/*****************************************************************************/

PunkBusterServicesSlide = function()
{
    this.name = "PunkBusterServicesSlide";
    SimpleSlide.call(this);
}

PunkBusterServicesSlide.prototype = new SimpleSlide();

PunkBusterServicesSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 500;
 
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
    var geometry = new THREE.CubeGeometry(100,150, 10);
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
        interps: ObjectEffects.prototype.moveFloorOut(this.root),
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
    this.addChild(gear_fadein);
    animation_group.add(gear_fadein);
    position.rotation.z = 10;
    if (name == 'PnkBstrA_animation')
    {
        var gear_animation = ObjectEffects.prototype.tweenObjectToAxisRotateZ([model],[position], 1000, 'x' );
        this.addChild(gear_animation);
        animation_group.add(gear_animation);        
    }
    else
    {
        console.log("object " + name + " at " + model.position.y + " target " + position.position.y);
        var gear_animation = ObjectEffects.prototype.tweenObjectToAxisRotateZ([model],[position], 1000, 'y' );
        this.addChild(gear_animation);
        animation_group.add(gear_animation);   
    }

    var text_visible = new Sim.KeyFrameAnimator;
    text_visible.init({
        interps: ObjectEffects.prototype.makeVisible( text_material ),
        loop: false,
        duration: 510
    });

    animation_group.add(text_visible);
    this.addChild(text_visible);
    return animation_group;
}

/*****************************************************************************/
/* PnkBstrA Details Slide                                                    */
/*****************************************************************************/

PnkBstrASlide = function()
{
    this.name = "PnkBstrASlide";
    SimpleSlide.call(this);
}

PnkBstrASlide.prototype = new SimpleSlide();

PnkBstrASlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 450;

    this.floor = this.createWireframeFloor(0xff80ff);

    this.floor.material.opacity = 0;
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

    this.delete_text = this.createTextObject("- Deletes PnkBstrB service on game exit", this.bullets_position, 0, -100, 0);
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


/*****************************************************************************/
/* Funk Buster Slide                                                         */
/*****************************************************************************/
FnkBstrASlide = function()
{
    this.name = "FnkBstrASlide";
    SimpleSlide.call(this);
}

FnkBstrASlide.prototype = new SimpleSlide();

FnkBstrASlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 500;

    parameters = { color: 0xffffff, envMap: this.textureCube, shading: THREE.FlatShading, transparent: true, opacity: 0 };
    cubeMaterial = new THREE.MeshBasicMaterial( parameters );
    this.materials.push(cubeMaterial)

    var geo = new THREE.SphereGeometry( 50, 50, 50);
    this.discoball_mesh = new THREE.Mesh( geo, cubeMaterial );
    this.discoball_mesh.position.set(0, 300, 0);
    this.root.add(this.discoball_mesh);
    
    //FnkBstrMan
    var funk_geometry = new THREE.PlaneGeometry(75, 200);
    var funk_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.fnkbstrman, transparent: true, opacity: 0 } );
    this.materials.push(funk_material);
    this.funk_mesh = new THREE.Mesh( funk_geometry, funk_material ); 
    this.funk_mesh.position.y = 100;
    this.funk_mesh.position.z = 5;
    this.root.add(this.funk_mesh);
    // LIGHTS
    this.createLighting();
    this.createFakeLights();

    // FLOOR: mesh to receive shadows
    
    this.floorTexture.wrapS = this.floorTexture.wrapT = THREE.RepeatWrapping; 
    this.floorTexture.repeat.set( 10, 10 );
    // Note the change to Lambert material.
    var floorMaterial = new THREE.MeshLambertMaterial( { map: this.floorTexture, side: THREE.DoubleSide, transparent: true, opacity: 0 } );
    this.materials.push(floorMaterial);
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    // Note the mesh is flagged to receive shadows
    //floor.receiveShadow = true;
    this.root.add(floor);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

FnkBstrASlide.prototype.loadResources = function()
{
    this.floorTexture = new THREE.ImageUtils.loadTexture( 'resources/disco_floor.png' );
    this.fnkbstrman = new THREE.ImageUtils.loadTexture('resources/fnkbstrman2.png');
    this.textureCube = THREE.ImageUtils.loadTextureCube( ["resources/disco/disco000.png","resources/disco/disco002.png","resources/disco/disco003.png","resources/disco/disco008.png","resources/disco/disco005.png","resources/disco/disco006.png"] );
}

FnkBstrASlide.prototype.createLighting = function()
{
    this.spotlights = [];
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
        this.spotlights.push(light);
    }
    this.top_light = ObjectEffects.prototype.createSpotlight(0xffffff);
    this.top_light.position.set(0, 600, 0);
    this.top_light.intensity = 0.5;
    this.top_light.exponent = 0;
    this.top_light.target.position.x = 0;
    this.top_light.target.position.y = 0;
    this.root.add(this.top_light);
       
}
FnkBstrASlide.prototype.createFakeLights = function()
{
    var geo = new THREE.SphereGeometry( 1300, 40, 20 ); // Extra geometry to be broken down for MeshFaceMaterial
    var parameters = { color: 0x000000 };
    var cubeMaterial = new THREE.ParticleBasicMaterial( { size: 10, color: 0xffffff } );
   
    this.lights_color = [128, 5, 128];
    this.lights = new THREE.ParticleSystem(geo, cubeMaterial);
    this.lights.position.y = 150;
    this.lights.position.z = -25;
    this.lights.rotation.x = 0.1;
    this.root.add(this.lights);
   
}

FnkBstrASlide.prototype.initAnimations = function()
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



FnkBstrASlide.prototype.update = function()
{
    Sim.Object.prototype.update.call(this);
    var timer = 0.0001 * Date.now();   
    if (this.discoball_mesh != null)
    {
        this.discoball_mesh.rotation.y -= 0.001;
    }

    if (this.lights)
    {
        this.lights.rotation.y -= 0.003;
        var h = ( 360 * ( this.lights_color[0] + timer ) % 360 ) / 360;
        this.lights.material.color.setHSL( h, 1, 0.5 );
    }
    if (this.spotlights)
    {
        for (var i = 0; i < this.spotlights.length; i++)
        {
            this.spotlights[i].target.position.x = Math.cos(timer/5 * 5 * i) * 25 * i;
            this.spotlights[i].target.position.z = Math.sin(timer/5 * 5 * i) * 25 * i;
        }
    }

}


/*****************************************************************************/
/* PnkBstrB Details Slide                                                    */
/*****************************************************************************/

PnkBstrBSlide = function()
{
    this.name = "PnkBstrBSlide";
    SimpleSlide.call(this);
}

PnkBstrBSlide.prototype = new SimpleSlide();

PnkBstrBSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 450;

    this.floor = this.createWireframeFloor(0x81BEF7);
    this.floor.material.opacity = 0;
    this.floor.position.set(0,20,-400); // move floor a bit back.
    this.root.add(this.floor);
    
    this.heading_position = new THREE.Object3D();
    this.heading_position.position.set(0,290,0);
    this.heading_text = this.createHeading("PnkBstrB Service", this.heading_position);
    this.root.add(this.heading_text);
    
    this.bullets_position = new THREE.Object3D();
    this.bullets_position.position.set(-280, 240, 0);

    this.purpose_text = this.createTextObject("- Scans processes, memory, hard drive IDs, adapter addresses", this.bullets_position, 0,0,0);
    this.root.add(this.purpose_text);

    this.re_text = this.createTextObject("- Contains anti-RE'ing techniques", this.bullets_position, 0, -25, 0);
    this.root.add(this.re_text);

    this.listens_text = this.createTextObject("- Listens on 127.0.0.1:45301", this.bullets_position, 0, -50, 0);
    this.root.add(this.listens_text);

    this.cmd_text = this.createTextObject("- Has ~30 commands", this.bullets_position, 0, -75, 0);
    this.root.add(this.cmd_text);

    this.pbcl_text = this.createTextObject("- Listens for commands from pbcl.dll", this.bullets_position, 0, -100, 0);
    this.root.add(this.pbcl_text);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initFadeAnimations();
}

PnkBstrBSlide.prototype.loadResources = function()
{

}

PnkBstrBSlide.prototype.createHeading = function(text, position)
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
PnkBstrBSlide.prototype.createTextObject = function(text, position, x, y, z)
{
     // text objects
    object = this.create2dText(text, 20, 1350, 50, 'left');
    object.position.set(position.position.x + x,
                        position.position.y + y,
                        position.position.z + z);
    console.log("putting text object " + text + " at " + object.position.x + " " + object.position.y + " " + object.position.z );
    object.material.opacity = 0;
    this.materials.push(object.material);

    return object;
}


/*****************************************************************************/
/* Deobfuscation Video Slide                                                 */
/*****************************************************************************/

DeobfuscateSlide = function()
{
    this.name = "DeobfuscateSlide";
    SimpleSlide.call(this);
}


DeobfuscateSlide.prototype = new SimpleSlide();

DeobfuscateSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 1500;

    this.floor = this.createDottedFloor();
    this.floor.position.set(0,-200,-200); // move floor a bit back.
    this.root.add(this.floor);
    this.video = document.getElementById('pnkdecode_video');
    this.image = document.createElement( 'canvas' );
    this.image.width = 960;
    this.image.height = 940;

    this.imageContext = this.image.getContext( '2d' );
    this.imageContext.fillStyle = '#000000';
    this.imageContext.fillRect( 0, 0, 960, 940 );

    this.video_texture = new THREE.Texture( this.image );
    this.video_texture.minFilter = THREE.LinearFilter;
    this.video_texture.magFilter = THREE.LinearFilter;

    this.material = new THREE.MeshBasicMaterial( { map: this.video_texture, overdraw: true } );
    
    var plane = new THREE.PlaneGeometry( 960, 940, 4, 4 );

    this.video_mesh = new THREE.Mesh( plane, this.material );
    this.video_mesh.scale.x = this.video_mesh.scale.y = this.video_mesh.scale.z = 1.0;
    this.video_mesh.position.y = 200;
    this.video_mesh.rotation.y = 0;
    this.video_mesh.position.z = 150;
    this.root.add(this.video_mesh);
    
    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

DeobfuscateSlide.prototype.initAnimations = function()
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

    var videoAnimator = new Sim.VideoAnimator;
    videoAnimator.init({video: this.video, video_texture: this.video_texture, image_context: this.imageContext});
    this.addChild(videoAnimator);
    this.animations.push(videoAnimator);


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

/*****************************************************************************/
/* Anti Reversing Slide                                                      */
/*****************************************************************************/

AntiRESlide = function()
{
    this.name = "AntiRESlide";
    SimpleSlide.call(this);
}

AntiRESlide.prototype = new SimpleSlide();

AntiRESlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 450;

    
    var idapin_geometry = new THREE.PlaneGeometry(300, 300);
    this.idapin_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.xor_texture, transparent: true, opacity: 0 } );
    this.materials.push(this.idapin_material);
    this.idapin_mesh = new THREE.Mesh( idapin_geometry, this.idapin_material ); 
    this.idapin_mesh.position.y = 100;
    this.idapin_mesh.position.z = 5;
    this.root.add(this.idapin_mesh);

    var netlog_geometry = new THREE.PlaneGeometry(300, 300);
    this.netlog_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.netlog_texture, transparent: true, opacity: 1 } );
    this.materials.push(this.netlog_material);
    this.netlog_mesh = new THREE.Mesh( netlog_geometry, this.netlog_material ); 
    this.netlog_mesh.position.y = 2000;
    this.netlog_mesh.position.z = -5;
    this.root.add(this.netlog_mesh);
    // PIN model
    this.createPinModels();

    // FLOOR
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


    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

AntiRESlide.prototype.createPinModels = function()
{
    this.pin_left = new THREE.Mesh(this.pin_geometry, this.pin_material);
    this.pin_right = new THREE.Mesh(this.pin_geometry, this.pin_material);
    this.materials.push(this.pin_material);

    this.pin_right.scale.x = this.pin_left.scale.x = 20; 
    this.pin_right.scale.y = this.pin_left.scale.y = 20;
    this.pin_right.scale.z = this.pin_left.scale.z = 0.15;
    this.pin_right.rotation.z = this.pin_left.rotation.z = 0;
    this.pin_left.rotation.y = 0.0;
    this.pin_left.rotation.x = -1.5;

    this.pin_right.rotation.y = 1.0;

    this.pin_left.position.set(-225, 65, 0);                
    this.pin_right.position.set(225, 65, 0);  
    this.createLighting();
    
    this.root.add(this.pin_left);
    this.root.add(this.pin_right);
}
AntiRESlide.prototype.loadResources = function()
{
    this.floor_texture = new THREE.ImageUtils.loadTexture("resources/checkerboard.jpg");
    this.xor_texture = new THREE.ImageUtils.loadTexture("resources/idapinlog.png");
    this.netlog_texture = new THREE.ImageUtils.loadTexture("resources/netlog.png");

    // Gear Model
    var loader = new THREE.ColladaLoader();
    var that = this;
    this.pin_left = new THREE.Object3D();
    this.pin_right = new THREE.Object3D();
    var that = this;
    loader.load("resources/models/pin.dae", function ( collada ) {
        that.dae = collada.scene;
        skin = collada.skins[ 0 ];

        that.dae.updateMatrix();
        that.pin_geometry = that.dae.children[ 0 ].geometry;
        that.pin_material = that.dae.children[ 0 ].material;      
    });
}

AntiRESlide.prototype.createLighting = function()
{
    var spot_light = ObjectEffects.prototype.createSpotlight(0xffffff);
    spot_light.position.set(-250,350,-100);
    this.root.add(spot_light);

    var spot_light2 = ObjectEffects.prototype.createSpotlight(0xffffff);
    spot_light2.position.set(250,350,-100);
    this.root.add(spot_light2);


    // point it to the ground.
    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0,0,5);
    spot_light.target = lightTarget;
    spot_light2.target = lightTarget;

    // left and right lights
    var spot_light3 = ObjectEffects.prototype.createSpotlight(0xffffff);
    spot_light3.position.set(250,0,-100);
    this.root.add(spot_light3);
    var spot_light4 = ObjectEffects.prototype.createSpotlight(0xffffff);
    spot_light4.position.set(-250,0,100);
    this.root.add(spot_light4);

    var lightTarget = new THREE.Object3D();
    lightTarget.position.set(0,150,5);
    spot_light3.target = lightTarget;
    spot_light4.target = lightTarget;
}

AntiRESlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "fadeIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.materials),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);

    var moveback_forward = new Sim.AnimationGroup;

    moveback_forward.name = "moveback_forward";
    var moveSide = this.moveMeshBack(this.idapin_mesh, -150);
    moveback_forward.add(moveSide);

    var moveDown = this.moveMeshDown(this.netlog_mesh);
    moveback_forward.add(moveDown);    

    moveback_forward.init();

    this.addChild(moveback_forward);
    this.animations.push(moveback_forward);
    

    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "floorAnimatorOut";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.moveFloorOut(this.root),
        loop: false,
        duration: 1000
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);

}

/*****************************************************************************/
/* Decryption Slide                                                          */
/*****************************************************************************/
DecryptionSlide = function()
{
    this.name = "DecryptionSlide";
    SimpleSlide.call(this);
}

DecryptionSlide.prototype = new SimpleSlide();

DecryptionSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 450;



    var decrypt1_geometry = new THREE.PlaneGeometry(200, 300);
    this.decrypt1_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.decrypt1_texture, transparent: true, opacity: 0 } );
    this.materials.push(this.decrypt1_material);
    this.decrypt1_mesh = new THREE.Mesh( decrypt1_geometry, this.decrypt1_material ); 
    this.decrypt1_mesh.position.y = 150;
    this.decrypt1_mesh.position.z = 5;
    this.root.add(this.decrypt1_mesh);

    var decrypt2_geometry = new THREE.PlaneGeometry(350, 200);
    this.decrypt2_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.decrypt2_texture, transparent: true, opacity: 0 } );
    this.materials.push(this.decrypt2_material);
    this.decrypt2_mesh = new THREE.Mesh( decrypt2_geometry, this.decrypt2_material ); 
    this.decrypt2_mesh.position.y = 2000;
    this.decrypt2_mesh.position.z = 5;
    this.root.add(this.decrypt2_mesh);

    var decrypt3_geometry = new THREE.PlaneGeometry(180, 200);
    this.decrypt3_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.decrypt3_texture, transparent: true, opacity: 0 } );
    this.materials.push(this.decrypt3_material);
    this.decrypt3_mesh = new THREE.Mesh( decrypt3_geometry, this.decrypt3_material ); 
    this.decrypt3_mesh.position.y = 2000;
    this.decrypt3_mesh.position.z = 5;
    this.root.add(this.decrypt3_mesh);



    this.floor_texture.wrapS = this.floor_texture.wrapT = THREE.RepeatWrapping; 
    this.floor_texture.repeat.set( 10, 10 );
    // Note the change to Lambert material.
    var floorMaterial = new THREE.MeshBasicMaterial( { map: this.floor_texture, side: THREE.DoubleSide, transparent: true, opacity: 0} );
    this.materials.push(floorMaterial);
    var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    // Note the mesh is flagged to receive shadows
    //floor.receiveShadow = true;
    this.root.add(floor);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

DecryptionSlide.prototype.loadResources = function()
{
    this.floor_texture = THREE.ImageUtils.loadTexture("resources/code_floor.png");
    this.decrypt1_texture = THREE.ImageUtils.loadTexture("resources/decrypt1.png");
    this.decrypt2_texture = THREE.ImageUtils.loadTexture("resources/decrypt2.png");
    this.decrypt3_texture = THREE.ImageUtils.loadTexture("resources/decrypt3.png");
}

DecryptionSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "fadeIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.fadeIn(this.materials),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);

    var moveside = new Sim.AnimationGroup;

    moveside.name = "moveside";
    var moveSide = this.moveMeshSide(this.decrypt1_mesh, -150, true);
    moveside.add(moveSide);

    var moveDown = this.moveMeshDown(this.decrypt2_mesh);
    moveside.add(moveDown);    

    moveside.init();

    this.addChild(moveside);
    this.animations.push(moveside);
    

    var move_otherside = new Sim.AnimationGroup;

    move_otherside.name = "moveside";
    var moveRightSide = this.moveMeshRightSide(this.decrypt2_mesh, -150, true);
    move_otherside.add(moveRightSide);

    var moveDown = this.moveMeshDown(this.decrypt3_mesh);
    move_otherside.add(moveDown);    

    move_otherside.init();

    this.addChild(move_otherside);
    this.animations.push(move_otherside);
    

    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "floorAnimatorOut";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.moveFloorOut(this.root),
        loop: false,
        duration: 1000
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
}


/*****************************************************************************/
/* pbcl hooking info slide                                                   */
/*****************************************************************************/

PbclHookingSlide = function()
{
    this.name = "PbclHookingSlide";
    SimpleSlide.call(this);
}

PbclHookingSlide.prototype = new SimpleSlide();

PbclHookingSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 450;

    // floor
    this.floor = this.createDottedFloor(0xff80ff);
    this.floor.position.set(0,-200,-200); // move floor a bit back.
    this.root.add(this.floor);

    // apimon texture
    var geometry = new THREE.PlaneGeometry(350, 265);
    this.apimon_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.apimon_texture, opacity: 0, transparent: true } );
    this.apimon_mesh = new THREE.Mesh( geometry, this.apimon_material ); 
    this.materials.push(this.apimon_material);
    this.apimon_mesh.position.set(0, 150, 5);
    this.root.add(this.apimon_mesh);


    var geometry = new THREE.PlaneGeometry(500, 250);
    this.hook_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.pbclhook_texture, opacity: 1, transparent: true } );
    this.materials.push(this.hook_material);

    this.hook_mesh = new THREE.Mesh( geometry, this.hook_material ); 
    this.hook_mesh.position.set(0, 2000, 5);
    this.root.add(this.hook_mesh);

    var geometry = new THREE.PlaneGeometry(350, 300);
    this.kick_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.kick_texture, opacity: 1, transparent: true } );
    this.materials.push(this.kick_material);

    this.kick_mesh = new THREE.Mesh( geometry, this.kick_material ); 
    this.kick_mesh.position.set(0, 2000, 5);
    this.root.add(this.kick_mesh);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

PbclHookingSlide.prototype.loadResources = function()
{
    this.apimon_texture = THREE.ImageUtils.loadTexture("resources/apimon.png");
    this.pbclhook_texture = THREE.ImageUtils.loadTexture("resources/pbcl.cb.apimon.png");
    this.kick_texture = THREE.ImageUtils.loadTexture("resources/pnk_kick2.png");
}

PbclHookingSlide.prototype.initAnimations = function()
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


    var movein_one = new Sim.AnimationGroup;
    movein_one.name = "PbclMove";
    var moveSide = this.moveMeshSide(this.apimon_mesh, -150, true);
    movein_one.add(moveSide);

    var moveDown = this.moveMeshDown(this.hook_mesh);
    movein_one.add(moveDown);    

    movein_one.init();
    this.animations.push(movein_one);
    this.addChild(movein_one);


    var movein_two = new Sim.AnimationGroup;
    movein_two.name = "PbclMoveTwo";
    
    var fadeOut = this.fadeOut(this.apimon_mesh);
    movein_two.add(fadeOut);

    var moveSide = this.moveMeshSide(this.hook_mesh, -125, true);
    movein_two.add(moveSide);

    var moveDown = this.moveMeshDown(this.kick_mesh);
    movein_two.add(moveDown);    

    movein_two.init();
    this.animations.push(movein_two);
    this.addChild(movein_two);


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
PbclHookingSlide.prototype.fadeOut = function(mesh)
{
    var fade = new Sim.KeyFrameAnimator;
    var keys = [0, 0.25, 1];
    var opacity_values = [
        {opacity: 0.7},
        {opacity: 0.3},
        {opacity: 0}
    ];
    fade.init({ 
        interps: [{keys: keys, values: opacity_values, target: mesh.material}],
        loop: false,
        duration: 500
    });
    return fade;  

}

/*****************************************************************************/
/* Obfuscated Code Slide                                                     */
/*****************************************************************************/
ObfuscatedCodeSlide = function()
{
    this.name = "ObfuscatedCodeSlide";
    SimpleSlide.call(this);
}

ObfuscatedCodeSlide.prototype = new SimpleSlide();

ObfuscatedCodeSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 450;

    
    var geometry = new THREE.PlaneGeometry(400, 300);
    
    this.obfusc_cmd_material = new THREE.MeshBasicMaterial( { map: this.obfusc_cmd_texture, transparent: true, opacity: 0 } );
    this.obfusc_cmd_mesh = new THREE.Mesh( geometry, this.obfusc_cmd_material ); 
    this.materials.push(this.obfusc_cmd_material);
    this.obfusc_cmd_mesh.position.set(0, 150, -5);
    this.root.add(this.obfusc_cmd_mesh);

    var geometry = new THREE.PlaneGeometry(300, 300);
    this.obfusc_op_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.obfusc_op_texture, transparent: true, opacity: 0 } );
    this.obfusc_op_mesh = new THREE.Mesh( geometry, this.obfusc_op_material ); 
    this.obfusc_op_mesh.position.set(0, 2000, -5);
    this.materials.push(this.obfusc_op_material);
    this.root.add(this.obfusc_op_mesh);


    this.createFloorLighting();
    this.floor = this.createTexturedFloor(this.floor_texture);

    this.root.add(this.floor);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}

ObfuscatedCodeSlide.prototype.loadResources = function()
{
    this.obfusc_cmd_texture = new THREE.ImageUtils.loadTexture("resources/obfusc_cmd.png");
    this.obfusc_op_texture = new THREE.ImageUtils.loadTexture("resources/obfusc_op.png");
    this.floor_texture = new THREE.ImageUtils.loadTexture("resources/checkerboard.jpg");
}

ObfuscatedCodeSlide.prototype.initAnimations = function()
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



    var movein_one = new Sim.AnimationGroup;
    movein_one.name = "ObfuscMove";
    var moveSide = this.moveMeshSide(this.obfusc_cmd_mesh, -150, true);
    movein_one.add(moveSide);

    var moveDown = this.moveMeshDown(this.obfusc_op_mesh);
    movein_one.add(moveDown);    

    movein_one.init();
    this.animations.push(movein_one);
    this.addChild(movein_one);

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



/*****************************************************************************/
/* Preception Slide                                                          */
/*****************************************************************************/

PreceptionSlide = function()
{
    this.name = "PreceptionSlide";
    SimpleSlide.call(this);
}

PreceptionSlide.prototype = new SimpleSlide();

PreceptionSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);
    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 450;

    this.point_marker = new THREE.Object3D();
    this.point_marker.position.x = 0;
    this.point_marker.position.y = 128;
    this.point_marker.position.z = -128;
    this.root.add(this.point_marker);
    // look at the created object so we can move it around and have the camera follow it.
    this.app.camera.lookAt(this.point_marker.position);
    
    // give it that blocky look
    this.dirt_texture.magFilter = THREE.NearestFilter;
    this.dirt_texture.minFilter = THREE.LinearMipMapLinearFilter;
    
    this.grass_dirt_texture.magFilter = THREE.NearestFilter;
    this.grass_dirt_texture.minFilter = THREE.LinearMipMapLinearFilter;



    this.plane_materials = [
        new THREE.MeshBasicMaterial( { map: this.goal_texture,  transparent: true, opacity: 0} ),
        new THREE.MeshBasicMaterial({map: this.goal_texture, transparent: true, opacity: 0})
    ];

    var geometry1 = new THREE.PlaneGeometry(300, 200);
    var geometry2 = new THREE.PlaneGeometry(300, 200);
    // rotate
    geometry2.applyMatrix( new THREE.Matrix4().makeRotationY( Math.PI ) );
    // merge the two planes
    THREE.GeometryUtils.merge( geometry1, geometry2);
    // set the faces 
    geometry1.materials = this.plane_materials;
    geometry1.faces[ 0 ].materialIndex = 0;
    geometry1.faces[ 1 ].materialIndex = 1;
        
    var goal_mesh =  new THREE.Mesh( geometry1, new THREE.MeshFaceMaterial(this.plane_materials) );
    goal_mesh.position.set(32, 620, -64);
    this.materials.push(this.plane_materials[0]);
    this.materials.push(this.plane_materials[1]);


    this.root.add(goal_mesh);


    this.initMineCubes();
    

    this.grass_texture.wrapS = this.grass_texture.wrapT = THREE.RepeatWrapping; 
    this.grass_texture.magFilter = THREE.NearestFilter;
    this.grass_texture.minFilter = THREE.LinearMipMapLinearFilter;
    this.grass_texture.repeat.set( 64,64 );
    // Note the change to Lambert material.
    var floorMaterial = new THREE.MeshBasicMaterial( { map: this.grass_texture, side: THREE.DoubleSide, transparent: true, opacity: 0} );
    this.materials.push(floorMaterial);
    var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 50, 50);
    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -0.5;
    floor.rotation.x = Math.PI / 2;
    // Note the mesh is flagged to receive shadows
    //floor.receiveShadow = true;
    this.root.add(floor);
    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}
PreceptionSlide.prototype.initMineCubes = function()
{
    var original = new THREE.Object3D();
    var marker = new THREE.Object3D();
    marker.position.set(-664, 40, -128);
    original.position.set(-664, 40, -128);
    this.createCubes(original, marker);
}

PreceptionSlide.prototype.createCubes = function(original, marker)
{
    var wall_height = 8; // in boxes
    var wall_length = 24;  // in boxes
    var wall_width = 8;
    var geometry = new THREE.CubeGeometry(64, 64, 64);
    var material = new THREE.MeshBasicMaterial({ map: this.dirt_texture, transparent: true, opacity: 0});
    var top_material = new THREE.MeshBasicMaterial({ map: this.grass_dirt_texture, transparent: true, opacity: 0});
    this.materials.push(material);
    this.materials.push(top_material);
    var cube_mesh = new THREE.Mesh(geometry, material);
    cube_mesh.position.set(marker.position.x, marker.position.y, marker.position.z);
    this.root.add(cube_mesh);
    for (var nz = 0; nz < wall_width; nz++)
    {
        for (var ny = 0; ny < wall_height; ny++)
        {
            for (var nx = 0; nx < wall_length; nx++)
            {
                var cube_mesh;
                if (ny == wall_height-1)
                {
                    cube_mesh = new THREE.Mesh(geometry, top_material);    
                }
                else
                {
                    cube_mesh = new THREE.Mesh(geometry, material);
                }

                cube_mesh.position.set(marker.position.x, marker.position.y, marker.position.z);
                //console.log("Creating cube at " + cube_mesh.position.x + " " + cube_mesh.position.y + " " + cube_mesh.position.z);
                this.root.add(cube_mesh);
                marker.position.x += 64;
            }
            marker.position.y += 64;
            marker.position.x = original.position.x;
        }
        wall_height -= 1;
        marker.position.z -= 64;
        marker.position.y = original.position.y;        
    }
    
}
PreceptionSlide.prototype.loadResources = function()
{
    this.grass_texture = THREE.ImageUtils.loadTexture("resources/minecraft/grass.png")
    this.dirt_texture = THREE.ImageUtils.loadTexture("resources/minecraft/dirt.png");
    this.grass_dirt_texture = THREE.ImageUtils.loadTexture("resources/minecraft/grass_dirt.png");
    this.goal_texture = THREE.ImageUtils.loadTexture("resources/goal_blocks.png");

}

PreceptionSlide.prototype.initAnimations = function()
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

    var lookUp = this.look(0, 400, 0);
    this.animations.push(lookUp); 
    this.addChild(lookUp);

    var lookMove = new Sim.AnimationGroup;
    lookMove.name = "LookAndMove";
    
    // look at end of wall
    var lookRight = this.look(905, 128, 0);
    lookMove.add(lookRight);

    // move to end of wall
    var moveRight = this.move(900, 128, 0);
    lookMove.add(moveRight);


    var lookLeftOnce = this.look(900, 128, -1510);
    lookMove.add(lookLeftOnce);

    var moveForward = this.move(900, 128, -1500);
    lookMove.add(moveForward);

    var lookLeft = this.look(400, 128, -1000);
    lookMove.add(lookLeft);
    

    var moveForward = this.move(300, 128, -1500);
    lookMove.add(moveForward);

    var lookCenter = this.look(250, 400, 0);
    lookMove.add(lookCenter);
    lookMove.init({isChain:true});
    this.animations.push(lookMove);
    this.addChild(lookMove);
   
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
PreceptionSlide.prototype.look = function(x, y, z)
{
    var duration = 250;
    var tweenjs = new Sim.TweenjsAnimator;
    tweenjs.name = "look " + x + " " + y + " " + z;
    var tween = new TWEEN.Tween( this.point_marker.position )
            .to( { x: x, y: y, z: z }, duration )
            .easing( TWEEN.Easing.Exponential.InOut );
    tween.name = "look " + x + " " + y + " " + z;
    tweenjs.init({tweens: [tween], duration: duration }); 
    return tweenjs;
}

PreceptionSlide.prototype.move = function(x, y, z)
{
    var duration = 250;
    var tweenjs = new Sim.TweenjsAnimator;
    tweenjs.name = "look " + x + " " + y + " " + z;
    var tween = new TWEEN.Tween( this.app.camera.position )
            .to( { x: x, y: y, z: z }, duration );
    tween.name = "look " + x + " " + y + " " + z;
    tweenjs.init({tweens: [tween], duration: duration }); 
    return tweenjs;
}
PreceptionSlide.prototype.done = function()
{
    // NFI why, but the slide after this has it's camera bonkered, so set the default position.
    this.point_marker.position = new THREE.Vector3(0,150,0);
    this.update();
    SimpleSlide.prototype.done.call(this);
}
// need to override update so we can force the camera to look at specific positions.
PreceptionSlide.prototype.update = function()
{
    Sim.Object.prototype.update.call(this);
    this.app.camera.lookAt(this.point_marker.position);
}

/*****************************************************************************/
/* Ninko Slide                                                               */
/*****************************************************************************/

NinkoSlide = function()
{
    this.name = "NinkoSlide";
    SimpleSlide.call(this);
}

NinkoSlide.prototype = new SimpleSlide();

NinkoSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    this.camera_pos.x = 0;
    this.camera_pos.y = 150;
    this.camera_pos.z = 550;
    
    
    var fox_geometry = new THREE.PlaneGeometry(100, 200);
    
    this.fox_material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.fox_texture } );
    this.fox_mesh = new THREE.Mesh( fox_geometry, this.fox_material ); 
    this.materials.push(this.fox_material);
    this.foxes = []

    for (var i = 0; i < 5; i++)
    {
        var fox_mesh = new THREE.Mesh( fox_geometry, this.fox_material ); 
        fox_mesh.position.y = 100;
        fox_mesh.position.z -= i;
        this.foxes.push(fox_mesh);
        this.root.add(fox_mesh);
    }
    
    this.ninko_mesh = this.createNinkoText();
    this.root.add(this.ninko_mesh);

    this.createFloorLighting();
    this.floor = this.createTexturedFloor(this.floor_texture);
    this.root.add(this.floor);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
}
NinkoSlide.prototype.loadResources = function()
{
    this.floor_texture = new THREE.ImageUtils.loadTexture("resources/checkerboard.jpg");
    
    this.fox_texture = new THREE.ImageUtils.loadTexture("resources/fox.png");
    this.ninko_texture = new THREE.ImageUtils.loadTexture("resources/ninko_text.png");
}

NinkoSlide.prototype.createNinkoText = function()
{
    var geometry = new THREE.PlaneGeometry(350, 500);
    // want to know how i came up with these values? Trial and fucking error.
    this.ninko_texture.offset.x = 0;
    this.ninko_texture.repeat.x = 1;

    this.ninko_texture.offset.y = 0.80;
    this.ninko_texture.repeat.y = 0.2;

    this.ninko_material = new THREE.MeshBasicMaterial( { map: this.ninko_texture, transparent: true, opacity: 1});
    var mesh = new THREE.Mesh( geometry, this.ninko_material ); 
    mesh.position.y = -2000;
    return mesh;
}

NinkoSlide.prototype.initAnimations = function()
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


    var multiply = this.multiplyAnimations();
    multiply.init();
    this.animations.push(multiply);
    this.addChild(multiply);
    
    var slideUp = new Sim.KeyFrameAnimator;
    slideUp.name = "fadeInNinko";
    slideUp.init({
        interps: ObjectEffects.prototype.slideUp(this.ninko_mesh),
        loop: false,
        duration: 2000
    });
    this.animations.push(slideUp);
    this.addChild(slideUp);   

    var scroll_keys = [
        [0.80, 0.76, 500],
        [0.76, 0.625, 1000],
        [0.625, 0.485, 1000],
        [0.485, 0.34, 2000]
    ];
    for (var i = 0; i < scroll_keys.length; i++)
    {
        var scroll = this.scrollAnimation(scroll_keys[i][0], scroll_keys[i][1], scroll_keys[i][2]);
        this.animations.push(scroll);
        this.addChild(scroll);        
    }


    
    

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
NinkoSlide.prototype.scrollAnimation = function(from, to, duration)
{
    var anim = new Sim.KeyFrameAnimator;
    var keys = [0, 1];
    var values = [
        {x: 0, y: from, z: 0},
        {x: 0, y: to, z: 0}
    ]; // end -0.07 start = 0.80
    anim.init({
        interps: [{keys: keys, values: values, target: this.ninko_texture.offset}],
        loop: false,
        duration: duration
    });
    return anim;

}
NinkoSlide.prototype.multiplyAnimations = function()
{
    var multiply = new Sim.AnimationGroup;
    multiply.name = "multiplyAnimation";
    var z = 0;
    // some day i should learn math and, like, how to code properly.
    for (var i = 0; i < this.foxes.length; i++)
    {   
        if (i < 3)
            z = z + -35;
        else
            z = z + 35;

        var anim = new Sim.KeyFrameAnimator;
        var keys = [0, 1];
        var tx = -200 + (i * 100);
        var tz = -35 + z;
        var values = [
            {x: this.foxes[i].position.x, y: this.foxes[i].position.y, z: this.foxes[i].position.z},
            {x: tx, y: this.foxes[i].position.y, z: tz}
        ];
        anim.init({
            interps: [{keys: keys, values: values, target: this.foxes[i].position}],
            loop: false,
            duration: 1500
        });
        multiply.add(anim);
    }
    return multiply;
}


/*****************************************************************************/
/* UDP Decrypting Proxy Slide                                                */
/*****************************************************************************/
UDPDPSlide = function()
{
    this.name = "UDPDPSlide";
    SimpleSlide.call(this);
}

UDPDPSlide.prototype = new SimpleSlide();

UDPDPSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initFadeAnimations();
}

UDPDPSlide.prototype.loadResources = function()
{

}


/*****************************************************************************/
/* Fake Client Video Slide                                                   */
/*****************************************************************************/
FakeClientSlide = function()
{
    this.name = "FakeClientSlide";
    SimpleSlide.call(this);
}

FakeClientSlide.prototype = new SimpleSlide();

FakeClientSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initFadeAnimations();
}

FakeClientSlide.prototype.loadResources = function()
{

}

/*****************************************************************************/
/* pbcl details Slide                                                        */
/*****************************************************************************/
PbclDetailsSlide = function()
{
    this.name = "PbclDetailsSlide";
    SimpleSlide.call(this);
}

PbclDetailsSlide.prototype = new SimpleSlide();

PbclDetailsSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initFadeAnimations();
}

PbclDetailsSlide.prototype.loadResources = function()
{

}


/*****************************************************************************/
/* Wiki Slide                                                                */
/*****************************************************************************/
WikiSlide = function()
{
    this.name = "WikiSlide";
    SimpleSlide.call(this);
}

WikiSlide.prototype = new SimpleSlide();

WikiSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initFadeAnimations();
}

WikiSlide.prototype.loadResources = function()
{

}

/*****************************************************************************/
/* TODO Slide                                                                */
/*****************************************************************************/
TODOSlide = function()
{
    this.name = "TODOSlide";
    SimpleSlide.call(this);
}

TODOSlide.prototype = new SimpleSlide();

TODOSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initFadeAnimations();
}

TODOSlide.prototype.loadResources = function()
{

}

/*****************************************************************************/
/* Thanks/Credits Slide                                                      */
/*****************************************************************************/
ThanksSlide = function()
{
    this.name = "ThanksSlide";
    SimpleSlide.call(this);
}

ThanksSlide.prototype = new SimpleSlide();

ThanksSlide.prototype.init = function(App)
{
    SimpleSlide.prototype.init.call(this, App);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initFadeAnimations();
}

ThanksSlide.prototype.loadResources = function()
{

}

//slides.push(new IntroSlide());
//slides.push(new MyBioSlide());
//slides.push(new PBGamesSlide());
//slides.push(new PunkBusterServicesSlide());
//slides.push(new PnkBstrASlide());
//slides.push(new FnkBstrASlide());
//slides.push(new PnkBstrBSlide());
//slides.push(new DeobfuscateSlide());
//slides.push(new AntiRESlide());
//slides.push(new DecryptionSlide());
//slides.push(new PbclHookingSlide());
//slides.push(new ObfuscatedCodeSlide());
//slides.push(new PreceptionSlide());
slides.push(new NinkoSlide());
