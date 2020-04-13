"use strict";


function sendPostSaveRequest() {
    const request = new XMLHttpRequest();
    const json = {"name1":"Hallo", "name2":"Welt"}
    request.onreadystatechange = function () {
        if(4 == this.readyState && 200 == this.status){
            document.getElementById("saveTest").innerHTML = this.responseText;
            console.log(this.responseText)
        }
    }
    request.open("POST","/api/config/save",true)
    request.setRequestHeader("Content-Type","application/json")
    request.send(JSON.stringify(json))
}

function sendGetLoadRequest(){
    const request = new XMLHttpRequest();
    const hash = 0;
    const targetUrl = "/api/config/load/" + hash.toString()
    request.onreadystatechange = function () {
        if(4 == this.readyState && 200 == this.status){
            document.getElementById("loadTest").innerHTML = this.responseText;
            console.log(this.responseText)
        }
        console.log(this.status)
    }
    request.open("GET",targetUrl,true)
    console.log(targetUrl)
    request.send()
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