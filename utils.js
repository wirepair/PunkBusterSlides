function copyFields(material)
{
	var newMaterial = new THREE.MeshPhongMaterial();
    for (var p in material) {
        if (material.hasOwnProperty(p) && p !== "id") {
            var obj = material[p];
            newMaterial[p] = obj;
        }
    }
    return newMaterial;
}

function copyMaterial(material)
{
	if (material.hasOwnProperty("materials"))
	{
		var mats = [];
        for (var i = 0; i < material.materials.length; i++)
        {                        
        	mats.push(copyFields(material.materials[i]));
        }
        return mats;
	}
	return copyFields(material);
}

function copyModel(geometry, material)
{
	var meshface = new THREE.MeshFaceMaterial();
	meshface.materials = copyMaterial(material);
	return new THREE.Mesh( geometry,  meshface );
}

function getPowerOfTwo(value, pow) 
{
	var pow = pow || 1;
	while ( pow < value ) 
	{
	    pow *= 2;
	}
	return pow;
}

function getRandomColor()
{
	var color = getRandomInt(0, 256);
	color = color << 16;
	color += getRandomInt(0, 256) << 8;
	color += getRandomInt(0, 256);
	return color;
}

function getRandomInt (min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}