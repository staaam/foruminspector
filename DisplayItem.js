/* begin DisplayItem class */
function DisplayItem() {
}

DisplayItem.prototype.init = function (parent, className) {
    this.parent = parent;
   
	this.myself = document.createElement("div");
	this.myself.className = className;
   	parent.appendChild(this.myself);
}

DisplayItem.prototype.loadItemsCallback( forumsArr )
{
	
}

/* end DisplayItem class */