#!/bin/sh
export HOME=/home/svkruik

# Git
cd ..
git config --global --add safe.directory "$HOME/Documents/GitHub/SK-Metrics"
git reset --hard
git pull
echo "Git setup complete"

# Hosting - metrics.stefankruik.com
cd frontend
npm install
npm run build
sudo systemctl restart sk-metrics.service
echo "Hosting deployment complete. Reloading server."
