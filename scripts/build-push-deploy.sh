#!/bin/bash

# Exit on error
set -euo pipefail

# Colors for output (available for trap messages)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Trap errors and print a message
trap 'echo -e "${RED}Error on line ${LINENO}: ${BASH_COMMAND} (exit code: $?)${NC}"' ERR

# Load environment variables from .env and export them
if [ -f .env ]; then
    set -o allexport
    # shellcheck disable=SC1090
    source .env
    set +o allexport
fi

# Configuration
PROJECT_GITHUB_NAME="${PROJECT_GITHUB_NAME:-36pool}"
TAG="${TAG:-$(git rev-parse --short HEAD)}"

# Validate required image variables
if [ -z "${DOCKER_IMAGE_BACKEND:-}" ] || [ -z "${DOCKER_IMAGE_FRONTEND:-}" ]; then
    echo -e "${RED}Missing DOCKER_IMAGE_BACKEND or DOCKER_IMAGE_FRONTEND in environment.${NC}"
    echo "Set them to the desired image names (prefer fully-qualified, e.g. myuser/my-backend)."
    exit 1
fi

echo -e "${GREEN}Building and pushing Docker images${NC}"
echo "Backend image base: ${DOCKER_IMAGE_BACKEND}"
echo "Frontend image base: ${DOCKER_IMAGE_FRONTEND}"
echo "Tag: ${TAG}"
echo ""

# Build and push backend
echo -e "${YELLOW}Building backend image...${NC}"
docker build -t "${DOCKER_IMAGE_BACKEND}:${TAG}" -f ./backend/Dockerfile ./backend

echo -e "${YELLOW}Tagging backend as latest...${NC}"
docker tag "${DOCKER_IMAGE_BACKEND}:${TAG}" "${DOCKER_IMAGE_BACKEND}:latest"

echo -e "${YELLOW}Pushing backend images...${NC}"
docker push "${DOCKER_IMAGE_BACKEND}:${TAG}"
docker push "${DOCKER_IMAGE_BACKEND}:latest"
echo -e "${GREEN}✓ Backend images pushed: ${DOCKER_IMAGE_BACKEND}:${TAG} and :latest${NC}"
echo ""

# Build and push frontend
echo -e "${YELLOW}Building frontend image...${NC}"
docker build -t "${DOCKER_IMAGE_FRONTEND}:${TAG}" -f ./frontend/Dockerfile ./frontend

echo -e "${YELLOW}Tagging frontend as latest...${NC}"
docker tag "${DOCKER_IMAGE_FRONTEND}:${TAG}" "${DOCKER_IMAGE_FRONTEND}:latest"

echo -e "${YELLOW}Pushing frontend images...${NC}"
docker push "${DOCKER_IMAGE_FRONTEND}:${TAG}"
docker push "${DOCKER_IMAGE_FRONTEND}:latest"
echo -e "${GREEN}✓ Frontend images pushed: ${DOCKER_IMAGE_FRONTEND}:${TAG} and :latest${NC}"
echo ""

echo -e "${GREEN}=== Build and push completed successfully ===${NC}"
echo "Backend: ${DOCKER_IMAGE_BACKEND}:${TAG} (also tagged as :latest)"
echo "Frontend: ${DOCKER_IMAGE_FRONTEND}:${TAG} (also tagged as :latest)"
echo ""

# Deploy step
echo -e "${GREEN}Starting deployment to remote server...${NC}"

DEPLOY_TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo -e "${YELLOW}Deployment timestamp: ${DEPLOY_TIMESTAMP}${NC}"

# Determine whether to deploy
if [ -z "${DEPLOY_HOST:-}" ] || [ -z "${DEPLOY_USER:-}" ] || [ -z "${DEPLOY_PATH:-}" ]; then
    echo -e "${YELLOW}Deployment vars not fully set (DEPLOY_HOST/DEPLOY_USER/DEPLOY_PATH). Skipping deploy.${NC}"
    exit 0
fi

# Only require sshpass if deploying
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}sshpass not found. Please install it to enable password-based SSH automation.${NC}"
    exit 1
fi

sshpass -p "${DEPLOY_PASS}" ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} << EOF
    cd ${DEPLOY_PATH}
    docker-compose down
    docker-compose pull
    docker-compose up -d
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment completed successfully on ${DEPLOY_HOST}${NC}"
    echo -e "${GREEN}Deployment timestamp: ${DEPLOY_TIMESTAMP}${NC}"

    echo -e "${YELLOW}Waiting 30 seconds for services to start...${NC}"
    sleep 30

    echo -e "${GREEN}Opening browser at http://${DEPLOY_HOST}${NC}"
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://${DEPLOY_HOST}"
    elif command -v open &> /dev/null; then
        open "http://${DEPLOY_HOST}"
    else
        echo -e "${YELLOW}Could not detect browser opener. Please manually open: http://${DEPLOY_HOST}${NC}"
    fi
else
    echo -e "${RED}Deployment failed on ${DEPLOY_HOST}${NC}"
    exit 1
fi
