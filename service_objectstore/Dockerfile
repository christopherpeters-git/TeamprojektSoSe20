#Importing a prebuild environment with go installed
FROM golang
#Adding everything in the current directory to given path
ADD ./Server.go /go/src/server_service/
#Adding everything in the current directory to given path
RUN go install server_service/
#Adding the contents from src to dest
ADD ./roomplaner/ /go/bin/roomplaner/
#Change the working directory (like cd)
WORKDIR /go/bin/
#Change permissions due to windows compilation
RUN chmod -R -v u+rwx roomplaner
#Binary to start on container start
ENTRYPOINT /go/bin/server_service
#Port inside the container
EXPOSE 101