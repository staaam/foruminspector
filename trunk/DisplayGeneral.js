/* begin DisplayGeneral class */

var display = function () {
	var privatea;

    return {
        init: function () {
        },
        
        clear: function (el) {
        	el.innerHTML = "";
        },
        
       	setDirection: function ( dir ) {
        	display.dir = dir;
        },
        
        createCategoryItem: function (parentElem, category) {
        	var loadCategoryFunction = function(callback) 
        		{ category.load( function ( o ) { callback( o.subItems ); } ); };
        	
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
        	
        	var postItem = document.createElement("div");
        	postItem.className = "di-secondary-header";
        	
        	var span = document.createElement("span");
        	//aDiv.className
        	span.innerHTML = post.text;
        	postItem.appendChild(span);
        	parentElem.appendChild(postItem);
        	
        	var divider = document.createElement("div");
        	divider.className = "di-divider";
        	parentElem.appendChild(divider);
        	
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
        	parentElem.dir = display.dir;
        	parentElem.style.textAlign = (display.dir == "rtl")? "right" : "left";
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
        	var span = document.createElement("span");
        	span.innerHTML = board.title;
        	parentElem.appendChild(span);
        	
        	display.reduceSpanText( span, 310 );
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
        	return labels.posts + ": " + topic.posts + " " +
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