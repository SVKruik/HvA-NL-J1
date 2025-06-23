#!/bin/bash

LOG_FILE="deploy.log"
echo "[DEPLOY] Starting DEV deployment at $(date)" | tee -a $LOG_FILE

set -a
source .env
source .env.dev
set +a

echo "[DEPLOY] Logging into Docker Registry..." | tee -a $LOG_FILE
docker login -u "$REGISTRY_USERNAME" -p "$REGISTRY_PASSWORD" $REGISTRY_DOMAIN 2>>$LOG_FILE

export COMPOSE_PROJECT_NAME="tse_dev"

docker compose --env-file ./.env.dev pull 2>>$LOG_FILE

echo "[DEPLOY] Stopping old containers..." | tee -a $LOG_FILE
docker compose --env-file ./.env.dev down --remove-orphans 2>>$LOG_FILE

echo "[DEPLOY] Starting new containers..." | tee -a $LOG_FILE
docker compose --env-file ./.env.dev up -d --force-recreate 2>>$LOG_FILE

echo "[DEPLOY] DEV Deployment finished successfully!" | tee -a $LOG_FILE
