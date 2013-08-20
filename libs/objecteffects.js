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

ObjectEffects.prototype.slideIn = function(object3D, target)
{
    var inPositionKeys = [0, .25, .75, 1];
    var inPositionValues = [ { x : 1000, y: target[1], z : target[2]}, 
                            { x: 500, y: target[1], z : target[2]},
                            { x: 250, y: target[1], z : target[2]},
                            { x : target[0], y: target[1], z : target[2]}
                            ];
    return [ 
            { keys:inPositionKeys, values:inPositionValues, target:object3D.position }
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

ObjectEffects.prototype.slideUp = function(object3D)
{
    var keys = [0, .75, 1];
    var values = [ 
                   { x: 0, y: -500, z: 5},
                   { x: 0, y: 0, z: 5},
                   { x : 0, y: 100, z : 0}
    ];

    return [ 
            { keys:keys, values:values, target:object3D.position }
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
ObjectEffects.prototype.tweenObjectToAxisRotateZ = function ( objects, targets, duration, axis )
{
    var tween_group = [];
    for ( var i = 0; i < objects.length; i ++ ) 
    {

        var object = objects[ i ];
        var target = targets[ i ];
        if( axis == 'x')
        {
            tween_group.push(new TWEEN.Tween( object.position )
                .to( { x: target.position.x }, duration )
                .easing( TWEEN.Easing.Exponential.InOut ));
        } 
        else if ( axis == 'y')
        {
            tween_group.push(new TWEEN.Tween( object.position )
                .to( { y: target.position.y }, duration )
                .easing( TWEEN.Easing.Exponential.InOut ));
        }

        tween_group.push(new TWEEN.Tween( object.rotation )
            .to( { z: target.rotation.z }, duration ))
    }
    var tweenjs = new Sim.TweenjsAnimator;
    tweenjs.init({tweens: tween_group, duration: duration });
    return tweenjs;
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
ObjectEffects.prototype.createSpotlight = function(color, debug)
{
    var spotlight = new THREE.SpotLight(color);
    spotlight.shadowCameraVisible = debug || false;
    spotlight.shadowDarkness = 0.15;
    spotlight.intensity = 2;
    // must enable shadow casting ability for the light
    spotlight.castShadow = true;
    return spotlight;
}

ObjectEffects.prototype.createPointLight = function(color, debug)
{
    var point_light = new THREE.PointLight(color);
    point_light.shadowCameraVisible = debug || false;
    point_light.shadowDarkness = 0.15;
    point_light.intensity = 0.2;
    // must enable shadow casting ability for the light
    point_light.castShadow = true;
    return point_light;
}

ObjectEffects.prototype.makeVisible = function( objects )
{
    return [{ 
                keys:[0, 1], 
                values:[ { opacity: 0},
                         { opacity: 1} 
                         ],
                target: objects
                }];
}
