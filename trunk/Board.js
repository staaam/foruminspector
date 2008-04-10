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
    var dom = toDOM(getBody(content));
    var tables = dom.getElementsByTagName('table');
    for (var i=0; i<tables.length; i++) {
        this.tryParseBoardTable(tables[i]);
    }
    var spans = dom.getElementsByTagName('span');
    var e = getEl(spans, 'class', 'maintitle');
    if (!e) {
	    e = getEl(spans, 'class', 'gen');
    }
    if (!e) {
	    spans = dom.getElementsByTagName('div');
	    e = getEl(spans, 'class', 'maintitle');
	    if (!e) {
		    e = getEl(spans, 'class', 'gen');
	    }
    }

    this.title = e.textContent;
};

function getEl(els, attr, val) {
    for (var i=0; i<els.length; i++) {
    	if (els[i] && els[i].getAttribute(attr) == val) {
    		return els[i];
    	}
    }
}

Board.prototype.tryParseBoardTable = function (table) {
    if (table.getAttribute('class') != 'forumline') {
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
    if (!a.getAttribute('href') || !a.getAttribute('href').match(/viewonline.php/)) {
    	return false;
    }
    var spans = table.getElementsByTagName('span');
    // spans[0] -- Who is Online
    // spans[1] -- General Info
    // spans[2] -- Users online

    labels.whoIsOnline = a.innerHTML;
    this.boardInfo = {
    	general: spans[1].innerHTML,
    	users: spans[2].innerHTML
    };
};

Board.prototype.parseForumsTable = function (table) {
    var trs = table.getElementsByTagName('tr'); // all table rows, first row is headers
    var cat;
    for (var i=1; i<trs.length; i++) {
        var tr = trs[i];
        var as = tr.getElementsByTagName('a');
        if (as[0].getAttribute('class') == 'cattitle') {
            // category title row
            cat = new Category(this, this.mkFullUrl(as[0].getAttribute('href')), as[0].innerHTML);
            cat.index = i;
            //cat.parseBoardTableRow(tr);
            this.addItem(cat);
        }
        else {
            // title/link is is first <a> tag, so look into it
            var forum = ctrl.newForum(this, this.mkFullUrl(as[0].getAttribute('href')), as[0].innerHTML);
            forum.index = i;
            forum.parseBoardTableRow(tr);
            cat.addItem(forum);
        }
    }
    return true;
};

Board.prototype.idRegEx = /\/(.*)/;

Board.prototype.tryParseForumsHeader = function (table) {
    var ths = table.getElementsByTagName('th');
    if (ths == null || ths.length < 4) {
        return false;
    }
    
    // assumption -- every and only forums table has row with th's
    labels.forum = ths[0].textContent;
    labels.topics = ths[1].textContent;
    labels.posts = ths[2].textContent;
    labels.lastPost = ths[3].textContent;
    
    return true;
};
/* end Board class */
