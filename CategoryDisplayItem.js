/* begin CategoryDislpayItem class */
function CategoryDislpayItem(parent, headerText, headerUrl, subHeader, expandingFunction) {

	this.initDisplayItem(parent);
	this.myself.className = "display-item";
   	
   	var header = document.createElement("div");
   	header.className = "di-header";
   	//header.innerHTML = "" +
   	//	"<img class=\"fg-sign\" src=\"cleardot.gif\" style=\"width: 9px; height: 9px;\"/>" +
	//	headerText +
	//	"<a href=\"" + headerUrl + "\" class=\"name\">" + 
	//	"<img class=\"noborder smallImage\" src=\"order_arrow.gif\"/></a>" +
	//	"<span class=\"di-loading\" style=\"display: none\">(Loading...)</span>" + 
	//	"<div class=\"fg-byline\">" + subHeader + "</div>";
	
	this.plusImg = document.createElement("img");
	this.plusImg.className = "di-sign-plus";
	//plusImg.src = "cleardot.gif";
	//plusImg.style.width = "9px";
	//plusImg.style.height = "9px";
	header.appendChild(this.plusImg);
	
	var headerTextSpan = document.createElement("span");
	headerTextSpan.innerHTML = headerText;
	header.appendChild(headerTextSpan);
	
	var gotoLink = document.createElement("a");
	gotoLink.href = headerUrl;
	header.appendChild(gotoLink);
	
	var gotoImg = document.createElement("img");
	plusImg.className = "noborder smallImage gotoArrow";
	//plusImg.src = "order_arrow.gif";
	gotoLink.appendChild(gotoImg);
	
 	this.loadingSpan = document.createElement("span");
 	this.loadingSpan.className = "di-loading";
	this.loadingSpan.innerHTML = "(Loading...)";
	header.appendChild(this.loadingSpan);
	
	var bylineDiv = document.createElement("div");
	bylineDiv.innerHTML = subHeader;
	header.appendChild(bylineDiv);
	  	
   	this.myself.appendChild(header);
   	var divider = document.createElement("div");
   	divider.className = "di-divider";
   	this.myself.appendChild(divider);
   	this.expandedPart = document.createElement("div");
   	this.expandedPart.className = "di-expanded";
   	this.myself.appendChild(this.expandedPart);
   	
   	this.isClosed = true;
   	
   	var that = this;
   	 
   	this.header.onclick = function() {
   		if (that.isClosed)
   		{
   			that.loadingSpan.style.display = "inline";
   			that.expandedPart.style.display = "block";
   			that.plusImg.className = "di-sign-minus";
   			that.isClosed = false;
   			expandingFunction( that.loadItemsCallback );
   		}
   		else
   		{
   			that.loadingSpan.style.display = "none";
   			that.expandedPart.style.display = "none";
   			that.plusImg.className = "di-sign-plus";
   			that.isClosed = true;
   		}
   	}
}

CategoryDislpayItem.prototype = new DisplayItem();

CategoryDislpayItem.prototype.loadItemsCallback = function( forumsArr )
{
	display.categories( this.myself, forumsArr );
}

/* end CategoryDislpayItem class */