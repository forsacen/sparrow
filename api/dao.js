const common=require('../lib/yf_common')
const MongoClient = require('mongodb').MongoClient
const loger=require('../loger')
const process=require('process')
const cfg=require('../config')

let dao=function(){
}

function updateAuthor(data){
    for(let i=0;i<data.length;i++){
        let item=data[i]
        if(item.cnAuthor.length>0){
            item.author=item.cnAuthor
        }else if(item.enAuthor.length>0){
            item.author=item.enAuthor
        }else{
            item.author=''
        }
        delete item.enAuthor
        delete item.cnAuthor
    }
    return data
}
function updateOneAuthor(data){
    if(data.cnAuthor.length>0){
        data.author=data.cnAuthor
    }else if(item.enAuthor.length>0){
        data.author=data.enAuthor
    }else{
        data.author=''
    }
    delete data.enAuthor
    delete data.cnAuthor
    return data
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

dao.prototype.getMainPageList=async function(){
    let filter={cnAuthor:1,intro:1,cnName:1,enAuthor:1,enName:1}
    let re=await this.col.aggregate( [{ $match: { makeCover: 0,status:0}},{$project:filter},{ $sample: { size: cfg.module.api.dataCount.mainList*cfg.module.api.dataCount.mainPages } }] )
    let data=await re.toArray()
    return data
}

dao.prototype.getMainHot=async function (){
    let filter={cnName:1,enName:1,enAuthor:1,cnAuthor:1}//@@中英文
    let re=await this.col.aggregate( [ { $sample: { size: cfg.module.api.dataCount.mainHot } },{$project:filter}] )
    let data=await re.toArray()
    //data=updateAuthor(data)
    return data
}

dao.prototype.getMainTuijian=async function(){
    let filter={cnName:1,enName:1,enAuthor:1,cnAuthor:1}//@@中英文
    let re=await this.col.aggregate( [ { $sample: { size: cfg.module.api.dataCount.mainTuijian } },{$project:filter}] )
    let data=await re.toArray()
    //data=updateAuthor(data)
    return data
}

dao.prototype.getHot=async function (category){
    let filter={category:1,cnName:1,enAuthor:1,cnAuthor:1}
    let re=await this.col.aggregate( [ {$match:{category:category}},{ $sample: { size: cfg.module.api.dataCount.mainHot } },{$project:filter}] )
    let data=await re.toArray()
    data=updateAuthor(data)
    return data
}

dao.prototype.getTuijian=async function (category){
    let filter={category:1,cnName:1,enAuthor:1,cnAuthor:1}
    let re=await this.col.aggregate( [ {$match:{category:category}},{ $sample: { size: cfg.module.api.dataCount.mainHot } },{$project:filter}] )
    let data=await re.toArray()
    data=updateAuthor(data)
    return data
}

dao.prototype.getCountList=async function (index){
    let filter={cnAuthor:1,intro:1,cnName:1,enAuthor:1,enName:1}
    let re=await this.col.find({},{projection:filter}).limit(cfg.module.api.dataCount.mainList).skip(index*cfg.module.api.dataCount.mainList)
    let data=await re.toArray()
    return data
}
dao.prototype.getDataCount=async function(){
    let count=await this.col.countDocuments()
    return count
}
//1a65940417f5759f
dao.prototype.getBook=async function(id){
    let filter={cnAuthor:1,intro:1,cnName:1,enAuthor:1,enName:1,chapters:1}
    let data=await this.col.findOne({_id:id},{projection:filter})
    return data
}

dao.prototype.searchName=async function(keys){
    let filter={cnAuthor:1,intro:1,cnName:1,enAuthor:1,enName:1}
    let regex=''
    for(let i=0;i<keys.length;i++){
        if(keys[i].length>0){
            regex+=keys[i]+'|'
        }
    }
    regex=regex.trimR('\\|')
    let re=await this.col.find({$or:[{cnName:{$regex:regex,$options: "i"}},{enName:{$regex:regex,$options: "i"}}]},{projection:filter}).limit(cfg.search.limit)
    let data=await re.toArray()
    return data
}

dao.prototype.getChapter=async function(id,index){
    let filter={'category':1,'cnName':1,'enName':1,'lastChapter':1}
    filter['chapters.'+index]=1
    filter['contents.'+index]=1
    let data=await this.col.findOne({_id:id},{projection:filter})
    return data
}

module.exports=new dao()