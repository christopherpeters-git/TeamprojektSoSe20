const getObjectTargetUrl = "/proxy/getObjectById";
const getJsonTargetUrl = "/proxy/getJson";

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

function sendGetLoadJson(functionToCalOnSuccess){
	const request = createAjaxRequest();
	request.onreadystatechange = function () {
		if(4 === this.readyState){
			if(200 === this.status){
				functionToCalOnSuccess(this.responseText);
			}else{
				alert(this.status + ":" + this.responseText);
			}
		}
	}
	console.log(getJsonTargetUrl);
	request.open("GET",getJsonTargetUrl,true);
	request.send();
}
