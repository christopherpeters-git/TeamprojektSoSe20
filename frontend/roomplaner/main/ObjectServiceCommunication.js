const configServicePort = 99;
const objectServicePort = 100;

const getObjectTargetUrl = "localhost:" + objectServicePort +  "/api/getObject";
const getJsonTargetUrl = "localhost:" + objectServicePort + "/api/getJson"

function createAjaxRequest(){
	let request;
	if(window.XMLHttpRequest){
		request = new XMLHttpRequest();
	}else{
		request = new ActiveXObject();
	}
	return request;
}

function sendGetLoadObject(index){
	let data = "";
	let dataArrived = false;
	const request = createAjaxRequest();
	request.onreadystatechange = function () {
		if(4 === this.readyState){
			if(200 === this.status){
				data = this.responseText;
				dataArrived = true;
			}else{
				alert("" + this.status + ":" +this.responseText)
			}
		}
	}
	console.log(getObjectTargetUrl + "/?" + "index=" + index);
	request.open("GET",getObjectTargetUrl + "/?" + "index=" + index,true)
	request.send()
}

function sendGetLoadJson(){
	const request = createAjaxRequest();
	request.onreadystatechange = function () {
		if(4 === this.readyState){
			if(200 === this.status){

			}else{
			}
		}
	}
	request.open("GET",getJsonTargetUrl,true)
	request.send();
}
