/* begin Category class */
function Category(parent, url, title) {
    this.init(parent, url, title);
}

Category.prototype = new ForumItem();

Category.prototype.idRegEx = /[?&]c=(\d+)/;
Category.prototype.viewer = "index.php";

Category.prototype.visibleSubItems = function () {
	return ctrl.isShowAllForums() ? this.subItems : this.selSubItems();
}

/* end Category class */