/* begin ListDisplayItem class */
function ListDisplayItem(parent) {
	this.initDisplayItem(parent)
	this.myself.className = "listDisplayItem";
}

ListDisplayItem.prototype = new DisplayItem();
/* end ListDisplayItem class */	