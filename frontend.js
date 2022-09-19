
let vendors;
let items;

//Promise.all([getVendors(), getItems()])



function addRows() {
    var table = document.getElementById('line-item-table');
    var rowCount = table.rows.length;
    let rowToCopy = table.rows[1];
    var row = table.insertRow(rowCount);
    row.innerHTML = rowToCopy.innerHTML;
    //google.script.run.withSuccessHandler(populateMPNs).withFailureHandler(er => {alert(er)}).getSKUs()
    populateMPNs(items.itemList)
}

function deleteRows(e) {
    var rowToDelete = e.parentNode.parentNode.rowIndex;
    var table = document.getElementById('line-item-table');
    var rowCount = table.rows.length;
    if (rowCount > '2') {
        var row = table.deleteRow(rowToDelete);
    }
}

async function populateVendors(vendors) {
    autocomplete(document.getElementById("supplier-box"), vendors);
}

async function populateMPNs(SKUs) {
    for (let element of document.getElementsByName("MPNs[]")) {
        autocomplete(element, SKUs);
    }
}

async function httpGet(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.setRequestHeader("api-auth-accountid", "7af95a52-a6e1-47ad-a76e-fad14dfa7349");
    request.setRequestHeader("api-auth-applicationkey", "4cdde7f5-f1a6-f4ef-37bd-dd15b0f1caed");
    request.send(null);
    return request.responseText;
}

async function getFetch(url) {

}

async function getVendors() {
    let response = JSON.parse(await httpGet("https://inventory.dearsystems.com/ExternalApi/v2/supplier?Limit=1000"));

    let vendorNames = [];

    for (let entry of response.SupplierList) {
        vendorNames.push(entry.Name)
    }

    populateVendors(vendorNames)

    //vendors = vendorNames;
    return vendors;
}

async function getItems() {
    let response = JSON.parse(await httpGet("https://inventory.dearsystems.com/ExternalApi/v2/product?Limit=1000"));

    let itemPairs = [];
    let itemList = [];
    let SKU;
    let name;

    for (let entry of response.Products) {
        SKU = entry.SKU;
        name = entry.Name;
        itemPairs.push({
            SKU: name
        })
        itemList.push(SKU)
    }

    populateMPNs(itemList)
    items = {
        'itemPairs': itemPairs,
        'itemList': itemList
    }
}


function updateDescrip(e) {

    if (items.itemList.includes(e.value)) {
        let SKU = e.value;
        //alert(e.parentNode.outerHTML)
        for (let node of e.parentNode.children) {
            //alert(node)
            if (node.firstElementChild && node.firstElementChild.name == "descrips[]") {

                node.firstElementChild.value = items.itemPairs[SKU];
            }
        }

        //alert(e.parentNode.parentNode)
    }
}

function disp() {
    alert(document.getElementById("total-box").value)
}

function submitForm() {

    // input validation

    let request = {

        Supplier: document.getElementById("supplier-box").value,
        IsExpensify: document.getElementById("expensify-checkbox").checked,
        OrderTotal: document.getElementById("total-box").value,
        Lines: []
    }

    for (let line of document.getElementsByName("order-row")) {

        //alert(getLineInfo(line).MPN)

        //request.lines.push(getLineInfo(line))
    }

}

function getLineInfo(e) {

    let node = e.firstChild;
    let line = new Object();
    //alert(node.nodeName)

    while (node.nextSibling) {

        switch (node.name) {

            case "MPN-cell":
                line.MPN = node.value;
                break;
            case "descrip-cell":
                line.Description = node.value;
                break;
            case "qty-cell":
                line.Quantity = node.value;
                break;
            case "price-cell":
                line.Price = node.value;
                break;
        }
        node = node.nextSibling;
    }
    return line;
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    updateDescrip(inp);
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}