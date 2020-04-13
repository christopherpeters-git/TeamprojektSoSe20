package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	_ "time"
)

var saveUrlPattern = "/api/config/save"
var loadUrlPattern = "/api/config/load/"
var configSavePath = "./configs/"
var configExtension = ".conf"

type Config struct {
	Hash         uint64
	CreationDate string
	FileUrl      string
}

func ConfigInit(c *Config, data string) {
	c.Hash = CalcHash(data)
	c.FileUrl = configSavePath + strconv.FormatUint(c.Hash, 10) + configExtension
}

func main() {
	fmt.Printf("%s\n", "config-service has started...")
	//Creates a log file
	f, err := os.OpenFile("log.txt", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)

	http.HandleFunc(saveUrlPattern, SaveConfig)
	http.HandleFunc(loadUrlPattern, LoadConfig)
	http.Handle("/", http.FileServer(http.Dir("./.test/"))) //For testing purposes
	http.ListenAndServe(":99", nil)
}

func CalcHash(data string) uint64 {
	//TODO find a fitting hash function
	return 0
}

func SaveConfig(w http.ResponseWriter, r *http.Request) {
	//TODO improver error handling
	//TODO send back creationDate
	//Load config-entry array from json
	jsonData, err := ioutil.ReadFile("configs.json")
	if err != nil {
		log.Fatal(err.Error())
	}
	var configEntries []Config
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		log.Fatal(err.Error())
	}
	//Create and init config-entry
	var newConfig Config
	message := readRequestBody(r)
	ConfigInit(&newConfig, message)
	//Add config-entry to config array
	configEntries = append(configEntries, newConfig)
	//write config-entry array to json
	newJson, err := json.MarshalIndent(configEntries, "", " ")
	if err != nil {
		log.Fatal(err.Error())
	}
	//save config to fileURL
	ioutil.WriteFile("configs.json", newJson, 0644)
	//create config file in configSavePath
	ioutil.WriteFile(newConfig.FileUrl, []byte(message), 0644)
	//send back the new hash
	strHash := strconv.FormatUint(newConfig.Hash, 10)
	log.Print("Converted Hash: " + strHash)
	w.Write([]byte(strHash))
}

func readRequestBody(r *http.Request) string {
	message, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err.Error())
	}
	return string(message)
}

func LoadConfig(w http.ResponseWriter, r *http.Request) {
	//Extract hash from request-url
	urlString := r.URL.String()
	stringParts := strings.Split(urlString, "/")
	if len(urlString) <= 0 || len(stringParts) <= 1 {
		log.Println(r.URL.String())
		w.WriteHeader(404)
		w.Write([]byte("Invalid Url: " + r.URL.String()))
		return
	}

	hash, err := strconv.ParseUint(stringParts[len(stringParts)-1], 10, 64)
	if err != nil {
		log.Println(err.Error())
		w.WriteHeader(404)
		w.Write([]byte("Invalid Hash: " + r.URL.String()))
		return
	}

	//Load configs.json
	jsonData, err := ioutil.ReadFile("configs.json")
	if err != nil {
		log.Println(err.Error())
		w.Write([]byte("internal server error - see server logs" + r.URL.String()))
		return
	}

	var configEntries []Config
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		log.Println(err.Error())
		w.Write([]byte("internal server error - see server logs" + r.URL.String()))
		return
	}
	//Search for config with hash
	var foundPath *string
	for _, element := range configEntries {
		if element.Hash == hash {
			foundPath = &element.FileUrl
			break
		}
	}
	if foundPath == nil {
		hashStr := strconv.FormatUint(hash, 10)
		w.WriteHeader(404)
		log.Println("No Element with hash " + hashStr + " found")
		w.Write([]byte("No saved config found for hash " + hashStr))
		return
	}
	log.Println("URL found: " + *foundPath)

	//Read and return data from found path
	data, err := ioutil.ReadFile(*foundPath)
	if err != nil {
		log.Println("URL in json but not found: " + err.Error())
		w.Write([]byte("internal server error - see server logs" + r.URL.String()))
		return
	}
	w.Write(data)
}

func getDownloadLink() {
	//TODO
}

func saveLogs() {
	//TODO
}
