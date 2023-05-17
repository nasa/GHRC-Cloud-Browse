#!/bin/bash
export AWS_REGION=$bamboo_AWS_REGION
export AWS_ACCESS_KEY_ID=$bamboo_AWS_SVC_PROD_SECRET_ACCESS_KEY
export AWS_SECRET_ACCESS_KEY=$bamboo_AWS_REGION


docker build . -t browseui &&
CID=$(docker create browseui) &&
docker cp "${CID}":app/build ./dist &&
docker rm "${CID}" &&
aws s3 mv s3://ghrc-web-services/browseui s3://ghrc-web-services-backup/browseui --recursive &&
aws s3 sync ./dist s3://ghrc-web-services/browseui