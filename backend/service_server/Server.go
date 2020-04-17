package main

import (
	"log"
	"net/http"
	"os"
)

func main() {
	//Creates a log file
	f, err := os.OpenFile("log.txt", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		log.Fatalf("error opening file: %v", err)
	}
	defer f.Close()
	log.SetOutput(f)
	log.Print("Server-service has started...")

	http.Handle("/", http.FileServer(http.Dir("test/")))
	http.ListenAndServe(":100", nil)
}
