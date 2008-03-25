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
