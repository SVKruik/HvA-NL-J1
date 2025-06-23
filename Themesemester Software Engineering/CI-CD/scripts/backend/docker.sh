#!/bin/bash

cd ../../mission
set -a
source .env
set +a
cd ../backend

docker login -u kruiksv -p $GITLAB_PAT gitlab.fdmci.hva.nl:5050
docker pull gitlab.fdmci.hva.nl:5050/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/backend:latest
docker tag gitlab.fdmci.hva.nl:5050/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/backend:latest tse/backend
docker rmi gitlab.fdmci.hva.nl:5050/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/backend:latest
docker run -d -p 9099:9099 tse/backend:latest
