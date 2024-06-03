const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const cfg=require('./config')
const initialization=require('./initialization')
const G=require('./global')
const render = require('koa-ejs')
const loger=require('./loger')
//const compress = require('koa-compress');
function createServer(){
    const Koa=require('koa')
    const app = new Koa()
    //app.use(compress({ threshold: 2048 }));
    app.on('error', (err) => {
        loger.fatal(err)
    });
    const vhost = require ( 'koa-virtual-host')
    const web=require('./web')
    const api=require('./api')
    const admin=require('./admin')
    const resource=require('./resource')
    if(cluster.isWorker){
        console.log('[worker] ' + "start worker ..." + cluster.worker.id)
    }
    render(app, {
        root: cfg.module.web.view,
        layout: false,
        viewExt: 'html',
        cache: !cfg.common.debug,
        debug: false,
    })
    if('resource' in cfg.module){
        for(let i=0;i<cfg.common.baseDomain.length;i++){
            cfg.module.resource.domain.push(`resource.${cfg.common.baseDomain[i]}`)
        }
    }
    if('web' in cfg.module){
        for(let i=0;i<cfg.common.baseDomain.length;i++){
            cfg.module.web.domain.push(cfg.common.baseDomain[i])
            cfg.module.web.domain.push(`www.${cfg.common.baseDomain[i]}`)
        }
    }
    if('api' in cfg.module){
        for(let i=0;i<cfg.common.baseDomain.length;i++){
            cfg.module.api.domain.push(`api.${cfg.common.baseDomain[i]}`)
        }
    }
    if('admin' in cfg.module){
        for(let i=0;i<cfg.common.baseDomain.length;i++){
            cfg.module.api.domain.push(`admin.${cfg.common.baseDomain[i]}`)
        }
    }
    if('resource' in cfg.module){
        for(let i=0;i<cfg.module.resource.domain.length;i++){
            app.use(vhost(cfg.module.resource.domain[i],resource))
        }
    }
    if('web' in cfg.module){
        for(let i=0;i<cfg.module.web.domain.length;i++){
            app.use(vhost(cfg.module.web.domain[i],web))
        }
    }
    if('api' in cfg.module){
        for(let i=0;i<cfg.module.api.domain.length;i++){
            app.use(vhost(cfg.module.api.domain[i],api))
        }
    }

    if('admin' in cfg.module){
        for(let i=0;i<cfg.module.admin.domain.length;i++){
            app.use(vhost(cfg.module.admin.domain[i],admin))
        }
    }
    app.listen(cfg.common.port,() => console.log(`Example app listening on port ${cfg.common.port}!`))
}
async function main(){
    if(cfg.common.cluster){
        if (cluster.isMaster) {
            console.log('[master] ' + "start master...");
            let workers=[]
            for (var i = 0; i < numCPUs; i++) {
                let worker=cluster.fork();
                workers.push(worker)
            }
            G.set('workers',workers)
            cluster.on('listening', function (worker, address) {
                console.log('[master] ' + 'listening: worker' + worker.id + ',pid:'
                    + worker.process.pid + ', Address:' + address.address + ":" + address.port);
            });
        }else if (cluster.isWorker) {
            await initialization()
            createServer()
        }
    }else{
        await initialization()
        createServer()
    }
}

main()