/* begin Forum class */
function Forum(parent, url, title) {
    this.init(parent, url, title);
}

Forum.prototype = new ForumItem();

Forum.prototype.idRegEx = /[?&]f=(\d+)/;
Forum.prototype.viewer = "viewforum.php?f=";

Forum.prototype.parseBoardTableRow = function(tr) {
    var tds = tr.getElementsByTagName('td');
    // tds[0] img, whether has new posts?
    var img = tds[0].getElementsByTagName('img')[0];
    this.icon = img.src; // icon
    this.hasNewPosts = img.title; // has/has no new posts
    
    // tds[1] forum title, link; description; moderator(s)
    this.topics = getText(tds[2]);
    this.posts = getText(tds[3]);
    // tds[4] last post date; author, link
    this.lastPost = parseLastPost(this, tds[4]);
};

function parseLastPost(that, td) {
    var lastPost = td.getElementsByTagName('span')[0];
	var as = lastPost.getElementsByTagName('a');
    var author = as[0];
    var date = lastPost.innerHTML;
    var ds = date.match(/^(.*?)<br/);
    if (ds && ds.length > 1) {
    	ds = ds[1];
    }
    var post = {
    	date: ds,
		author: getText(author),
		authorProfileLink: that.mkFullUrl(author.getAttribute('href')),
		link: "",
		id: 0
    };
    if (as[1]) {
    	post.link = that.mkFullUrl(as[1].getAttribute('href'));
    	var m = Post.prototype.linkMatch(post.link);
    	if (m) {
    		post.id = m[1];
    	}
    }
    return post;
}

Forum.prototype.parse = function (content) {
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
        this.tryParseTopicsTable(tables[i]);
    }
};

Forum.prototype.tryParseTopicsTable = function (table) {
    if (table.className != 'forumline' ||
        !this.tryParseTopicsHeader(table)) {
        return false;
    }
    
    var trs = table.getElementsByTagName('tr'); // all table rows, first row is headers
    for (var i=1; i<trs.length; i++) {
        this.parseForumTableRow(trs[i], i);
    }
    return true;
};

Forum.prototype.tryParseTopicsHeader = function (table) {
    var ths = table.getElementsByTagName('th');
    if (ths == null || ths.length < 4) {
        return false;
    }
    
    // assumption -- every and only topics table has row with th's
    if (!labels.topics)   { labels.topics = getText(ths[0]); }
    if (!labels.posts)    { labels.posts = getText(ths[1]); }
    if (!labels.author)   { labels.author = getText(ths[2]); }
    if (!labels.views)    { labels.views = getText(ths[3]); }
    if (!labels.lastPost) { labels.lastPost = getText(ths[4]); }
    
    return true;
};

Forum.prototype.parseForumTableRow = function (tr, idx) {
    var as = tr.getElementsByTagName('a');
    if (as.length == 0) {
        return false;
    }
    // title/link is is first <a> tag, so look into it
    var topic = ctrl.newTopic(this, this.mkFullUrl(as[0].getAttribute('href')), as[0].innerHTML);
    topic.index = idx;
    topic.parseForumTableRow(tr);
    this.addItem(topic);
    return true;
};

Forum.prototype.isSelected = function () {
	return ctrl.isSelectedForum(this);
};

Forum.prototype.toHTML = function () {
    return "<span class='forum'>" + this.toHTMLlink() + "</span>";
};

Forum.prototype.toHTMLlink = function () {
    return "<a href=\"" + this.url + "\" target=\"_blank\">"+this.title+"</a>";
};
/* end Forum class */