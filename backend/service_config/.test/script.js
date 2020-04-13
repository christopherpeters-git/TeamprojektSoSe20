"use strict";


function sendPostSaveRequest() {
    const request = new XMLHttpRequest();
    const json = {"name1":"Hallo", "name2":"Welt"}
    request.onreadystatechange = function () {
        if(4 == this.readyState){
            if(200 == this.status){
                document.getElementById("saveTest").innerHTML = this.responseText;
                console.log(this.responseText)
            }else{
                alert("" + this.status + ":" +this.responseText)
            }
        }
    }
    request.open("POST","/api/config/save",true)
    request.setRequestHeader("Content-Type","application/json")
    request.send(JSON.stringify(json))
}

function sendPostLoadRequest(){
    const request = new XMLHttpRequest();
    const targetUrl = "/api/config/load"
    const id = document.getElementById("id").value
    const pwd = document.getElementById("pwd").value
    request.onreadystatechange = function () {
        if(4 == this.readyState){
            if(200 == this.status){
                document.getElementById("loadTest").innerHTML = this.responseText;
                console.log(this.responseText)
            }else{
                alert("" + this.status + ":" +this.responseText)
            }
        }
    }
    request.open("POST",targetUrl,true)
    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    request.send("id="+id+"&"+"pwd="+pwd)
}