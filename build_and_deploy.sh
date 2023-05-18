#!/bin/bash

set -e  # Abort script if any command fails

export AWS_REGION="$bamboo_AWS_REGION"
export AWS_ACCESS_KEY_ID="$bamboo_AWS_SVC_PROD_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$bamboo_AWS_SVC_PROD_SECRET_ACCESS_KEY"

# Check if AWS credentials are valid
aws sts get-caller-identity >/dev/null

# Build the Docker image
docker build . -t browseui

# Create a unique container ID
CID=$(docker create browseui)

# Copy the build artifacts from the Docker container to the local "dist" directory
docker cp "${CID}":app/build ./dist

# Clean up the Docker container
docker rm "${CID}"

# Validate AWS S3 connectivity
aws s3 ls >/dev/null

# Move the contents of the "browseui" directory in the S3 bucket to a backup directory
aws s3 mv s3://ghrc-web-services/browseui s3://ghrc-web-services-backup/browseui --recursive

# Sync the local "dist" directory to the "browseui" directory in the S3 bucket
aws s3 sync ./dist s3://ghrc-web-services/browseui

# Cleanup the "dist" directory
rm -rf ./dist

echo "Deployment completed successfully."
