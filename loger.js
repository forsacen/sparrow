const Loger=require('./lib/yf_log')
const MongoClient = require('mongodb').MongoClient
const common=require('./lib/yf_common')
let loger=function(){
    this.loger=null
}
loger.prototype.warn=function(arg,cb){
    return this.loger.warn(arg,cb)
}
loger.prototype.fatal=function(arg,cb){
    return this.loger.fatal(arg,cb)
}
loger.prototype.log=function(arg,cb){
    return this.loger.log(arg,cb)
}

loger.prototype.init=async function(option){
    let url=common.makeMongoUrl(option)
    let client = await MongoClient.connect(url)
    let db=client.db(option.database)
    this.loger = new Loger({col:db.collection(option.collection),project:option.project})
    //this.loger.stackOffset(1)
}

module.exports=new loger()