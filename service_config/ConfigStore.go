package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"
)

var saveUrlPattern = "/api/config/save"
var loadUrlPattern = "/api/config/load"
var configSavePath = "./configs/"
var configExtension = ".conf"
var configJsonPath = "configs.json"
var logFileName = "ConfigStore.log"
var passwordLength = 10

type Config struct {
	ID           uint64
	Password     string
	CreationDate string
	FileUrl      string
}

func main() {
	//Create config-dir if not exisiting
	createConfigFolderIfNotExisting()
	//Creates a log file
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	f, err := os.OpenFile("./" + logFileName, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)
	log.Print("config-service has started...")

	http.HandleFunc(saveUrlPattern, SaveConfig)
	http.HandleFunc(loadUrlPattern, LoadConfig)
	http.Handle("/", http.FileServer(http.Dir("test/")))
	http.ListenAndServe(":99", nil)
}


func createConfigFolderIfNotExisting() {
	_, err := os.Stat("configs")
	if os.IsNotExist(err) {
		errDir := os.MkdirAll("configs", 0755)
		if errDir != nil {
			log.Fatal(err)
		}
	}
}

//Creates a new .conf file and places an entry in configs.json
func SaveConfig(w http.ResponseWriter, r *http.Request) {
	//Load config-entry array from json
	log.Println("Started answering save-request...")
	log.Println("Msg: " + strconv.FormatInt(r.ContentLength, 10))
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
		log.Println("could not read the request-body: " + err.Error())
		w.WriteHeader(400)
		return
	}
	ConfigInit(&newConfig, uint64(len(configEntries)))
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
	//send back the new pwd
	w.Write([]byte("ID: " + strconv.FormatUint(newConfig.ID, 10) + " Password: " + newConfig.Password))
	log.Println("Answered save-request successfully...")
}

//Returns the right file depending on the entries in config.json
func LoadConfig(w http.ResponseWriter, r *http.Request) {
	log.Println("Started answering load-request...")
	//
	r.ParseForm()
	log.Println("ID: " + r.FormValue("id"))
	log.Println("Password: " + r.FormValue("pwd"))
	incomingId, err := strconv.ParseUint(r.FormValue("id"), 10, 64)
	incomingPwd := r.FormValue("pwd")
	if err != nil {
		w.WriteHeader(500)
		log.Print("Input is not a number: + " + err.Error())
		w.Write([]byte("Input invalid"))
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
	//Search for config
	var foundPath *string
	for _, element := range configEntries {
		if element.ID == incomingId {
			if strings.Compare(element.Password, incomingPwd) == 0 {
				foundPath = &element.FileUrl
				break
			}
		}
	}
	if foundPath == nil {
		idStr := strconv.FormatUint(incomingId, 10)
		w.WriteHeader(404)
		log.Println("No Element with id and pwd for " + idStr + " found")
		w.Write([]byte("No saved config found or wrong password for ID: " + idStr))
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
	log.Println(string(data))
	log.Println("Answered load-request successfully...")
}

func sendDownloadLinkOfConfig() {
	//TODO
}

func readRequestBody(r *http.Request) (string, error) {
	message, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println("Request could not be read: " + err.Error())
		return "Null", err
	}
	return string(message), err
}

//Initalizes the config
func ConfigInit(c *Config, id uint64) {
	//TODO save date in config
	var time time.Time = time.Now()
	c.CreationDate = time.String()
	c.ID = id
	c.FileUrl = configSavePath + strconv.FormatUint(c.ID, 10) + configExtension
	c.Password = generatePassword(passwordLength)
}

//Generates a random integer from min to max
func randomInt(min, max int) int {
	return min + rand.Intn(max-min)
}

//Generates a random password with length len
func generatePassword(len int) string {
	rand.Seed(time.Now().Unix())
	bytes := make([]byte, len)
	for i := 0; i < len; i++ {
		bytes[i] = byte(randomInt(65, 122))
	}
	return string(bytes)
}

/*
Not used yet
//Calculates a hash depending on the date and the data
func CalcHash(data string, time time.Time) {

}

func extractTimeToString(time time.Time) string{
	stringArr := strings.Split(time.String()," ")
	extractedTime := strings.ReplaceAll(stringArr[0] + stringArr[1],"-","")
	extractedTime = strings.ReplaceAll(extractedTime,":","")
	extractedTime = strings.ReplaceAll(extractedTime,".","")
	log.Print("Extracted time-string: " + extractedTime)
	return extractedTime
}

*/
