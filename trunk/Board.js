/* begin Board class */
function Board(parent, url, title) {
    this.init(parent, url.replace(/\/(index\.php[^\/]*)?$/,"") + "/", title);
    this.label = {
        forum: "Forum",
        topics: "Topics",
        posts: "Posts",
        lastPost: "Last Post"
    };
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
        this.tryParseForumsTable(tables[i]);
    }
};

Board.prototype.tryParseForumsTable = function (table) {
    if (table.getAttribute('class') != 'forumline' ||
        !this.tryParseForumsHeader(table)) {
        return false;
    }

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
}

Board.prototype.idRegEx = /\/(.*)/;

Board.prototype.tryParseForumsHeader = function (table) {
    var ths = table.getElementsByTagName('th');
    if (ths == null || ths.length < 4) {
        return false;
    }
    
    // assumption -- every and only forums table has row with th's
    this.label.forum = ths[0].innerHTML;
    this.label.topics = ths[1].innerHTML;
    this.label.posts = ths[2].innerHTML;
    this.label.lastPost = ths[3].innerHTML;
    
    return true;
};
/* end Board class */
