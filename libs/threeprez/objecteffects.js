/*
 * ObjectEffects - Probably should remove/rename this, but creates light objects.
 * @author: Isaac Dawson https://github.com/wirepair/
*/
/* VARIOUS EFFECTS FOR OBJECTS */
ObjectEffects = function()
{

}
ObjectEffects.prototype = new Object();

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
