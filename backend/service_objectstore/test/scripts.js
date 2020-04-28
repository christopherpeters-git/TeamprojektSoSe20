function sendGetObject(){
    const request = new XMLHttpRequest();
    const targetUrl = "/api/getObject"
    const id = document.getElementById("id").value
    request.onreadystatechange = function () {
        if(4 === this.readyState){
            if(200 === this.status){

                document.getElementById("loadTest").innerHTML = this.responseText;
                alert(this.responseText)
            }else{
                alert("" + this.status + ":" +this.responseText)
            }
        }
    }
    request.open("POST",targetUrl,true)
    request.setRequestHeader("Content-Type","application/x-www-form-urlencoded")
    request.send("id="+id)
}