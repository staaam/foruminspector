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
    this.hasNewPosts = img.title; // has/has no new posts
    if (img.src.match("folder_announce")) {
        this.type = "announce";
    }
    else if (img.src.match("folder_sticky")) {
        this.type = "sticky";
    }
    else {
        this.type = "normal";
    }
    
    // tds[1] topic title, link; type (announce/sticky/norm in lang); pages
    this.posts = tds[2].textContent;
    this.author = tds[3].textContent;
    this.views = tds[4].textContent;
    // tds[5] last post date; author, link
};

Topic.prototype.toHTML = function () {
    return "<span class='topic'><a href=\"" + this.url + "\" target=\"_blank\">"+this.title+"</a><div class='parentForum'>"+this.parent.parent.label.forum + ":" + this.parent.toHTMLlink() +"</div><div class='views'>"+this.parent.label.views+": "+this.views+"</div><div class='posts'>"+this.parent.label.posts+": "+this.posts+"</div></span>"
}
/* end Topic class */