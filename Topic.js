/* begin Topic class */
function Topic(parent, url, title) {
    this.init(parent, url, title);
}

Topic.prototype = new ForumItem();

Topic.prototype.idRegEx = /[?&]t=(\d+)/;
Topic.prototype.viewer = "viewtopic.php?t=";

Topic.prototype.parseForumTableRow = function (tr) {
    var tds = tr.getElementsByTagName('td');
    // tds[0] img, whether has new posts?
    var img = tds[0].getElementsByTagName('img')[0];
    this.icon = img.src; // icon
    this.hasNewPostsTitle = img.title; // has/has no new posts
    if (img.src.match("_announce")) {
        this.type = "announce";
    }
    else if (img.src.match("_sticky")) {
        this.type = "sticky";
    }
    else {
        this.type = "normal";
    }
  	this.hasNewPosts = img.src.match("_new") ? true : false;
   	this.isLocked = img.src.match("_lock") ? true : false;
   	this.isHot = img.src.match("_hot") ? true : false;
    
   // tds[1] topic title, link; type (announce/sticky/norm in lang); pages
    this.posts = tds[2].textContent;
    this.author = tds[3].textContent;
    this.views = tds[4].textContent;
    this.lastPost = parseLastPost(this, tds[5]);
    // tds[5] last post date; author, link
};

Topic.prototype.isSelected = function () {
	return ctrl.isSelectedTopic(this);
};

Topic.prototype.toHTML = function () {
    return "<span class='topic'><a href=\"" + this.url + "\" target=\"_blank\">"+this.title+"</a><div class='parentForum'>"+this.parent.parent.label.forum + ":" + this.parent.toHTMLlink() +"</div><div class='views'>"+this.parent.label.views+": "+this.views+"</div><div class='posts'>"+this.parent.label.posts+": "+this.posts+"</div></span>"
}
/* end Topic class */
