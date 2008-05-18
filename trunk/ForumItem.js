/* begin ForumItem class */
function ForumItem() {
}

ForumItem.prototype.init = function (parent, url, title) {
    this.parent = parent;
    this.url = url;
    this.boardUrl = url.replace(/\/[^\/]*$/, "") + "/";
    this.title = title;
    if (title == null) {
        this.title = url;
    }
    try {
    	this.id = this.linkMatch(url)[1];
    }
    catch (e) {
    	alert(e);
    }
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

ForumItem.prototype.linkMatch = function (url) {
	return url.match(this.idRegEx);
}

ForumItem.prototype.mkFullUrl = function (relUrl) {
	var url = (relUrl.substr(0, 4) != "http") ? this.boardUrl + relUrl : relUrl;
	return url;
};

ForumItem.prototype.load = function (callback) {
    if (this.isLoaded) {
    	callback(this);
        return;
    }
    this.reload(callback);
};

ForumItem.prototype.isUpdated = function () {
	return false;
}

ForumItem.prototype.isNew = function () {
	return false;
}

ForumItem.prototype.isSelected = function () {
	return false;
};

ForumItem.prototype.selSubItems = function () {
	var r = [];
	for (var i=0;i<this.subItems.length;i++) {
		if (this.subItems[i].isSelected()) {
			r.push(this.subItems[i]);
		}
	}
	return r;
};

ForumItem.prototype.visibleSubItems = function () {
	return this.subItems;
}

ForumItem.prototype.reload = function (callback) {
    this.isLoaded = true;
    var that = this;
    _IG_FetchContent(this.url, function (content) {
        that.onLoad(content);
        callback(that);
    });
};

ForumItem.prototype.onLoad = function (content) {
    this.parse(content);
};

ForumItem.prototype.parse = function (content) {
};


ForumItem.prototype.getTableHeader = function (table) {
	var ths = table.getElementsByTagName('th');
    if 	(ths == null || ths.length == 0) {
        var tds = table.getElementsByTagName('td');
        ths = [];
        for (var i in tds) {
        	var c = tds[i].className; 
        	if (c && (c.indexOf("thCorner") >= 0 || c.indexOf("thTop") >= 0)) {
        		ths.push(tds[i]);
        	}
        }
    }
    return ths;
};
//ForumItem.prototype.display = function () {
//    ctrl.display(this);
//};

/* end ForumItem class */