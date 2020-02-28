#! /bin/sh

docker build . -f docker/deploy-functions.dockerfile -t firestore-functions-deploy
docker run --env-file .env firestore-functions-deploy