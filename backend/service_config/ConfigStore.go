package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strconv"
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

func ConfigInit(c *Config) {
	c.Hash = CalcHash(c)
	c.FileUrl = configSavePath + strconv.FormatUint(c.Hash, 10) + configExtension
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
	ConfigInit(&newConfig)
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
	message := readRequestBody(r)
	ioutil.WriteFile(newConfig.FileUrl, []byte(message), 0644)
	fmt.Fprint(w, message)
}

func readRequestBody(r *http.Request) string {
	message, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatal(err.Error())
	}
	log.Print(r.ContentLength)
	log.Print(r.Method)
	log.Print(r.RequestURI)
	log.Print(string(message))
	return string(message)
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
