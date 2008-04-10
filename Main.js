var ctrl = function () {
	var prefs = new _IG_Prefs(moduleID);//__MODULE_ID__
	var tabs = new _IG_Tabs(moduleID, "Forums", _gel("TabsDiv"));
    var board = new Board(null, prefs.getString("url"));
    var selForums = {};
    var selTopics = {};
    var allForums = {};
    var allTopics = {};
    
    var divLog;
    var divMostViews;
    var divMostPosts;
    var divForumList;
    var divNewTopics;
    var divBoardInfo;
    
    var divStared;
    var displayGeneral = new DisplayGeneral();

    return {
        init: function () {
            ctrl.createTabs();
            
            display.init(divStared);
            
            selForums = splitKeys(prefs.getString("selForums"));
            selTopics = splitKeys(prefs.getString("selTopics"));
            board.load(function (board) {
	        	display.categories(_gel(divForumList), board.subItems);
	        });
	        
            for (var i=0;i<selForums.length;i++) {
            	var fid = selForums[i];
                var forum = ctrl.newForum(board, board.mkFullUrl(Forum.prototype.viewer + fid));
                forum.load(function(){});
            }
            return false;
        },
        
        createTabs: function () {
            divForumList = tabs.addDynamicTab("Forums", ctrl.resize);

            //divLog = tabs.addDynamicTab("Log", ctrl.resize);
            
            divStared = tabs.addDynamicTab("Stared", ctrl.resize);
            
            divNewTopics = tabs.addDynamicTab("New Topics", ctrl.onNewTopics);
            
            divBoardInfo = tabs.addDynamicTab("Board Info", ctrl.resize);
            
            tabs.alignTabs("left", 10);
        },
        
        onNewTopics: function () {
            for (var i in allForums) {
            	var forum = allForums[i];
            	if (forum.isSelected()) {
	        		forum.load(function(forum) {
	        			display.topics(_gel(divNewTopics), forum.subItems);
	        		});
            	}
        	}
        	ctrl.resize();
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
        
//        display: function (forumItem) {
//            if (forumItem instanceof Board) {
//                ctrl.displayBoard(forumItem);
//            } else
//            if (forumItem instanceof Forum) {
//                ctrl.displayForum(forumItem);
//            }
//        },
        
        displayBoard: function (board) {
            //var frmLst_id = tabs.addDynamicTab(board.label.forum, ctrl.resize);
            var s ="<form action=\"?\">";
            for (var i=0;i<board.subItems.length;i++) {
                var cat = board.subItems[i];
                s += "<a href=\"" + cat.url + "\">"+cat.title+"</a><ul>";
                for (var j=0;j<cat.subItems.length;j++) {
                    var forum=cat.subItems[j];
                    var name = forum.id;
                    var checked = ctrl.isSelectedForum(forum) ? " checked=\"yes\"" : "";
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
            for (var t=0;t<topics.length;t++) {
                arTopics.push(topics[t]);
            }
            var sortedTopics = arTopics.sort(sortFunc);
            for (var i=0;i<sortedTopics.length;i++) {
                    var topic = sortedTopics[i];
                    var name = topic.id;
                    var checked = ctrl.isSelectedTopic(topic) ? " checked=\"yes\"" : "";
                    s += "<input type=\"checkbox\" name=\"f"+name+"\" onClick=\"ctrl.toggleTopic(this.form, '"+name+"');\"" + checked + "\">"+"&nbsp;"+ topic.toHTML() +"<br>";
            }
            s += "</form>";
            _gel(divId).dir = dir;
            _gel(divId).innerHTML = s;
        },
        
        isSelectedForum: function (forum) {
        	return selForums[forum.id] != undefined;
        },
        
        isSelectedTopic: function (topic) {
        	return selTopics[topic.id] != undefined;
        },
        
        toggleForum: function (forum, checked) {
        	var name = forum.id;
            if (checked) {
                selForums[name] = 1;
                //allForums[name].load();
            } else {
                selForums[name] = undefined;
            }
            prefs.set("selForums", joinKeys(selForums));
        },

        toggleTopic: function (topic, checked) {
        	var name = topic.id;
            if (checked) {
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

var labels = {
    forum: "Forum",
    topics: "Topics",
    posts: "Posts",
    lastPost: "Last Post",
    whoIsOnline: "Who is Online",
    
    author: "Aurhor",
    views: "Views"
};

function getText(node) {
	if (!node) {
		return undefined;
	}
	return node.innerText || node.text || node.textContent;
//	return node.text || node.textContent || (function(node){
//        var _result = "";
//        if (node == null) {
//            return _result;
//        }
//        var childrens = node.childNodes;
//        var i = 0;
//        while (i < childrens.length) {
//            var child = childrens.item(i);
//            switch (child.nodeType) {
//                case 1: // ELEMENT_NODE
//                case 5: // ENTITY_REFERENCE_NODE
//                    _result += arguments.callee(child);
//                    break;
//                case 3: // TEXT_NODE
//                case 2: // ATTRIBUTE_NODE
//                case 4: // CDATA_SECTION_NODE
//                    _result += child.nodeValue;
//                    break;
//                case 6: // ENTITY_NODE
//                case 7: // PROCESSING_INSTRUCTION_NODE
//                case 8: // COMMENT_NODE
//                case 9: // DOCUMENT_NODE
//                case 10: // DOCUMENT_TYPE_NODE
//                case 11: // DOCUMENT_FRAGMENT_NODE
//                case 12: // NOTATION_NODE
//                // skip
//                break;
//            }
//            i++;
//        }
//        return _result;
//    }(node));
}

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


//Array.prototype.grep = function (f){
//	var output=new Array();
//	for(var i=0;i<this.length;i++){
//	     if(f(this[i])){
//	     	output.push(this[i])
//			//output.length++
//			//output[output.length-1]=this[i];
//	     }
//	}
//	return output;
//}

var greps = {
	hotTopic: function (topic) { return topic.isHot; },
	and: function (f,g) { return function(t) { return f(t) && g(t); }; },
	not: function (f) { return function(t) { return !f(t); }; }
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
