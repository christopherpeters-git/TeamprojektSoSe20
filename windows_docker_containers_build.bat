echo off
CD service_config/
docker build --no-cache --tag configservice .
CD ..

CD service_objectstore/
docker build --no-cache --tag objectservice .
CD ..

CD service_server/
docker build --no-cache --tag serverservice .
CD ..

echo REMEMBER TO SET ONLINE-MODE IN Communication.js TO true

pause