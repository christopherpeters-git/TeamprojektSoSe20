//Online URL's
const getJsonTargetUrl = "/proxy/getJson";
const getObjectTargetUrl = "/proxy/getObject";
const getLoadConfigUrl = "/proxy/loadConfig"
const getSaveConfigUrl = "/proxy/saveConfig"
//Offline URL's
const getJsonTargetUrlOffline = "items.json";

const isOnline = true;

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
		request = new ActiveXObject("Microsoft.XMLHTTP");
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

function sendPostLoadConfig(id,pass,functionToCallOnSuccess){
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
	request.open("POST",getLoadConfigUrl,true);
	request.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	console.log("" + id + " " + pass);
	request.send("id="+id+"&"+"pwd="+pass);
}

function sendPostSaveConfig(configStr,functionToCallOnSuccess){
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
	request.open("POST",getSaveConfigUrl,true);
	request.setRequestHeader("Content-Type","application/json");
	request.send(configStr);
}
