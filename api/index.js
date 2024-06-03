const Koa=require('koa')
const app = new Koa()
const router=require('./router')
const loger=require('../loger')
app.use(async (ctx,next)=>{
    ctx.set('Access-Control-Allow-Origin','*')
    ctx.set("Access-Control-Allow-Headers", "X-Requested-With")
    ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
    ctx.set("Content-Type", "text/plain;charset=utf-8")
    await next()
})
app.use(async (ctx,next)=>{
    try{
        await next()
    }catch (e) {
        loger.fatal(e)
    }
})
app.use(router.routes())

module.exports = app