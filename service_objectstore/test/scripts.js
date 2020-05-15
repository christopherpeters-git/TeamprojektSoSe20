function sendGetLoadObject(){
    const request = new XMLHttpRequest();
    const targetUrl = "/api/getObjectByIndex"
    const index = document.getElementById("index").value
    request.onreadystatechange = function () {
        if(4 === this.readyState){
            if(200 === this.status){
                document.getElementById("objectTest").innerHTML = this.responseText;
            }else{
                alert("" + this.status + ":" +this.responseText)
            }
        }
    }
    console.log(targetUrl + "?" + "index=" + index);
    request.open("GET",targetUrl + "?" + "index=" + index,true)
    request.send() //TODO add to parameters
}

function sendGetLoadJson(){
    const request = new XMLHttpRequest();
    const targetUrl = "/api/getJson"
    request.onreadystatechange = function () {
        if(4 === this.readyState){
            if(200 === this.status){
                document.getElementById("jsonTest").innerHTML = this.responseText;
            }else{
                alert("" + this.status + ":" +this.responseText)
            }
        }
    }
    request.open("GET",targetUrl,true)
    request.send();
}