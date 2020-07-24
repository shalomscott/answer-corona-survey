'use strict';

const Koa = require('koa');
const serve = require('koa-static');
const views = require('koa-views');
const router = new (require('@koa/router'))();
const app = new Koa();

const { getSurvey, getCaptcha, submitSurvey } = require('./utils/requests.js');
const dowload = require('./utils/download-file.js');
const base64 = require('./utils/base64-encode.js');
const { saveCookies, getCookies } = require('./utils/cookies-db.js');

router.get('/done', () => {
	return ctx.render('done.njk');
});

router.get('/:tz', async (ctx) => {
	const { tz } = ctx.params;
	const captchaPath = `/tmp/captcha-${tz}.jpeg`;

	const cookies = (await getSurvey()).headers.raw()['set-cookie'].join(';');
	console.log('Retrieved some cookies:\n' + cookies);

	await getCaptcha(cookies).then(dowload(captchaPath));
	console.log('Finished downloading captcha.jpeg');

	const [imageData] = await Promise.all([
		base64(captchaPath),
		saveCookies(tz, cookies)
	]);
	console.log('Converted captcha file to base64 and saved cookies');

	return ctx.render('solver.njk', { tz, imageData });
});

router.post('/:tz/solution', async (ctx) => {
	const { tz } = ctx.params;
	const solution = ctx.request.body;
	console.log(`got solution ${solution} for ${tz}`);
});

// .then(() => getCaptcha(cookie))
// .then(dowloadFile(CAPTCHA_PATH))
// .then(log('downloaded captcha.jpeg'))
// .then(crackCaptcha(CAPTCHA_PATH))
// .then(log('captcha solution is: %s'))
// .then((solution) => submitSurvey(cookie, solution, process.env.TZ))
// .then((res) => res.text())
// .then(log('got final response: %s'))
// .catch(console.error);

app
	.use(serve('public'))
	.use(views('templates', { map: { njk: 'nunjucks' } }))
	.use(router.routes())
	.use(router.allowedMethods());

module.exports = app;
