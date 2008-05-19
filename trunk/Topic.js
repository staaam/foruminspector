/* begin Topic class */
function Topic(parent, url, title) {
	var po = "&postorder=" + ctrl.getPostOrder();
    this.init(parent, url + po, title);
    this.replylink = url.replace("viewtopic.php?", "posting.php?mode=reply&");
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

Topic.prototype.isUpdated = function () {
	return this.lastPost.id > ctrl.getLastPost();
}

Topic.prototype.isNew = function () {
	return this.id > ctrl.getLastTopic();
}

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
            var hr = getHref(as[i]);
            if (cl && cl == "maintitle" && hr && hr.indexOf(this.viewer) == 0) {
                this.title = as[i].innerHTML;
                break;
            }
        }
    }
    var as = dom.getElementsByTagName('a');
    for (var i=0; i<as.length; i++) {
    	var hr = getHref(as[i]);
    	var text = getText(as[i]);
    	var imgs = as[i].getElementsByTagName('img');
    	if (!text && imgs && imgs.length > 0) {
    		text = imgs[0].alt;
    	}
    	if (!text) {
    		continue;
    	}
    	if (hr.match(/posting.php/)) {
    		if (hr.match(/mode=reply/)) {
    			labels.reply = text;
    		}
    		else if (hr.match(/mode=quote/)) {
    			labels.quote = text;   			
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
    var ths = this.getTableHeader(table);
    if (ths == null || ths.length < 2) {
        return false;
    }
    
    // assumption -- every and only posts table has row with th's
    labels.author = getText(ths[0]);
    labels.post = getText(ths[1]);
    
    return true;
};
function pushArr(arr1, arr2) {
    for (var i=0; i<arr2.length;i++) {
    	arr1.push(arr2[i]);
    }
    return arr1;
}

Topic.prototype.tryParseTopicTableRow = function (tr, idx) {
    var spans = [];
    spans = pushArr(spans, tr.getElementsByTagName('div'));
    spans = pushArr(spans, tr.getElementsByTagName('span'));

    if (spans.length == 0) {
        return false;
    }
    
    var text = "";
    var author = "";
    var details = "";
    for (var i=0; i<spans.length;i++) {
    	var s = spans[i];
    	switch (s.className) { 
	    	case 'postbody' :
	    		var imgs = s.getElementsByTagName('img');
	    		for (var j=0;j<imgs.length;j++) {
	    			imgs[j].src = this.mkFullUrl(getSrc(imgs[j]));
	    			imgs[j].className="outerImage";
	    		}
	    		text = text + s.innerHTML;
	    		break;
	    	case 'name' :
	    		author = getText(s);
	    		break;
	    	case 'postdetails':
	    		var t = getText(s);
	    		if (t) {
	    			details = t;
	    		}
	    		break;
	    	default:
    	}	
    }
    
    if (text.length == 0) {
    	return false;
    }

    var as = tr.getElementsByTagName('a');
    var post;
    for (var i in as) {
    	try {
    		var a = this.mkFullUrl(getHref(as[i]));
    		post = new Post(this, a);
	    	if (post.id) {
	    		break;
	    	}
    	} catch (e) {}
    	post = null;
    }
    if (post == null) {
    	return false;
    }

    post.text = text;
    post.author = author;
    post.details = details;
//    for (var i in as) {
//    	var url = this.mkFullUrl(getHref(as[i]));
//    	if (url.match(/posting.php/)) {
//    		post.quoteLink = url;
//
//    		labels.quote = getText(as[i]);
//    		if (!labels.quote) {
//    			var img = as[i].getElementsByTagName('img');
//    			if (img) {
//    				img = img[0];
//    				labels.quote = img.alt;
//    			}
//    			else {
//    				labels.quote = "Quote";
//    			} 
//    		}
//    		break;
//    	}
//    }
    
    post.parseTopicTableRow(tr);
    this.addItem(post);    
    // title/link is is first <a> tag, so look into it
//    var topic = ctrl.newTopic(this, this.mkFullUrl(getHref(as[0])), as[0].innerHTML);
//    topic.index = idx;
//    topic.parseForumTableRow(tr);
//    this.addItem(topic);
    return true;
};

Topic.prototype.toHTML = function () {
    return "<span class='topic'><a href=\"" + this.url + "\" target=\"_blank\">"+this.title+"</a><div class='parentForum'>"+labels.forum + ":" + this.parent.toHTMLlink() +"</div><div class='views'>"+labels.views+": "+this.views+"</div><div class='posts'>"+labels.posts+": "+this.posts+"</div></span>"
}
/* end Topic class */
