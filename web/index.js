const cfg=require('../config')
const Koa=require('koa')
const app = new Koa()
const router=require('./router')
const cache = require('koa-static-cache')
const axios=require('axios')
const loger=require('../loger')

const serverRender=async (ctx, next)=>{
    let href=ctx.request.href
    const userAgent = ctx.request.header['user-agent'];
    //if(userAgent==='百度agent'){
    if(userAgent==="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"){
        let url=cfg.serverRender.url.indexOf('?')===-1?
            cfg.serverRender.url+'?'+'yf_server_render_url='+href:
            cfg.serverRender.url+'&='+href
        try{
            const res=await axios.get(url,{
                headers: {
                    'User-Agent': userAgent
                }
            })
            ctx.body=res.data
        }catch (e) {
            //ctx.status=e.response.status
            //ctx.body=e.message
            await next()
        }
    }else{
        await next()
    }
}

app.use(async (ctx,next)=>{
    try{
        await next()
    }catch (e) {
        loger.fatal(e)
    }
})

/*app.use(cache( {
    dir:cfg.module.web.static,
    maxAge: cfg.module.web.maxAge,
    prefix: '/static',
    gzip:true,
}))*/
app.use(cache( {
    dir:cfg.module.web.view,
    maxAge: cfg.module.web.maxAge,
    gzip:true,
}))
//app.use(routerResource.routes())

app.use(serverRender)

app.use(router.routes())

module.exports = app