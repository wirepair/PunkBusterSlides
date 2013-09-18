/*
 * AnimationEffects - Creates various keys/positions for interpolation in animations.
 * @author: Isaac Dawson https://github.com/wirepair/
*/

AnimationEffects = function()
{

}
AnimationEffects.prototype = new Object();

AnimationEffects.prototype.moveMeshDown = function(mesh)
{
    var down = new ThreePrez.KeyFrameAnimator;
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

AnimationEffects.prototype.moveMeshDownIn = function(mesh)
{
    var down = new ThreePrez.KeyFrameAnimator;
    down.name = "moveDownAnimation";
    var m = mesh.position;
    var mr = mesh.rotation;
    var keys = [0, .25, 1];
    var position_values = [
        { x: m.x, y: 2000, z: m.z}, 
        { x: m.x, y: 1000, z: m.z},
        { x: m.x, y: 140, z: m.z}
    ];
    
    var interps = [{keys: keys, values: position_values, target: mesh.position}];
    down.init({
        interps: interps,
        loop: false,
        duration: 250
    });
    return down;
}

AnimationEffects.prototype.moveMeshDownOut = function(mesh)
{
    var down = new ThreePrez.KeyFrameAnimator;
    down.name = "moveDownAnimation";
    var m = mesh.position;
    var mr = mesh.rotation;
    var keys = [0, .25, 1];
    var position_values = [
        { x: m.x, y: 140, z: m.z}, 
        { x: m.x, y: -1000, z: m.z},
        { x: m.x, y: -1850, z: m.z}
    ];
    
    var interps = [{keys: keys, values: position_values, target: mesh.position}];
    down.init({
        interps: interps,
        loop: false,
        duration: 250
    });
    return down;
}



AnimationEffects.prototype.moveMeshSide = function(mesh, z, rotate)
{
    var side = new ThreePrez.KeyFrameAnimator;
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

AnimationEffects.prototype.moveMeshRightSide = function(mesh, z, rotate)
{
    var side = new ThreePrez.KeyFrameAnimator;
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


AnimationEffects.prototype.moveMeshBack = function(mesh, z)
{
    var back = new ThreePrez.KeyFrameAnimator;
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
 * rotateIn - rotates the object (either root or single object) by
 * setting keys and values to be interpolated from a negative z incrementally to a positive
 * z axis.
 *
 */
AnimationEffects.prototype.rotateIn = function(object3D)
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
AnimationEffects.prototype.rotateOut = function(object3D)
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

AnimationEffects.prototype.slideIn = function(object3D, target)
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
AnimationEffects.prototype.moveFloorIn = function(object3D)
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
AnimationEffects.prototype.moveFloorOut = function(object3D)
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

AnimationEffects.prototype.slideUp = function(object3D)
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
AnimationEffects.prototype.fadeIn = function( materials )
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
AnimationEffects.prototype.fadeOut = function( materials )
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
AnimationEffects.prototype.tweenObjectToAxisRotateZ = function ( objects, targets, duration, axis )
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
    var tweenjs = new ThreePrez.TweenjsAnimator;
    tweenjs.init({tweens: tween_group, duration: duration });
    return tweenjs;
}

AnimationEffects.prototype.makeVisible = function( objects )
{
    return [{ 
                keys:[0, 1], 
                values:[ { opacity: 0},
                         { opacity: 1} 
                         ],
                target: objects
                }];
}
