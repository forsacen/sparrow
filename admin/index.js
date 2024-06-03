const cfg=require('../config')
const Koa=require('koa')
const app = new Koa()
const router=require('./router')
app.use(router.routes())
module.exports = app