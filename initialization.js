require('./lib/yf_init')
const cfg=require('./config')
const common=require('./lib/yf_common')
const loger=require('./loger')
const thread=require('./thread')
const G=require('./global')
const TimerList=require('./lib/yf_timerlist')
const process=require('process')

async function initialization(){
    common.enableDebug()
    common.debug('init loger')
    await loger.init(cfg.loger)
    if(!cfg.common.debug){
        await loger.log('cnennovel server start '+new Date(Date.now()).toISOString())
    }
    common.debug('init loger completed')
    if('web' in cfg.module){
        if('dao' in cfg.module.web) {
            common.debug('init web dao')
            const webDao = require('./web/dao')
            await webDao.init(cfg.module.web.dao)
            common.debug('init web dao completed')
        }
    }
    if('api' in cfg.module){
        if('dao' in cfg.module.api){
            common.debug('init api dao')
            const apiDao=require('./api/dao')
            await apiDao.init(cfg.module.api.dao)
            common.debug('init api dao completed')
        }
    }
    if('admin' in cfg.module){
        if('dao' in cfg.module.admin) {
            common.debug('init admin dao')
            const adminDao = require('./admin/dao')
            await adminDao.init(cfg.module.admin.dao)
            common.debug('init admin dao completed')
        }
    }
    if('resource' in cfg.module){
        if('dao' in cfg.module.resource) {
            common.debug('init resource dao')
            const resourceDao = require('./resource/dao')
            await resourceDao.init(cfg.module.resource.dao)
            common.debug('init resource dao completed')
        }
    }
    process.on('uncaughtException', async function (err) {
        common.debug(err)
        await loger.fatal(err)
        //process.exit(-1)
    })
    process.on('unhandledRejection',async function(err,promise){
        common.debug(err)
        await loger.fatal(err)
        //process.exit(-1)
    })
    G.timerList=new TimerList()
    G.timerList.setTimer(cfg.search.timerLimit)
    thread.begin()
}
module.exports=initialization