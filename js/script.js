var list = document.createElement("div");
var addLi = document.createElement("div");

addLi.classList.add("cell");
addLi.classList.add("main");

var plus = document.createElement("div");
plus.classList.add("img-plus");
var input = document.createElement("textarea");

addLi.appendChild(input);
addLi.appendChild(plus);

document.body.appendChild(addLi);

plus.onclick = function(event) {
        if (input.value) {
        var listElem = document.createElement("div");
        listElem.classList.add("cell");
        listElem.innerHTML = input.value;
        listElem.setAttribute("draggable", "true");
        list.appendChild(listElem);
        input.value = "";
    }
}

document.body.appendChild(list);

document.body.onmouseover = function(event) {
    var target = event.target;    
    var relative = event.relatedTarget;
    
    if (!target.getAttribute("draggable"))
        return;
    if(relative) {
        if(event.relatedTarget.classList.contains("delete"))
        return;
    }

    target.style.background = "lightgrey";
    var deleteElem = document.createElement("div");
    deleteElem.classList.add("delete");
    target.appendChild(deleteElem);

    deleteElem.onclick = function() {
        target.parentNode.removeChild(target);
    }

    target.onmouseleave = function() {
        target.style.background = "";
        target.removeChild(deleteElem);
    }
}


document.body.onmousedown = function(event) {
    var target = event.target;

    if (!target.getAttribute("draggable"))
        return;

    var coords = getCoords(target);
    var shiftX = event.pageX - coords.left;
    var shiftY = event.pageY - coords.top;

    target.style.position = "absolute";
    moveAt(event);
    
    document.onmousemove = function(e) {
        moveAt(e);
    }

    target.onmouseup = function(e) {
        document.onmousemove = null;
        target.onmouseup = null;

        var heightTarget = target.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
        
                var sibling = document.elementFromPoint(20, target.getBoundingClientRect().bottom - heightTarget/2);
                if(sibling.className == "cell" && sibling != target) {
                    var  heightSibling = sibling.getBoundingClientRect().bottom - sibling.getBoundingClientRect().top;
                    if (target.getBoundingClientRect().bottom - heightTarget/2 < sibling.getBoundingClientRect().bottom - heightSibling / 2)
                        sibling.before(target);
                }

                if (target.getBoundingClientRect().top < list.getBoundingClientRect().top)
                    list.insertBefore(target, list.firstElementChild);
                if (target.getBoundingClientRect().top > list.getBoundingClientRect().bottom)
                    list.appendChild(target);

        target.style.position = "";
    }

    target.ondragstart = function() {
        return false;
    }

    function moveAt(e) {
        target.style.left = e.pageX - shiftX + 'px';
        target.style.top = e.pageY - shiftY + 'px';
    }

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset,
        }
    }
}

