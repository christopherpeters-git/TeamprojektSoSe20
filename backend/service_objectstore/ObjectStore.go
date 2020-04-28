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
var itemFolderPath = "/" + itemFolderName + "/"
var jsonName = "items.json"
var logName = "ObjectStore.log"

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

	createConfigFolderIfNotExisting()

	http.Handle("/", http.FileServer(http.Dir("test/")))
	http.HandleFunc(getObjectUrl, getObject)
	http.HandleFunc(getJsonFileUrl, getJson)
	http.ListenAndServe(":100", nil)
}

//Folder will be created if not existing
func createConfigFolderIfNotExisting() {
	_, err := os.Stat(itemFolderName)
	if os.IsNotExist(err) {
		errDir := os.MkdirAll(itemFolderName, 0755)
		if errDir != nil {
			log.Fatal(err)
		}
	}
}

//writes the request object in the response-stream
func getObject(w http.ResponseWriter, r *http.Request) {
	//Read the parameter of the request
	r.ParseForm()
	requestId := r.FormValue("id")
	incomingId, err := strconv.ParseUint(requestId, 10, 64)
	if err != nil {
		log.Println("Failed to parse uint: " + err.Error())
		w.WriteHeader(400)
		w.Write([]byte("Input is not an integer"))
	}
	log.Println("ID: " + requestId + " " + strconv.FormatInt(r.ContentLength, 10) + "ID:" + r.FormValue("id"))
	//Read & parse the .json file
	jsonData, err := ioutil.ReadFile(itemFolderName + jsonName)
	if err != nil {
		log.Fatal(err.Error())
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
	}
	var configEntries []Item
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		log.Fatal(err.Error())
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
	}
	//Search for matching object at index
	var foundPath *string
	for _, element := range configEntries {
		if element.ID == incomingId {
			foundPath = &element.FileUrl
			break
		}
	}
	if foundPath == nil { //TODO
		//log.Println("Object at index " + ... + " not found")
		w.WriteHeader(404)
		w.Write([]byte("Requested index not found"))
		return
	}
	data, err := ioutil.ReadFile(*foundPath)
	if err != nil {
		log.Fatal(err.Error())
	}
	w.Write(data)
	log.Println("Answered object request successfully")
}

func getJson(w http.ResponseWriter, r *http.Request) {

}
