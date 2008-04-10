/* begin CategoryDisplayItem class */
function CategoryDisplayItem(parent, headerText, headerUrl, subHeader, expandingFunction, isSelected, selectFunction ) {

	this.initDisplayItem(parent);
	
   	this.header = document.createElement("div");
   	this.header.className = "di-header";
	
	this.plusImg = document.createElement("img");
	this.plusImg.className = "di-sign-plus";
	this.plusImg.src = "http://foruminspector.googlecode.com/svn/trunk/cleardot.gif";
	this.plusImg.style.width = "9px";
	this.plusImg.style.height = "9px";
	this.header.appendChild(this.plusImg);
	
	var headerTextSpan = document.createElement("span");
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
	gotoLink.addEventListener('click',onClickLink,false);	
	this.header.appendChild(gotoLink);
	
	var gotoImg = document.createElement("img");
	gotoImg.className = "noborder gotoArrow";
	gotoImg.src = "http://foruminspector.googlecode.com/svn/trunk/cleardot.gif";	
	gotoLink.appendChild(gotoImg);
	
 	this.loadingSpan = document.createElement("span");
 	this.loadingSpan.className = "di-loading";
	this.loadingSpan.innerHTML = "(Loading...)";
	this.header.appendChild(this.loadingSpan);
	
	if (selectFunction != null) {
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
   	
   	display.reduceSpanText( headerTextSpan, 290 );
  	
   	this.isClosed = true;
   	this.loadingSpan.style.display = "none";
   	this.expandedPart.style.display = "none";
   	
   	var that = this;
   	
   	var onClickHeader = function() {
   		if (that.isClosed)
   		{
   			that.loadingSpan.style.display = "inline";
   			that.expandedPart.style.display = "block";
   			that.plusImg.className = "di-sign-minus";
   			that.header.className = "di-header di-expanded";
   			that.isClosed = false;
   			expandingFunction( function( o ) { that.loadItemsCallback( o ); } );
   		}
   		else
   		{
   			that.loadingSpan.style.display = "none";
   			that.expandedPart.style.display = "none";
   			that.plusImg.className = "di-sign-plus";
   			that.header.className = "di-header";
   			that.isClosed = true;
   		}
   	}
   	this.header.addEventListener('click',onClickHeader,false);
}

CategoryDisplayItem.prototype = new DisplayItem();

CategoryDisplayItem.prototype.loadItemsCallback = function( forumsArr )
{
	while ( this.expandedPart.childNodes.length >= 1 )
    {
        this.expandedPart.removeChild( this.expandedPart.firstChild );       
    } 
    
	display.secondaryForums( this.expandedPart, forumsArr );
	this.loadingSpan.style.display = "none";
	_IG_AdjustIFrameHeight();
}

/* end CategoryDisplayItem class */