package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

var getObjectUrl = "/api/getObject/"
var getJsonFileUrl = "/api/getJson"
var itemFolderName = "items"
var itemFolderPath = itemFolderName + "/"
var jsonName = "items.json"
var logName = "ObjectStore.log"
var indexUrlParameter = "index"

type Item struct {
	ID      uint64
	FileUrl string
}

func main() {
	//Creates a log file
	f, err := os.OpenFile(logName, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)
	log.Print("Object-service has started...")

	http.Handle("/", http.FileServer(http.Dir("test/")))
	http.HandleFunc(getObjectUrl, getObject)
	http.HandleFunc(getJsonFileUrl, getJson)
	http.ListenAndServe(":100", nil)
}

//writes the request object in the response-stream
func getObject(w http.ResponseWriter, r *http.Request) {
	//Read the parameter of the request
	queryResults, ok := r.URL.Query()[indexUrlParameter]
	if !ok || len(queryResults) < 1 {
		w.WriteHeader(400)
		w.Write([]byte("url parameter unkown"))
		log.Println("Cant find parameter " + indexUrlParameter)
		return
	}

	strIndex := queryResults[0]
	incomingIndex, err := strconv.ParseUint(strIndex, 10, 64)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte("Input is not an integer"))
		log.Println("Failed to parse uint: " + err.Error())
		return
	}

	log.Println("Requested index: " + strconv.FormatUint(incomingIndex, 10))
	//Read & parse the .json file
	jsonData, err := ioutil.ReadFile(jsonName)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Println(err.Error())
		return
	}

	var configEntries []Item
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Println(err.Error())
		return
	}
	if incomingIndex > (uint64)(len(configEntries))-1 || incomingIndex < 0 {
		w.WriteHeader(404)
		w.Write([]byte("Index out of range"))
		log.Println("Index out of range")
		return
	}

	var foundPath = &configEntries[incomingIndex].FileUrl
	if foundPath == nil {
		w.WriteHeader(404)
		w.Write([]byte("Requested index not found"))
		log.Println("Object at index " + strconv.FormatUint(incomingIndex, 10) + " not found")
		return
	}

	data, err := ioutil.ReadFile(itemFolderPath + *foundPath)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Println(err.Error())
		return
	}
	w.Write(data)
	log.Println("Answered object request successfully, object send: " + *foundPath)
}

func getJson(w http.ResponseWriter, r *http.Request) {

}
