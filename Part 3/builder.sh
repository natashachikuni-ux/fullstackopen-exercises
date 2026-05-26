#!/bin/bash

# Stop the script immediately if any command fails
set -e

# Grab the variables passed in from the terminal
GITHUB_REPO=$1
DOCKER_REPO=$2

# Check if both arguments were provided
if [ -z "$GITHUB_REPO" ] || [ -z "$DOCKER_REPO" ]; then
  echo "⚠️ Usage: ./builder.sh <github-user/repository> <dockerhub-user/image-name>"
  exit 1
fi

echo "🚀 Cloning GitHub repository: https://github.com/$GITHUB_REPO.git..."
# Clean up any old workspace folders first
rm -rf workspace-dir

# 👇 ADD --depth 1 TO THIS LINE
git clone --depth 1 https://github.com/$GITHUB_REPO.git workspace-dir

# Move into the cloned code directory
cd workspace-dir

echo "🛠️ Building Docker image: $DOCKER_REPO..."
docker build -t $DOCKER_REPO .

echo "📤 Pushing image to Docker Hub..."
docker push $DOCKER_REPO

echo "✅ Pipeline complete! Image is live on Docker Hub."