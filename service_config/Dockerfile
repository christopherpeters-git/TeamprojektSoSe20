#Importing a prebuild environment with go installed
FROM golang
#Adding everything in the current directory to given path
ADD . /go/src/config_service/
#Adding everything in the current directory to given path
RUN go install config_service/
#Adding the contents from src to dest
ADD ./test/ /go/bin/test/
#Change the working directory (like cd)
WORKDIR /go/bin/
#Change permissions due to windows compilation
RUN chmod -R -v u+rx test
#Binary to start on container start
ENTRYPOINT /go/bin/config_service
#Port inside the container
EXPOSE 99