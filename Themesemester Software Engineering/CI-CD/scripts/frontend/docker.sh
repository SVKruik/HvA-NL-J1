#!/bin/bash

cd ../../mission
set -a
source .env
set +a
cd ../frontend

docker login -u kruiksv -p $GITLAB_PAT gitlab.fdmci.hva.nl:5050
docker pull gitlab.fdmci.hva.nl:5050/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/frontend:latest
docker tag gitlab.fdmci.hva.nl:5050/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/frontend:latest tse/frontend
docker rmi gitlab.fdmci.hva.nl:5050/se-specialization-2024-2/tse2/stefan-kruik/ci-cd/frontend:latest
docker run -d -p 9100:9100 tse/frontend:latest
