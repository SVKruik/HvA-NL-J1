#!/bin/bash

cd ../../mission
set -a
source .env
set +a
cd ../backend

mvn clean org.jacoco:jacoco-maven-plugin:0.8.8:prepare-agent verify org.jacoco:jacoco-maven-plugin:0.8.8:report
