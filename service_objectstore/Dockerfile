#Importing a prebuild environment with go installed
FROM golang
#Adding everything in the current directory to given path
ADD ./ObjectStore.go /go/src/object_service/
#Adding everything in the current directory to given path
RUN go install object_service/
#Adding the contents from src to dest
ADD ./items/ /go/bin/items/
ADD ./items.json /go/bin/
#Change the working directory (like cd)
WORKDIR /go/bin/
#Change permissions due to windows compilation
RUN chmod -R -v u+r items
RUN chmod -v u+r ./items.json
#Binary to start on container start
ENTRYPOINT /go/bin/object_service
#Port inside the container
EXPOSE 100