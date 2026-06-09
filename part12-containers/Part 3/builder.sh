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
rm -rf workspace-dir
git clone --depth 1 https://github.com/$GITHUB_REPO.git workspace-dir
cd workspace-dir

echo "🛠️ Building Docker image: $DOCKER_REPO..."
docker build -t $DOCKER_REPO .

echo "🔐 Authenticating with Docker Hub..."
echo "$DOCKER_PWD" | docker login -u "$DOCKER_USER" --password-stdin

echo "📤 Pushing image to Docker Hub..."
docker push $DOCKER_REPO

echo "✅ Pipeline complete! Image is live on Docker Hub."