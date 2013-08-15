SlideResources = function()
{
	this.slide_resources = new Queue();
}

SlideResources.prototype = new Object();

SlideResources.prototype.getResources = function(slide_index)
{
	if (slide_index < 0 || slide_index > this.slide_resources.length())
	{
		return null;
	}
	return this.slide_resources.get(slide_index);
}


ResourceLoader = function()
{
	this.name = "ResourceLoader";
	
	this.textures = [];
	this.models = [];
	this.materials = [];
}

ResourceLoader.prototype = new Object();

ResourceLoader

ResourceLoader.prototype.loadTexture = function(texture, slide_index)
{

}

ResourceLoader.prototype.loadModel = function(model, slide_index)
{

}