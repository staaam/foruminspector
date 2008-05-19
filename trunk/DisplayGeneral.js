/* begin DisplayGeneral class */

var display = function () {

	//var newTabs;
	//var updatedTabs;

    return {
        init: function () {
        	display.updatedTabs = [];
        	display.newTabs = [];
        },
        
        clear: function (el) {
        	el.innerHTML = "";
        },
        
       	setBoardDirection: function ( dir ) {
        	display.boardDir = dir;
        },
        
        setGlobalDirection: function (dir) {
        	display.globalDir = dir;
        },
        
        oppositeDirection: function ( dir ) {
        	if (dir == "rtl")
        		return "ltr";
        	
        	return "rtl";
        },
        
        createCategoryItem: function (parentElem, category) {
        	var loadCategoryFunction = function(callback) 
        		{ category.load( function ( o ) { callback( o.visibleSubItems() ); } ); };
        	
        	//var selectCategoryFunction = function( status )
        	//	{ ctrl.toggleForum( category, status ); };
        		
        	var displayItem = new CategoryDisplayItem(
        			parentElem, category.title, category.url, 
        			null, loadCategoryFunction, null, null, true, false, false);
        },
        
        createSecondaryForumItem: function (parentElem, forum) {
        	
        	var selectForumFunction = function( status )
        		{ ctrl.toggleForum( forum, status ); };
        	
        	var displayItem = new ForumDisplayItemSecondary(
        		parentElem, forum.title, forum.url,
        		display.getForumSubHeader(forum) , forum.isSelected(),
        		selectForumFunction);
        },
        
        createSecondaryPostItem: function ( parentElem, post ) {
        	
        	var str = labels.author + ": " + post.author + " ("+post.details+")" + " <a href='"+post.replylink + "' target='_blank'>" + labels.quote + "</a>";
        	var span = document.createElement("div");
        	span.className = "postAuthor";
        	span.innerHTML = str;
        	span.dir = display.boardDir;
        	span.style.textAlign = (display.boardDir == "rtl")? "right" : "left";
        	parentElem.appendChild(span);
        	
        	var postItem = document.createElement("div");
        	postItem.dir = display.boardDir;	
        	postItem.style.textAlign = (display.boardDir == "rtl")? "right" : "left";
        	postItem.className = "di-secondary-header";
        	
        	var span = document.createElement("span");
        	//aDiv.className
        	span.innerHTML = post.text;
        	postItem.appendChild(span);
        	parentElem.appendChild(postItem);
        	
        	var divider2 = document.createElement("div");
        	divider2.className = "post-divider";
        	parentElem.appendChild(divider2);
        	
        },
        
        createTopicItem: function ( parentElem, topic ) {
        	createTopicItem( parentElem, topic, false );
        },
        
        createTopicItem: function ( parentElem, topic, isNew ) {
        	var loadTopicFunction = function(callback) 
        		{ topic.load( function ( o ) { callback( o.subItems ); } ); };
        	
        	var selectTopicFunction = function( status )
        		{ ctrl.toggleTopic( topic, status ); };
        		
        	var displayItem = new CategoryDisplayItem(
        			parentElem, topic.title, topic.url, 
        			display.getTopicSubHeader( topic ), loadTopicFunction,
        			topic.isSelected(), selectTopicFunction, false, topic.isUpdated(), isNew );
        },
        
        createBoardInfo: function ( parentElem, board )
        {
        	parentElem.dir = display.boardDir;
        	parentElem.style.textAlign = (display.boardDir == "rtl")? "right" : "left";
        	parentElem.innerHTML = "" +
        		"<div class=\"di-divider\"></div>" + 
        		"<div class=\"boardInfo\">" +
        		board.boardInfo.general + 
        		"</div>" + 
				"<div class=\"di-divider\"></div>" +
				"<div class=\"boardInfo\">" +
				board.boardInfo.users +
				"</div>";
        },
        
        setLoading: function( isLoading ) {
        	 var img = _gel("loadingImage");
        	 if (img) {
	        	 if(isLoading)
	        	 	img.src = "http://foruminspector.googlecode.com/svn/trunk/loading_big_green.gif";
	        	 else
	        	 	img.src = "http://foruminspector.googlecode.com/svn/trunk/loading_big_green_static.gif";
        	 }
        },
        
        createBoardTitle: function ( parentElem, board ){
        	
        	parentElem.className = "boardTitle thinBorder";
        	
        	var str = "<table class=\"titleTable boardTitle\"><tr><td>" +
        	"<a class=\"blackColor\" href=\""+ 
        	board.url + "\" target=\"_blank\">" + board.title + "</a></td>" +
        	"<td class=\"buttonsTD\" dir=\""+display.oppositeDirection(display.globalDir)+"\">" +
        	"<a href=\"http://foruminspector.googlecode.com/svn/trunk/help.html\" target=\"_blank\">"+
        	"<img class=\"thinImgBorder helpImage\" src=\"http://foruminspector.googlecode.com/svn/trunk/cleardot.gif\">"+
        	"</img>" +
        	"</a>" +
        	"<img id=\"loadingImage\" class=\"noBorder loadingImage\"  src=\"http://foruminspector.googlecode.com/svn/trunk/loading_big_green.gif\">"+
        	"</img>" +
        	"<img class=\"noBorder refreshImage\" onclick=\"ctrl.refresh();\" src=\"http://foruminspector.googlecode.com/svn/trunk/cleardot.gif\">"+
        	"</img>" +
        	"</td></tr></table>";        	
        	parentElem.innerHTML = str;
        	
        	//var img = _gel("loadingImage");
        	//alert(img);
        	
        	
        	//var table = document.createElement("table");
        	//table.className = "boardTitle";
        	//table.width = "100%";
        	//parentElem.appendChild(table);
        	
        	//var tr = document.createElement("tr");
        	//table.appendChild(tr);
        	
        	//var titleTD = document.createElement("td");
        	//titleTD.className = "titleSpan";
        	
        	//var a = document.createElement("a");
        	//a.innerHTML = board.title;
        	//a.href = board.url;
        	//a.target = "_blank";
        	//a.style.color = "#000000";
        	//a.className = "blackColor";
        	//titleTD.appendChild(a);
        	//tr.appendChild(titleTD);
        	
        	//var buttonTD = document.createElement("td");
        	
        	//buttonTD.style.width = "0%";
        	///buttonTD.className = "helpSpan";
        	//alert(display.globalDir);
        	//buttonTD.dir = display.oppositeDirection(display.globalDir);
        	
        	//var helpLink = document.createElement("a");
			//helpLink.target = "_blank";
			//helpLink.href = "http://foruminspector.googlecode.com/svn/trunk/help.html";
	
        	//var helpImg = document.createElement("img");
			//helpImg.className = "thinImgBorder helpImage";
			//helpImg.src = "http://foruminspector.googlecode.com/svn/trunk/cleardot.gif";	
			//helpLink.appendChild(helpImg);
			//buttonTD.appendChild(helpLink);
        	
        	//var refreshImg = document.createElement("img");
			//refreshImg.className = "noBorder refreshImage";
			//refreshImg.src = "http://foruminspector.googlecode.com/svn/trunk/cleardot.gif";
			//addEventListener(refreshImg, 'click', ctrl.refresh);
        	//buttonTD.appendChild(refreshImg);
        	//tr.appendChild(buttonTD);
        	//display.reduceSpanText( a, 310 );
        },
        
        getForumSubHeader: function ( forum ) {
        	return labels.topics + ": " + forum.topics + " " +
  			labels.posts + ": " + forum.posts + "<br>" +
    		labels.lastPost + ": " + forum.lastPost.date + " " +
    		"<a href=\"" + forum.lastPost.authorProfileLink + "\" target=\"_blank\">" +
    		forum.lastPost.author + "<a href=\"" + forum.lastPost.link + "\" target=\"_blank\">" +
    		"<img class=\"noborder\" src=\"http://foruminspector.googlecode.com/svn/trunk/icon_latest_reply.gif\"></a>";
        },
        
        getTopicSubHeader: function ( topic ) {
        	return labels.forum + ": <a href=\"" + topic.parent.url + "\" target=\"_blank\">" + topic.parent.title + "</a><br>" +
        	labels.posts + ": " + topic.posts + " " +
  			labels.author + ": " + topic.author + " " +
  			labels.views + ": " + topic.views + " " +
    		labels.lastPost + ": " + topic.lastPost.date + " " +
    		"<a href=\"" + topic.lastPost.authorProfileLink + "\" target=\"_blank\">" +
    		topic.lastPost.author + "<a href=\"" + topic.lastPost.link + "\" target=\"_blank\">" +
    		"<img class=\"noborder\" src=\"http://foruminspector.googlecode.com/svn/trunk/icon_latest_reply.gif\"></a>";
        },
        
        categories: function ( parentElem, cats )
        {
        	var listDisplayItem = new ListDisplayItem( parentElem );
        	
        	for(var i=0; i<cats.length; i++)
        	{
        		display.createCategoryItem( listDisplayItem.myself, cats[i] );
        	}
        },
        
        secondaryForums: function ( parentElem, forums )
        {
        	var listDisplayItem = new ListDisplayItem( parentElem );
   
        	for(var i=0; i<forums.length; i++)
        	{
        		display.createSecondaryForumItem( listDisplayItem.myself, forums[i] );
        	}        	
        },
        
        secondaryPosts: function ( parentElem, posts )
        {
        	var listDisplayItem = new ListDisplayItem( parentElem );
   
        	for(var i=0; i<posts.length; i++)
        	{
        		display.createSecondaryPostItem( listDisplayItem.myself, posts[i] );
        	} 
        },
        
        forums: function( parentElem, forums )
        {
           	var listDisplayItem = new ListDisplayItem( parentElem );
   
        	for(var i=0; i<forums.length; i++)
        	{
        		display.createForumItem( listDisplayItem.myself, forums[i] );
        	}    	
        },

        topics: function( parentElem, tabName, tabs, prefs, newTopics, topics ) {
           	var listDisplayItem = new ListDisplayItem( parentElem );
           	var tabUpdated = false;

			for(var i=0; i<newTopics.length; i++)
        	{
        		if (newTopics[i].isUpdated())
        			tabUpdated = true;
        			
        		display.createTopicItem( listDisplayItem.myself, newTopics[i], true );
        	}   

        	for(var i=0; i<topics.length; i++)
        	{
        		if (topics[i].isUpdated())
        			tabUpdated = true;

        		display.createTopicItem( listDisplayItem.myself, topics[i], false );
        	}
        	
        	display.updatedTabs[tabName] = tabUpdated;
        	//alert(tabName + " " + newTopics.length);
        	display.newTabs[tabName] = (newTopics.length > 0) ? true : false;
        	display.setSpecialTabsClass(tabs, prefs);
        },
        
        reduceSpanText: function( objSpan, widthFinal ) {
        	// while width of dynamic span is greater than final width
			var widthTemp = objSpan.offsetWidth;
			var text = getText(objSpan);			
			
			var lengthText = text.length;
			
            while(widthTemp > widthFinal && lengthText > 0)
            {
                // reduce one character from original text

                lengthText--;
                var textTrimmed = text.substring(0, lengthText) + "...";

                // get width of reduced text

                objSpan.innerHTML = textTrimmed;
                widthTemp = objSpan.offsetWidth;
            }
        },
        
        setSpecialTabsClass: function( tabs, prefs ) {
            var tabsArr = tabs.getTabs();
            for(var i = 0; i < tabsArr.length; i++ ) {
            	var aTab = tabsArr[i];
            	var name = aTab.getName();
            	var cont = aTab.getNameContainer();
            	
            	if (name == prefs.getMsg("forums") || name == prefs.getMsg("starred"))
            		display.setSpecialTabClass( aTab );
            	
				cont.className = cont.className.replace("isItalic", "");
            	for(var key in display.updatedTabs) { 
            		if (name == prefs.getMsg(key)) { 
            			if (display.updatedTabs[key] == true) 
            				cont.className = cont.className + " isItalic";
            			break;
            		}
            	}
            	
  				cont.className = cont.className.replace("isBold", "");
            	for(var key in display.newTabs) {
            		if (name == prefs.getMsg(key)) { 
            			if (display.newTabs[key] == true) 
            				cont.className = cont.className + " isBold";
            			break;
            		}
            	}
            	//alert(key + " class " + cont.className);
           	}
        },
        
        setSpecialTabClass: function ( tab ) {
        	tab.getNameContainer().className = "special_tab_con " + 
            	tab.getNameContainer().className;
        }

    }
}();

function DisplayGeneral() {
}

DisplayGeneral.prototype.init = function (divStared) {
	
	var afterTabsDiv = "afterTabsDiv";
	var staredDivHeader = "" +
		"<div class=\"staredTitle\">" +
		"	Old motorcycle restoration" +
		"</div>" +
		"<div class=\"staredStared\">" +
		"	Stared" +
		"</div>" +
		"<div class=\"staredNewStared\">" +
		"	New topic UTL:" +
		"	<input type=\"text\">" +
		"	<input type=\"button\" value=\"Add Topic\">" +
		"</div>";
	
	var staredDivFooter = "";	
	
	var forumItemStr = "" +
		"<div class=\"forumItem\">" +
		"	<a href=\"http://www.kuku.com?motorcycles=1\" class=\"name\">Classic Cars & Motorcycles</a>" +
		"	<div class=\"info\">" +
		"		<div class=\"numTopics\">Topics: 5</div>" +
		"		<div class=\"numPosts\">Posts: 201</div>" +
		"		<div class=\"lastPost\">" +
		"			<div class=\"lastPostTime\">Sat Nov 1, 2008 7:18 am</div>" +
		"			<a href=\"http://www.kuku.com?user=dan\" class=\"lastPostUser\">Dan</a>" +
		"		</div>" +
		"	</div>" +
		"	<span class=\"fg-loading\"> (Loading...)</span>" +
		"</div>";
	
	//alert(divStared);
	_gel(divStared).innerHTML = forumItemStr + forumItemStr + forumItemStr;
	_gel(divStared).className = "staredTab";
	
	_gel(afterTabsDiv).innerHTML = staredDivHeader;
	
	//<img src="http://hosting.gmodules.com/ig/gadgets/file/102059220620070378482/minus.bmp" alt="Big Boat">
	//<img src="http://hosting.gmodules.com/ig/gadgets/file/102059220620070378482/plus.bmp" alt="Big Boat">
}


/* end DisplayGeneral class */