#!/bin/bash

LOG_FILE="deploy.log"
echo "[DEPLOY] Starting TEST deployment at $(date)" | tee -a $LOG_FILE

set -a
source .env
source .env.test
set +a

echo "[DEPLOY] Logging into Docker Registry..." | tee -a $LOG_FILE
docker login -u "$REGISTRY_USERNAME" -p "$REGISTRY_PASSWORD" $REGISTRY_DOMAIN 2>>$LOG_FILE

export COMPOSE_PROJECT_NAME="tse_test"

docker compose --env-file ./.env.test pull 2>>$LOG_FILE

echo "[DEPLOY] Stopping old containers..." | tee -a $LOG_FILE
docker compose --env-file ./.env.test down --remove-orphans 2>>$LOG_FILE

echo "[DEPLOY] Starting new containers..." | tee -a $LOG_FILE
docker compose --env-file ./.env.test up -d --force-recreate 2>>$LOG_FILE

echo "[DEPLOY] TEST Deployment finished successfully!" | tee -a $LOG_FILE
