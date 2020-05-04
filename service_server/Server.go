package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"
)

//Proxy adresses
const proxyGetObjectUrl = "/proxy/getObject/"
const proxyGetJsonUrl = "/proxy/getJson"

//Service adresses
const getObjectUrl = "http://127.0.0.1:100/api/getObjectByIndex"
const getJsonUrl = "http://127.0.0.1:100/api/getJson"

func main() {
	//Creates a log file
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	f, err := os.OpenFile("Server.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)
	log.Print("Server-service has started...")

	http.Handle("/", http.FileServer(http.Dir("roomplaner/")))
	http.HandleFunc(proxyGetJsonUrl, handleJsonRequest)
	http.HandleFunc(proxyGetObjectUrl, handleGetObjectById)
	http.ListenAndServe(":12345", nil)
}

func handleGetObjectById(w http.ResponseWriter, r *http.Request) {
	log.Println("Started redirecting object request...")
	//Extracting the request id
	parts := strings.Split(r.URL.String(), "/")
	id := parts[len(parts)-1]
	if id == "" {
		w.WriteHeader(400)
		w.Write([]byte(r.URL.String()))
		log.Println("Wrong url: " + r.URL.String())
		return
	}
	log.Println("Requested id: " + id)

	//Creating the request to the service
	client := http.Client{}
	req, err := http.NewRequest("GET", getObjectUrl, nil)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Println(err.Error())
		return
	}
	q := req.URL.Query()
	q.Add("index", id)
	req.URL.RawQuery = q.Encode()

	resp, err := client.Do(req)
	if err != nil {
		w.WriteHeader(500)
		log.Println(err.Error())
		return
	}
	defer resp.Body.Close()

	//Reading and returning the content of the response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		w.WriteHeader(500)
		log.Println(err.Error())
		return
	}
	w.Write([]byte(string(body)))
	log.Println("Finished redirecting object request...")
}

func handleJsonRequest(w http.ResponseWriter, r *http.Request) {
	log.Println("Started redirecting json request...")
	resp, err := http.Get(getJsonUrl)
	if err != nil {
		w.WriteHeader(500)
		log.Println(err.Error())
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		w.WriteHeader(500)
		log.Println(err.Error())
		return
	}
	w.Write(body)
	log.Println("Finished redirecting json request")
}
