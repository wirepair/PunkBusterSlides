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
slides.push(new IntroSlide());



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
    this.root.add(line);

    // Tell the framework about our object
    this.setObject3D(this.root);
    this.initAnimations();
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

    this.setObject3D(this.root);
    this.initAnimations();
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
    tweenjs.init({tweens: tween_group, duration: duration * 2 }); //, onComplete: group.onGroupComplete
    return tweenjs;
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
    this.root = new THREE.Object3D();

    SimpleSlide.prototype.init.call(this, App);
    this.materials = [];

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
    var texture = THREE.ImageUtils.loadTexture("resources/BattlefieldPlay4Free_box.jpg");
    var material = new THREE.MeshLambertMaterial( { color: 0x888888, map: texture, transparent: true, opacity: 0}); //
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

    
    // Gear Model
    var loader = new THREE.ColladaLoader();
    var that = this;
    this.pba_gear = new THREE.Object3D();
    this.pbb_gear = new THREE.Object3D();
    this.pbcl_gear = new THREE.Object3D();

    loader.load.call(this, "resources/models/Gear-Handmade.dae", function ( collada ) {
                

                that.dae = collada.scene;
                skin = collada.skins[ 0 ];

                that.dae.position.x = 250;
                that.dae.position.y = 220;
                that.dae.position.z = 5;
                // set the model to the center so we can rotate it properly.
                that.dae.children[0].position.set(0,0,0); 
                that.dae.updateMatrix();
                var geometry = that.dae.children[ 0 ].geometry;
                var material = that.dae.children[ 0 ].material;

                // PnkBstrA gear
                that.pba_gear = copyModel(geometry, material);
                that.pba_gear.scale.x =  that.pba_gear.scale.y = that.pba_gear.scale.z = 25;
                that.pba_gear.position.set(250, 220, 5);
                

                // PnkBstrB gear
                that.pbb_gear = copyModel(geometry, material);
                that.pbb_gear.scale.x =  that.pbb_gear.scale.y = that.pbb_gear.scale.z = 25;
                that.pbb_gear.position.set(-250, 220, 5);

                // pbcl.dll gear
                that.pbcl_gear = copyModel(geometry, material);
                that.pbcl_gear.scale.x =  that.pbcl_gear.scale.y = that.pbcl_gear.scale.z = 25;
                that.pbcl_gear.position.set(250, 220, 5);                
                
                // set transparency for the gears.
                for (var i = 0; i < that.pba_gear.material.materials.length; i++)
                {
                    that.pba_gear.material.materials[i].transparent = true;
                    that.pba_gear.material.materials[i].opacity = 0;
                    that.pbb_gear.material.materials[i].transparent = true;
                    that.pbb_gear.material.materials[i].opacity = 0;
                    that.pbcl_gear.material.materials[i].transparent = true;
                    that.pbcl_gear.material.materials[i].opacity = 0;
                }

                that.root.add(that.pba_gear);
                that.root.add(that.pbb_gear);
                that.root.add(that.pbcl_gear);
                // must init our animations after model has loaded here.
                that.initAnimations.call(that);
    });

    
    this.createLighting();

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
    
}

PunkBusterServicesSlide.prototype.createTextObject = function(text, position, x, y, z)
{
     // text objects
    object = this.create2dText(text, 20);
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
    this.app.camera.position.set(0,150,400);
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

PunkBusterServicesSlide.prototype.update = function()
{
    Sim.Object.prototype.update.call(this);
}
PunkBusterServicesSlide.prototype.nextAnimation = function()
{
    // if we are reloaded our opacity will be reset.
    if (this.animations.isBeginning())
    {
        for (var i = 0; i < this.materials.length; i++)
        {
            //this.materials[i].opacity = 0;
        }        
    }
    SimpleSlide.prototype.nextAnimation.call(this)
}

slides.push(new PunkBusterServicesSlide());











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