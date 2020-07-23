#!/bin/bash

STACK_NAME='answer-coronavirus-survey'
PACKAGE_BUCKET='answer-coronavirus-survey-packages'
GENERATED_TEMPLATE='gen-template.yml'

# Cleanup
trap "rm $GENERATED_TEMPLATE 2> /dev/null" EXIT

# Install dependencies
npm install

# Package (Uploads a package file to S3)
sam package \
	--s3-bucket "$PACKAGE_BUCKET" \
	--output-template-file "$GENERATED_TEMPLATE"

# Deploy
sam deploy \
	--template-file "$GENERATED_TEMPLATE" \
	--stack-name "$STACK_NAME" \
	--capabilities CAPABILITY_IAM