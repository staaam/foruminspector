/* begin DisplayItem class */
function DisplayItem() {
}

DisplayItem.prototype.initDisplayItem = function (parent) {
    this.parent = parent;
   
	this.myself = document.createElement("div");
	this.myself.className = className;
   	parent.appendChild(this.myself);
}

/* end DisplayItem class */