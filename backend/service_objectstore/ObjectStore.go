package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
)

var getObjectUrl = "/api/getObject"

type Item struct {
	ID      uint64
	FileUrl string
}

func main() {
	//Creates a log file
	f, err := os.OpenFile("log.txt", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)
	log.Print("object-service has started...")

	http.Handle("/", http.FileServer(http.Dir("test/")))
	http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hi")
	})
	http.HandleFunc(getObjectUrl, getObject)
	http.ListenAndServe(":100", nil)
}
func getObject(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	test := r.FormValue("id")
	incomingId, _ := strconv.ParseUint(test, 10, 64)
	log.Println("ID: " + test + " " + strconv.FormatInt(r.ContentLength, 10) + "ID:" + r.FormValue("id"))
	jsonData, err := ioutil.ReadFile("./main/items.json")
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

}
