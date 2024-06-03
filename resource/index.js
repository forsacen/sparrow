const Koa=require('koa')
const app = new Koa()
const router=require('./router')
const loger=require('../loger')
app.use(async (ctx,next)=>{
    try{
        await next()
    }catch (e) {
        loger.fatal(e)
    }
})

app.use(router.routes())

module.exports = app