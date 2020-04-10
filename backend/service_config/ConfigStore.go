package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	_ "time"
)

var saveUrlPattern = "/api/config/save/"
var loadUrlPattern = "/api/config/load/"
var configSavePath = "./configs/"
var configExtension = ".conf"

type Config struct {
	hash         uint64 `json:"hash"`
	creationDate string `json:"creationDate"`
	fileUrl      string `json:"fileUrl"`
}

func ConfigInit(c *Config) {
	c.hash = CalcHash(c)
	c.fileUrl = configSavePath + strconv.FormatUint(c.hash, 10) + configExtension
}

func main() {
	fmt.Printf("%s\n", "config-service has started...")
	http.HandleFunc(saveUrlPattern, SaveConfig)
	http.HandleFunc(loadUrlPattern, LoadConfig)
	http.Handle("/", http.FileServer(http.Dir("./.test/"))) //For testing purposes
	http.ListenAndServe(":99", nil)
}

func CalcHash(c *Config) uint64 {
	//TODO
	return 0
}

func SaveConfig(w http.ResponseWriter, r *http.Request) {
	//Load config-entry array from json
	jsonFile, err := os.Open("configs.json")
	if err != nil {
		log.Fatal(err.Error())
	}
	defer jsonFile.Close()

	byteArray, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		log.Fatal(err.Error())
	}

	var configEntrys []Config
	json.Unmarshal(byteArray, &configEntrys)
	//TODO
	//Create and init config-entry
	var newConfig Config
	ConfigInit(&newConfig)
	//Add config-entry to config array
	configEntrys = append(configEntrys, newConfig)
	//write config-entry array to json
	newJson, err := json.Marshal(configEntrys)
	if err != nil {
		log.Fatal(err.Error())
	}
	//save config to fileURL
	ioutil.WriteFile("configs.json", newJson, 0644)
	//create config file in configSavePath
	fmt.Print(readRequestBody(r))
	ioutil.WriteFile(newConfig.fileUrl, readRequestBody(r), 0644)

	response, err := json.Marshal(newConfig)
	if err != nil {
		log.Fatal(err.Error())
	}
	fmt.Fprint(w, string(response))
}

func readRequestBody(r *http.Request) []byte {
	bodyInBytes, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err.Error())
	}
	return bodyInBytes
}

func LoadConfig(w http.ResponseWriter, r *http.Request) {
	//TODO
}

func getDownloadLink() {
	//TODO
}

func saveLogs() {
	//TODO
}
