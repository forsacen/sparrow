const common=require('../lib/yf_common')
const MongoClient = require('mongodb').MongoClient
const loger=require('../loger')
const process=require('process')

let dao=function(){
}
dao.prototype.init=async function(option){
    try {
        let url=common.makeMongoUrl(option)
        let client = await MongoClient.connect(url)
        this.db=client.db(option.database)
        this.col=await this.db.collection(option.collection)
    } catch (e) {
        await loger.fatal(e)
        process.exit(-1)
    }
}
module.exports=new dao()