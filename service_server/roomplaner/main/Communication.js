const getJsonTargetUrl = "/proxy/getJson";
const getObjectTargetUrl = "/proxy/getObject";
const getJsonTargetUrlOffline = "items.json";

const isOnline = false;

function getIsOnline(){
	return isOnline;
}

function getGetObjectTargetUrl(){
	return getObjectTargetUrl;
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

	if(getIsOnline()){
		request.open("GET",getJsonTargetUrl,true);
	}else{
		request.open("GET",getJsonTargetUrlOffline,true);
	}
	console.log("Online: " + getIsOnline());
	request.send();
}
