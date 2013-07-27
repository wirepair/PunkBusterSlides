Queue = function()
{
    this.list = [];
    this.index = -1;

    this._current = null;
}

Queue.prototype.push = function(obj)
{
    this.list.push(obj);
}

Queue.prototype.setList = function(list)
{
    this.list = list;
    this.index = -1;
}

Queue.prototype.current = function()
{
    return this._current;
}

Queue.prototype.peek = function()
{
    return this.list[this.index+1];
}

Queue.prototype.get = function(index)
{
    this._current = this.list[this.index];
    return this._current; 
}
Queue.prototype.last = function()
{
    return this.list[this.list.length-1];
}
Queue.prototype.next = function()
{
    if (this.peek() == null)
    {
        return null;
    }
    this.index += 1;
    this._current = this.list[this.index];
    return this._current;

}

Queue.prototype.prev = function()
{
    if (this.index != -1)
    {
        this.index -= 1;
        this._current = this.list[this.index];
        return this._current;
    }
    else
    {
        return null;
    }
}
Queue.prototype.isBeginning = function()
{
    return (this.index <= 0) ? true : false;
}

Queue.prototype.isEnd = function()
{
    return (this.index+1 == this.list.length) ? true : false;
}

Queue.prototype.getIndex = function()
{
    return this.index;
}

Queue.prototype.reset = function()
{
    this.index = -1;
    this._current = null;
}

Queue.prototype.length = function()
{
    return this.list.length;
}

Queue.prototype.empty = function()
{
    return this.list.length == 0 ? true : false;
}
