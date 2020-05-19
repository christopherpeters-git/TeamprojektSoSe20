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

func reportError (w http.ResponseWriter, statusCode int, responseMessage string, logMessage string){
	http.Error(w,responseMessage,statusCode)
	log.Println(logMessage)
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

//Creates a new Config folder if it doesnt exist
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
		reportError(w,400,"Couldnt read the request-body","could not read the request-body: " + err.Error())
		return
	}
	ConfigInit(&newConfig, uint64(len(configEntries)))
	//Add config-entry to config array
	configEntries = append(configEntries, newConfig)
	//write config-entry array to json
	newJson, err := json.MarshalIndent(configEntries, "", " ")
	if err != nil {
		reportError(w,500,"Internal server error","Failed marshaling the new Config-array: " + err.Error())
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
		reportError(w,500,"Input invalid","Input is not a number: + " + err.Error())
		return
	}

	//Load configs.json
	jsonData, err := ioutil.ReadFile(configJsonPath)
	if err != nil {
		reportError(w,500,"internal server error - see server logs" + r.URL.String(),err.Error())
		return
	}

	var configEntries []Config
	err = json.Unmarshal(jsonData, &configEntries)
	if err != nil {
		reportError(w,500,"internal server error - see server logs" + r.URL.String(),err.Error())
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
		reportError(w,404,"No saved config found or wrong password for ID: " + idStr,"No Element with id and pwd for " + idStr + " found")
		return
	}
	log.Println("URL found: " + *foundPath)
	//Read and return data from found path
	data, err := ioutil.ReadFile(*foundPath)
	if err != nil {
		reportError(w,500,"internal server error - see server logs" + r.URL.String(),"URL in json but not found: " + err.Error())
		return
	}
	w.Write(data)
	log.Println(string(data))
	log.Println("Answered load-request successfully...")
}

//Reads the body of a given request
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

