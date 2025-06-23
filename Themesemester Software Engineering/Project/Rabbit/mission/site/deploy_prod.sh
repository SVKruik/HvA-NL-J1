#!/bin/bash

LOG_FILE="deploy.log"
echo "[DEPLOY] Starting PROD deployment at $(date)" | tee -a $LOG_FILE

set -a
source .env
source .env.prod
set +a

echo "[DEPLOY] Logging into Docker Registry..." | tee -a $LOG_FILE
docker login -u "$REGISTRY_USERNAME" -p "$REGISTRY_PASSWORD" $REGISTRY_DOMAIN 2>>$LOG_FILE

export COMPOSE_PROJECT_NAME="rabbit_prod"

docker compose --env-file ./.env.prod pull 2>>$LOG_FILE

echo "[DEPLOY] Stopping old containers..." | tee -a $LOG_FILE
docker compose --env-file ./.env.prod down --remove-orphans 2>>$LOG_FILE

echo "[DEPLOY] Starting new containers..." | tee -a $LOG_FILE
docker compose --env-file ./.env.prod up -d --force-recreate 2>>$LOG_FILE

echo "[DEPLOY] Waiting for site bootup..." | tee -a $LOG_FILE

sleep 10
echo "[DEPLOY] Updating search index..." | tee -a $LOG_FILE
curl -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $DEPLOYMENT_PASSWORD" \
    -d '{"type":"search","repository":"Rabbit", "payload": { "env": "prod" } }' \
    $DEPLOYMENT_ENDPOINT 2>>$LOG_FILE

echo "[DEPLOY] PROD Deployment finished successfully!" | tee -a $LOG_FILE
