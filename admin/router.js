const router = require('koa-router')()

module.exports=router

router.get('/', function (ctx, next) {
    ctx.body = 'this is a get response!'
})
router.get('/cluster', function (ctx, next) {
    if(cluster.isWorker){
        console.log('worker'+cluster.worker.id)
        ctx.body=',PID:'+process.pid
    }else{
        ctx.body='simple process'
    }
})
