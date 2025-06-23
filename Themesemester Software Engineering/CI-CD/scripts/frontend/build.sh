#!/bin/bash

cd ../../mission
set -a
source .env
set +a
cd ../frontend

docker buildx build --platform linux/arm64 -t tse/frontend .
