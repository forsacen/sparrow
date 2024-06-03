const router = require('koa-router')()
const dao=require('./dao')
const loger=require('../loger')
const G=require('../global')
const cfg=require('../config')
const zlib=require('zlib')
module.exports=router


router.get('/main', async (ctx) => {
    ctx.body = G.cache.mainPageData
})

router.get('/main/:index', async (ctx) => {
    const index=parseInt(ctx.params.index)
    if(index>0 && index<G.cache.mainList.length){
        ctx.body=G.cache.mainList[index]
    }else{
        ctx.status=403
    }
})

router.get('/count/:index?',async (ctx)=>{
    let index=(ctx.params.index===undefined?1:parseInt(ctx.params.index))
    /*if(cfg.page.maxPagination>0&&index>cfg.page.maxPagination){
        ctx.status=403
        return
    }*/
    let countList=await dao.getCountList(index-1)
    let pageCount=Math.ceil(G.cache.dataCount/cfg.module.api.dataCount.mainList)
    let data={
        t:'count',
        data:{
            //breadcrumb:[{name:'首页',href:'/'},{name:cfg.categoryMap[ctx.params.category]}],
            pagination:{
                current:index,
                total:pageCount,
                path:'/count'
            },
            main:countList,
            hot:G.cache.mainHot,
            tuijian:G.cache.mainTuijian,
        },
    }
    ctx.body=zlib.deflateSync(JSON.stringify(data))
})/*
router.get('/user', async (ctx) => {
    ctx.body='{"name":"liu","age":34}'
})*/
router.get('/book/:id',async(ctx)=>{
    let id=ctx.params.id
    let book=await dao.getBook(id)
    //let category=book.category
    //let rCategory=cfg.rCategoryMap[category]===undefined?'jingdian':cfg.rCategoryMap[book.category]
    let data={
        t:'book',
        data:{
            breadcrumb:[{name:'首页',href:'/'},{name:book.cnName}],
            book:book
        },
    }
    ctx.body=zlib.deflateSync(JSON.stringify(data))
})

router.get('/book/:id/chapter/:index',async (ctx)=>{
    let id=ctx.params.id
    let index=ctx.params.index
    let d=await dao.getChapter(id,index)
    //let category=d.category
    //let rCategory=cfg.rCategoryMap[category]===undefined?'jingdian':cfg.rCategoryMap[d.category]
    let chapterName=d.chapters[index]
    let nIndex=parseInt(index)
    let data={
        t:'chapter',
        data:{
            id:d._id,
            breadcrumb:[{name:'首页',href:'/'},{name:d.cnName,href:'/book/'+d._id},{name:chapterName}],
            c:d.contents[index],
            t:chapterName,
            n:d.cnName,//@@这里有可能不是中英文小说
            en:d.enName,
            i:nIndex,
            next:nIndex<parseInt(d.lastChapter-1)?(nIndex+1).toString():undefined,
            pre:nIndex>0?(nIndex-1).toString():undefined,
        }
    }
    /*
    let rs=zlib.deflateSync(JSON.stringify(data))
    let rc=utf8ArrayToStr(zlib.inflateSync(Buffer.from(rs)))
    let rj=JSON.parse(rc)
    let c=rj.data.chapter.c
    let b=new Buffer(c , 'base64')
    let r=zlib.brotliDecompressSync(b)
    let rb=decompress(b)
    r=utf8ArrayToStr(r)*/
    ctx.body=zlib.deflateSync(JSON.stringify(data))
})

router.get('/search/:key',async(ctx)=>{
    let req=ctx.req
    let proxy=req.headers['x-forwarded-for']&&ctx.headers['x-forwarded-for'].split(',')[0]
    let clientIP=req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        (req.connection.socket ? req.connection.socket.remoteAddress : null)||
        ctx.request.ip
    if(G.timerList.has(proxy)||G.timerList.has(clientIP)){
        let o={}
        o.t='search'
        o.data={}
        o.data.error=true
        o.data.msg='搜索间隔不能低于'+cfg.search.timerLimit/1000+'秒'
        o.data.breadcrumb=[{name:'首页',href:'/'},{name:'搜索'}]
        o.data.main={}
        o.data.hot=G.cache.mainHot
        o.data.tuijian=G.cache.mainTuijian
        let data=zlib.deflateSync(JSON.stringify(o))
        ctx.body=data
        return
    }else{
        if(proxy){
            G.timerList.add(proxy)
        }
        if(clientIP&&clientIP!==proxy){
            G.timerList.add(clientIP)
        }
    }
    let keys=ctx.params['key'].split('+')
    let length=0
    let error=false
    let errmsg=''
    for(let i=0;i<keys.length;i++){
        if(keys[i].length>0){
            if(keys[i].getByteSize()<3){
                error=true
                errmsg='关键词过短!'
                break
            }else if(keys[i].length>20){
                error=true
                errmsg='关键词过长!'
            }
        }
        length+=keys[i].length
    }
    if(!error && length===0){
        error=true
        errmsg='关键词过短!'
    }
    if(error){
        let o={}
        o.t='search'
        o.data={}
        o.data.error=error
        o.data.msg=errmsg
        o.data.breadcrumb=[{name:'首页',href:'/'},{name:'搜索'}]
        o.data.main={}
        o.data.hot=G.cache.mainHot
        o.data.tuijian=G.cache.mainTuijian
        let data=zlib.deflateSync(JSON.stringify(o))
        ctx.body=data
    }else{
        let re=await dao.searchName(keys)
        if(re.length===0){
            error=true
            errmsg='搜索结果为空!'
        }
        let o={}
        o.t='search'
        o.data={}
        o.data.error=error
        o.data.msg=errmsg
        o.data.breadcrumb=[{name:'首页',href:'/'},{name:'搜索'}]
        o.data.main=re
        o.data.hot=G.cache.mainHot
        o.data.tuijian=G.cache.mainTuijian
        let data=zlib.deflateSync(JSON.stringify(o))
        ctx.body=data
    }
})