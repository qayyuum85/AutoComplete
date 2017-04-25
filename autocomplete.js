/* Auto complete feature with suggestions
-- AutoSuggestion HTML Structure
<div id="overSel">
	<ul id="selList">
		<li>a</li>
		<li>b</li>
		<li>c</li>
		<li>d</li>
	</ul>
</div>

-- Autocomplete HTML Structure
	<div style="width:500px;height:30px;">
		<input type = "text" id = "qryBox" class = "noXButton" onkeyup="autocompleteText(this.event)"/>
		<input id="autocomplete" type="text" disabled="disabled" />
	</div>
*/


// Added autocomplete feature
function autocompleteText(event){
	var event = event || window.event;
	var Array = ["abdullah","aadfsdf", "niazi","abdrty"]; // replace this with server call
	var array2 = Array.map(function(n,i){return n.toLowerCase();});
	var searchBox = document.getElementById("qryBox");
	var autoCompleteBox = document.getElementById("autocomplete");
	var value = searchBox.value;
	var lowerCaseVal, str_after, new_str;
	if (value == "") {
		autoCompleteBox.value = "";
		return;
	}
	else {
		lowerCaseVal = value.toLowerCase();
		autoCompleteBox.value = lowerCaseVal;
	    for(i = 0; i< array2.length; i++){
	        if(array2[i].lastIndexOf(lowerCaseVal, 0) === 0){
	            if (event.keyCode == 39){
	                searchBox.value = array2[i];
	            }
	            str_after = array2[i].substr(lowerCaseVal.length, array2[i].length);
	            new_str = value + str_after;
	            autoCompleteBox.value = new_str;
	            return;
	        }
	    }
	}
}

var timeoutId = 0;
function showSelection(elem) {
	clearTimeout(timeoutId);
	var UP = 38, DOWN = 40, ENTER = 13;
	var event = event || window.event;

	var getKey = function(e) {
		if(window.event) { return e.keyCode; }  // IE
		else if(e.which) { return e.which; }    // Netscape/Firefox/Opera
	};

	// Timeout will only be triggered if other than these 3 keys are pressed
	var pressedKey = getKey(event);
	if (pressedKey == UP || pressedKey == DOWN || pressedKey == ENTER) {
		return;
	}
	else {
	    timeoutId = setTimeout( function() {
		    genDropList(elem);
		}, 500);
	}
}

function buildList(txtRef, val){
	// Remove all children
	var el = document.getElementById("selList");
	while (el.firstChild) { el.removeChild(el.firstChild); }

	var divList = document.getElementById("overSel");

	// Get filtered list
	listing = {list: ['asdsdasd','bbbbbb','cccccc']};
	var listing = getFilteredList(txtRef, false);
	var data = listing.list;

	var clearfSelect = function () { // for clearing fSelect class
		var rowArray = document.getElementById("selList").children;
		Array.prototype.forEach.call(rowArray, function (row, rowIdx){
			row.className = "";
		});
	};

	/*Build list*/
	if (data && data.length > 0) {
		data.forEach(function (col){
			var li = document.createElement("li");
			/*Add highlight function*/
			li.innerHTML = hlChar(col, val);
			// li.value = col;
			// Change to data_city property name since property value not working
			li.data_city = col;

			// For appending fSelect class onmouseover
			li.onmouseover = function () {
				var thisLi = li;
				clearfSelect();
				thisLi.className = "fSelect";
			};

			li.onclick = function (txt, data){
				return function(){
					if (txtRef) {
						txtRef.value = txt;
						divList.style.display = "none";
					}
				};
			}(col);

			el.appendChild(li);
		});
		return true;
	}
	else {
		return false;
	}
}


function genDropList(elem) {
	var selDiv = document.getElementById("overSel");
	var show = buildList(elem, elem.value);
	if (show) {
		resizeOverlay(elem);
	}
	else {
		selDiv.style.display = "none";
	}
}


function resizeOverlay(elem){
	var selDiv = document.getElementById("overSel");
	var	obj = elem.getBoundingClientRect();

	selDiv.style.width = (obj.right - obj.left - 2) + "px"; //Minus 2 to fit with the textbox
	selDiv.style.left = (obj.left) + "px";
	selDiv.style.display = "block";

	document.getElementById("selList").firstChild.className = "fSelect";
	setListPos(elem);
}

function setListPos(elem){
	// Adjust the position of list according to page height
	var overlay = document.getElementById("overSel");

	// Get max height of the page
	var bodyHeight = function getBodyHeight() {
		var body = document.body,
			html = document.documentElement;
		var height = Math.max( body.scrollHeight, body.offsetHeight,
                     html.clientHeight, html.scrollHeight, html.offsetHeight );
        // return height;
        return body.offsetHeight;
	}

	// Calculate list height
	var listH = function calcListH(){
		var list = document.getElementById("selList");
	    var numOfChild = (list.children) ? list.children.length : 0;

		// Get an element's height in the list
        var childH = function getChildHeight(){
			var	fChild = list.firstChild;
	        return fChild.offsetHeight;
	    };

		return {
			"childH": childH(),
			"number": numOfChild,
			"totalH": numOfChild * childH()
		}
	};

    // Check remaining height under element
	var elemProp = elem.getBoundingClientRect();
    var pageH = bodyHeight();
    var remainingB = pageH - elemProp.bottom;

    // Add another 2px to include padding & border
    var elemTop = remainingB + (elemProp.bottom - elemProp.top) + 2;

    // If less than move up, but up to specific height only, then overflow
    var listDetail = listH();
    var listHeight = listDetail.totalH;

    // Will push the list down if list height is at least 6 child elements
    if (remainingB >= listDetail.childH*6){
	    // Subtract 2 because of border & padding
    	overlay.style.top = (elemProp.bottom - 2) + "px";
    	overlay.style.height = (listHeight > remainingB) ? remainingB + "px": listHeight + "px";
    	//overlay.style.overflow = "auto";
    }
    // If cannot fit more than 6 children, then push up
    else if (listHeight > remainingB) {
        overlay.style.top = "";
		overlay.style.bottom = elemTop + "px";
		if (listHeight > elemProp.top) {
			overlay.style.height = elemProp.top + "px";
			//overlay.style.overflow = "hidden";
		}
		else {
			// If less than remaining top height,
			// then list should have relative size to its content
        	overlay.style.height = listHeight;
        	//overlay.style.overflow = "hidden";
		}

	}
	// Default behaviour
    else {
	    // Subtract 2 because of border & padding
    	overlay.style.top = (elemProp.bottom - 2) + "px";
    	overlay.style.height = listHeight;
    	//overlay.style.overflow = "hidden";
    }
}
