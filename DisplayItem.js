/* begin DisplayItem class */
function DisplayItem() {
}

DisplayItem.prototype.initDisplayItem = function (parent) {
    this.parent = parent;
   
	this.myself = document.createElement("div");
   	parent.appendChild(this.myself);
}

/* end DisplayItem class */