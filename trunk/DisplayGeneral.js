/* begin DisplayGeneral class */
function DisplayGeneral() {
}

DisplayGeneral.prototype.init = function (divStared) {
	
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
		"</div>"
	
	//alert(divStared);
	_gel(divStared).innerHTML = forumItemStr; 
	
}


/* end DisplayGeneral class */