package main

import (
	"encoding/json"
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
var configJsonPath = "configs.json"

type Config struct {
	Hash         uint64
	CreationDate string
	FileUrl      string
}

func ConfigInit(c *Config, data string) {
	//TODO save date in config
	c.Hash = CalcHash(data)
	c.FileUrl = configSavePath + strconv.FormatUint(c.Hash, 10) + configExtension
}

func main() {
	//Creates a log file
	f, err := os.OpenFile("log.txt", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)
	log.Print("config-service has started...")

	http.HandleFunc(saveUrlPattern, SaveConfig)
	http.HandleFunc(loadUrlPattern, LoadConfig)
	http.Handle("/", http.FileServer(http.Dir("./.test/"))) //For testing purposes
	http.ListenAndServe(":99", nil)
}

//Calculates a hash depending on the date and the data
func CalcHash(data string, time string) uint64 {
	//TODO find a fitting hash function
	return 0
}

//Creates a new .conf file and places an entry in configs.json
func SaveConfig(w http.ResponseWriter, r *http.Request) {
	//TODO send back creationDate
	//Load config-entry array from json
	log.Println("Started answering save-request...")
	jsonData, err := ioutil.ReadFile(configJsonPath)
	if err != nil {
		log.Println("No " + configJsonPath + " found: " + err.Error())
	}
	var configEntries []Config
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		log.Println("Unmarshaling failed: " + err.Error())
	}
	//Create and init config-entry
	var newConfig Config
	message, err := readRequestBody(r)
	if err != nil {
		log.Print("could not read the request-body: " + err.Error())
		w.WriteHeader(400)
		return
	}
	ConfigInit(&newConfig, message)
	//Add config-entry to config array
	configEntries = append(configEntries, newConfig)
	//write config-entry array to json
	newJson, err := json.MarshalIndent(configEntries, "", " ")
	if err != nil {
		log.Print("Failed marshaling the new Config-array: " + err.Error())
		w.WriteHeader(500)
		return
	}
	//save config to fileURL
	ioutil.WriteFile(configJsonPath, newJson, 0644)
	//create config file in configSavePath
	ioutil.WriteFile(newConfig.FileUrl, []byte(message), 0644)
	//send back the new hash
	strHash := strconv.FormatUint(newConfig.Hash, 10)
	log.Print("Converted Hash: " + strHash)
	w.Write([]byte(strHash))
	log.Println("Answered save-request successfully...")
}

func readRequestBody(r *http.Request) (string, err) {
	message, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Print()
		return "Null", err
	}
	return string(message), err
}

func LoadConfig(w http.ResponseWriter, r *http.Request) {
	log.Println("Started answering load-request...")
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
	jsonData, err := ioutil.ReadFile(configJsonPath)
	if err != nil {
		log.Println(err.Error())
		w.WriteHeader(500)
		w.Write([]byte("internal server error - see server logs" + r.URL.String()))
		return
	}

	var configEntries []Config
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		log.Println(err.Error())
		w.WriteHeader(500)
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
		w.WriteHeader(500)
		w.Write([]byte("internal server error - see server logs" + r.URL.String()))
		return
	}
	w.Write(data)
	log.Println("Answered load-request successfully...")
}

func getDownloadLink() {
	//TODO
}
