/* begin Post class */
function Post(parent, url, title) {
    this.init(parent, url, title);
}

Post.prototype = new ForumItem();

Post.prototype.idRegEx = /[?&]p=(\d+)/;
Post.prototype.viewer = "viewpost.php?p=";

Post.prototype.parseTopicTableRow = function (tr) {
	
};
/* end Post class */
