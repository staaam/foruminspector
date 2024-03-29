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
    var post = {
    	date: "",
		author: "",
		authorProfileLink: "",
		url: "",
		id: 0
    };
	for (var i=0; i<as.length; i++) {
		var a = as[i];
		var href = getHref(a);
		if (!href)
			continue;
		if (href.match(/profile.php/)) {
			// author element
			post.author = getText(a);
			post.authorProfileLink = that.mkFullUrl(href);
		}
		else if (href.match(/viewtopic.php/)) {
			// last post
			post.url = that.mkFullUrl(href);
		}
	}
    var date = lastPost.innerHTML;
    var ds = date.match(/^(.*?)<br\/?>(.*?)</i);
    if (ds && ds.length > 1) {
    	post.date = ds[1];
	    if (!post.author && ds.length > 2)
	    	post.author = ds[2];
    }
	var p = new Post(that, post.url);
	p.date = post.date;
	p.author = post.author;
	p.authorProfileLink = post.authorProfileLink;
    return p;
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
            var hr = getHref(as[i]);
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
    var ths = this.getTableHeader(table);
    if (ths == null || ths.length < 4) {
        return false;
    }
    
    // assumption -- every and only topics table has row with th's
    labels.topics = getText(ths[0]);
    labels.posts = getText(ths[1]);
    labels.author = getText(ths[2]);
    labels.views = getText(ths[3]);
    labels.lastPost = getText(ths[4]);
    
    return true;
};

Forum.prototype.parseForumTableRow = function (tr, idx) {
    var as = tr.getElementsByTagName('a');
    if (as.length == 0) {
        return false;
    }
    // title/link is is first <a> tag, so look into it
    var topic = ctrl.newTopic(this, this.mkFullUrl(getHref(as[0])), as[0].innerHTML);
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