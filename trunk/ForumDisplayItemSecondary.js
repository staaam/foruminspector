/* begin ForumDisplayItemSecondary class */
function ForumDisplayItemSecondary(parent, headerText, headerUrl, subHeader, isSelected, selectFunction) {
	this.initDisplayItem(parent)
	this.myself.className = this.myself.className + " ForumDisplayItemSecondary";
	
	this.header = document.createElement("div");
   	this.header.className = "di-secondary-header";

	var headerTextSpanH3 = document.createElement("h3");
   		
	var gotoLink = document.createElement("a");
	gotoLink.target = "_blank";
	gotoLink.href = headerUrl;
	var onClickLink = function (e) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();        
	}
	gotoLink.addEventListener('click',onClickLink,false);
	headerTextSpanH3.appendChild(gotoLink);
	headerTextSpanH3.className = "di-maintitle";
	this.header.appendChild(headerTextSpanH3);
	
	var headerTextSpan = document.createElement("span");
	headerTextSpan.innerHTML = headerText;
	gotoLink.appendChild(headerTextSpan);
	
	this.select = document.createElement("input");
	this.select.className = "di-select";	
	this.select.type = "checkbox";
	this.select.checked = isSelected;
	var onClickSelect = function (e) {
		
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
		
		selectFunction( this.checked );
        
	}
	this.select.addEventListener('click',onClickSelect,false);
	this.header.appendChild(this.select);
	
	if (subHeader != null)
	{
		var bylineDiv = document.createElement("div");
		bylineDiv.className = "di-byline-secondary";
		bylineDiv.innerHTML = subHeader;
		this.header.appendChild(bylineDiv);
	}

  	this.myself.appendChild(this.header);
  	
  	var divider = document.createElement("div");
   	divider.className = "di-divider";
   	this.myself.appendChild(divider);
  	
  	display.reduceSpanText( headerTextSpan, 300 );
}

ForumDisplayItemSecondary.prototype = new DisplayItem();
/* end ForumDisplayItemSecondary class */	