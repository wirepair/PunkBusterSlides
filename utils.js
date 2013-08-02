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