#!/bin/sh

npm run build
docker build -t rabbit_site_dev .
