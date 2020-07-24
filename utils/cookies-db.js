'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;

module.exports = {
	saveCookies,
	getCookies
};

function saveCookies(tz, cookies) {
	return docClient
		.put({
			TableName: DYNAMODB_TABLE,
			Item: { tz, cookies }
		})
		.promise();
}

function getCookies(tz) {
	return docClient
		.get({
			TableName: DYNAMODB_TABLE,
			Key: { tz }
		})
		.promise()
		.then(({ Item }) => {
			if (!Item) return;
			const { cookies } = Item;
			return cookies;
		});
}
