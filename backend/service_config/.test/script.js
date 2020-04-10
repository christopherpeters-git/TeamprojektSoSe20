"use strict";

function sendRequest() {
    const request = new XMLHttpRequest();
    const json = {"name1":"Hallo", "name2":"Welt"}
    request.onreadystatechange = function () {
        if(4 == this.readyState && 200 == this.status){
            document.getElementById("testarea").innerHTML = this.responseText;
        }
    }
    request.open("POST","/api/config/save",true)
    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    request.send(JSON.stringify(json))
}