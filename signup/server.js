'use strict';

const Koa = require('koa');
const router = new (require('@koa/router'))();
const serve = require('koa-static');
const app = new Koa();

app.use(serve('public')).use(router.routes());

module.exports = app;
