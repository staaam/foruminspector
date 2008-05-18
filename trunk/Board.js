/* begin Board class */
function Board(parent, url, title) {
    this.init(parent, url.replace(/\/(index\.php[^\/]*)?$/,"") + "/", title);
}

Board.prototype = new ForumItem();

Board.prototype.parse = function (content) {
    if (content == null) {
        return;
    }
    this.dir = content.match(/<html dir="rtl">/i) ? "rtl" : "ltr";
    this.boardInfo = {
    	general: "Sorry, no information availible",
    	users: "Sorry, no information availible"
    };
    var dom = toDOM(getBody(content));
    var tables = dom.getElementsByTagName('table');
    for (var i=0; i<tables.length; i++) {
        this.tryParseBoardTable(tables[i]);
    }
    var spans = dom.getElementsByTagName('span');
    var e = getElClass(spans, 'maintitle');
    if (!e) {
	    e = getElClass(spans, 'gen');
    }
    if (!e) {
	    spans = dom.getElementsByTagName('div');
	    e = getElClass(spans, 'maintitle');
	    if (!e) {
		    e = getElClass(spans, 'gen');
	    }
    }

    this.title = getText(e);
};

function getElClass(els, val) {
    for (var i=0; i<els.length; i++) {
    	if (els[i] && els[i].className == val) {
    		return els[i];
    	}
    }
}

Board.prototype.tryParseBoardTable = function (table) {
    if (table.className != 'forumline') {
    	return false;
    }
    
    if (this.tryParseForumsHeader(table)) {
    	this.parseForumsTable(table);
    	return true;
    }
    
    if (this.tryParseBoardInfo(table)) {
    	return true;
    }
    
    return false;
};

Board.prototype.tryParseBoardInfo = function (table) {
    if (!table || !table.getElementsByTagName('a')) {
    	return false;
    }
    var a = table.getElementsByTagName('a')[0];
    var href = getHref(a);
    if (!href || !href.match(/viewonline.php/)) {
    	return false;
    }
    var spans = table.getElementsByTagName('span');
    // spans[0] -- Who is Online
    // spans[1] -- General Info
    // spans[2] -- Users online

    labels.whoIsOnline = getHTML(a);
    this.boardInfo = {
    	general: getHTML(spans[1]),
    	users: getHTML(spans[2])
    };
};

Board.prototype.parseForumsTable = function (table) {
    var trs = table.getElementsByTagName('tr'); // all table rows, first row is headers
    var cat;
    var lastPost = 0;
    for (var i=1; i<trs.length; i++) {
        var tr = trs[i];
        var as = tr.getElementsByTagName('a');
        var href = getHref(as[0]);
        if (Category.prototype.linkMatch(href)) {
            // category title row
            cat = new Category(this, this.mkFullUrl(href), as[0].innerHTML);
            cat.index = i;
            //cat.parseBoardTableRow(tr);
            this.addItem(cat);
        }
        else {
            // title/link is is first <a> tag, so look into it
            var forum = ctrl.newForum(this, this.mkFullUrl(href), as[0].innerHTML);
            forum.index = i;
            forum.parseBoardTableRow(tr);
            if (forum.lastPost.id > lastPost) {
            	lastPost = forum.lastPost.id;
            }
            cat.addItem(forum);
        }
    }
    ctrl.setLastPost(lastPost);
    return true;
};

Board.prototype.idRegEx = /\/(.*)/;

Board.prototype.tryParseForumsHeader = function (table) {
    var ths = table.getElementsByTagName('th');
    if (ths == null || ths.length < 4) {
        return false;
    }
    
    // assumption -- every and only forums table has row with th's
    labels.forum = getText(ths[0]);
    labels.topics = getText(ths[1]);
    labels.posts = getText(ths[2]);
    labels.lastPost = getText(ths[3]);
    
    return true;
};
/* end Board class */
