'use strict';

const dowloadFile = require('./utils/download-file.js');
const crackCaptcha = require('./utils/crack-captcha.js');
const { getSurvey, getCaptcha, submitSurvey } = require('./utils/requests.js');
const log = require('./utils/promise-log.js');

let cookie = '';

getSurvey()
	.then((res) => res.headers.raw()['set-cookie'])
	.then((cookies) => (cookie = cookies.join(';')))
	.then(log('retrieved some cookies:\n%s'))
	.then(() => getCaptcha(cookie))
	.then(dowloadFile('captcha.jpeg'))
	.then(log('downloaded captcha.jpeg'))
	.then(crackCaptcha)
	.then(log('captcha solution is: %s'))
	.then((solution) => submitSurvey(cookie, solution, process.env.TZ))
	.then((res) => res.text())
	.then(log('got final response: %s'))
	.catch(console.error);
