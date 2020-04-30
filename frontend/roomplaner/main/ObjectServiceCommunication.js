const getObjectTargetUrl = "/proxy/getObject";
const getJsonTargetUrl = "/proxy/getJson";

function getGetObjectTargetUrl(){
	return getObjectTargetUrl;
}

function getGetJsonTargetUrl(){
	return getJsonTargetUrl;
}

function createAjaxRequest(){
	let request;
	if(window.XMLHttpRequest){
		request = new XMLHttpRequest();
	}else{
		request = new ActiveXObject();
	}
	return request;
}

function sendGetLoadObject(index,functionToCallOnSuccess){
	let data = "";
	let dataArrived = false;
	const request = createAjaxRequest();
	request.onreadystatechange = function () {
		if(4 === this.readyState){
			if(200 === this.status){
				functionToCallOnSuccess(this.responseText);
			}else{
				alert("" + this.status + ":" +this.responseText)
			}
		}
	}
	console.log(getObjectTargetUrl + "/?" + "index=" + index);
	request.open("GET",getObjectTargetUrl + "/?" + "index=" + index,true)
	request.send()
}

function sendGetLoadJson(functionToCallOnSuccess){
	const request = createAjaxRequest();
	request.onreadystatechange = function () {
		if(4 === this.readyState){
			if(200 === this.status){
				functionToCallOnSuccess(this.responseText);
			}else{
				alert(this.status + ":" + this.responseText);
			}
		}
	}
	console.log(getJsonTargetUrl);
	request.open("GET",getJsonTargetUrl,true);
	request.send();
}
