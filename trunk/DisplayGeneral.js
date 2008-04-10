/* begin DisplayGeneral class */

var display = function () {
	var privatea;

    return {
        init: function () {
        },
        
        createCategoryItem: function (parentElem, category) {
        	
        	// callback( forums[] )
        	var loadCategoryFunction = function(callback) 
        		{ category.load( function ( o ) { callback( o.subItems ); } ); };
        	
        	var selectCategoryFunction = function( status )
        		{ ctrl.toggleForum( category, status ); };
        		
        	var displayItem = new CategoryDisplayItem(
        			parentElem, category.title, category.url, 
        			null, loadCategoryFunction, selectCategoryFunction);
        },
                
        createForumItem: function (parentElem, forum) {
        	
        	var loadForumFunction = function(callback)
        		{ forum.load( function ( o ) { callback( o.subItems ); } ); };
        		
        	var selectForumFunction = function( status )
        		{ ctrl.toggleForum( forum, status ); };
        	
        	var displayItem = new ForumDisplayItemSecondary(
        		parentElem, forum.title, forum.url,
        		display.getForumSubHeader(forum) , selectForumFunction);
        },
        
        getForumSubHeader: function ( forum ) {
        	return labels.topics + ": " + forum.topics + " " +
  			labels.posts + ": " + forum.posts + " " +
    		labels.lastPost + ": " + forum.lastPost.date + " " +
    		"<a href=\"" + forum.lastPost.authorProfileLink + "\" target=\"_blank\">" +
    		forum.lastPost.author + "</a href=\"" + forum.lastPost.link + "\">" +
    		" <img src=\"http://foruminspector.googlecode.com/svn/trunk/icon_latest_reply.gif\">";//
        },
        
        categories: function ( parentElem, cats )
        {
        	var listDisplayItem = new ListDisplayItem( parentElem );
        	
        	for(var i=0; i<cats.length; i++)
        	{
        		display.createCategoryItem( listDisplayItem.myself, cats[i] );
        	}
        },
        
        forums: function ( parentElem, forums )
        {
        	var listDisplayItem = new ListDisplayItem( parentElem );
   
        	for(var i=0; i<forums.length; i++)
        	{
        		display.createForumItem( listDisplayItem.myself, forums[i] );
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