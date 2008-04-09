/* begin DisplayGeneral class */

var displayGeneral = function () {
	var privatea;

    return {
        init: function () {
        },
        
        createCategoryItem: function (parentElem, category) {
        	
        	// callback( forums[] )
        	var loadCategoryFunction = function(callback) 
        		{ ctrl.loadCategory(category, callback) };
        	
        	var displayItem = new CategoryItem();
        	displayItem.init(parentElem, category.title, null, "empty sub header", 
        		loadCategoryFunction);
        },
        
        categories: function ( parentElem, cats )
        {
        	var listDisplayItem = ListDisplayItem( parentElem );
        	
        	for(var i = 0; i < cats.length; i++)
        	{
        		var displayItem = new createCategoryItem( listDisplayItem.myself, cats[i] );
        		listDisplayItem.addItem( displayItem );
        	}
        },
        
        createForumItem: function (parentElem, forum) {
        	
        	var loadForumFunction = function(callback) { ctrl.loadForum(forum, callback) };
        	
        	//var displayItem(parentElem, "asdf", "asdfa", )
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