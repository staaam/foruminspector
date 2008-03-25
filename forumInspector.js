/* begin ForumItem class */
function ForumItem() {
}

ForumItem.prototype.init = function (parent, url, title) {
    this.parent = parent;
    this.url = url;
    this.boardUrl = url.replace(/\/[^\/]*$/, "") + "/";
    this.title = title;
    if (title == null || title == undefined) {
        this.title = url;
    }
    this.id = url.match(this.idRegEx)[1];
    this.subItems = [];
    this.isLoaded = false;
    //printStr("new item url=" + this.url + " title=" + this.title);
}

ForumItem.prototype.idRegEx = /\?(.*)/;
ForumItem.prototype.viewer = "";

ForumItem.prototype.addItem = function (item) {
    //printStr("add item url=" + item.url + " title=" + item.title);
    this.subItems.push(item);
};

ForumItem.prototype.mkFullUrl = function (relUrl) {
    return this.boardUrl + relUrl;
};

ForumItem.prototype.load = function () {
    if (this.isLoaded) {
        return;
    }
    this.reload();
};

ForumItem.prototype.reload = function () {
    this.isLoaded = true;
    var that = this;
    _IG_FetchContent(this.url, function (content) {
        that.onLoad(content);
    });
};

ForumItem.prototype.onLoad = function (content) {
    this.parse(content);
    this.display();
};

ForumItem.prototype.parse = function (content) {
};

ForumItem.prototype.display = function () {
    ctrl.display(this);
};

/* end ForumItem class *//* begin Board class */
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
/* begin Category class */
function Category(parent, url, title) {
    this.init(parent, url, title);
}

Category.prototype = new ForumItem();

Category.prototype.idRegEx = /[?&]c=(\d+)/;
Category.prototype.viewer = "index.php";
/* end Category class *//* begin Forum class */
function Forum(parent, url, title) {
    this.init(parent, url, title);
    this.label = {
        topics: "Topics",
        posts: "Posts",
        author: "Aurhor",
        views: "Views",
        lastPost: "Last Post"
    };
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
    this.topics = tds[2].textContent;
    this.posts = tds[3].textContent;
    // tds[4] last post date; author, link
};

Forum.prototype.parse = function (content) {
    if (content == null) {
        return;
    }
    this.dir = content.match(/<html dir="rtl">/i) ? "rtl" : "ltr";
    var dom = toDOM(getBody(content));
    if (this.title == this.url) {
        // try load title from the page
        var as = dom.getElementsByTagName('a');
        for (var i in as) {
            var cl = as[i].getAttribute('class');
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
    if (table.getAttribute('class') != 'forumline' ||
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
    this.label.topics = ths[0].innerHTML;
    this.label.posts = ths[1].innerHTML;
    this.label.author = ths[2].innerHTML;
    this.label.views = ths[3].innerHTML;
    this.label.lastPost = ths[4].innerHTML;
    
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

ForumItem.prototype.toHTML = function () {
    return "<span class='forum'>" + this.toHTMLlink() + "</span>";
};

ForumItem.prototype.toHTMLlink = function () {
    return "<a href=\"" + this.url + "\" target=\"_blank\">"+this.title+"</a>";
};
/* end Forum class *//* begin Topic class */
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
/* begin Post class */
function Post(parent, url, title) {
    this.init(parent, url, title);
}

Post.prototype = new ForumItem();

Post.prototype.idRegEx = /[?&]p=(\d+)/;
Post.prototype.viewer = "viewpost.php?p=";
/* end Post class */
var ctrl = function () {
    var prefs = new _IG_Prefs(__MODULE_ID__);
    var tabs = new _IG_Tabs(__MODULE_ID__);
    var board = new Board(null, prefs.getString("url"));
    var selForums = {};
    var selTopics = {};
    var allForums = {};
    var allTopics = {};
    
    var divLog;
    var divMostViews;
    var divMostPosts;
    var divForumList;

    return {
        init: function () {
            ctrl.createTabs();
            
            selForums = splitKeys(prefs.getString("selForums"));
            selTopics = splitKeys(prefs.getString("selTopics"));
            board.load();
            for (var fid in selForums) {
                var forum = ctrl.newForum(board, board.mkFullUrl(Forum.prototype.viewer + fid));
                forum.load();
            }
            return false;
        },
        
        createTabs: function () {
            divForumList = tabs.addDynamicTab("Forums", ctrl.resize);

            //divLog = tabs.addDynamicTab("Log", ctrl.resize);
            
        },
        
        newForum: function (parent, url, title) {
            return ctrl.newItem(allForums, new Forum(parent, url, title));
        },
        
        newTopic: function (parent, url, title) {
            return ctrl.newItem(allTopics, new Topic(parent, url, title));
        },
        
        newItem: function (all, item) {
            var id = item.id;
            if (!all[id]) {
                all[id] = item;
            }
            if (all[id].title == all[id].url) {
                all[id].title = item.title;
            }
            return all[id];
        },
        
        display: function (forumItem) {
            if (forumItem instanceof Board) {
                ctrl.displayBoard(forumItem);
            } else
            if (forumItem instanceof Forum) {
                ctrl.displayForum(forumItem);
            }
        },
        
        displayBoard: function (board) {
            //var frmLst_id = tabs.addDynamicTab(board.label.forum, ctrl.resize);
            var s ="<form action=\"?\">";
            for (var i in board.subItems) {
                var cat = board.subItems[i];
                s += "<a href=\"" + cat.url + "\">"+cat.title+"</a><ul>";
                for (var j in cat.subItems) {
                    var forum=cat.subItems[j];
                    var name = forum.id;
                    var checked = selForums[name] != undefined ? " checked=\"yes\"" : "";
                    s += "<li>"+"<input type=\"checkbox\" name=\"f"+name+"\" onClick=\"ctrl.toggleForum(this.form, '"+name+"');\"" + checked + "\">"+"&nbsp;"+forum.toHTML()+"</li>";
                }
                s += "</ul>";
            }
            s += "</form>";
            _gel(divForumList).dir = board.dir;
            _gel(divForumList).innerHTML = s;
        },
        
        displayForum: function (forum) {
            if (!divMostPosts) {
                divMostPosts = tabs.addDynamicTab("Most Posts", ctrl.resize);
            }
            if (!divMostViews) {            
                divMostViews = tabs.addDynamicTab("Most Views", ctrl.resize);
            }
            
            var frmLst_id = tabs.addDynamicTab(forum.title, ctrl.resize);
            ctrl.updateTopics(frmLst_id, forum.subItems, forum.dir, sorters.neg(sorters.byIndex));
            ctrl.updateTopics(divMostPosts, allTopics, forum.dir, sorters.byPosts);
            ctrl.updateTopics(divMostViews, allTopics, forum.dir, sorters.byViews);
        },
        
        updateTopics: function (divId, topics, dir, sortFunc) {
            var s ="<form action=\"?\">";
            //var topics = forum.subItems;
            var arTopics = [];
            for (var t in topics) {
                arTopics.push(topics[t]);
            }
            var sortedTopics = arTopics.sort(sortFunc);
            for (var i in sortedTopics) {
                    var topic = sortedTopics[i];
                    var name = topic.id;
                    var checked = selTopics[name] != undefined ? " checked=\"yes\"" : "";
                    s += "<input type=\"checkbox\" name=\"f"+name+"\" onClick=\"ctrl.toggleTopic(this.form, '"+name+"');\"" + checked + "\">"+"&nbsp;"+ topic.toHTML() +"<br>";
            }
            s += "</form>";
            _gel(divId).dir = dir;
            _gel(divId).innerHTML = s;
        },
        
        toggleForum: function (form, name) {
            if (form["f"+name].checked) {
                selForums[name] = 1;
                allForums[name].load();
            } else {
                selForums[name] = undefined;
            }
            prefs.set("selForums", joinKeys(selForums));
        },

        toggleTopic: function (form, name) {
            if (form["f"+name].checked) {
                selTopics[name] = 1;
            } else {
                selTopics[name] = undefined;
            }
            prefs.set("selTopics", joinKeys(selTopics));
        },

        resize: function (tabId) {
            _IG_AdjustIFrameHeight();
        }
    }
}();

function splitKeys(str) {
    var map = new Object();
    var s = str.split(";");
    for (var i in s) {
        if (s[i].length > 0) {
            map[s[i]] = true;
        }
    }
    return map;
}

var sorters = {
    byPosts: function (a,b) { return b.posts - a.posts; },
    byViews: function (a,b) { return b.views - a.views; },
    byIndex: function (a,b) { return b.index - a.index; },
    neg: function (f) {
        return function(a,b) {
            return -1 * f(a,b);
        };
    }
}

function joinKeys(map) {
    var str = "";
    for (var i in map) {
        if (map[i]) {
            str += i + ";";
        }
    }
    return str;
}

function log(object) {
    if (typeof object == "string") {
        _gel('log').innerHTML += str + "<br>";
    } else {
        _gel('log').innerHTML += "<pre>" + getObjectProperties(object) + "</pre>";
    }
}

function getObjectProperties (object) {
    var result = '';
    for (var property in object) {
        result += property + ': ' + object[property] + '\r\n';
    }
    return result;
}

function toDOM(HTMLstring) {
    var d = document.createElement('div');
    d.innerHTML = HTMLstring;
    return d;
}

function getBody(html) {
    return html.replace(/\n/g," ").replace(/.*<body.*?>/,"").replace(/<\/body>.*/, "");
}

_IG_RegisterOnloadHandler(ctrl.init);
