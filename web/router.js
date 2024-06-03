const router = require('koa-router')()
const cluster=require('cluster')
//const G=require('../global')
//const cfg=require('../config')
//const dao=require('./dao')
module.exports=router

router.get('/', async (ctx) => {
    //await ctx.render('index')
    await ctx.render('index')
})

router.get('/book/:id',async(ctx)=>{
    await ctx.render('index')
})

router.get('/book/:id/chapter/:index',async (ctx)=>{
    await ctx.render('index')
})

router.get('/mybook',async(ctx)=>{
    await ctx.render('index')
})
router.get('/myword',async(ctx)=>{
    await ctx.render('index')
})
router.get('/count/:page?',async(ctx)=>{
    await ctx.render('index')
})
router.get('/search/:key',async(ctx)=>{
    await ctx.render('index')
})

router.get('/cluster', async (ctx, next) => {
    if(cluster.isWorker){
        console.log('worker'+cluster.worker.id)
        ctx.body=',PID:'+process.pid
    }else{
        ctx.body='simple process'
    }
})

router.get('/test', async (ctx, next) => {
    await ctx.render('test')
})

