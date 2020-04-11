"use strict";


function sendPostRequest() {
    const request = new XMLHttpRequest();
    const json = {"name1":"Hallo", "name2":"Welt"}
    request.onreadystatechange = function () {
        if(4 == this.readyState && 200 == this.status){
            document.getElementById("testarea").innerHTML = this.responseText;
        }
        console.log(this.status)
    }
    request.open("POST","/api/config/save",true)
    request.setRequestHeader("Content-Type","application/json")
    request.send(JSON.stringify(json))
}

function sendGetRequest() {
    const request = new XMLHttpRequest();
    const json = {"name1":"Hallo", "name2":"Welt"}
    request.onreadystatechange = function () {
        if(4 == this.readyState && 200 == this.status){
            document.getElementById("testarea").innerHTML = this.responseText;
        }
        console.log(this.status)
    }
    request.open("GET","/api/config/save",true)
    request.send(JSON.stringify(json))
}