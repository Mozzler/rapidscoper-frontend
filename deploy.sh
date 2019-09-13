npm run build
aws s3 sync public s3://staging.rapidscoper.com --profile=rapidscoper --delete