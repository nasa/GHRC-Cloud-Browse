docker build . -t browseui &&
CID=$(docker create browseui) &&
docker cp "${CID}":app/build ./dist &&
docker rm "${CID}" &&
aws s3 mv s3://ghrc-web-services/browseui s3://ghrc-web-services-backup/browseui --recursive &&
aws s3 sync ./dist s3://ghrc-web-services/browseui