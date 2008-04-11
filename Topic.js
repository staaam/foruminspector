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
    this.posts = getText(tds[2]);
    this.author = getText(tds[3]);
    this.views = getText(tds[4]);
    this.lastPost = parseLastPost(this, tds[5]);
    // tds[5] last post date; author, link
};

Topic.prototype.isSelected = function () {
	return ctrl.isSelectedTopic(this);
};

Topic.prototype.parse = function (content) {
    if (content == null) {
        return;
    }
    this.dir = content.match(/<html dir="rtl">/i) ? "rtl" : "ltr";
    var dom = toDOM(getBody(content));
    if (this.title == this.url) {
        // try load title from the page
        var as = dom.getElementsByTagName('a');
        for (var i=0;i<as.length;i++) {
            var cl = as[i].className;
            var hr = as[i].getAttribute('href');
            if (cl && cl == "maintitle" && hr && hr.indexOf(this.viewer) == 0) {
                this.title = as[i].innerHTML;
                break;
            }
        }
    }
    var tables = dom.getElementsByTagName('table');
    for (var i=0; i<tables.length; i++) {
        this.tryParsePostsTable(tables[i]);
    }
};

Topic.prototype.tryParsePostsTable = function (table) {
    if (table.className != 'forumline' ||
        !this.tryParsePostsHeader(table)) {
        return false;
    }
    
    var trs = table.getElementsByTagName('tr'); // all table rows, first row is nav, second row is headers
    for (var i=0; i<trs.length; i++) {
        this.tryParseTopicTableRow(trs[i], i);
    }
    return true;
};

Topic.prototype.tryParsePostsHeader = function (table) {
    var ths = table.getElementsByTagName('th');
    if (ths == null || ths.length < 2) {
        return false;
    }
    
    // assumption -- every and only posts table has row with th's
    if (!labels.author) { labels.author = getText(ths[0]); }
    if (!labels.post)   { labels.post = getText(ths[1]); }
    
    return true;
};

Topic.prototype.tryParseTopicTableRow = function (tr, idx) {
    var spans = tr.getElementsByTagName('span');
    if (spans.length == 0) {
        return false;
    }
    
    var text = "";
    for (var i=0; i<spans.length;i++) {
    	if (spans[i].className == 'postbody') {
    		var imgs = spans[i].getElementsByTagName('img');
    		for (var j=0;j<imgs.length;j++) {
    			imgs[j].src = this.mkFullUrl(imgs[j].getAttribute("src"));
    			imgs[j].className="outerImage";
    		}
    		text = text + spans[i].innerHTML;
    	}
    }
    
    if (text.length == 0) {
    	return false;
    }
    var tb = tr.getElementsByTagName('table')[0];
    if (!tb) {
    	return false;
    }
    var a = tb.getElementsByTagName('a')[0];
    if (!a) {
    	return false;
    }
    var post = ctrl.newPost(this, this.mkFullUrl(a.getAttribute('href')));
    post.text = text;
    post.parseTopicTableRow(tr);
    this.addItem(post);    
    // title/link is is first <a> tag, so look into it
//    var topic = ctrl.newTopic(this, this.mkFullUrl(as[0].getAttribute('href')), as[0].innerHTML);
//    topic.index = idx;
//    topic.parseForumTableRow(tr);
//    this.addItem(topic);
    return true;
};

Topic.prototype.toHTML = function () {
    return "<span class='topic'><a href=\"" + this.url + "\" target=\"_blank\">"+this.title+"</a><div class='parentForum'>"+labels.forum + ":" + this.parent.toHTMLlink() +"</div><div class='views'>"+labels.views+": "+this.views+"</div><div class='posts'>"+labels.posts+": "+this.posts+"</div></span>"
}
/* end Topic class */
