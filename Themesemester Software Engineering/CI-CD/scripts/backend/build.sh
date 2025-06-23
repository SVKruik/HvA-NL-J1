#!/bin/bash

cd ../../mission
set -a
source .env
set +a
cd ../backend

mvn clean package
docker buildx build --platform linux/arm64 -t tse/backend .
