	var CONST = {
	selForums: "sf",
	selTopics: "st",
	lastPost: "lp",
	lastTopic: "lt",
	
	pMostViews: "mv",
	pMostPosts: "mp",
	pRcntUpdtd: "ru",
	pNewTopics: "nt",
	
	showForums: "s0",
	showStarred: "s1",
	showNewTopics: "s2",
	showRecntUpd: "s3",
	showMostViews: "s4",
	showMostPosts: "s5",
	showBoadrInfo: "s6",
	
	NULL: null
};

var ctrl = function () {
	var prefs = new _IG_Prefs(moduleID);//__MODULE_ID__
	var tabs = new _IG_Tabs(moduleID, prefs.getMsg(prefs.getString("defTab")), _gel("TabsDiv"));
    var board;
    
    var cachedPrefs = {};
    
    var selForums = {};
    var selTopics = {};
    
    var allForums = {};
    var allTopics = {};
    var allPosts = {};
    
    var divMostViews;
    var divMostPosts;
    var divForumList;
    var divNewTopics;
    var divBoardInfo;
    var divRecTopics;
    
    var divStarred;
    var loadingCount = 0;
    var displayGeneral = new DisplayGeneral();

    return {
        init: function () {
            return ctrl.refresh();
        },
        
        refresh: function () {
        	while(tabs.getTabs().length>0) {
        		tabs.removeTab(0);
        	}
        	//alert("inside refresh");
			loadingCount = 0;
            ctrl.createTabs();
    		cachedPrefs = {};

		    allForums = {};
		    allTopics = {};
		    allPosts = {};
		    
		    board = new Board(null, prefs.getString("url"));
		    
            selForums = splitKeys(prefs.getString(CONST.selForums));
            selTopics = splitKeys(prefs.getString(CONST.selTopics));
            
            ctrl.getLastTopic();
            ctrl.getLastPost();
            ctrl.getMostViews();
	        ctrl.getMostPosts();
	        ctrl.getRcntUpdtd();
	        ctrl.getNewTopics();            
            
            var xx="";
            for (var i in cachedPrefs) {
            	xx += i + ": " + cachedPrefs[i] + "\n";
            }
            //alert(xx);
            
            for (var i=0;i<selForums.length;i++) {
            	var fid = selForums[i];
                var forum = ctrl.newForum(board, board.mkFullUrl(Forum.prototype.viewer + fid));
                forum.load(function(){});
            }
            board.load(function (board) {
            	display.setBoardDirection(board.dir);
            	display.setGlobalDirection(globalDir);
            	display.createBoardTitle( _gel("beforeTabsDiv"), board );
            	display.createBoardInfo(_gel(divBoardInfo), board);
            	var tab = tabs.getSelectedTab();
            	tabs.setSelectedTab(tab.getIndex());
            	
            	ctrl.onForumsSelUpdate();
            	ctrl.onTopicsSelUpdate();
            	ctrl.showForums();
	        });
	        
            return false;
        },
        
        isShowAllForums: function () {
        	return prefs.getInt("showForums");
        },
        
        showForums: function () {
//        	if (!prefs.getBool(CONST.showForums))
//        		return;

        	var items = [];
        	for (var i=0; i<board.subItems.length; i++) {
        		var c = board.subItems[i];
        		if (c.visibleSubItems().length > 0) {
        			items.push(c);
        		}
        	}
	        display.categories(_gel(divForumList), items);
        	ctrl.resize();
        },
        
        createTab: function (sp, name, callback) {
        	var nm = prefs.getMsg(name);
        	var tab = tabs.addDynamicTab(nm, 
            	function() { try {
            		display.setSpecialTabsClass(tabs, prefs); ctrl.resize(); 
            	} catch (e) {} });
            	
        	if (!prefs.getBool(sp)) {
        		var tbs = tabs.getTabs();
        		for (var i in tbs) {
        			if (tbs[i].getName() == nm) {
        				tabs.removeTab(tbs[i].getIndex());
        				break;
        			}
        		}
        	}
	        return tab;
        },
        
        increaseLoading: function () {
        	loadingCount++;
        	display.setLoading(loadingCount);
        },

        decreaseLoading: function () {
        	loadingCount--;
        	display.setLoading(loadingCount);
        },
        
        createTabs: function () {
            divForumList = ctrl.createTab(CONST.showForums, "forums", ctrl.resize);
            divStarred   = ctrl.createTab(CONST.showStarred, "starred", ctrl.onStarred);
            divNewTopics = ctrl.createTab(CONST.showNewTopics, "latestT", ctrl.onNewTopics);
            divRecTopics = ctrl.createTab(CONST.showRecntUpd, "recentlyUpdated", ctrl.onLRUTopics);
            divMostViews = ctrl.createTab(CONST.showMostViews, "mostViews", ctrl.onMostViews);
            divMostPosts = ctrl.createTab(CONST.showMostPosts, "mostPosts", ctrl.onMostPosts);
            
            //divBoardInfo = ctrl.createTab(CONST.showBoadrInfo, "boardInfo", ctrl.resize);
            divBoardInfo = tabs.addDynamicTab(prefs.getMsg("boardInfo"), ctrl.resize);
            
            tabs.alignTabs("left", 10);
            
            display.setSpecialTabsClass(tabs, prefs); 
        },
        
        onStarred: function () {
        	var map = {};        	
			for (var tid in selTopics) {
        		var fid = selTopics[tid];
        		if (fid) {
	        		map[fid] = tid;
        		}
        	}
        	var diTopics = [];
        	
        	for (var fid in map) {
            	var forum = allForums[fid];
            	if (!forum) {
	                forum = ctrl.newForum(board, board.mkFullUrl(Forum.prototype.viewer + fid));
            	}
        		forum.load(function() {
        			diTopics = diTopics.concat(forum.selSubItems());
        			ctrl.displayTopics(_gel(divStarred), [], diTopics.sort(sorters.byId));
        		});
        	}
        },
        
        onForumsSelUpdate: function () {
        	ctrl.onNewTopics();
        	ctrl.onLRUTopics();
        	ctrl.onMostViews();
        	ctrl.onMostPosts();
        },
        
        onTopicsSelUpdate: function () {
        	ctrl.onStarred();
        },
        
        onNewTopics: function () {
        	ctrl.displayForumsTopics(_gel(divNewTopics), sorters.byId, CONST.pNewTopics);
        },
        
        onLRUTopics: function () {
        	ctrl.displayForumsTopics(_gel(divRecTopics), sorters.byLastPostId, CONST.pRcntUpdtd);
        },
        
        onMostViews: function () {
        	ctrl.displayForumsTopics(_gel(divMostViews), sorters.byViews, CONST.pMostViews);
        },
        
        onMostPosts: function () {
        	ctrl.displayForumsTopics(_gel(divMostPosts), sorters.byPosts, CONST.pMostPosts);
        },
        
        displayForumsTopics: function (el, sorter, name) {
        	try {
        		display.clear(el);
    			var prevA = ctrl.getCPA(name);
    			var prev = {};
    			for (var i=0; i<prevA.length; i++) {
    				prev[prevA[i]] = 1;
    			}

	            for (var i in allForums) {
	            	var forum = allForums[i];
	            	if (forum.isSelected()) {
		        		forum.load(function() {
		        			var ar = ctrl.getAllTopics().sort(sorter).splice(0, prefs.getInt("nTopics"));
		        			
		        			var ids = [ ];
		        			var o = [];
		        			var n = []; 
		        			for (var j in ar) {
		        				ids[j] = ar[j].id;
		        				if (prev[ar[j].id]) {
		        					o.push(ar[j]);		        					
		        				}
		        				else {
		        					n.push(ar[j]);
		        				}
		        			}
		        			try {
			        			ctrl.displayTopics(el, n, o);
			        			prefs.setArray(name, ids);
		        			} catch (e) {}
		        		});
	            	}
	        	}
	        } catch(e) {};
        },
        
        displayTopics: function (el, updTopics, oldTopics) {
			display.clear(el);
			display.topics(el, updTopics, oldTopics);
        	ctrl.resize();
		},
                
        getAllTopics: function () {
			var r = [];
			for (var i in allTopics) {
				if (allTopics[i].parent.isSelected()) {
					r.push(allTopics[i]);
				}
			}
			return r;        	
        },
        
        newForum: function (parent, url, title) {
            return ctrl.newItem(allForums, new Forum(parent, url, title));
        },
        
        newTopic: function (parent, url, title) {
            return ctrl.newItem(allTopics, new Topic(parent, url, title));
        },
        
        newPost: function (parent, url, title) {
            return ctrl.newItem(allPosts, new Post(parent, url, title));
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
        
        isSelectedForum: function (forum) {
        	return selForums[forum.id] != null;
        },
        
        isSelectedTopic: function (topic) {
        	return selTopics[topic.id] != null;
        },
        
        toggleForum: function (forum, checked) {
        	var name = forum.id;
            if (checked) {
                selForums[name] = 1;
                allForums[name].load(function(){});
            } else {
                selForums[name] = null;
            }
            prefs.set(CONST.selForums, joinKeys(selForums));
            ctrl.onForumsSelUpdate();
        },

        toggleTopic: function (topic, checked) {
        	var name = topic.id;
            if (checked) {
                selTopics[name] = topic.parent.id;
            } else {
                selTopics[name] = null;
            }
            prefs.set(CONST.selTopics, joinKeys(selTopics));
            ctrl.onTopicsSelUpdate();
        },
        
        getCPI: function (name) {
        	if (cachedPrefs[name] == undefined) {
        		cachedPrefs[name] = prefs.getInt(name);
        	}
        	return cachedPrefs[name]; 
        },
        
        getCPA: function (name) {
        	if (cachedPrefs[name] == undefined) {
        		cachedPrefs[name] = prefs.getArray(name);
        	}
        	return cachedPrefs[name]; 
        },
        
        getLastTopic: function () { return ctrl.getCPI(CONST.lastTopic); },
        getLastPost : function () { return ctrl.getCPI(CONST.lastPost); },
        getNewTopics: function () { return ctrl.getCPA(CONST.pNewTopics); },
        getRcntUpdtd: function () { return ctrl.getCPA(CONST.pRcntUpdtd); },
        getMostViews: function () { return ctrl.getCPA(CONST.pMostViews); },
        getMostPosts: function () { return ctrl.getCPA(CONST.pMostPosts); },

        setLastTopic: function (lastTopicId) { prefs.set(CONST.lastTopic, lastTopicId); },
        setLastPost : function (lastPostId) { prefs.set(CONST.lastPost, lastPostId); },

		getPostOrder: function () {
			return prefs.getString("postorder");
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
    views: "Views",
    quote: "Quote",
    reply: "Reply" 
};

function getText(node) {
	if (!node) {
		return null;
	}
	var text = node.innerText || node.text || node.textContent;
	if (!text) {
		text = "";
	}
	return text.replace(/^\s*/, "").replace(/\s*$/, "");
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

function getHTML(node) {
	return node.innerHTML.replace(/^\s*/, "").replace(/\s*$/, "");
}

function splitKeys(str) {
    var map = new Object();
    var s = str.split(";");
    for (var i in s) {
        if (s[i].length > 0) {
        	var a = s[i].split("=");
            map[a[0]] = a[1];
        }
    }
    return map;
}

function joinKeys(map) {
    var str = "";
    for (var i in map) {
        if (map[i]) {
            str += i + "=" + map[i] + ";";
        }
    }
    return str;
}

var sorters = {
    byPosts: function (a,b) { return b.posts - a.posts; },
    byViews: function (a,b) { return b.views - a.views; },
    byIndex: function (a,b) { return b.index - a.index; },
    byId: function (a,b) { return b.id - a.id; },
    byLastPostId: function (a,b) { return b.lastPost.id - a.lastPost.id; },
    neg: function (f) {
        return function(a,b) {
            return -1 * f(a,b);
        };
    }
}

function toDOM(HTMLstring) {
    var d = document.createElement('div');
    d.innerHTML = HTMLstring;
    return d;
}

function getBody(html) {
    return html.replace(/\n/g," ").replace(/.*<body.*?>/,"").replace(/<\/body>.*/, "");
}

var myBase = toDOM("<a href=\"bbbbbaaaaassssseeee.gif\"></a>");
myBase= myBase.getElementsByTagName('a')[0];
myBase=myBase.getAttribute('href');
myBase=myBase.replace("bbbbbaaaaassssseeee.gif","");

function getHref(a) {
	return getAttr(a, 'href');
}
function getSrc(i) {
	return getAttr(i, 'src');
}
function getAttr(a, attr) {
	if (!a || !a.getAttribute) return null;
	var hr = a.getAttribute(attr);
	if (!hr) return hr;
	return hr.replace(myBase,"");
}

_IG_RegisterOnloadHandler(ctrl.init);
