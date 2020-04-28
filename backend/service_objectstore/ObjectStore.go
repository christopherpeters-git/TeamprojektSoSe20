package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

var getObjectUrl = "/api/getObject"
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
	queryResult := r.URL.Query()
	strIndex := queryResult.Get(indexUrlParameter)
	if strIndex == "" {
		w.WriteHeader(400)
		w.Write([]byte("url parameter unkown"))
		log.Fatal("'" + indexUrlParameter + "'" + "' not found as parameter:" + queryResult.Encode())
	}
	log.Println("Request index: " + strIndex)
	incomingIndex, err := strconv.ParseUint(strIndex, 10, 64)
	if err != nil {
		w.WriteHeader(400)
		w.Write([]byte("Input is not an integer"))
		log.Fatal("Failed to parse uint: " + err.Error())
	}
	log.Println("index: " + strIndex + " " + strconv.FormatInt(r.ContentLength, 10) + "index:" + r.FormValue("index"))
	//Read & parse the .json file
	jsonData, err := ioutil.ReadFile(itemFolderName + jsonName)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Fatal(err.Error())
	}
	var configEntries []Item
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Fatal(err.Error())
	}
	var foundPath = &configEntries[incomingIndex].FileUrl
	if foundPath == nil { //TODO
		w.WriteHeader(404)
		w.Write([]byte("Requested index not found"))
		log.Fatal("Object at index " + strconv.FormatUint(incomingIndex, 10) + " not found")
	}
	data, err := ioutil.ReadFile(*foundPath)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Fatal(err.Error())
	}
	w.Write(data)
	log.Println("Answered object request successfully")
}

func getJson(w http.ResponseWriter, r *http.Request) {

}
