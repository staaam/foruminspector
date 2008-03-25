/* begin Category class */
function Category(parent, url, title) {
    this.init(parent, url, title);
}

Category.prototype = new ForumItem();

Category.prototype.idRegEx = /[?&]c=(\d+)/;
Category.prototype.viewer = "index.php";
/* end Category class */