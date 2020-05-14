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
const proxyLoadConfigUrl = "/proxy/loadConfig"
const proxySaveConfigUrl = "/proxy/saveConfig"

//Service adresses
const getObjectUrl = "http://172.17.0.3:100/api/getObjectByIndex"
const getJsonUrl = "http://172.17.0.3:100/api/getJson"
const loadConfigUrl = "http://172.17.0.2:99/api/config/load"
const saveConfigUrl = "http://172.17.0.2:99/api/config/save"

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
	http.HandleFunc(proxyLoadConfigUrl, handleLoadConfig)
	http.HandleFunc(proxySaveConfigUrl, handleSaveConfig)
	http.ListenAndServe(":101", nil)
}

func handleSaveConfig(w http.ResponseWriter, r *http.Request) {
	log.Println("Started redirecting save-config request...")
	body, _ := ioutil.ReadAll(r.Body)
	log.Println("body: " + string(body))
	http.Redirect(w, r, saveConfigUrl, 302)

	log.Println("Finished redirecting save-config request...")
}

func handleLoadConfig(w http.ResponseWriter, r *http.Request) {
	log.Println("Started redirecting load-config request...")

	//http.Redirect(w,r,loadConfigUrl,302)
	resp, err := http.Post(loadConfigUrl, "application/x-www-form-urlencoded", r.Body)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Println(err.Error())
		return
	}

	defer resp.Body.Close()
	//Reading and returning the content of the response
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("Internal server error"))
		log.Println(err.Error())
		return
	}
	log.Println("Data: " + string(body))
	w.Write(body)
	log.Println("Finished redirecting load-config request...")
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
		w.Write([]byte("Internal server error"))
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
	w.Write(body)
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
