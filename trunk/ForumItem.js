/* begin ForumItem class */
function ForumItem() {
}

ForumItem.prototype.init = function (parent, url, title) {
    this.parent = parent;
    this.url = url;
    this.boardUrl = url.replace(/\/[^\/]*$/, "") + "/";
    this.title = title;
    if (title == null || title == undefined) {
        this.title = url;
    }
    this.id = url.match(this.idRegEx)[1];
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

ForumItem.prototype.mkFullUrl = function (relUrl) {
    return this.boardUrl + relUrl;
};

ForumItem.prototype.load = function (callback) {
    if (this.isLoaded) {
    	callback(this);
        return;
    }
    this.reload(callback);
};

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

//ForumItem.prototype.display = function () {
//    ctrl.display(this);
//};

/* end ForumItem class */