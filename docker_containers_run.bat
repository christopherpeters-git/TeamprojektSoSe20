echo off
docker run --publish 99:99 --detach --name cs configservice
docker run --publish 100:100 --detach --name os objectservice
docker run --publish 80:101 --detach --name ss serverservice

docker ps

pause
