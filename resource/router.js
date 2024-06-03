const router = require('koa-router')()
const dao=require('./dao')
module.exports=router
router.get('/cover/:id',async (ctx)=>{
    let id=ctx.params.id
    let data=await dao.getCover(id)
    if(ctx.req.headers['if-none-match']===data.coverEtag){
        ctx.status=304
    }else{
        ctx.set({
            'Etag':data.coverEtag,
            //'Cache-Control':'public, max-age=2592000',
            'Content-Type':'image/jpeg',
        })
        ctx.body=data.cover.buffer
    }
})

