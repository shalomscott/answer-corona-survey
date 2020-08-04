'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const router = new (require('@koa/router'))();
const app = new Koa();

const { getSurvey, getCaptcha, submitSurvey } = require('./utils/requests.js');
const download = require('./utils/download-file.js');
const base64 = require('./utils/base64-encode.js');
const { saveCookies, getCookies } = require('./utils/cookies-db.js');

router.get('/:tz', async (ctx) => {
	const { tz } = ctx.params;
	const captchaPath = `/tmp/captcha-${tz}.jpeg`;

	const cookies = (await getSurvey()).headers.raw()['set-cookie'].join(';');
	console.log('Retrieved some cookies:\n' + cookies);

	await getCaptcha(cookies).then(download(captchaPath));
	console.log('Finished downloading captcha.jpeg');

	const [imageData] = await Promise.all([
		base64(captchaPath),
		saveCookies(tz, cookies)
	]);
	console.log('Converted captcha file to base64 and saved cookies');

	return ctx.render('solver.njk', { tz, imageData });
});

router.get('/:tz/done', async (ctx) => {
	const { tz } = ctx.params;
	const { solution } = ctx.query;
	console.log(`Got captcha solution ${solution} for ${tz}`);

	const cookies = await getCookies(tz);
	console.log(`Retrieved cookies for ${tz}`);

	const response = await submitSurvey(cookies, solution, tz).then((res) =>
		res.text()
	);
	console.log('Got final response: ' + response);

	return ctx.render('done.njk');
});

app
	.use(serve('public'))
	.use(views('templates', { map: { njk: 'nunjucks' } }))
	.use(router.routes())
	.use(router.allowedMethods());

module.exports = app;
