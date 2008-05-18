/* begin DisplayGeneral class */

var display = function () {
	var privatea;

    return {
        init: function () {
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
        			null, loadCategoryFunction, null, null, true);
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
        	
        	var str = labels.author + ": " + post.author + " ("+post.details+")";
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
        	var loadTopicFunction = function(callback) 
        		{ topic.load( function ( o ) { callback( o.subItems ); } ); };
        	
        	var selectTopicFunction = function( status )
        		{ ctrl.toggleTopic( topic, status ); };
        		
        	var displayItem = new CategoryDisplayItem(
        			parentElem, topic.title, topic.url, 
        			display.getTopicSubHeader( topic ), loadTopicFunction,
        			topic.isSelected(), selectTopicFunction, false );
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
        	"<img class=\"noBorder refreshImage\" onclick=\"ctrl.refresh();\" src=\"http://foruminspector.googlecode.com/svn/trunk/cleardot.gif\">"+
        	"</img>"
        	 + "</td></tr></table>";
        	
        	parentElem.innerHTML = str;
        	
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

        topics: function( parentElem, topics ) {
           	var listDisplayItem = new ListDisplayItem( parentElem );

        	for(var i=0; i<topics.length; i++)
        	{
        		display.createTopicItem( listDisplayItem.myself, topics[i] );
        	}    	
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
            for(var i = 0; i < tabsArr.length; i++ )
            {
            	var aTab = tabsArr[i];
            	
            	if (aTab.getNameContainer().innerHTML == prefs.getMsg("forums") ||
            		aTab.getNameContainer().innerHTML == prefs.getMsg("starred"))
            	{
            		display.setSpecialTabClass( aTab );
            	}
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