// Constructor
SlidesApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
SlidesApp.prototype = new Sim.App();

// Our custom initializer
SlidesApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	this.slides = [];
    this.slides_index = 0;
    var intro = new IntroSlide();
    intro.init();
    this.slides.push(intro);
    this.focus();
    this.animating = false;
    this.nextSlide();
}

SlidesApp.prototype.nextSlide = function()
{
   
    if (this.slides_index != 0)
    {
        var slide = this.slides[this.slides_index-1];
        this.animateOut(slide);
    }

    var slide = this.slides[this.slides_index]
    this.animating = !this.animating;
    console.log("loading slide animating is: " + this.animating);
    slide.subscribe("in_complete", this, this.onAnimationInComplete);
    slide.subscribe("out_complete", this, this.onAnimationOutComplete);
    this.addObject(slide);
    slide.animate(this.animating , "in");
    this.slides_index++;
}

SlidesApp.prototype.animateOut = function(slide)
{
    this.animating = true;
    slide.animate(this.animating, "out");
}

SlidesApp.prototype.previousSlide = function()
{

}

SlidesApp.prototype.handleKeyDown = function(keyCode, charCode)
{
    switch(keyCode)
    {
        case Sim.KeyCodes.KEY_LEFT:
            this.previousSlide();
            break;
        case Sim.KeyCodes.KEY_RIGHT:
            this.nextSlide();
            break;
    }
//            this.animating = !this.animating;
//            this.intro.animate(this.animating);

}

SlidesApp.prototype.onAnimationInComplete = function()
{
    this.animating = false;
}

SlidesApp.prototype.onAnimationOutComplete = function()
{
    this.animating = false;
}

SlidesApp.prototype.update = function()
{
    Sim.App.prototype.update.call(this);
}


SimpleSlide = function()
{
    Sim.Object.call(this);   
}
SimpleSlide.prototype = new Sim.Object();

SimpleSlide.prototype.init = function()
{

}

SimpleSlide.prototype.animateIn = function(on)
{ 
    ( on == true ) ? this.animatorIn.start() : this.animatorIn.stop();
}

SimpleSlide.prototype.animateOut = function(on)
{
    ( on == true ) ? this.animatorOut.start() : this.animatorOut.stop();
}

SimpleSlide.prototype.animate = function(on, flag)
{
    console.log("animate: " + on + " flag: " + flag);
    ( flag == "in" ) ? this.animateIn(on) : this.animateOut(on); 
}

SimpleSlide.prototype.onAnimationInComplete = function()
{
    this.publish("in_complete");
    this.animator.unsubscribe("in_complete");
}

SimpleSlide.prototype.onAnimationOutComplete = function()
{
    this.publish("out_complete");
    console.log("out is complete.");
    this.animator.unsubscribe("out_complete");
}


IntroSlide = function()
{
	Sim.Object.call(this);
    this.texture = null;
}

IntroSlide.prototype = new SimpleSlide();

IntroSlide.prototype.init = function()
{
    var mohawk = "resources/isaac.mohawk.png";
    var geometry = new THREE.PlaneGeometry(3.337, 3);
    this.texture = THREE.ImageUtils.loadTexture(mohawk);
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: this.texture } );
    var mesh = new THREE.Mesh( geometry, material ); 

    // Tell the framework about our object
    this.setObject3D(mesh);
    this.animatorIn = new Sim.KeyFrameAnimator;
    this.animatorIn.init({ 
        interps:
            [ 
            { keys:IntroSlide.inPositionKeys, values:IntroSlide.inPositionValues, target:this.object3D.position },
            { keys:IntroSlide.inRotationKeys, values:IntroSlide.inRotationValues, target:this.object3D.rotation } 
            ],
        loop: false,
        duration: 3000
    });
    this.addChild(this.animatorIn); 
    this.animatorIn.subscribe("in_complete", this, this.onAnimationInComplete);

    this.animatorOut = new Sim.KeyFrameAnimator;
    this.animatorOut.init({ 
        interps:
            [ 
            { keys:IntroSlide.outPositionKeys, values:IntroSlide.outPositionValues, target:this.object3D.position },
            { keys:IntroSlide.outRotationKeys, values:IntroSlide.outRotationValues, target:this.object3D.rotation } 
            ],
        loop: false,
        duration: 3000
    });    

    this.addChild(this.animatorOut);    
    this.animatorOut.subscribe("out_complete", this, this.onAnimationOutComplete);
}



IntroSlide.inPositionKeys = [0, .25, .75, 1];
IntroSlide.inPositionValues = [ { x : 0, y: 0, z : -100}, 
                        { x: 0, y: 0, z: -75},
                        { x: 0, y: 0, z: -50},
                        { x : 0, y: 0, z : 0}
                        ];
IntroSlide.inRotationKeys = [0, .5, 1];
IntroSlide.inRotationValues = [ { z: 0 }, 
                                { z: Math.PI},
                                { z: Math.PI * 2 },
                                ];

IntroSlide.outPositionKeys = [0, .25, .75, 1];
IntroSlide.outPositionValues = [ { x : 0, y: 0, z : 0}, 
                        { x: 0, y: 0, z: -25},
                        { x: 0, y: 0, z: -75},
                        { x : 0, y: 0, z : -100}
                        ];
IntroSlide.outRotationKeys = [0, .5, 1];
IntroSlide.outRotationValues = [ { z: 0 }, 
                                { z: Math.PI},
                                { z: Math.PI * 2 },
                                ];
