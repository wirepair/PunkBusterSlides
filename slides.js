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

    var mohawk = "resources/isaac.mohawk.png";
    var geometry = new THREE.PlaneGeometry(3.337, 3);
    var texture = THREE.ImageUtils.loadTexture(mohawk);
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
    var mesh = new THREE.Mesh( geometry, material ); 

    // Tell the framework about our object
    this.setObject3D(mesh);
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

    var mohawk = "resources/punk.gif";
    var geometry = new THREE.PlaneGeometry(3.337, 3);
    var texture = THREE.ImageUtils.loadTexture(mohawk);
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
    var mesh = new THREE.Mesh( geometry, material ); 
    mesh.position.z = -100;
    // Tell the framework about our object
    this.setObject3D(mesh);
    this.initAnimations();
}

SecondSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "animatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.rotateIn(this.object3D),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "animatorIn";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.rotateOut(this.object3D),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
    //animatorOut.subscribe("complete", this, this.onAnimationComplete);
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

    var mohawk = "resources/cherry1.png";
    var geometry = new THREE.PlaneGeometry(3.337, 3);
    var texture = THREE.ImageUtils.loadTexture(mohawk);
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture } );
    var mesh = new THREE.Mesh( geometry, material ); 
    mesh.position.z = -100;
    // Tell the framework about our object
    this.setObject3D(mesh);
    this.initAnimations();
}

ThirdSlide.prototype.initAnimations = function()
{
    var animatorIn = new Sim.KeyFrameAnimator;
    animatorIn.name = "animatorIn";
    animatorIn.init({ 
        interps: ObjectEffects.prototype.rotateIn(this.object3D),
        loop: false,
        duration: 500
    });
    this.addChild(animatorIn); 
    this.animations.push(animatorIn);
    var animatorOut = new Sim.KeyFrameAnimator;
    animatorOut.name = "animatorIn";
    animatorOut.init({ 
        interps: ObjectEffects.prototype.rotateOut(this.object3D),
        loop: false,
        duration: 500
    });    

    this.addChild(animatorOut);
    this.animations.push(animatorOut);
    //animatorOut.subscribe("complete", this, this.onAnimationComplete);
}
slides.push(new ThirdSlide());
