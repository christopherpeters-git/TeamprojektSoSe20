"use strict";

function sendRequest() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if(4 == this.readyState && 200 == this.status){
            document.getElementById("testarea").innerHTML = this.responseText;
        }
    }
    request.open("POST","/api/config/save")
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    request.send("<bla>BlaBla</bla>")
}