package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

var getObjectUrl = "/api/getObjectByIndex/"
var getJsonFileUrl = "/api/getJson"
var itemFolderName = "items"
var itemFolderPath = itemFolderName + "/"
var jsonName = "items.json"
var logName = "ObjectStore.log"
var indexUrlParameter = "index"

var serverStartFailedMsg = "Starting service failed: "

type Item struct {
	ID      uint64
	FileUrl string
}

func reportError (w http.ResponseWriter, statusCode int, responseMessage string, logMessage string){
	w.WriteHeader(statusCode)
	w.Write([]byte(responseMessage))
	log.Println(logMessage)
}

func main() {
	//Creates a log file
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	f, err := os.OpenFile(logName, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)

	//Stopping server if item folder doesnt exist
	_, err = os.Stat(itemFolderName)
	if os.IsNotExist(err) {
		log.Fatal(serverStartFailedMsg + "Couldn't find " + itemFolderName)
	}
	http.Handle("/", http.FileServer(http.Dir("test/")))
	http.HandleFunc(getObjectUrl, getObjectByIndex)
	http.HandleFunc(getJsonFileUrl, getJson)
	http.ListenAndServe(":100", nil)
	log.Print("Object-service has started...")
}

//writes the request object in the response-stream
func getObjectByIndex(w http.ResponseWriter, r *http.Request) {
	log.Println("Started answering an object request...")
	//Read the parameter of the request
	queryResults, ok := r.URL.Query()[indexUrlParameter]
	if !ok || len(queryResults) < 1 {
		reportError(w, 400,"url parameter unkown","Cant find parameter " + indexUrlParameter)
		return
	}
	//Extrac index parameter
	log.Println(queryResults)
	strIndex := queryResults[0]
	incomingIndex, err := strconv.ParseUint(strIndex, 10, 64)
	if err != nil {
		reportError(w, 400,"Input is not an integer","Failed to parse uint: " + err.Error())
		return
	}

	log.Println("Requested index: " + strconv.FormatUint(incomingIndex, 10))
	//Read & parse the .json file
	jsonData, err := ioutil.ReadFile(jsonName)
	if err != nil {
		reportError(w,500, "Internal server error", err.Error())
		return
	}
	//Parsing the json file
	var configEntries []Item
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		reportError(w,500,"Internal server error",err.Error())
		return
	}
	if incomingIndex > (uint64)(len(configEntries))-1 || incomingIndex < 0 {
		reportError(w,404, "Index out of range", "Index out of range")
		return
	}
	//Get fileUrl by index
	var foundPath = &configEntries[incomingIndex].FileUrl
	if foundPath == nil {
		reportError(w,404,"Requested index not found", "Object at index " + strconv.FormatUint(incomingIndex, 10) + " not found")
		return
	}
	//Read data from found file
	data, err := ioutil.ReadFile(itemFolderPath + *foundPath)
	if err != nil {
		reportError(w,500, "Internal server error", err.Error())
		return
	}
	//Send data
	w.Write(data)
	log.Println("Answered object request successfully, object send: " + *foundPath)
}

func getJson(w http.ResponseWriter, r *http.Request) {
	log.Println("Started answering a json request...")
	//Reading json
	data, err := ioutil.ReadFile(jsonName)
	if err != nil {
		reportError(w,500,"Internal server error",err.Error())
		return
	}
	//Sending json content
	w.Write(data)
	log.Println("Answered json request successfully")
}
