/* begin ForumDisplayItemSecondary class */
function ForumDisplayItemSecondary(parent) {
	this.initDisplayItem(parent)
	this.myself.className = this.myself.className + " ForumDisplayItemSecondary";
}

ForumDisplayItemSecondary.prototype = new DisplayItem();
/* end ForumDisplayItemSecondary class */	