mkdir logs
docker cp ss:/go/bin/Server.log ./logs/
docker cp os:/go/bin/ObjectStore.log ./logs/
docker cp cs:/go/bin/ConfigStore.log ./logs/
pause