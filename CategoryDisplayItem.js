/* begin CategoryDisplayItem class */
function CategoryDisplayItem(parent, headerText, headerUrl,
	subHeader, expandingFunction, isSelected, selectFunction, isForums, direction ) {

	this.initDisplayItem(parent);
	
	this.isForums = isForums;
	
   	this.header = document.createElement("div");
   	
   	this.header.dir = display.dir;	
   	if(display.dir == "rtl")
   		this.header.style.textAlign = "right";
   	else
   		this.header.style.textAlign = "left";
   	
   	this.header.className = "di-header";
	
	this.plusImg = document.createElement("img");
	this.plusImg.className = "di-sign-plus";
	this.plusImg.src = "http://foruminspector.googlecode.com/svn/trunk/cleardot.gif";
	this.plusImg.style.width = "9px";
	this.plusImg.style.height = "9px";
	this.header.appendChild(this.plusImg);
	
	var headerTextSpan = document.createElement("span");
	headerTextSpan.className = "di-header-span";
	headerTextSpan.innerHTML = headerText;
	this.header.appendChild(headerTextSpan);
	
	var gotoLink = document.createElement("a");
	gotoLink.target = "_blank";
	gotoLink.href = headerUrl;
	var onClickLink = function (e) {
		if (!e) var e = window.event;
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();        
	}
	addEventListener(gotoLink, 'click',onClickLink);
	
	var gotoImg = document.createElement("img");
	gotoImg.className = "noborder gotoArrow-" + display.dir;
	gotoImg.src = "http://foruminspector.googlecode.com/svn/trunk/cleardot.gif";	
	gotoLink.appendChild(gotoImg);
		
	this.header.appendChild(gotoLink);
	
 	this.loadingSpan = document.createElement("span");
 	this.loadingSpan.className = "di-loading";
	this.loadingSpan.innerHTML = "(Loading...)";
	this.header.appendChild(this.loadingSpan);
	
	if (selectFunction != null) {
		this.select = document.createElement("input");
		this.select.className = "di-select-" + display.dir;	
		this.select.type = "checkbox";
		this.select.checked = isSelected;
		var that = this;
		var onClickSelect = function (e) {
			
			if (!e) var e = window.event;
			e.cancelBubble = true;
			if (e.stopPropagation) e.stopPropagation();
			
			selectFunction( that.select.checked );
	        
		}
		addEventListener(this.select,'click',onClickSelect);
		this.header.appendChild(this.select);
	}
	
	if (subHeader != null)
	{
		this.bylineDiv = document.createElement("div");
		this.bylineDiv.className = "di-byline";
		this.bylineDiv.innerHTML = subHeader;
		this.header.appendChild(this.bylineDiv);
	}
	  	
   	this.myself.appendChild(this.header);
   	var divider = document.createElement("div");
   	divider.className = "di-divider";
   	this.myself.appendChild(divider);
   	this.expandedPart = document.createElement("div");
   	this.expandedPart.className = "di-expanded";
   	this.myself.appendChild(this.expandedPart);
   	
   	display.reduceSpanText( headerTextSpan, 260 );
  	
   	this.isClosed = true;

   	this.loadingSpan.style.visibility = "hidden";
   	this.expandedPart.style.display = "none";

   	//this.loadingSpan.style.display = "none";
   	//this.expandedPart.style.display = "none";
   	
   	var that = this;
   	
   	var onClickHeader = function() {
   		if (that.isClosed)
   		{
   			that.loadingSpan.style.visibility = "visible";
   			that.expandedPart.style.display = "block";
   			that.plusImg.className = "di-sign-minus";
   			that.header.className = "di-header di-expanded";
   			that.isClosed = false;
   			expandingFunction( function( o ) { that.loadItemsCallback( o ); } );
   		}
   		else
   		{
   			that.loadingSpan.style.visibility = "hidden";
   			that.expandedPart.style.display = "none";
   			that.plusImg.className = "di-sign-plus";
   			that.header.className = "di-header";
   			that.isClosed = true;
   		}
   	}
   	addEventListener(this.header, 'click',onClickHeader);
}

function addEventListener(o, t, f) {
	if (o.addEventListener) {
		o.addEventListener(t,f,false);
	} else {
		o.attachEvent("on"+t,f);
	}
}


CategoryDisplayItem.prototype = new DisplayItem();

CategoryDisplayItem.prototype.loadItemsCallback = function( forumsArr )
{
	while ( this.expandedPart.childNodes.length >= 1 )
    {
        this.expandedPart.removeChild( this.expandedPart.firstChild );       
    } 

	if (this.isForums)
	{    
		display.secondaryForums( this.expandedPart, forumsArr );
	}
	else
	{
		display.secondaryPosts( this.expandedPart, forumsArr );
	}
	this.loadingSpan.style.visibility = "hidden";
	_IG_AdjustIFrameHeight();
}

/* end CategoryDisplayItem class */